#!/usr/bin/env npx ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENERATED_FILE_PREFIX = void 0;
/*
 * This script uses src/languages/en.ts as the source of truth, and leverages ChatGPT to generate translations for other languages.
 */
const dotenv = require("dotenv");
const fs_1 = require("fs");
// eslint-disable-next-line you-dont-need-lodash-underscore/get
const get_1 = require("lodash/get");
const path_1 = require("path");
const typescript_1 = require("typescript");
const GithubUtils_1 = require("@github/libs/GithubUtils");
const decodeUnicode_1 = require("@libs/StringUtils/decodeUnicode");
const dedent_1 = require("@libs/StringUtils/dedent");
const hash_1 = require("@libs/StringUtils/hash");
const LOCALES_1 = require("@src/CONST/LOCALES");
const en_1 = require("@src/languages/en");
const CLI_1 = require("./utils/CLI");
const Prettier_1 = require("./utils/Prettier");
const PromisePool_1 = require("./utils/PromisePool");
const ChatGPTTranslator_1 = require("./utils/Translator/ChatGPTTranslator");
const DummyTranslator_1 = require("./utils/Translator/DummyTranslator");
const TSCompilerUtils_1 = require("./utils/TSCompilerUtils");
const GENERATED_FILE_PREFIX = (0, dedent_1.default)(`
    /**
     *   _____                      __         __
     *  / ___/__ ___  ___ _______ _/ /____ ___/ /
     * / (_ / -_) _ \\/ -_) __/ _ \\\`/ __/ -_) _  /
     * \\___/\\__/_//_/\\__/_/  \\_,_/\\__/\\__/\\_,_/
     *
     * This file was automatically generated. Please consider these alternatives before manually editing it:
     *
     * - Improve the prompts in prompts/translation, or
     * - Improve context annotations in src/languages/en.ts
     */
`);
exports.GENERATED_FILE_PREFIX = GENERATED_FILE_PREFIX;
/**
 * This class encapsulates most of the non-CLI logic to generate translations.
 * The primary reason it exists as a class is so we can import this file with no side effects at the top level of the script.
 * This is useful for unit testing.
 *
 * At a high level, this is how it works:
 *  - It takes in a set of languages to generate translations for, a directory where translations are stored, and a file to use as the source of truth for translations.
 *  - It then uses the source file to recursively extract all string literals and template expressions, and uses ChatGPT to generate translations for each of them.
 *  - It then replaces the original string literals and template expressions with the translated ones, and writes the resulting code to a file.
 *  - It also formats the files using prettier.
 */
