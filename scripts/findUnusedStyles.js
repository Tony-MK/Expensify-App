"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComprehensiveStylesFinder = void 0;
var fs = require("fs");
var glob_1 = require("glob");
var path = require("path");
var ts = require("typescript");
var TSCompilerUtils_1 = require("./utils/TSCompilerUtils");
// Static patterns and constants - created once
var STYLE_FILE_EXTENSIONS = '**/*.{ts,tsx}';
var STYLE_KEY_SKIP_PATTERNS = new Set(['default', 'exports', 'module', 'require', 'import', 'from', 'theme', 'colors', 'variables', 'CONST', 'Platform', 'StyleSheet']);
// Use EXCLUDED_STYLE_DIRS to clarify which directories are being ignored
var EXCLUDED_STYLE_DIRS = ['src/styles/utils/**', 'src/styles/generators/**', 'src/styles/theme/**'];
var ComprehensiveStylesFinder = /** @class */ (function () {
    function ComprehensiveStylesFinder(rootDir) {
        this.styleDefinitions = new Map();
        this.fileContents = new Map();
        this.rootDir = rootDir;
    }
    ComprehensiveStylesFinder.prototype.findUnusedStyles = function () {
        console.log('🔍 Step 1: Finding all style definitions...');
        this.findAllStyleDefinitions();
        console.log("\uD83D\uDCCA Found ".concat(this.styleDefinitions.size, " style definitions"));
        console.log('🔍 Step 2: Loading all file contents...');
        this.loadAllFileContents();
        console.log('🔍 Step 3: Comprehensive style usage analysis...');
        this.findStyleUsagesComprehensive();
        console.log('📊 Step 4: Identifying unused styles...');
        return this.getUnusedStyles();
    };
    ComprehensiveStylesFinder.prototype.findAllStyleDefinitions = function () {
        var styleFiles = (0, glob_1.globSync)("src/styles/".concat(STYLE_FILE_EXTENSIONS), {
            cwd: this.rootDir,
            ignore: EXCLUDED_STYLE_DIRS,
        });
        console.log("Scanning ".concat(styleFiles.length, " main style files (excluding utils/generators/themes)..."));
        for (var _i = 0, styleFiles_1 = styleFiles; _i < styleFiles_1.length; _i++) {
            var file = styleFiles_1[_i];
            var fullPath = path.join(this.rootDir, file);
            try {
                var fileContent = fs.readFileSync(fullPath, 'utf8');
                var sourceFile = ts.createSourceFile(fullPath, fileContent, ts.ScriptTarget.Latest, true);
                this.extractStyleKeysFromFile(sourceFile, file);
            }
            catch (error) {
                console.warn("Warning: Could not read style file ".concat(file, ":"), error);
            }
        }
    };
    ComprehensiveStylesFinder.prototype.extractStyleKeysFromFile = function (sourceFile, file) {
        var _this = this;
        var visit = function (node) {
            // For styles/index.ts, only process styles that are inside the main styles function
            if (file === 'src/styles/index.ts') {
                // Look for the main styles function (arrow function assigned to 'styles' variable)
                if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'styles' && node.initializer && ts.isArrowFunction(node.initializer)) {
                    // Process only the body of the styles function
                    if (node.initializer.body) {
                        var returnObject = void 0;
                        if (ts.isParenthesizedExpression(node.initializer.body)) {
                            returnObject = node.initializer.body.expression;
                        }
                        else if (ts.isObjectLiteralExpression(node.initializer.body)) {
                            returnObject = node.initializer.body;
                        }
                        else if (ts.isSatisfiesExpression(node.initializer.body)) {
                            var satisfiesExpr = node.initializer.body.expression;
                            if (ts.isParenthesizedExpression(satisfiesExpr)) {
                                returnObject = satisfiesExpr.expression;
                            }
                            else {
                                returnObject = satisfiesExpr;
                            }
                        }
                        if (returnObject && ts.isObjectLiteralExpression(returnObject)) {
                            // Process each property in the returned object
                            _this.extractStyleDefinitionsFromObject(returnObject, sourceFile, file);
                            // After processing style definitions, check for spread patterns within this styles file
                            var fileContent = sourceFile.getFullText();
                            _this.checkSpreadPatternsInStylesFile(fileContent, file);
                        }
                    }
                    return; // Don't continue traversing for styles function
                }
                // Skip processing top-level constants and other functions for styles/index.ts
                if (ts.isVariableDeclaration(node) || ts.isFunctionDeclaration(node)) {
                    return;
                }
            }
            else {
                // For other files, process all style-like nodes normally
                _this.extractStyleDefinitionFromNode(node, sourceFile, file);
            }
            ts.forEachChild(node, visit);
        };
        visit(sourceFile);
    };
    /**
     * Extracts style definitions from a TypeScript object literal expression.
     *
     * This function scans through all properties in an object literal (typically the main styles object)
     * and identifies valid style definitions. It captures both:
     * - Property assignments with object literal values (e.g., `myStyle: { color: 'red' }`)
     * - Method declarations that return styles (e.g., `myStyle: () => ({ color: 'red' })`)
     *
     * Valid style definitions are added to the styleDefinitions map with their source location
     * for later unused style detection.
     *
     * @param objectLiteral - The TypeScript object literal expression to scan for style definitions
     * @param sourceFile - The TypeScript source file containing the object literal
     * @param file - The relative file path for tracking style definition locations
     */
    ComprehensiveStylesFinder.prototype.extractStyleDefinitionsFromObject = function (objectLiteral, sourceFile, file) {
        for (var _i = 0, _a = objectLiteral.properties; _i < _a.length; _i++) {
            var property = _a[_i];
            if (ts.isPropertyAssignment(property) || ts.isMethodDeclaration(property)) {
                var key = TSCompilerUtils_1.default.extractKeyFromPropertyNode(property);
                if (key && this.isStyleKey(key)) {
                    try {
                        var shouldCapture = false;
                        if (ts.isPropertyAssignment(property)) {
                            // For PropertyAssignment, check if the value is an object literal
                            if (ts.isObjectLiteralExpression(property.initializer)) {
                                shouldCapture = true;
                            }
                        }
                        else if (ts.isMethodDeclaration(property)) {
                            // For MethodDeclaration, it's a function that returns styles
                            shouldCapture = true;
                        }
                        if (shouldCapture) {
                            var _b = sourceFile.getLineAndCharacterOfPosition(property.getStart()), line = _b.line, character = _b.character;
                            this.styleDefinitions.set(key, {
                                key: key,
                                file: file,
                                line: line + 1,
                                column: character + 1,
                            });
                        }
                    }
                    catch (error) {
                        console.warn("Warning: Could not get position for style '".concat(key, "' in ").concat(file));
                    }
                }
            }
        }
    };
    /**
     * Extracts a style definition from an individual TypeScript AST node.
     *
     * This function processes individual AST nodes (typically during tree traversal) to identify
     * style definitions in non-main style files. It handles three types of style definitions:
     * - Property assignments with object literal values (e.g., `myStyle: { color: 'red' }`)
     * - Method declarations that return styles (e.g., `myStyle: () => ({ color: 'red' })`)
     * - Variable declarations that define styles (e.g., `const myStyle = { color: 'red' }`)
     *
     * @param node - The TypeScript AST node to check for style definitions
     * @param sourceFile - The TypeScript source file containing the node
     * @param file - The relative file path for tracking style definition locations
     */
    ComprehensiveStylesFinder.prototype.extractStyleDefinitionFromNode = function (node, sourceFile, file) {
        // Look for object literal properties (style definitions)
        if (ts.isPropertyAssignment(node) || ts.isMethodDeclaration(node)) {
            var key = TSCompilerUtils_1.default.extractKeyFromPropertyNode(node);
            if (key && this.isStyleKey(key)) {
                try {
                    var shouldCapture = false;
                    if (ts.isPropertyAssignment(node)) {
                        // For PropertyAssignment, check if the value is an object literal
                        if (ts.isObjectLiteralExpression(node.initializer)) {
                            shouldCapture = true;
                        }
                    }
                    else if (ts.isMethodDeclaration(node)) {
                        // For MethodDeclaration, it's a function that returns styles
                        shouldCapture = true;
                    }
                    if (shouldCapture) {
                        var _a = sourceFile.getLineAndCharacterOfPosition(node.getStart()), line = _a.line, character = _a.character;
                        this.styleDefinitions.set(key, {
                            key: key,
                            file: file,
                            line: line + 1,
                            column: character + 1,
                        });
                    }
                }
                catch (error) {
                    console.warn("Warning: Could not get position for style '".concat(key, "' in ").concat(file));
                }
            }
        }
        // Also look for variable declarations that might be styles
        if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
            var key = node.name.text;
            if (this.isStyleKey(key)) {
                try {
                    var _b = sourceFile.getLineAndCharacterOfPosition(node.getStart()), line = _b.line, character = _b.character;
                    this.styleDefinitions.set(key, {
                        key: key,
                        file: file,
                        line: line + 1,
                        column: character + 1,
                    });
                }
                catch (error) {
                    console.warn("Warning: Could not get position for style '".concat(key, "' in ").concat(file));
                }
            }
        }
    };
    ComprehensiveStylesFinder.prototype.isStyleKey = function (key) {
        // Skip certain patterns that are likely not style keys
        if (STYLE_KEY_SKIP_PATTERNS.has(key)) {
            return false;
        }
        return true;
    };
    ComprehensiveStylesFinder.prototype.loadAllFileContents = function () {
        // Use excludeMainStyleFiles to exclude only the main style definition files
        // Keep utils/generators/themes for usage checking
        var excludeMainStyleFiles = ['src/styles/index.ts', 'src/styles/variables.ts'];
        var sourceFiles = (0, glob_1.globSync)("src/**/".concat(STYLE_FILE_EXTENSIONS), {
            cwd: this.rootDir,
            ignore: excludeMainStyleFiles,
        });
        console.log("Loading ".concat(sourceFiles.length, " source files (including utils/generators/themes for usage checking)..."));
        for (var _i = 0, sourceFiles_1 = sourceFiles; _i < sourceFiles_1.length; _i++) {
            var file = sourceFiles_1[_i];
            var fullPath = path.join(this.rootDir, file);
            try {
                // Check if it's actually a file (not a directory)
                var stat = fs.lstatSync(fullPath);
                if (!stat.isFile()) {
                    console.warn("Skipping ".concat(file, ": not a file"));
                    continue;
                }
                var fileContent = fs.readFileSync(fullPath, 'utf8');
                this.fileContents.set(file, fileContent);
            }
            catch (error) {
                console.warn("Warning: Could not read source file ".concat(file, ":"), error);
            }
        }
    };
    ComprehensiveStylesFinder.prototype.findStyleUsagesComprehensive = function () {
        var allFiles = Array.from(this.fileContents.entries());
        console.log("Analyzing usage patterns for ".concat(this.styleDefinitions.size, " style keys across ").concat(allFiles.length, " files..."));
        var processedFiles = 0;
        for (var _i = 0, allFiles_1 = allFiles; _i < allFiles_1.length; _i++) {
            var _a = allFiles_1[_i], file = _a[0], content = _a[1];
            this.analyzeFileForStyleUsage(file, content);
            processedFiles++;
            // Early termination: if all styles are found, stop processing
            if (this.styleDefinitions.size === 0) {
                console.log("  \u2705 All styles found as used!");
                break;
            }
            // Show progress every 100 files
            if (processedFiles % 100 === 0) {
                console.log("  ".concat(this.styleDefinitions.size, " styles remaining..."));
            }
        }
        console.log("  Completed analysis.");
    };
    ComprehensiveStylesFinder.prototype.analyzeFileForStyleUsage = function (file, content) {
        // Use TypeScript AST to get content without comments
        try {
            var sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
            // Use getText() to get content without comments
            var cleanContent = sourceFile.getText();
            // Check individual style usage patterns - iterate over current definitions
            var keysToCheck = Array.from(this.styleDefinitions.keys());
            for (var _i = 0, keysToCheck_1 = keysToCheck; _i < keysToCheck_1.length; _i++) {
                var key = keysToCheck_1[_i];
                if (this.isStyleUsedInContent(key, cleanContent, file)) {
                    // Remove the key from definitions since it's used
                    this.styleDefinitions.delete(key);
                }
            }
        }
        catch (error) {
            // Fallback: use original content if AST parsing fails
            console.warn("Warning: Could not parse ".concat(file, " with AST, using original content"));
            var keysToCheck = Array.from(this.styleDefinitions.keys());
            for (var _a = 0, keysToCheck_2 = keysToCheck; _a < keysToCheck_2.length; _a++) {
                var key = keysToCheck_2[_a];
                if (this.isStyleUsedInContent(key, content, file)) {
                    this.styleDefinitions.delete(key);
                }
            }
        }
    };
    ComprehensiveStylesFinder.prototype.checkSpreadPatternsInStylesFile = function (content, file) {
        var _this = this;
        try {
            var sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
            var visit_1 = function (node) {
                // Handle object spread assignments (in object literals)
                if (ts.isSpreadAssignment(node)) {
                    _this.handleSpreadExpression(node.expression);
                }
                // Handle array/function spread elements
                else if (ts.isSpreadElement(node)) {
                    _this.handleSpreadExpression(node.expression);
                }
                ts.forEachChild(node, visit_1);
            };
            visit_1(sourceFile);
        }
        catch (error) {
            console.warn("Warning: Could not parse ".concat(file, " for spread detection:"), error);
        }
    };
    ComprehensiveStylesFinder.prototype.handleSpreadExpression = function (expression) {
        // Simple spreads like ...baseStyle
        if (ts.isIdentifier(expression)) {
            var objectName = expression.text;
            if (this.styleDefinitions.has(objectName)) {
                this.styleDefinitions.delete(objectName);
            }
        }
        // Property access spreads like ...positioning.pFixed
        else if (ts.isPropertyAccessExpression(expression)) {
            if (ts.isIdentifier(expression.expression) && ts.isIdentifier(expression.name)) {
                var objectName = expression.expression.text;
                var propertyName = expression.name.text;
                // Mark BOTH the object name and property name as used
                if (this.styleDefinitions.has(objectName)) {
                    this.styleDefinitions.delete(objectName);
                }
                if (this.styleDefinitions.has(propertyName)) {
                    this.styleDefinitions.delete(propertyName);
                }
            }
            // For complex property access (e.g., ...theme.styles.button)
            else {
                this.extractIdentifiersFromExpression(expression);
            }
        }
        // Element access spreads like ...styles['key']
        else if (ts.isElementAccessExpression(expression)) {
            if (ts.isIdentifier(expression.expression)) {
                var objectName = expression.expression.text;
                if (this.styleDefinitions.has(objectName)) {
                    this.styleDefinitions.delete(objectName);
                }
            }
            // Also check if the key is a string literal
            if (ts.isStringLiteral(expression.argumentExpression)) {
                var key = expression.argumentExpression.text;
                if (this.styleDefinitions.has(key)) {
                    this.styleDefinitions.delete(key);
                }
            }
        }
        // For all other complex expressions, extract any identifiers
        else {
            this.extractIdentifiersFromExpression(expression);
        }
    };
    ComprehensiveStylesFinder.prototype.extractIdentifiersFromExpression = function (expression) {
        var _this = this;
        var visit = function (node) {
            if (ts.isIdentifier(node)) {
                var name_1 = node.text;
                if (_this.styleDefinitions.has(name_1)) {
                    _this.styleDefinitions.delete(name_1);
                }
            }
            ts.forEachChild(node, visit);
        };
        visit(expression);
    };
    ComprehensiveStylesFinder.prototype.isStyleUsedInContent = function (key, content, file) {
        // Fast check: if the key doesn't appear at all in the content, it's not used
        if (!content.includes(key)) {
            return false;
        }
        try {
            var sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
            var found_1 = false;
            var visit_2 = function (node) {
                if (found_1) {
                    return; // Early termination for performance
                }
                // Property access: obj.key, styles.key, theme.key
                if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.name) && node.name.text === key) {
                    found_1 = true;
                    return;
                }
                // Identifier: key (in destructuring, assignments, etc.)
                if (ts.isIdentifier(node) && node.text === key) {
                    // Exclude property names in object literals (e.g., {key: value} where key is the property name)
                    var parent_1 = node.parent;
                    if (ts.isPropertyAssignment(parent_1) && parent_1.name === node) {
                        // This is a property name, not a usage
                        ts.forEachChild(node, visit_2);
                        return;
                    }
                    if (ts.isMethodDeclaration(parent_1) && parent_1.name === node) {
                        // This is a method name, not a usage
                        ts.forEachChild(node, visit_2);
                        return;
                    }
                    if (ts.isGetAccessorDeclaration(parent_1) && parent_1.name === node) {
                        // This is a getter name, not a usage
                        ts.forEachChild(node, visit_2);
                        return;
                    }
                    if (ts.isSetAccessorDeclaration(parent_1) && parent_1.name === node) {
                        // This is a setter name, not a usage
                        ts.forEachChild(node, visit_2);
                        return;
                    }
                    found_1 = true;
                    return;
                }
                // Element access: obj["key"], obj['key']
                if (ts.isElementAccessExpression(node) && ts.isStringLiteral(node.argumentExpression) && node.argumentExpression.text === key) {
                    found_1 = true;
                    return;
                }
                // Template literal usage: `${key}` or `text-${key}-more`
                if (ts.isTemplateExpression(node)) {
                    for (var _i = 0, _a = node.templateSpans; _i < _a.length; _i++) {
                        var span = _a[_i];
                        if (ts.isIdentifier(span.expression) && span.expression.text === key) {
                            found_1 = true;
                            return;
                        }
                        // Also check for property access in template spans
                        if (ts.isPropertyAccessExpression(span.expression) && ts.isIdentifier(span.expression.name) && span.expression.name.text === key) {
                            found_1 = true;
                            return;
                        }
                    }
                }
                // Tagged template literals: css`${key}`
                if (ts.isTaggedTemplateExpression(node) && ts.isTemplateExpression(node.template)) {
                    for (var _b = 0, _c = node.template.templateSpans; _b < _c.length; _b++) {
                        var span = _c[_b];
                        if (ts.isIdentifier(span.expression) && span.expression.text === key) {
                            found_1 = true;
                            return;
                        }
                    }
                }
                ts.forEachChild(node, visit_2);
            };
            visit_2(sourceFile);
            return found_1;
        }
        catch (error) {
            // Fallback to simple text search if AST parsing fails
            console.warn("Warning: Could not parse ".concat(file, " for usage detection, falling back to text search"));
            return content.includes(key);
        }
    };
    ComprehensiveStylesFinder.prototype.getUnusedStyles = function () {
        // Whatever remains in styleDefinitions are the unused styles
        var unused = Array.from(this.styleDefinitions.values());
        return unused.sort(function (a, b) { return a.file.localeCompare(b.file) || a.line - b.line; });
    };
    return ComprehensiveStylesFinder;
}());
exports.ComprehensiveStylesFinder = ComprehensiveStylesFinder;
// CLI interface
function main() {
    var rootDir = process.cwd();
    try {
        var finder = new ComprehensiveStylesFinder(rootDir);
        var unusedStyles = finder.findUnusedStyles();
        if (unusedStyles.length === 0) {
            console.log('✅ No unused styles found!');
            process.exit(0);
        }
        console.error("Found ".concat(unusedStyles.length, " unused styles:"));
        console.log('');
        var groupedByFile = {};
        for (var _i = 0, unusedStyles_1 = unusedStyles; _i < unusedStyles_1.length; _i++) {
            var style = unusedStyles_1[_i];
            if (!groupedByFile[style.file]) {
                groupedByFile[style.file] = [];
            }
            groupedByFile[style.file].push(style);
        }
        for (var _a = 0, _b = Object.entries(groupedByFile); _a < _b.length; _a++) {
            var _c = _b[_a], file = _c[0], styles = _c[1];
            console.log("\uD83D\uDCC1 ".concat(file, ":"));
            for (var _d = 0, styles_1 = styles; _d < styles_1.length; _d++) {
                var style = styles_1[_d];
                console.log("  - ".concat(style.key, " (line ").concat(style.line, ":").concat(style.column, ")"));
            }
            console.log('');
        }
        process.exit(1);
    }
    catch (error) {
        console.error('❌ Error analyzing styles:', error);
        process.exit(1);
    }
}
if (require.main === module) {
    main();
}
