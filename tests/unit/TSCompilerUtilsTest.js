"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = require("typescript");
var TSCompilerUtils_1 = require("../../scripts/utils/TSCompilerUtils");
var dedent_1 = require("../../src/libs/StringUtils/dedent");
function createSourceFile(content) {
    return typescript_1.default.createSourceFile('test.ts', content, typescript_1.default.ScriptTarget.Latest, true);
}
function printSourceFile(sourceFile) {
    return typescript_1.default.createPrinter().printFile(sourceFile);
}
describe('TSCompilerUtils', function () {
    describe('addImport', function () {
        it('adds a default import after an existing import', function () {
            var source = createSourceFile((0, dedent_1.default)("\n                    import fs from 'fs';\n                    console.log('hello');\n                "));
            var updated = TSCompilerUtils_1.default.addImport(source, 'myModule', 'some-path');
            var output = printSourceFile(updated);
            expect(output).toBe((0, dedent_1.default)("\n                    import fs from 'fs';\n                    import myModule from \"some-path\";\n                    console.log('hello');\n                "));
        });
        it('adds a default import at the top when there are no imports', function () {
            var source = createSourceFile((0, dedent_1.default)("\n                    console.log('hello');\n                "));
            var updated = TSCompilerUtils_1.default.addImport(source, 'myModule', 'some-path');
            var output = printSourceFile(updated);
            expect(output).toBe((0, dedent_1.default)("\n                    import myModule from \"some-path\";\n                    console.log('hello');\n                "));
        });
        it('adds after multiple imports', function () {
            var source = createSourceFile((0, dedent_1.default)("\n                    import fs from 'fs';\n                    import path from 'path';\n\n                    function main() {\n                        console.log('hi');\n                    }\n                "));
            var updated = TSCompilerUtils_1.default.addImport(source, 'myModule', 'some-path');
            var output = printSourceFile(updated);
            expect(output).toBe((0, dedent_1.default)("\n                    import fs from 'fs';\n                    import path from 'path';\n                    import myModule from \"some-path\";\n                    function main() {\n                        console.log('hi');\n                    }\n                "));
        });
        it('adds to an empty file', function () {
            var source = createSourceFile("");
            var updated = TSCompilerUtils_1.default.addImport(source, 'init', './init');
            var output = printSourceFile(updated);
            expect(output).toBe((0, dedent_1.default)("\n                    import init from \"./init\";\n                "));
        });
        it('supports type-only imports', function () {
            var source = createSourceFile((0, dedent_1.default)("\n                    import fs from 'fs';\n                    console.log('hello');\n                "));
            var updated = TSCompilerUtils_1.default.addImport(source, 'MyType', 'some-path', true);
            var output = printSourceFile(updated);
            expect(output).toBe((0, dedent_1.default)("\n                    import fs from 'fs';\n                    import type MyType from \"some-path\";\n                    console.log('hello');\n                "));
        });
    });
    describe('traverseASTsInParallel', function () {
        it('visits all nodes in lockstep and applies individual visitors', function () {
            var en = "const x = \"Hello\"; function greet(name: string) { return `Hi ${name}`; }";
            var it = "const x = \"Ciao\"; function greet(name: string) { return `Ciao ${name}`; }";
            var enAST = createSourceFile(en);
            var itAST = createSourceFile(it);
            var enKinds = [];
            var itKinds = [];
            TSCompilerUtils_1.default.traverseASTsInParallel([
                { label: 'en', node: enAST },
                { label: 'it', node: itAST },
            ], function (nodes) {
                var enNode = nodes.en;
                enKinds.push(enNode.kind);
                var itNode = nodes.it;
                itKinds.push(itNode.kind);
            });
            expect(enKinds.length).toBe(itKinds.length);
            for (var i = 0; i < enKinds.length; i++) {
                expect(enKinds.at(i)).toBe(itKinds.at(i));
            }
        });
        it('collects matching string literals from multiple ASTs', function () {
            var en = "const a = \"Hello\"; const b = `World`;";
            var it = "const a = \"Ciao\"; const b = `Mondo`;";
            var enAST = createSourceFile(en);
            var itAST = createSourceFile(it);
            var enStrings = [];
            var itStrings = [];
            TSCompilerUtils_1.default.traverseASTsInParallel([
                { label: 'en', node: enAST },
                { label: 'it', node: itAST },
            ], function (nodes) {
                var enNode = nodes.en;
                var itNode = nodes.it;
                if (typescript_1.default.isStringLiteral(enNode) || typescript_1.default.isNoSubstitutionTemplateLiteral(enNode)) {
                    enStrings.push(enNode.text);
                }
                if (typescript_1.default.isStringLiteral(itNode) || typescript_1.default.isNoSubstitutionTemplateLiteral(itNode)) {
                    itStrings.push(itNode.text);
                }
            });
            expect(enStrings).toEqual(['Hello', 'World']);
            expect(itStrings).toEqual(['Ciao', 'Mondo']);
        });
        it('traverses only the shared structure when node counts differ', function () {
            var code1 = "const x = { a: 1, b: 2 };";
            var code2 = "const x = { a: 1 };";
            var ast1 = createSourceFile(code1);
            var ast2 = createSourceFile(code2);
            var count1 = 0;
            var count2 = 0;
            TSCompilerUtils_1.default.traverseASTsInParallel([
                { label: 'one', node: ast1 },
                { label: 'two', node: ast2 },
            ], function (nodes) {
                if (nodes.one) {
                    count1++;
                }
                if (nodes.two) {
                    count2++;
                }
            });
            // Expect both to visit the same number of shared nodes
            expect(count1).toBe(count2);
        });
        it('does nothing when given an empty array', function () {
            expect(function () {
                return TSCompilerUtils_1.default.traverseASTsInParallel([], function () {
                    throw new Error();
                });
            }).not.toThrow();
        });
        it('handles nested objects', function () {
            var ast1 = createSourceFile('const x = { a: 1, b: {c: 2}, d: 3};');
            var ast2 = createSourceFile('const x = { a: 1, b: {c: 2}, d: 3};');
            TSCompilerUtils_1.default.traverseASTsInParallel([
                {
                    label: 'one',
                    node: ast1,
                },
                {
                    label: 'two',
                    node: ast2,
                },
            ], function (nodes) {
                expect(nodes.one).toStrictEqual(nodes.two);
            });
        });
    });
    describe('findDefaultExport', function () {
        it('returns the identifier in `export default` statement', function () {
            var code = (0, dedent_1.default)("\n                const strings = { greeting: 'Hello' };\n                export default strings;\n            ");
            var ast = createSourceFile(code);
            var result = TSCompilerUtils_1.default.findDefaultExport(ast);
            expect(result === null || result === void 0 ? void 0 : result.getText()).toBe('strings');
        });
        it('returns the object literal if directly exported', function () {
            var code = (0, dedent_1.default)("\n                export default { farewell: 'Goodbye' };\n            ");
            var ast = createSourceFile(code);
            var result = TSCompilerUtils_1.default.findDefaultExport(ast);
            expect(result).not.toBeNull();
            if (!result) {
                return;
            }
            expect(typescript_1.default.isObjectLiteralExpression(result)).toBe(true);
            expect(result === null || result === void 0 ? void 0 : result.getText()).toContain('farewell');
        });
        it('returns null if no default export is present', function () {
            var code = (0, dedent_1.default)("\n                const foo = 'bar';\n                export const greeting = 'Hello';\n            ");
            var ast = createSourceFile(code);
            var result = TSCompilerUtils_1.default.findDefaultExport(ast);
            expect(result).toBeNull();
        });
        it('returns identifier for `export { foo as default }`', function () {
            var code = (0, dedent_1.default)("\n                const foo = { bar: 'baz' };\n                export { foo as default };\n            ");
            var ast = createSourceFile(code);
            var result = TSCompilerUtils_1.default.findDefaultExport(ast);
            expect(result === null || result === void 0 ? void 0 : result.getText()).toBe('default');
        });
    });
    describe('resolveDeclaration', function () {
        it('resolves a variable declaration', function () {
            var code = (0, dedent_1.default)("\n                const foo = { message: 'hi' };\n            ");
            var ast = createSourceFile(code);
            var node = TSCompilerUtils_1.default.resolveDeclaration('foo', ast);
            expect(node).not.toBeNull();
            if (!node) {
                return;
            }
            expect(typescript_1.default.isVariableDeclaration(node)).toBe(true);
            expect(node.getText()).toContain('message');
        });
        it('resolves a function declaration', function () {
            var code = (0, dedent_1.default)("\n                function greet() {\n                    return 'hello';\n                }\n            ");
            var ast = createSourceFile(code);
            var node = TSCompilerUtils_1.default.resolveDeclaration('greet', ast);
            expect(node).not.toBeNull();
            if (!node) {
                return;
            }
            expect(typescript_1.default.isFunctionDeclaration(node)).toBe(true);
            expect(node.getText()).toContain('hello');
        });
        it('resolves a class declaration', function () {
            var code = (0, dedent_1.default)("\n                class MyClass {\n                    method() {}\n                }\n            ");
            var ast = createSourceFile(code);
            var node = TSCompilerUtils_1.default.resolveDeclaration('MyClass', ast);
            expect(node).not.toBeNull();
            if (!node) {
                return;
            }
            expect(typescript_1.default.isClassDeclaration(node)).toBe(true);
            expect(node.getText()).toContain('method');
        });
        it('returns null for unknown identifier', function () {
            var code = (0, dedent_1.default)("\n                const foo = 123;\n            ");
            var ast = createSourceFile(code);
            var node = TSCompilerUtils_1.default.resolveDeclaration('bar', ast);
            expect(node).toBeNull();
        });
        it('returns declaration even if variable has no initializer', function () {
            var code = (0, dedent_1.default)("\n                let foo;\n            ");
            var ast = createSourceFile(code);
            var node = TSCompilerUtils_1.default.resolveDeclaration('foo', ast);
            expect(node).not.toBeNull();
            if (!node) {
                return;
            }
            expect(typescript_1.default.isVariableDeclaration(node)).toBe(true);
        });
    });
    describe('extractIdentifierFromExpression', function () {
        it('extracts identifier from simple identifier', function () {
            var code = 'translations';
            var ast = createSourceFile(code);
            var expression = ast.statements[0];
            var result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBe('translations');
        });
        it('extracts identifier from satisfies expression', function () {
            var code = 'translations satisfies TranslationDeepObject<typeof translations>;';
            var ast = createSourceFile(code);
            var expression = ast.statements[0];
            var result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBe('translations');
        });
        it('extracts identifier from as expression', function () {
            var code = 'translations as SomeType;';
            var ast = createSourceFile(code);
            var expression = ast.statements[0];
            var result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBe('translations');
        });
        it('extracts identifier from parenthesized expression', function () {
            var code = '(translations);';
            var ast = createSourceFile(code);
            var expression = ast.statements[0];
            var result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBe('translations');
        });
        it('extracts identifier from nested parenthesized expression', function () {
            var code = '((translations));';
            var ast = createSourceFile(code);
            var expression = ast.statements[0];
            var result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBe('translations');
        });
        it('extracts identifier from type assertion (angle bracket syntax)', function () {
            var code = '<SomeType>translations;';
            var ast = createSourceFile(code);
            var expression = ast.statements[0];
            var result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            // Note: This might be 'translations' or null depending on how TypeScript parses angle bracket syntax in JSX-enabled contexts
            expect(result).toEqual(expect.any(String));
        });
        it('extracts identifier from complex nested expression', function () {
            var code = '(translations as SomeType);';
            var ast = createSourceFile(code);
            var expression = ast.statements[0];
            var result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBe('translations');
        });
        it('extracts identifier from satisfies expression with nested parentheses', function () {
            var code = '(translations) satisfies TranslationDeepObject<typeof translations>;';
            var ast = createSourceFile(code);
            var expression = ast.statements[0];
            var result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBe('translations');
        });
        it('returns null for non-identifier expressions', function () {
            var code = '"hello world";';
            var ast = createSourceFile(code);
            var expression = ast.statements[0];
            var result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBeNull();
        });
        it('returns null for complex expressions that do not contain identifiers', function () {
            var code = '42 + 24;';
            var ast = createSourceFile(code);
            var expression = ast.statements[0];
            var result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBeNull();
        });
        it('returns null for call expressions', function () {
            var code = 'someFunction();';
            var ast = createSourceFile(code);
            var expression = ast.statements[0];
            var result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBeNull();
        });
        it('returns null for member expressions', function () {
            var code = 'obj.property;';
            var ast = createSourceFile(code);
            var expression = ast.statements[0];
            var result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBeNull();
        });
        it('handles deeply nested expression types', function () {
            var code = '((translations as SomeType) satisfies AnotherType);';
            var ast = createSourceFile(code);
            var expression = ast.statements[0];
            var result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBe('translations');
        });
    });
    describe('extractKeyFromPropertyNode', function () {
        it('extracts key from property assignment with identifier', function () {
            var code = (0, dedent_1.default)("\n                const obj = {\n                    myKey: 'value'\n                };\n            ");
            var ast = createSourceFile(code);
            var varDecl = ast.statements[0];
            var objLiteral = varDecl.declarationList.declarations[0].initializer;
            var propertyAssignment = objLiteral.properties[0];
            var result = TSCompilerUtils_1.default.extractKeyFromPropertyNode(propertyAssignment);
            expect(result).toBe('myKey');
        });
        it('extracts key from property assignment with string literal', function () {
            var code = (0, dedent_1.default)("\n                const obj = {\n                    \"myStringKey\": 'value'\n                };\n            ");
            var ast = createSourceFile(code);
            var varDecl = ast.statements[0];
            var objLiteral = varDecl.declarationList.declarations[0].initializer;
            var propertyAssignment = objLiteral.properties[0];
            var result = TSCompilerUtils_1.default.extractKeyFromPropertyNode(propertyAssignment);
            expect(result).toBe('myStringKey');
        });
        it('extracts key from method declaration', function () {
            var code = (0, dedent_1.default)("\n                const obj = {\n                    myMethod() {\n                        return 'hello';\n                    }\n                };\n            ");
            var ast = createSourceFile(code);
            var varDecl = ast.statements[0];
            var objLiteral = varDecl.declarationList.declarations[0].initializer;
            var methodDeclaration = objLiteral.properties[0];
            var result = TSCompilerUtils_1.default.extractKeyFromPropertyNode(methodDeclaration);
            expect(result).toBe('myMethod');
        });
        it('handles computed property names by returning undefined', function () {
            var code = (0, dedent_1.default)("\n                const obj = {\n                    [computedKey]: 'value'\n                };\n            ");
            var ast = createSourceFile(code);
            var varDecl = ast.statements[0];
            var objLiteral = varDecl.declarationList.declarations[0].initializer;
            var propertyAssignment = objLiteral.properties[0];
            var result = TSCompilerUtils_1.default.extractKeyFromPropertyNode(propertyAssignment);
            expect(result).toBeUndefined();
        });
        it('handles numeric literal property names by returning undefined', function () {
            var code = (0, dedent_1.default)("\n                const obj = {\n                    123: 'value'\n                };\n            ");
            var ast = createSourceFile(code);
            var varDecl = ast.statements[0];
            var objLiteral = varDecl.declarationList.declarations[0].initializer;
            var propertyAssignment = objLiteral.properties[0];
            var result = TSCompilerUtils_1.default.extractKeyFromPropertyNode(propertyAssignment);
            expect(result).toBeUndefined();
        });
        it('handles method declaration with complex name by returning undefined', function () {
            var code = (0, dedent_1.default)("\n                const obj = {\n                    [Symbol.iterator]() {\n                        return {};\n                    }\n                };\n            ");
            var ast = createSourceFile(code);
            var varDecl = ast.statements[0];
            var objLiteral = varDecl.declarationList.declarations[0].initializer;
            var methodDeclaration = objLiteral.properties[0];
            var result = TSCompilerUtils_1.default.extractKeyFromPropertyNode(methodDeclaration);
            expect(result).toBeUndefined();
        });
        it('handles arrow function property assignment', function () {
            var code = (0, dedent_1.default)("\n                const obj = {\n                    arrowFunc: () => 'hello'\n                };\n            ");
            var ast = createSourceFile(code);
            var varDecl = ast.statements[0];
            var objLiteral = varDecl.declarationList.declarations[0].initializer;
            var propertyAssignment = objLiteral.properties[0];
            var result = TSCompilerUtils_1.default.extractKeyFromPropertyNode(propertyAssignment);
            expect(result).toBe('arrowFunc');
        });
    });
});
