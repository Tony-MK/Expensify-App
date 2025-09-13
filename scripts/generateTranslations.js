#!/usr/bin/env npx ts-node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENERATED_FILE_PREFIX = void 0;
/*
 * This script uses src/languages/en.ts as the source of truth, and leverages ChatGPT to generate translations for other languages.
 */
var dotenv = require("dotenv");
var fs_1 = require("fs");
// eslint-disable-next-line you-dont-need-lodash-underscore/get
var get_1 = require("lodash/get");
var path_1 = require("path");
var typescript_1 = require("typescript");
var GithubUtils_1 = require("@github/libs/GithubUtils");
var decodeUnicode_1 = require("@libs/StringUtils/decodeUnicode");
var dedent_1 = require("@libs/StringUtils/dedent");
var hash_1 = require("@libs/StringUtils/hash");
var LOCALES_1 = require("@src/CONST/LOCALES");
var en_1 = require("@src/languages/en");
var CLI_1 = require("./utils/CLI");
var Prettier_1 = require("./utils/Prettier");
var PromisePool_1 = require("./utils/PromisePool");
var ChatGPTTranslator_1 = require("./utils/Translator/ChatGPTTranslator");
var DummyTranslator_1 = require("./utils/Translator/DummyTranslator");
var TSCompilerUtils_1 = require("./utils/TSCompilerUtils");
var GENERATED_FILE_PREFIX = (0, dedent_1.default)("\n    /**\n     *   _____                      __         __\n     *  / ___/__ ___  ___ _______ _/ /____ ___/ /\n     * / (_ / -_) _ \\/ -_) __/ _ \\`/ __/ -_) _  /\n     * \\___/\\__/_//_/\\__/_/  \\_,_/\\__/\\__/\\_,_/\n     *\n     * This file was automatically generated. Please consider these alternatives before manually editing it:\n     *\n     * - Improve the prompts in prompts/translation, or\n     * - Improve context annotations in src/languages/en.ts\n     */\n");
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
var TranslationGenerator = /** @class */ (function () {
    function TranslationGenerator(config) {
        /**
         * If a complex template expression comes from an existing translation file rather than ChatGPT, then the hashes of its spans will be serialized from the translated version of those spans.
         * This map provides us a way to look up the English hash for each translated span hash, so that when we're transforming the English file and we encounter a translated expression hash,
         * we can look up English hash and use it to look up the translation for that hash (since the translation map is keyed by English string hashes).
         */
        this.translatedSpanHashToEnglishSpanHash = new Map();
        this.targetLanguages = config.targetLanguages;
        this.languagesDir = config.languagesDir;
        var sourceCode = fs_1.default.readFileSync(config.sourceFile, 'utf8');
        this.sourceFile = typescript_1.default.createSourceFile(config.sourceFile, sourceCode, typescript_1.default.ScriptTarget.Latest, true);
        this.translator = config.translator;
        this.compareRef = config.compareRef;
        this.paths = config.paths;
        this.verbose = config.verbose;
    }
    TranslationGenerator.prototype.generateTranslations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promisePool, translations, shouldUseExistingTranslations, allLocales, oldTranslationNodes_1, downloadPromises, _loop_1, _i, allLocales_1, targetLanguage, _loop_2, this_1, _a, _b, targetLanguage;
            var _this = this;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        promisePool = new PromisePool_1.default();
                        translations = new Map();
                        shouldUseExistingTranslations = !this.paths && this.compareRef;
                        if (!shouldUseExistingTranslations) return [3 /*break*/, 2];
                        allLocales = __spreadArray([LOCALES_1.LOCALES.EN], this.targetLanguages, true);
                        oldTranslationNodes_1 = [];
                        downloadPromises = [];
                        _loop_1 = function (targetLanguage) {
                            var targetPath = "src/languages/".concat(targetLanguage, ".ts");
                            downloadPromises.push(promisePool.add(function () {
                                // Download the file from GitHub
                                return GithubUtils_1.default.getFileContents(targetPath, _this.compareRef).then(function (content) {
                                    // Parse the file contents and find the translations node, save it in the oldTranslationsNodes map
                                    var parsed = typescript_1.default.createSourceFile(targetPath, content, typescript_1.default.ScriptTarget.Latest, true);
                                    var oldTranslationNode = _this.findTranslationsNode(parsed);
                                    if (!oldTranslationNode) {
                                        throw new Error("Could not find translation node in ".concat(targetPath));
                                    }
                                    oldTranslationNodes_1.push({ label: targetLanguage, node: oldTranslationNode });
                                });
                            }));
                        };
                        for (_i = 0, allLocales_1 = allLocales; _i < allLocales_1.length; _i++) {
                            targetLanguage = allLocales_1[_i];
                            _loop_1(targetLanguage);
                        }
                        return [4 /*yield*/, Promise.all(downloadPromises)];
                    case 1:
                        _e.sent();
                        // Traverse ASTs of all downloaded files in parallel, building a map of {locale => {translationKey => translation}}
                        // Note: traversing in parallel is not just a performance optimization. We need the translation key
                        // from en.ts to map to translations in other files, but we can't rely on dot-notation style paths alone
                        // because sometimes there are strings defined elsewhere, such as in functions or nested templates.
                        // So instead, we rely on the fact that the AST structure of en.ts will very nearly match the AST structure of other locales.
                        // We walk through the AST of en.ts in parallel with all the other ASTs, and take the translation key from
                        // en.ts and the translated value from the target locale.
                        TSCompilerUtils_1.default.traverseASTsInParallel(oldTranslationNodes_1, function (nodes) {
                            var _a;
                            var enNode = nodes[LOCALES_1.LOCALES.EN];
                            if (!_this.shouldNodeBeTranslated(enNode)) {
                                return;
                            }
                            // Use English for the translation key
                            var translationKey = _this.getTranslationKey(enNode);
                            for (var _i = 0, _b = _this.targetLanguages; _i < _b.length; _i++) {
                                var targetLanguage = _b[_i];
                                var translatedNode = nodes[targetLanguage];
                                if (!_this.shouldNodeBeTranslated(translatedNode)) {
                                    if (_this.verbose) {
                                        console.warn('😕 found translated node that should not be translated while English node should be translated', { enNode: enNode, translatedNode: translatedNode });
                                        console.trace();
                                    }
                                    continue;
                                }
                                var translationsForLocale = (_a = translations.get(targetLanguage)) !== null && _a !== void 0 ? _a : new Map();
                                var serializedNode = typescript_1.default.isStringLiteral(translatedNode) || typescript_1.default.isNoSubstitutionTemplateLiteral(translatedNode)
                                    ? translatedNode.getText().slice(1, -1)
                                    : _this.templateExpressionToString(translatedNode);
                                translationsForLocale.set(translationKey, serializedNode);
                                translations.set(targetLanguage, translationsForLocale);
                                // For complex template expressions, we need a way to look up the English span hash for each translated span hash, so we track those here
                                if (typescript_1.default.isTemplateExpression(enNode) && typescript_1.default.isTemplateExpression(translatedNode) && !_this.isSimpleTemplateExpression(enNode)) {
                                    for (var i = 0; i < enNode.templateSpans.length; i++) {
                                        var enSpan = enNode.templateSpans[i];
                                        var translatedSpan = translatedNode.templateSpans[i];
                                        _this.translatedSpanHashToEnglishSpanHash.set((0, hash_1.default)(translatedSpan.expression.getText()), (0, hash_1.default)(enSpan.expression.getText()));
                                    }
                                }
                            }
                        });
                        _e.label = 2;
                    case 2:
                        _loop_2 = function (targetLanguage) {
                            var translationsForLocale, stringsToTranslate, translationPromises, _loop_3, _f, stringsToTranslate_1, _g, key, _h, text, context, transformer, result, transformedSourceFile, printer, translatedCode, outputPath, finalFileContent;
                            return __generator(this, function (_j) {
                                switch (_j.label) {
                                    case 0:
                                        translationsForLocale = (_c = translations.get(targetLanguage)) !== null && _c !== void 0 ? _c : new Map();
                                        stringsToTranslate = new Map();
                                        this_1.extractStringsToTranslate(this_1.sourceFile, stringsToTranslate);
                                        translationPromises = [];
                                        _loop_3 = function (key, text, context) {
                                            if (translationsForLocale.has(key)) {
                                                return "continue";
                                            }
                                            var translationPromise = promisePool.add(function () { return _this.translator.translate(targetLanguage, text, context).then(function (result) { return translationsForLocale.set(key, result); }); });
                                            translationPromises.push(translationPromise);
                                        };
                                        for (_f = 0, stringsToTranslate_1 = stringsToTranslate; _f < stringsToTranslate_1.length; _f++) {
                                            _g = stringsToTranslate_1[_f], key = _g[0], _h = _g[1], text = _h.text, context = _h.context;
                                            _loop_3(key, text, context);
                                        }
                                        return [4 /*yield*/, Promise.allSettled(translationPromises)];
                                    case 1:
                                        _j.sent();
                                        transformer = this_1.createTransformer(translationsForLocale);
                                        result = typescript_1.default.transform(this_1.sourceFile, [transformer]);
                                        transformedSourceFile = (_d = result.transformed.at(0)) !== null && _d !== void 0 ? _d : this_1.sourceFile;
                                        result.dispose();
                                        // Import en.ts
                                        transformedSourceFile = TSCompilerUtils_1.default.addImport(transformedSourceFile, 'en', './en', true);
                                        printer = typescript_1.default.createPrinter();
                                        translatedCode = (0, decodeUnicode_1.default)(printer.printFile(transformedSourceFile));
                                        outputPath = path_1.default.join(this_1.languagesDir, "".concat(targetLanguage, ".ts"));
                                        fs_1.default.writeFileSync(outputPath, translatedCode, 'utf8');
                                        // Format the file with prettier
                                        return [4 /*yield*/, Prettier_1.default.format(outputPath)];
                                    case 2:
                                        // Format the file with prettier
                                        _j.sent();
                                        finalFileContent = fs_1.default.readFileSync(outputPath, 'utf8');
                                        finalFileContent = finalFileContent.replace('export default translations satisfies TranslationDeepObject<typeof translations>;', 'export default translations satisfies TranslationDeepObject<typeof en>;');
                                        // Add a fun ascii art touch with a helpful message
                                        finalFileContent = "".concat(GENERATED_FILE_PREFIX).concat(finalFileContent);
                                        fs_1.default.writeFileSync(outputPath, finalFileContent, 'utf8');
                                        console.log("\u2705 Translated file created: ".concat(outputPath));
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a = 0, _b = this.targetLanguages;
                        _e.label = 3;
                    case 3:
                        if (!(_a < _b.length)) return [3 /*break*/, 6];
                        targetLanguage = _b[_a];
                        return [5 /*yield**/, _loop_2(targetLanguage)];
                    case 4:
                        _e.sent();
                        _e.label = 5;
                    case 5:
                        _a++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Each translation file should have an object called translations that's later default-exported. This function takes in a root node, and finds the translations node.
     */
    TranslationGenerator.prototype.findTranslationsNode = function (sourceFile) {
        var defaultExport = TSCompilerUtils_1.default.findDefaultExport(sourceFile);
        if (!defaultExport) {
            throw new Error('Could not find default export in source file');
        }
        var defaultExportIdentifier = TSCompilerUtils_1.default.extractIdentifierFromExpression(defaultExport);
        var translationsNode = TSCompilerUtils_1.default.resolveDeclaration(defaultExportIdentifier !== null && defaultExportIdentifier !== void 0 ? defaultExportIdentifier : '', sourceFile);
        return translationsNode;
    };
    /**
     * Should the given node be translated?
     */
    TranslationGenerator.prototype.shouldNodeBeTranslated = function (node) {
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
        var isPartOfControlFlow = node.parent &&
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
        var isArgumentToLogFunction = node.parent &&
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
        var staticText = node.head.text;
        for (var _i = 0, _a = node.templateSpans; _i < _a.length; _i++) {
            var span = _a[_i];
            staticText += span.literal.text;
        }
        return /[a-zA-Z]/.test(staticText);
    };
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
    TranslationGenerator.prototype.isSimpleExpression = function (expr) {
        return typescript_1.default.isIdentifier(expr) || typescript_1.default.isPropertyAccessExpression(expr) || typescript_1.default.isElementAccessExpression(expr);
    };
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
    TranslationGenerator.prototype.isSimpleTemplateExpression = function (node) {
        var _this = this;
        return node.templateSpans.every(function (span) { return _this.isSimpleExpression(span.expression); });
    };
    /**
     * Extract any leading context annotation for a given node.
     */
    TranslationGenerator.prototype.getContextForNode = function (node) {
        var _a, _b;
        // First, check for an inline context comment.
        var inlineContext = (_a = node.getFullText().match(TranslationGenerator.CONTEXT_REGEX)) === null || _a === void 0 ? void 0 : _a[1].trim();
        if (inlineContext) {
            return inlineContext;
        }
        // Otherwise, look for the nearest ancestor that may have a comment attached.
        // For now, we only support property assignments.
        var nearestPropertyAssignmentAncestor = TSCompilerUtils_1.default.findAncestor(node, function (n) { return typescript_1.default.isPropertyAssignment(n); });
        if (!nearestPropertyAssignmentAncestor) {
            return undefined;
        }
        // Search through comments looking for a context comment
        var commentRanges = (_b = typescript_1.default.getLeadingCommentRanges(this.sourceFile.getFullText(), nearestPropertyAssignmentAncestor.getFullStart())) !== null && _b !== void 0 ? _b : [];
        for (var _i = 0, _c = commentRanges.reverse(); _i < _c.length; _i++) {
            var range = _c[_i];
            var commentText = this.sourceFile.getFullText().slice(range.pos, range.end);
            var match = commentText.match(TranslationGenerator.CONTEXT_REGEX);
            if (match) {
                return match[1].trim();
            }
        }
        // No context comments were found
        return undefined;
    };
    /**
     * Generate a hash of the string representation of a node along with any context comments.
     */
    TranslationGenerator.prototype.getTranslationKey = function (node) {
        if (!typescript_1.default.isStringLiteral(node) && !typescript_1.default.isNoSubstitutionTemplateLiteral(node) && !typescript_1.default.isTemplateExpression(node)) {
            throw new Error("Cannot generate translation key for node: ".concat(node.getText()));
        }
        // Trim leading whitespace, quotation marks, and backticks
        var keyBase = node
            .getText()
            .trim()
            .replace(/^['"`]/, '')
            .replace(/['"`]$/, '');
        var context = this.getContextForNode(node);
        if (context) {
            keyBase += context;
        }
        return (0, hash_1.default)(keyBase);
    };
    /**
     * Check if a given translation path should be translated based on the paths filter.
     * If no paths are specified, all paths should be translated.
     * If paths are specified, only paths that match exactly or are nested under a specified path should be translated.
     */
    TranslationGenerator.prototype.shouldTranslatePath = function (currentPath) {
        if (!this.paths || this.paths.length === 0) {
            return true;
        }
        for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
            var targetPath = _a[_i];
            // Exact match
            if (currentPath === targetPath) {
                return true;
            }
            // Current path is nested under target path
            if (currentPath.startsWith("".concat(targetPath, "."))) {
                return true;
            }
            // Target path is nested under current path (for parent path matching)
            if (targetPath.startsWith("".concat(currentPath, "."))) {
                return true;
            }
        }
        return false;
    };
    /**
     * Recursively extract all string literals and templates to translate from the subtree rooted at the given node.
     * Simple templates (as defined by this.isSimpleTemplateExpression) can be translated directly.
     * Complex templates must have each of their spans recursively translated first, so we'll extract all the lowest-level strings to translate.
     * Then complex templates will be serialized with a hash of complex spans in place of the span text, and we'll translate that.
     */
    TranslationGenerator.prototype.extractStringsToTranslate = function (node, stringsToTranslate, currentPath) {
        var _this = this;
        if (currentPath === void 0) { currentPath = ''; }
        if (this.shouldNodeBeTranslated(node)) {
            // Check if this translation path should be included based on the paths filter
            if (!this.shouldTranslatePath(currentPath)) {
                return; // Skip this node and its children if the path doesn't match
            }
            var context = this.getContextForNode(node);
            var translationKey = this.getTranslationKey(node);
            // String literals and no-substitution templates can be translated directly
            if (typescript_1.default.isStringLiteral(node) || typescript_1.default.isNoSubstitutionTemplateLiteral(node)) {
                stringsToTranslate.set(translationKey, { text: node.text, context: context });
            }
            // Template expressions must be encoded directly before they can be translated
            else if (typescript_1.default.isTemplateExpression(node)) {
                if (this.isSimpleTemplateExpression(node)) {
                    stringsToTranslate.set(translationKey, { text: this.templateExpressionToString(node), context: context });
                }
                else {
                    if (this.verbose) {
                        console.debug('😵‍💫 Encountered complex template, recursively translating its spans first:', node.getText());
                    }
                    node.templateSpans.forEach(function (span) { return _this.extractStringsToTranslate(span, stringsToTranslate, currentPath); });
                    stringsToTranslate.set(translationKey, { text: this.templateExpressionToString(node), context: context });
                }
            }
        }
        // Continue traversing children
        node.forEachChild(function (child) {
            var childPath = currentPath;
            // If the child is a property assignment, update the path
            if (typescript_1.default.isPropertyAssignment(child)) {
                var propName = void 0;
                if (typescript_1.default.isIdentifier(child.name)) {
                    propName = child.name.text;
                }
                else if (typescript_1.default.isStringLiteral(child.name)) {
                    propName = child.name.text;
                }
                if (propName) {
                    childPath = currentPath ? "".concat(currentPath, ".").concat(propName) : propName;
                }
            }
            _this.extractStringsToTranslate(child, stringsToTranslate, childPath);
        });
    };
    /**
     * Convert a template expression into a plain string representation that can be predictably serialized.
     * All ${...} spans containing complex expressions are replaced in the string by hashes of the expression text.
     *
     * @example templateExpressionToString(`Edit ${action?.type === 'IOU' ? 'expense' : 'comment'} on ${date}`)
     *       => `Edit ${HASH1} on ${date}`
     */
    TranslationGenerator.prototype.templateExpressionToString = function (expression) {
        var result = expression.head.text;
        for (var _i = 0, _a = expression.templateSpans; _i < _a.length; _i++) {
            var span = _a[_i];
            if (this.isSimpleExpression(span.expression)) {
                result += "${".concat(span.expression.getText(), "}");
            }
            else {
                result += "${".concat((0, hash_1.default)(span.expression.getText()), "}");
            }
            result += span.literal.text;
        }
        return result;
    };
    /**
     * Convert our string-encoded template expression to a template expression.
     * If the template contains any complex spans, those must be translated first, and those translations need to be passed in.
     */
    TranslationGenerator.prototype.stringToTemplateExpression = function (input, translatedComplexExpressions) {
        var _a, _b, _c, _d, _e;
        if (translatedComplexExpressions === void 0) { translatedComplexExpressions = new Map(); }
        var regex = /\$\{([^}]*)}/g;
        var matches = __spreadArray([], input.matchAll(regex), true);
        var headText = input.slice(0, (_b = (_a = matches.at(0)) === null || _a === void 0 ? void 0 : _a.index) !== null && _b !== void 0 ? _b : input.length);
        var templateHead = typescript_1.default.factory.createTemplateHead(headText);
        var spans = [];
        for (var i = 0; i < matches.length; i++) {
            var match = matches.at(i);
            if (!match) {
                continue;
            }
            var fullMatch = match[0], placeholder = match[1];
            var expression = void 0;
            var trimmed = placeholder.trim();
            if (/^\d+$/.test(trimmed)) {
                // It's a hash reference to a complex span
                var hashed = Number(trimmed);
                // If the translated, serialized template expression came from an existing translation file, then the hash of the complex expression will be a hash of the translated expression.
                // If the translated, serialized template expression came from ChatGPT, then the hash of the complex expression will be a hash of the English expression.
                // Meanwhile, translatedComplexExpressions is keyed by English hashes, because it comes from createTransformer, which is parsing and transforming an English file.
                // So when rebuilding the template expression from its serialized form, we first search for the translated expression assuming the expression is serialized with English hashes.
                // If that fails, we look up the English expression hash associated with the translated expression hash, then look up the translated expression using the English hash.
                var translatedExpression = (_c = translatedComplexExpressions.get(hashed)) !== null && _c !== void 0 ? _c : translatedComplexExpressions.get((_d = this.translatedSpanHashToEnglishSpanHash.get(hashed)) !== null && _d !== void 0 ? _d : hashed);
                if (!translatedExpression) {
                    throw new Error("No template found for hash: ".concat(hashed));
                }
                expression = translatedExpression;
            }
            else {
                // Assume it's a simple identifier or property access
                expression = typescript_1.default.factory.createIdentifier(trimmed);
            }
            var startOfMatch = match.index;
            var nextStaticTextStart = startOfMatch + fullMatch.length;
            var nextStaticTextEnd = i + 1 < matches.length ? (_e = matches.at(i + 1)) === null || _e === void 0 ? void 0 : _e.index : input.length;
            var staticText = input.slice(nextStaticTextStart, nextStaticTextEnd);
            var literal = i === matches.length - 1 ? typescript_1.default.factory.createTemplateTail(staticText) : typescript_1.default.factory.createTemplateMiddle(staticText);
            spans.push(typescript_1.default.factory.createTemplateSpan(expression, literal));
        }
        return typescript_1.default.factory.createTemplateExpression(templateHead, spans);
    };
    /**
     * Generate an AST transformer for the given set of translations.
     */
    TranslationGenerator.prototype.createTransformer = function (translations) {
        var _this = this;
        return function (context) {
            var visit = function (node) {
                if (_this.shouldNodeBeTranslated(node)) {
                    if (typescript_1.default.isStringLiteral(node)) {
                        var translatedText = translations.get(_this.getTranslationKey(node));
                        return translatedText ? typescript_1.default.factory.createStringLiteral(translatedText) : node;
                    }
                    if (typescript_1.default.isNoSubstitutionTemplateLiteral(node)) {
                        var translatedText = translations.get(_this.getTranslationKey(node));
                        return translatedText ? typescript_1.default.factory.createNoSubstitutionTemplateLiteral(translatedText) : node;
                    }
                    if (typescript_1.default.isTemplateExpression(node)) {
                        var translatedTemplate = translations.get(_this.getTranslationKey(node));
                        if (!translatedTemplate) {
                            console.warn('⚠️ No translation found for template expression', node.getText());
                            return node;
                        }
                        // Recursively translate all complex template expressions first
                        var translatedComplexExpressions = new Map();
                        // Template expression is complex:
                        for (var _i = 0, _a = node.templateSpans; _i < _a.length; _i++) {
                            var span = _a[_i];
                            var expression = span.expression;
                            if (_this.isSimpleExpression(expression)) {
                                continue;
                            }
                            var hash = (0, hash_1.default)(expression.getText());
                            var translatedExpression = typescript_1.default.visitNode(expression, visit);
                            translatedComplexExpressions.set(hash, translatedExpression);
                        }
                        // Build the translated template expression, referencing the translated template spans as necessary
                        return _this.stringToTemplateExpression(translatedTemplate, translatedComplexExpressions);
                    }
                }
                return typescript_1.default.visitEachChild(node, visit, context);
            };
            return function (node) {
                var _a;
                var transformedNode = (_a = typescript_1.default.visitNode(node, visit)) !== null && _a !== void 0 ? _a : node; // Ensure we always return a valid node
                return transformedNode; // Safe cast since we always pass in a SourceFile
            };
        };
    };
    /**
     * Regex to match context annotations.
     */
    TranslationGenerator.CONTEXT_REGEX = /^\s*(?:\/{2}|\*|\/\*)?\s*@context\s+([^\n*/]+)/;
    return TranslationGenerator;
}());
/**
 * The main function mostly contains CLI and file I/O logic, while TS parsing and translation logic is encapsulated in TranslationGenerator.
 */
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var languagesDir, enSourceFile, cli, translator, generator;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    languagesDir = (_a = process.env.LANGUAGES_DIR) !== null && _a !== void 0 ? _a : path_1.default.join(__dirname, '../src/languages');
                    enSourceFile = path_1.default.join(languagesDir, 'en.ts');
                    cli = new CLI_1.default({
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
                                default: Object.values(LOCALES_1.TRANSLATION_TARGET_LOCALES).filter(function (locale) { return locale !== LOCALES_1.LOCALES.ES; }),
                                parse: function (val) {
                                    var rawLocales = val.split(',');
                                    var validatedLocales = [];
                                    for (var _i = 0, rawLocales_1 = rawLocales; _i < rawLocales_1.length; _i++) {
                                        var locale = rawLocales_1[_i];
                                        if (!(0, LOCALES_1.isTranslationTargetLocale)(locale)) {
                                            throw new Error("Invalid locale ".concat(String(locale)));
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
                                parse: function (val) {
                                    var rawPaths = val.split(',').map(function (translationPath) { return translationPath.trim(); });
                                    var validatedPaths = [];
                                    var invalidPaths = [];
                                    for (var _i = 0, rawPaths_1 = rawPaths; _i < rawPaths_1.length; _i++) {
                                        var rawPath = rawPaths_1[_i];
                                        if ((0, get_1.default)(en_1.default, rawPath)) {
                                            validatedPaths.push(rawPath);
                                        }
                                        else {
                                            invalidPaths.push(rawPath);
                                        }
                                    }
                                    if (invalidPaths.length > 0) {
                                        throw new Error("found the following invalid paths: ".concat(JSON.stringify(invalidPaths)));
                                    }
                                    return validatedPaths;
                                },
                                supersedes: ['compare-ref'],
                                required: false,
                            },
                        },
                    });
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
                    generator = new TranslationGenerator({
                        targetLanguages: cli.namedArgs.locales,
                        languagesDir: languagesDir,
                        sourceFile: enSourceFile,
                        translator: translator,
                        compareRef: cli.namedArgs['compare-ref'],
                        paths: cli.namedArgs.paths,
                        verbose: cli.flags.verbose,
                    });
                    return [4 /*yield*/, generator.generateTranslations()];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
if (require.main === module) {
    main();
}
exports.default = main;
