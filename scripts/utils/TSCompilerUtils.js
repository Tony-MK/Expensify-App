"use strict";
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
var typescript_1 = require("typescript");
/**
 * Walk up the AST from a given node and return the nearest ancestor that matches a predicate.
 *
 * @param node The starting node.
 * @param predicate A function that returns true for the desired ancestor type.
 * @returns The nearest matching ancestor node, or undefined if none found.
 */
function findAncestor(node, predicate) {
    var current = node.parent;
    while (current) {
        if (predicate(current)) {
            return current;
        }
        current = current.parent;
    }
    return undefined;
}
/**
 * Adds a default import statement to the provided SourceFile.
 */
function addImport(sourceFile, identifierName, modulePath, isTypeOnly) {
    if (isTypeOnly === void 0) { isTypeOnly = false; }
    var newImport = typescript_1.default.factory.createImportDeclaration(undefined, typescript_1.default.factory.createImportClause(isTypeOnly, typescript_1.default.factory.createIdentifier(identifierName), undefined), typescript_1.default.factory.createStringLiteral(modulePath));
    // Find the index of the last import declaration
    var lastImportIndex = -1;
    for (var i = sourceFile.statements.length - 1; i >= 0; i--) {
        if (typescript_1.default.isImportDeclaration(sourceFile.statements[i])) {
            lastImportIndex = i;
            break;
        }
    }
    var updatedStatements = typescript_1.default.factory.createNodeArray(__spreadArray(__spreadArray(__spreadArray([], sourceFile.statements.slice(0, lastImportIndex + 1), true), [newImport], false), sourceFile.statements.slice(lastImportIndex + 1), true));
    return typescript_1.default.factory.updateSourceFile(sourceFile, updatedStatements);
}
/**
 * Walks a list of AST nodes in parallel and applies the visitor function at each set of corresponding nodes.
 * Traverses only to the depth and breadth of the shortest subtree at each level.
 *
 * disclaimer: I don't know how this should/will work for ASTs that don't share a common structure. For now, that's undefined behavior.
 */
function traverseASTsInParallel(roots, visit) {
    var _a;
    if (roots.length === 0) {
        return;
    }
    var nodeMap = {};
    for (var _i = 0, roots_1 = roots; _i < roots_1.length; _i++) {
        var _b = roots_1[_i], label = _b.label, node = _b.node;
        nodeMap[label] = node;
    }
    visit(nodeMap);
    // Collect children per label
    var childrenByLabel = new Map();
    var minChildren = Infinity;
    for (var _c = 0, roots_2 = roots; _c < roots_2.length; _c++) {
        var _d = roots_2[_c], label = _d.label, node = _d.node;
        var children = node.getChildren();
        childrenByLabel.set(label, children);
        if (children.length < minChildren) {
            minChildren = children.length;
        }
    }
    // Traverse child nodes in parallel, stopping at the shortest list
    for (var i = 0; i < minChildren; i++) {
        var nextLevel = [];
        for (var _e = 0, roots_3 = roots; _e < roots_3.length; _e++) {
            var label = roots_3[_e].label;
            var children = (_a = childrenByLabel.get(label)) !== null && _a !== void 0 ? _a : [];
            var child = children.at(i);
            if (child) {
                nextLevel.push({ label: label, node: child });
            }
        }
        traverseASTsInParallel(nextLevel, visit);
    }
}
/**
 * Finds the node that is exported as the default export.
 * Returns null if not found.
 */
function findDefaultExport(sourceFile) {
    for (var _i = 0, _a = sourceFile.statements; _i < _a.length; _i++) {
        var statement = _a[_i];
        if (typescript_1.default.isExportAssignment(statement) && !statement.isExportEquals) {
            return statement.expression;
        }
        if (typescript_1.default.isExportDeclaration(statement) && statement.exportClause && typescript_1.default.isNamedExports(statement.exportClause)) {
            for (var _b = 0, _c = statement.exportClause.elements; _b < _c.length; _b++) {
                var element = _c[_b];
                if (element.name.text === 'default') {
                    return element.name;
                }
            }
        }
    }
    return null;
}
/**
 * Resolves the identifier name to its declaration node within the source file.
 */