class TranslationGenerator {
    constructor(config) {
        /**
         * If a complex template expression comes from an existing translation file rather than ChatGPT, then the hashes of its spans will be serialized from the translated version of those spans.
         * This map provides us a way to look up the English hash for each translated span hash, so that when we're transforming the English file and we encounter a translated expression hash,
         * we can look up English hash and use it to look up the translation for that hash (since the translation map is keyed by English string hashes).
         */
        this.translatedSpanHashToEnglishSpanHash = new Map();
        this.targetLanguages = config.targetLanguages;
        this.languagesDir = config.languagesDir;
        const sourceCode = fs_1.default.readFileSync(config.sourceFile, 'utf8');
        this.sourceFile = typescript_1.default.createSourceFile(config.sourceFile, sourceCode, typescript_1.default.ScriptTarget.Latest, true);
        this.translator = config.translator;
        this.compareRef = config.compareRef;
        this.paths = config.paths;
        this.verbose = config.verbose;
    }
    async generateTranslations() {
        const promisePool = new PromisePool_1.default();
        // map of translations for each locale
        const translations = new Map();
        // If paths are specified, we only retranslate those paths and skip comparing with existing translations
        const shouldUseExistingTranslations = !this.paths && this.compareRef;
        // If a compareRef is provided and we're not filtering by paths, fetch the old version of the files, and traverse the ASTs in parallel to extract existing translations
        if (shouldUseExistingTranslations) {
            const allLocales = [LOCALES_1.LOCALES.EN, ...this.targetLanguages];
            // An array of labeled "translation nodes", where "translations node" refers to the main object in en.ts and
            // other locale files that contains all the translations.
            const oldTranslationNodes = [];
            const downloadPromises = [];
            for (const targetLanguage of allLocales) {
                const targetPath = `src/languages/${targetLanguage}.ts`;
                downloadPromises.push(promisePool.add(() => 
                // Download the file from GitHub
                GithubUtils_1.default.getFileContents(targetPath, this.compareRef).then((content) => {
                    // Parse the file contents and find the translations node, save it in the oldTranslationsNodes map
                    const parsed = typescript_1.default.createSourceFile(targetPath, content, typescript_1.default.ScriptTarget.Latest, true);
                    const oldTranslationNode = this.findTranslationsNode(parsed);
                    if (!oldTranslationNode) {
                        throw new Error(`Could not find translation node in ${targetPath}`);
                    }
                    oldTranslationNodes.push({ label: targetLanguage, node: oldTranslationNode });
                })));
            }
            await Promise.all(downloadPromises);
            // Traverse ASTs of all downloaded files in parallel, building a map of {locale => {translationKey => translation}}
            // Note: traversing in parallel is not just a performance optimization. We need the translation key
            // from en.ts to map to translations in other files, but we can't rely on dot-notation style paths alone
            // because sometimes there are strings defined elsewhere, such as in functions or nested templates.
            // So instead, we rely on the fact that the AST structure of en.ts will very nearly match the AST structure of other locales.
            // We walk through the AST of en.ts in parallel with all the other ASTs, and take the translation key from
            // en.ts and the translated value from the target locale.
            TSCompilerUtils_1.default.traverseASTsInParallel(oldTranslationNodes, (nodes) => {
                const enNode = nodes[LOCALES_1.LOCALES.EN];
                if (!this.shouldNodeBeTranslated(enNode)) {
                    return;
                }
                // Use English for the translation key
                const translationKey = this.getTranslationKey(enNode);
                for (const targetLanguage of this.targetLanguages) {
                    const translatedNode = nodes[targetLanguage];
                    if (!this.shouldNodeBeTranslated(translatedNode)) {
                        if (this.verbose) {
                            console.warn('😕 found translated node that should not be translated while English node should be translated', { enNode, translatedNode });
                            console.trace();
                        }
                        continue;
                    }
                    const translationsForLocale = translations.get(targetLanguage) ?? new Map();
                    const serializedNode = typescript_1.default.isStringLiteral(translatedNode) || typescript_1.default.isNoSubstitutionTemplateLiteral(translatedNode)
                        ? translatedNode.getText().slice(1, -1)
                        : this.templateExpressionToString(translatedNode);
                    translationsForLocale.set(translationKey, serializedNode);
                    translations.set(targetLanguage, translationsForLocale);
                    // For complex template expressions, we need a way to look up the English span hash for each translated span hash, so we track those here
                    if (typescript_1.default.isTemplateExpression(enNode) && typescript_1.default.isTemplateExpression(translatedNode) && !this.isSimpleTemplateExpression(enNode)) {
                        for (let i = 0; i < enNode.templateSpans.length; i++) {
                            const enSpan = enNode.templateSpans[i];
                            const translatedSpan = translatedNode.templateSpans[i];
                            this.translatedSpanHashToEnglishSpanHash.set((0, hash_1.default)(translatedSpan.expression.getText()), (0, hash_1.default)(enSpan.expression.getText()));
                        }
                    }
                }
            });
        }
        for (const targetLanguage of this.targetLanguages) {
            // Map of translations
            const translationsForLocale = translations.get(targetLanguage) ?? new Map();
            // Extract strings to translate
            const stringsToTranslate = new Map();
            this.extractStringsToTranslate(this.sourceFile, stringsToTranslate);
            // Translate all the strings in parallel (up to 8 at a time)
            const translationPromises = [];
            for (const [key, { text, context }] of stringsToTranslate) {
                if (translationsForLocale.has(key)) {
                    // This means that the translation for this key was already parsed from an existing translation file, so we don't need to translate it with ChatGPT
                    continue;
                }
                const translationPromise = promisePool.add(() => this.translator.translate(targetLanguage, text, context).then((result) => translationsForLocale.set(key, result)));
                translationPromises.push(translationPromise);
            }
            await Promise.allSettled(translationPromises);
            // Replace translated strings in the AST
            const transformer = this.createTransformer(translationsForLocale);
            const result = typescript_1.default.transform(this.sourceFile, [transformer]);
            let transformedSourceFile = result.transformed.at(0) ?? this.sourceFile; // Ensure we always have a valid SourceFile
            result.dispose();
            // Import en.ts
            transformedSourceFile = TSCompilerUtils_1.default.addImport(transformedSourceFile, 'en', './en', true);
            // Generate translated TypeScript code
            const printer = typescript_1.default.createPrinter();
            const translatedCode = (0, decodeUnicode_1.default)(printer.printFile(transformedSourceFile));
            // Write to file
            const outputPath = path_1.default.join(this.languagesDir, `${targetLanguage}.ts`);
            fs_1.default.writeFileSync(outputPath, translatedCode, 'utf8');
            // Format the file with prettier
            await Prettier_1.default.format(outputPath);
            // Enforce that the type of translated files matches en.ts
            let finalFileContent = fs_1.default.readFileSync(outputPath, 'utf8');
            finalFileContent = finalFileContent.replace('export default translations satisfies TranslationDeepObject<typeof translations>;', 'export default translations satisfies TranslationDeepObject<typeof en>;');
            // Add a fun ascii art touch with a helpful message
            finalFileContent = `${GENERATED_FILE_PREFIX}${finalFileContent}`;
            fs_1.default.writeFileSync(outputPath, finalFileContent, 'utf8');
            console.log(`✅ Translated file created: ${outputPath}`);
        }
    }
    /**
     * Each translation file should have an object called translations that's later default-exported. This function takes in a root node, and finds the translations node.
     */
    findTranslationsNode(sourceFile) {
        const defaultExport = TSCompilerUtils_1.default.findDefaultExport(sourceFile);
        if (!defaultExport) {
            throw new Error('Could not find default export in source file');
        }
        const defaultExportIdentifier = TSCompilerUtils_1.default.extractIdentifierFromExpression(defaultExport);
        const translationsNode = TSCompilerUtils_1.default.resolveDeclaration(defaultExportIdentifier ?? '', sourceFile);
        return translationsNode;
    }
    /**
     * Should the given node be translated?
     */
    shouldNodeBeTranslated(node) {
        // We only translate string literals and template expressions
        if (!typescript_1.default.isStringLiteral(node) && !typescript_1.default.isTemplateExpression(node) && !typescript_1.default.isNoSubstitutionTemplateLiteral(node)) {
            return false;
        }
        // Don't translate property keys (the name part of property assignments)
        if (node.parent && typescript_1.default.isPropertyAssignment(node.parent) && node.parent.name === node) {
            return false;
        }
        // Don't translate any strings or expressions that affect code execution by being part of control flow.
        // We want to translate only strings that are "leaves" or "results" of any expression or code block
        const isPartOfControlFlow = node.parent &&
            // imports and exports
            (typescript_1.default.isImportDeclaration(node.parent) ||
                typescript_1.default.isExportDeclaration(node.parent) ||
                // Switch/case clause
                typescript_1.default.isCaseClause(node.parent) ||
                // any binary expression except coalescing operators and the operands of +=
                (typescript_1.default.isBinaryExpression(node.parent) &&
                    node.parent.operatorToken.kind !== typescript_1.default.SyntaxKind.QuestionQuestionToken &&
                    node.parent.operatorToken.kind !== typescript_1.default.SyntaxKind.BarBarToken &&
                    node.parent.operatorToken.kind !== typescript_1.default.SyntaxKind.PlusEqualsToken));
        if (isPartOfControlFlow) {
            return false;
        }
        // Don't translate any logs
        const isArgumentToLogFunction = node.parent &&
            typescript_1.default.isCallExpression(node.parent) &&
            typescript_1.default.isPropertyAccessExpression(node.parent.expression) &&
            ((typescript_1.default.isIdentifier(node.parent.expression.expression) && node.parent.expression.expression.getText() === 'console') ||
                (typescript_1.default.isIdentifier(node.parent.expression.expression) && node.parent.expression.expression.getText() === 'Log'));
        if (isArgumentToLogFunction) {
            return false;
        }
        // Don't translate a string that's a literal type annotation
        if (typescript_1.default.isLiteralTypeNode(node.parent)) {
            return false;
        }
        // Don't translate object keys
        if (typescript_1.default.isComputedPropertyName(node.parent)) {
            return false;
        }
        // Only translate string literals if they contain at least one real letter
        if (typescript_1.default.isStringLiteral(node) || typescript_1.default.isNoSubstitutionTemplateLiteral(node)) {
            // \p{L} matches a-z, à-ö, Α-Ω, Ж, 文, …  – but NOT digits, emoji, punctuation, etc.
            return /\p{L}/u.test(node.text);
        }
        // Only translate a template expression if it contains alphabet characters outside the spans
        let staticText = node.head.text;
        for (const span of node.templateSpans) {
            staticText += span.literal.text;
        }
        return /[a-zA-Z]/.test(staticText);
    }
    /**
     * Is a given expression (i.e: template placeholder) "simple"?
     * We define an expression as "simple" if it is an identifier or property access expression. Anything else is complex.
     *
     * @example ${name} => true
     * @example ${user.firstName} => true
     * @example ${CONST.REPORT.TYPES.EXPENSE} => true
     * @example ${name ?? 'someone'} => false
     * @example ${condition ? 'A' : 'B'} => false
     */
    isSimpleExpression(expr) {
        return typescript_1.default.isIdentifier(expr) || typescript_1.default.isPropertyAccessExpression(expr) || typescript_1.default.isElementAccessExpression(expr);
    }
    /**
     * Is the given template expression "simple"? (i.e: can it be sent directly to ChatGPT to be translated)
     * We define a template expression as "simple" if each of its spans' expressions are simple (as defined by this.isSimpleTemplateSpan)
     *
     * @example `Hello, ${name}!` => true
     * @example `Welcome ${user.firstName}` => true
     * @example `Submit ${CONST.REPORT.TYPES.EXPENSE} report` => true
     * @example `Pay ${name ?? 'someone'}` => false
     * @example `Edit ${condition ? 'A' : 'B'}` => false
     */
    isSimpleTemplateExpression(node) {
        return node.templateSpans.every((span) => this.isSimpleExpression(span.expression));
    }
    /**
     * Extract any leading context annotation for a given node.
     */
    getContextForNode(node) {
        // First, check for an inline context comment.
        const inlineContext = node.getFullText().match(TranslationGenerator.CONTEXT_REGEX)?.[1].trim();
        if (inlineContext) {
            return inlineContext;
        }
        // Otherwise, look for the nearest ancestor that may have a comment attached.
        // For now, we only support property assignments.
        const nearestPropertyAssignmentAncestor = TSCompilerUtils_1.default.findAncestor(node, (n) => typescript_1.default.isPropertyAssignment(n));
        if (!nearestPropertyAssignmentAncestor) {
            return undefined;
        }
        // Search through comments looking for a context comment
        const commentRanges = typescript_1.default.getLeadingCommentRanges(this.sourceFile.getFullText(), nearestPropertyAssignmentAncestor.getFullStart()) ?? [];
        for (const range of commentRanges.reverse()) {
            const commentText = this.sourceFile.getFullText().slice(range.pos, range.end);
            const match = commentText.match(TranslationGenerator.CONTEXT_REGEX);
            if (match) {
                return match[1].trim();
            }
        }
        // No context comments were found
        return undefined;
    }
    /**
     * Generate a hash of the string representation of a node along with any context comments.
     */
    getTranslationKey(node) {
        if (!typescript_1.default.isStringLiteral(node) && !typescript_1.default.isNoSubstitutionTemplateLiteral(node) && !typescript_1.default.isTemplateExpression(node)) {
            throw new Error(`Cannot generate translation key for node: ${node.getText()}`);
        }
        // Trim leading whitespace, quotation marks, and backticks
        let keyBase = node
            .getText()
            .trim()
            .replace(/^['"`]/, '')
            .replace(/['"`]$/, '');
        const context = this.getContextForNode(node);
        if (context) {
            keyBase += context;
        }
        return (0, hash_1.default)(keyBase);
    }
    /**
     * Check if a given translation path should be translated based on the paths filter.
     * If no paths are specified, all paths should be translated.
     * If paths are specified, only paths that match exactly or are nested under a specified path should be translated.
     */
    shouldTranslatePath(currentPath) {
        if (!this.paths || this.paths.length === 0) {
            return true;
        }
        for (const targetPath of this.paths) {
            // Exact match
            if (currentPath === targetPath) {
                return true;
            }
            // Current path is nested under target path
            if (currentPath.startsWith(`${targetPath}.`)) {
                return true;
            }
            // Target path is nested under current path (for parent path matching)
            if (targetPath.startsWith(`${currentPath}.`)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Recursively extract all string literals and templates to translate from the subtree rooted at the given node.
     * Simple templates (as defined by this.isSimpleTemplateExpression) can be translated directly.
     * Complex templates must have each of their spans recursively translated first, so we'll extract all the lowest-level strings to translate.
     * Then complex templates will be serialized with a hash of complex spans in place of the span text, and we'll translate that.
     */
    extractStringsToTranslate(node, stringsToTranslate, currentPath = '') {
        if (this.shouldNodeBeTranslated(node)) {
            // Check if this translation path should be included based on the paths filter
            if (!this.shouldTranslatePath(currentPath)) {
                return; // Skip this node and its children if the path doesn't match
            }
            const context = this.getContextForNode(node);
            const translationKey = this.getTranslationKey(node);
            // String literals and no-substitution templates can be translated directly
            if (typescript_1.default.isStringLiteral(node) || typescript_1.default.isNoSubstitutionTemplateLiteral(node)) {
                stringsToTranslate.set(translationKey, { text: node.text, context });
            }
            // Template expressions must be encoded directly before they can be translated
            else if (typescript_1.default.isTemplateExpression(node)) {
                if (this.isSimpleTemplateExpression(node)) {
                    stringsToTranslate.set(translationKey, { text: this.templateExpressionToString(node), context });
                }
                else {
                    if (this.verbose) {
                        console.debug('😵‍💫 Encountered complex template, recursively translating its spans first:', node.getText());
                    }
                    node.templateSpans.forEach((span) => this.extractStringsToTranslate(span, stringsToTranslate, currentPath));
                    stringsToTranslate.set(translationKey, { text: this.templateExpressionToString(node), context });
                }
            }
        }
        // Continue traversing children
        node.forEachChild((child) => {
            let childPath = currentPath;
            // If the child is a property assignment, update the path
            if (typescript_1.default.isPropertyAssignment(child)) {
                let propName;
                if (typescript_1.default.isIdentifier(child.name)) {
                    propName = child.name.text;
                }
                else if (typescript_1.default.isStringLiteral(child.name)) {
                    propName = child.name.text;
                }
                if (propName) {
                    childPath = currentPath ? `${currentPath}.${propName}` : propName;
                }
            }
            this.extractStringsToTranslate(child, stringsToTranslate, childPath);
        });
    }
    /**
     * Convert a template expression into a plain string representation that can be predictably serialized.
     * All ${...} spans containing complex expressions are replaced in the string by hashes of the expression text.
     *
     * @example templateExpressionToString(`Edit ${action?.type === 'IOU' ? 'expense' : 'comment'} on ${date}`)
     *       => `Edit ${HASH1} on ${date}`
     */
    templateExpressionToString(expression) {
        let result = expression.head.text;
        for (const span of expression.templateSpans) {
            if (this.isSimpleExpression(span.expression)) {
                result += `\${${span.expression.getText()}}`;
            }
            else {
                result += `\${${(0, hash_1.default)(span.expression.getText())}}`;
            }
            result += span.literal.text;
        }
        return result;
    }
    /**
     * Convert our string-encoded template expression to a template expression.
     * If the template contains any complex spans, those must be translated first, and those translations need to be passed in.
     */
    stringToTemplateExpression(input, translatedComplexExpressions = new Map()) {
        const regex = /\$\{([^}]*)}/g;
        const matches = [...input.matchAll(regex)];
        const headText = input.slice(0, matches.at(0)?.index ?? input.length);
        const templateHead = typescript_1.default.factory.createTemplateHead(headText);
        const spans = [];
        for (let i = 0; i < matches.length; i++) {
            const match = matches.at(i);
            if (!match) {
                continue;
            }
            const [fullMatch, placeholder] = match;
            let expression;
            const trimmed = placeholder.trim();
            if (/^\d+$/.test(trimmed)) {
                // It's a hash reference to a complex span
                const hashed = Number(trimmed);
                // If the translated, serialized template expression came from an existing translation file, then the hash of the complex expression will be a hash of the translated expression.
                // If the translated, serialized template expression came from ChatGPT, then the hash of the complex expression will be a hash of the English expression.
                // Meanwhile, translatedComplexExpressions is keyed by English hashes, because it comes from createTransformer, which is parsing and transforming an English file.
                // So when rebuilding the template expression from its serialized form, we first search for the translated expression assuming the expression is serialized with English hashes.
                // If that fails, we look up the English expression hash associated with the translated expression hash, then look up the translated expression using the English hash.
                const translatedExpression = translatedComplexExpressions.get(hashed) ?? translatedComplexExpressions.get(this.translatedSpanHashToEnglishSpanHash.get(hashed) ?? hashed);
                if (!translatedExpression) {
                    throw new Error(`No template found for hash: ${hashed}`);
                }
                expression = translatedExpression;
            }
            else {
                // Assume it's a simple identifier or property access
                expression = typescript_1.default.factory.createIdentifier(trimmed);
            }
            const startOfMatch = match.index;
            const nextStaticTextStart = startOfMatch + fullMatch.length;
            const nextStaticTextEnd = i + 1 < matches.length ? matches.at(i + 1)?.index : input.length;
            const staticText = input.slice(nextStaticTextStart, nextStaticTextEnd);
            const literal = i === matches.length - 1 ? typescript_1.default.factory.createTemplateTail(staticText) : typescript_1.default.factory.createTemplateMiddle(staticText);
            spans.push(typescript_1.default.factory.createTemplateSpan(expression, literal));
        }
        return typescript_1.default.factory.createTemplateExpression(templateHead, spans);
    }
    /**
     * Generate an AST transformer for the given set of translations.
     */
    createTransformer(translations) {
        return (context) => {
            const visit = (node) => {
                if (this.shouldNodeBeTranslated(node)) {
                    if (typescript_1.default.isStringLiteral(node)) {
                        const translatedText = translations.get(this.getTranslationKey(node));
                        return translatedText ? typescript_1.default.factory.createStringLiteral(translatedText) : node;
                    }
                    if (typescript_1.default.isNoSubstitutionTemplateLiteral(node)) {
                        const translatedText = translations.get(this.getTranslationKey(node));
                        return translatedText ? typescript_1.default.factory.createNoSubstitutionTemplateLiteral(translatedText) : node;
                    }
                    if (typescript_1.default.isTemplateExpression(node)) {
                        const translatedTemplate = translations.get(this.getTranslationKey(node));
                        if (!translatedTemplate) {
                            console.warn('⚠️ No translation found for template expression', node.getText());
                            return node;
                        }
                        // Recursively translate all complex template expressions first
                        const translatedComplexExpressions = new Map();
                        // Template expression is complex:
                        for (const span of node.templateSpans) {
                            const expression = span.expression;
                            if (this.isSimpleExpression(expression)) {
                                continue;
                            }
                            const hash = (0, hash_1.default)(expression.getText());
                            const translatedExpression = typescript_1.default.visitNode(expression, visit);
                            translatedComplexExpressions.set(hash, translatedExpression);
                        }
                        // Build the translated template expression, referencing the translated template spans as necessary
                        return this.stringToTemplateExpression(translatedTemplate, translatedComplexExpressions);
                    }
                }
                return typescript_1.default.visitEachChild(node, visit, context);
            };
            return (node) => {
                const transformedNode = typescript_1.default.visitNode(node, visit) ?? node; // Ensure we always return a valid node
                return transformedNode; // Safe cast since we always pass in a SourceFile
            };
        };
    }
}
/**
 * Regex to match context annotations.
 */
TranslationGenerator.CONTEXT_REGEX = /^\s*(?:\/{2}|\*|\/\*)?\s*@context\s+([^\n*/]+)/;
/**
 * The main function mostly contains CLI and file I/O logic, while TS parsing and translation logic is encapsulated in TranslationGenerator.
 */
async function main() {
    const languagesDir = process.env.LANGUAGES_DIR ?? path_1.default.join(__dirname, '../src/languages');
    const enSourceFile = path_1.default.join(languagesDir, 'en.ts');
    /* eslint-disable @typescript-eslint/naming-convention */
    const cli = new CLI_1.default({
        flags: {
            'dry-run': {
                description: 'If true, just do local mocked translations rather than making real requests to an AI translator.',
            },
            verbose: {
                description: 'Should we print verbose logs?',
            },
        },
        namedArgs: {
            // By default, generate translations for all supported languages. Can be overridden with the --locales flag
            locales: {
                description: 'Locales to generate translations for.',
                default: Object.values(LOCALES_1.TRANSLATION_TARGET_LOCALES).filter((locale) => locale !== LOCALES_1.LOCALES.ES),
                parse: (val) => {
                    const rawLocales = val.split(',');
                    const validatedLocales = [];
                    for (const locale of rawLocales) {
                        if (!(0, LOCALES_1.isTranslationTargetLocale)(locale)) {
                            throw new Error(`Invalid locale ${String(locale)}`);
                        }
                        validatedLocales.push(locale);
                    }
                    return validatedLocales;
                },
            },
            'compare-ref': {
                description: 'For incremental translations, this ref is the previous version of the codebase to compare to. Only strings that changed or had their context changed since this ref will be retranslated.',
                default: '',
            },
            paths: {
                description: 'Comma-separated list of specific translation paths to retranslate (e.g., "common.save,errors.generic").',
                parse: (val) => {
                    const rawPaths = val.split(',').map((translationPath) => translationPath.trim());
                    const validatedPaths = [];
                    const invalidPaths = [];
                    for (const rawPath of rawPaths) {
                        if ((0, get_1.default)(en_1.default, rawPath)) {
                            validatedPaths.push(rawPath);
                        }
                        else {
                            invalidPaths.push(rawPath);
                        }
                    }
                    if (invalidPaths.length > 0) {
                        throw new Error(`found the following invalid paths: ${JSON.stringify(invalidPaths)}`);
                    }
                    return validatedPaths;
                },
                supersedes: ['compare-ref'],
                required: false,
            },
        },
    });
    /* eslint-enable @typescript-eslint/naming-convention */
    let translator;
    if (cli.flags['dry-run']) {
        console.log('🍸 Dry run enabled');
        translator = new DummyTranslator_1.default();
    }
    else {
        // Ensure OPEN_AI_KEY is set in environment
        if (!process.env.OPENAI_API_KEY) {
            // If not, try to load it from .env
            dotenv.config({ path: path_1.default.resolve(__dirname, '../.env') });
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('❌ OPENAI_API_KEY not found in environment.');
            }
        }
        translator = new ChatGPTTranslator_1.default(process.env.OPENAI_API_KEY);
    }
    const generator = new TranslationGenerator({
        targetLanguages: cli.namedArgs.locales,
        languagesDir,
        sourceFile: enSourceFile,
        translator,
        compareRef: cli.namedArgs['compare-ref'],
        paths: cli.namedArgs.paths,
        verbose: cli.flags.verbose,
    });
    await generator.generateTranslations();
}
if (require.main === module) {
    main();
}
exports.default = main;