function resolveDeclaration(name, sourceFile) {
    var _a, _b;
    for (var _i = 0, _c = sourceFile.statements; _i < _c.length; _i++) {
        var statement = _c[_i];
        if (typescript_1.default.isVariableStatement(statement)) {
            for (var _d = 0, _e = statement.declarationList.declarations; _d < _e.length; _d++) {
                var decl = _e[_d];
                if (typescript_1.default.isIdentifier(decl.name) && decl.name.text === name) {
                    return decl;
                }
            }
        }
        if (typescript_1.default.isFunctionDeclaration(statement) && ((_a = statement.name) === null || _a === void 0 ? void 0 : _a.text) === name) {
            return statement;
        }
        if (typescript_1.default.isClassDeclaration(statement) && ((_b = statement.name) === null || _b === void 0 ? void 0 : _b.text) === name) {
            return statement;
        }
    }
    return null;
}
/**
 * Check if a node is an expression that has both 'expression' and 'type' properties.
 * This is useful for satisfies expressions and type assertions.
 */
function isExpressionWithType(node) {
    return 'expression' in node && 'type' in node && node.expression !== undefined && node.type !== undefined;
}
/**
 * Check if a node is a satisfies expression by examining its structure.
 * This is more robust than checking SyntaxKind numbers which might vary between TS versions.
 */
function isSatisfiesExpression(node) {
    // Check if the node text contains 'satisfies' and has the expected structure
    var nodeText = node.getText();
    if (!nodeText.includes(' satisfies ')) {
        return false;
    }
    return isExpressionWithType(node);
}
/**
 * Extracts the identifier name from various expression types.
 * Handles cases like:
 * - Simple identifier: `translations`
 * - Satisfies expression: `translations satisfies SomeType`
 * - As expression: `translations as SomeType`
 * - Parenthesized expression: `(translations)`
 * - Type assertion: `<SomeType>translations`
 */
function extractIdentifierFromExpression(node) {
    // Direct identifier
    if (typescript_1.default.isIdentifier(node)) {
        return node.text;
    }
    // Check for satisfies expression by looking at the node structure
    // A satisfies expression has the form: expression satisfies type
    if (isSatisfiesExpression(node)) {
        return extractIdentifierFromExpression(node.expression);
    }
    // As expression: `translations as SomeType`
    if (typescript_1.default.isAsExpression(node)) {
        return extractIdentifierFromExpression(node.expression);
    }
    // Parenthesized expression: `(translations)`
    if (typescript_1.default.isParenthesizedExpression(node)) {
        return extractIdentifierFromExpression(node.expression);
    }
    // Type assertion: `<SomeType>translations`
    // Check for type assertion by looking for angle bracket syntax and structure
    var nodeText = node.getText();
    if (nodeText.includes('<') && nodeText.includes('>') && 'expression' in node && 'type' in node && node.expression !== undefined && node.type !== undefined) {
        return extractIdentifierFromExpression(node.expression);
    }
    return null;
}
/**
 * Extracts the key name from a TypeScript property assignment or method declaration node.
 * Handles cases like:
 * - Property assignment: `key: value` -> "key"
 * - String literal property: `"key": value` -> "key"
 * - Method declaration: `key() { ... }` -> "key"
 *
 * @param node The PropertyAssignment or MethodDeclaration node to extract the key from
 * @returns The key name as a string, or undefined if the key cannot be extracted
 */
function extractKeyFromPropertyNode(node) {
    if (typescript_1.default.isPropertyAssignment(node)) {
        if (typescript_1.default.isIdentifier(node.name) || typescript_1.default.isStringLiteral(node.name)) {
            return node.name.text;
        }
    }
    else if (typescript_1.default.isMethodDeclaration(node) && typescript_1.default.isIdentifier(node.name)) {
        return node.name.text;
    }
    return undefined;
}
exports.default = { findAncestor: findAncestor, addImport: addImport, traverseASTsInParallel: traverseASTsInParallel, findDefaultExport: findDefaultExport, resolveDeclaration: resolveDeclaration, extractIdentifierFromExpression: extractIdentifierFromExpression, extractKeyFromPropertyNode: extractKeyFromPropertyNode };
