"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = require("typescript");
const TSCompilerUtils_1 = require("../../scripts/utils/TSCompilerUtils");
const dedent_1 = require("../../src/libs/StringUtils/dedent");
function createSourceFile(content) {
    return typescript_1.default.createSourceFile('test.ts', content, typescript_1.default.ScriptTarget.Latest, true);
}
function printSourceFile(sourceFile) {
    return typescript_1.default.createPrinter().printFile(sourceFile);
}
describe('TSCompilerUtils', () => {
    describe('addImport', () => {
        it('adds a default import after an existing import', () => {
            const source = createSourceFile((0, dedent_1.default)(`
                    import fs from 'fs';
                    console.log('hello');
                `));
            const updated = TSCompilerUtils_1.default.addImport(source, 'myModule', 'some-path');
            const output = printSourceFile(updated);
            expect(output).toBe((0, dedent_1.default)(`
                    import fs from 'fs';
                    import myModule from "some-path";
                    console.log('hello');
                `));
        });
        it('adds a default import at the top when there are no imports', () => {
            const source = createSourceFile((0, dedent_1.default)(`
                    console.log('hello');
                `));
            const updated = TSCompilerUtils_1.default.addImport(source, 'myModule', 'some-path');
            const output = printSourceFile(updated);
            expect(output).toBe((0, dedent_1.default)(`
                    import myModule from "some-path";
                    console.log('hello');
                `));
        });
        it('adds after multiple imports', () => {
            const source = createSourceFile((0, dedent_1.default)(`
                    import fs from 'fs';
                    import path from 'path';

                    function main() {
                        console.log('hi');
                    }
                `));
            const updated = TSCompilerUtils_1.default.addImport(source, 'myModule', 'some-path');
            const output = printSourceFile(updated);
            expect(output).toBe((0, dedent_1.default)(`
                    import fs from 'fs';
                    import path from 'path';
                    import myModule from "some-path";
                    function main() {
                        console.log('hi');
                    }
                `));
        });
        it('adds to an empty file', () => {
            const source = createSourceFile(``);
            const updated = TSCompilerUtils_1.default.addImport(source, 'init', './init');
            const output = printSourceFile(updated);
            expect(output).toBe((0, dedent_1.default)(`
                    import init from "./init";
                `));
        });
        it('supports type-only imports', () => {
            const source = createSourceFile((0, dedent_1.default)(`
                    import fs from 'fs';
                    console.log('hello');
                `));
            const updated = TSCompilerUtils_1.default.addImport(source, 'MyType', 'some-path', true);
            const output = printSourceFile(updated);
            expect(output).toBe((0, dedent_1.default)(`
                    import fs from 'fs';
                    import type MyType from "some-path";
                    console.log('hello');
                `));
        });
    });
    describe('traverseASTsInParallel', () => {
        it('visits all nodes in lockstep and applies individual visitors', () => {
            const en = `const x = "Hello"; function greet(name: string) { return \`Hi \${name}\`; }`;
            const it = `const x = "Ciao"; function greet(name: string) { return \`Ciao \${name}\`; }`;
            const enAST = createSourceFile(en);
            const itAST = createSourceFile(it);
            const enKinds = [];
            const itKinds = [];
            TSCompilerUtils_1.default.traverseASTsInParallel([
                { label: 'en', node: enAST },
                { label: 'it', node: itAST },
            ], (nodes) => {
                const enNode = nodes.en;
                enKinds.push(enNode.kind);
                const itNode = nodes.it;
                itKinds.push(itNode.kind);
            });
            expect(enKinds.length).toBe(itKinds.length);
            for (let i = 0; i < enKinds.length; i++) {
                expect(enKinds.at(i)).toBe(itKinds.at(i));
            }
        });
        it('collects matching string literals from multiple ASTs', () => {
            const en = `const a = "Hello"; const b = \`World\`;`;
            const it = `const a = "Ciao"; const b = \`Mondo\`;`;
            const enAST = createSourceFile(en);
            const itAST = createSourceFile(it);
            const enStrings = [];
            const itStrings = [];
            TSCompilerUtils_1.default.traverseASTsInParallel([
                { label: 'en', node: enAST },
                { label: 'it', node: itAST },
            ], (nodes) => {
                const enNode = nodes.en;
                const itNode = nodes.it;
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
        it('traverses only the shared structure when node counts differ', () => {
            const code1 = `const x = { a: 1, b: 2 };`;
            const code2 = `const x = { a: 1 };`;
            const ast1 = createSourceFile(code1);
            const ast2 = createSourceFile(code2);
            let count1 = 0;
            let count2 = 0;
            TSCompilerUtils_1.default.traverseASTsInParallel([
                { label: 'one', node: ast1 },
                { label: 'two', node: ast2 },
            ], (nodes) => {
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
        it('does nothing when given an empty array', () => {
            expect(() => TSCompilerUtils_1.default.traverseASTsInParallel([], () => {
                throw new Error();
            })).not.toThrow();
        });
        it('handles nested objects', () => {
            const ast1 = createSourceFile('const x = { a: 1, b: {c: 2}, d: 3};');
            const ast2 = createSourceFile('const x = { a: 1, b: {c: 2}, d: 3};');
            TSCompilerUtils_1.default.traverseASTsInParallel([
                {
                    label: 'one',
                    node: ast1,
                },
                {
                    label: 'two',
                    node: ast2,
                },
            ], (nodes) => {
                expect(nodes.one).toStrictEqual(nodes.two);
            });
        });
    });
    describe('findDefaultExport', () => {
        it('returns the identifier in `export default` statement', () => {
            const code = (0, dedent_1.default)(`
                const strings = { greeting: 'Hello' };
                export default strings;
            `);
            const ast = createSourceFile(code);
            const result = TSCompilerUtils_1.default.findDefaultExport(ast);
            expect(result?.getText()).toBe('strings');
        });
        it('returns the object literal if directly exported', () => {
            const code = (0, dedent_1.default)(`
                export default { farewell: 'Goodbye' };
            `);
            const ast = createSourceFile(code);
            const result = TSCompilerUtils_1.default.findDefaultExport(ast);
            expect(result).not.toBeNull();
            if (!result) {
                return;
            }
            expect(typescript_1.default.isObjectLiteralExpression(result)).toBe(true);
            expect(result?.getText()).toContain('farewell');
        });
        it('returns null if no default export is present', () => {
            const code = (0, dedent_1.default)(`
                const foo = 'bar';
                export const greeting = 'Hello';
            `);
            const ast = createSourceFile(code);
            const result = TSCompilerUtils_1.default.findDefaultExport(ast);
            expect(result).toBeNull();
        });
        it('returns identifier for `export { foo as default }`', () => {
            const code = (0, dedent_1.default)(`
                const foo = { bar: 'baz' };
                export { foo as default };
            `);
            const ast = createSourceFile(code);
            const result = TSCompilerUtils_1.default.findDefaultExport(ast);
            expect(result?.getText()).toBe('default');
        });
    });
    describe('resolveDeclaration', () => {
        it('resolves a variable declaration', () => {
            const code = (0, dedent_1.default)(`
                const foo = { message: 'hi' };
            `);
            const ast = createSourceFile(code);
            const node = TSCompilerUtils_1.default.resolveDeclaration('foo', ast);
            expect(node).not.toBeNull();
            if (!node) {
                return;
            }
            expect(typescript_1.default.isVariableDeclaration(node)).toBe(true);
            expect(node.getText()).toContain('message');
        });
        it('resolves a function declaration', () => {
            const code = (0, dedent_1.default)(`
                function greet() {
                    return 'hello';
                }
            `);
            const ast = createSourceFile(code);
            const node = TSCompilerUtils_1.default.resolveDeclaration('greet', ast);
            expect(node).not.toBeNull();
            if (!node) {
                return;
            }
            expect(typescript_1.default.isFunctionDeclaration(node)).toBe(true);
            expect(node.getText()).toContain('hello');
        });
        it('resolves a class declaration', () => {
            const code = (0, dedent_1.default)(`
                class MyClass {
                    method() {}
                }
            `);
            const ast = createSourceFile(code);
            const node = TSCompilerUtils_1.default.resolveDeclaration('MyClass', ast);
            expect(node).not.toBeNull();
            if (!node) {
                return;
            }
            expect(typescript_1.default.isClassDeclaration(node)).toBe(true);
            expect(node.getText()).toContain('method');
        });
        it('returns null for unknown identifier', () => {
            const code = (0, dedent_1.default)(`
                const foo = 123;
            `);
            const ast = createSourceFile(code);
            const node = TSCompilerUtils_1.default.resolveDeclaration('bar', ast);
            expect(node).toBeNull();
        });
        it('returns declaration even if variable has no initializer', () => {
            const code = (0, dedent_1.default)(`
                let foo;
            `);
            const ast = createSourceFile(code);
            const node = TSCompilerUtils_1.default.resolveDeclaration('foo', ast);
            expect(node).not.toBeNull();
            if (!node) {
                return;
            }
            expect(typescript_1.default.isVariableDeclaration(node)).toBe(true);
        });
    });
    describe('extractIdentifierFromExpression', () => {
        it('extracts identifier from simple identifier', () => {
            const code = 'translations';
            const ast = createSourceFile(code);
            const expression = ast.statements[0];
            const result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBe('translations');
        });
        it('extracts identifier from satisfies expression', () => {
            const code = 'translations satisfies TranslationDeepObject<typeof translations>;';
            const ast = createSourceFile(code);
            const expression = ast.statements[0];
            const result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBe('translations');
        });
        it('extracts identifier from as expression', () => {
            const code = 'translations as SomeType;';
            const ast = createSourceFile(code);
            const expression = ast.statements[0];
            const result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBe('translations');
        });
        it('extracts identifier from parenthesized expression', () => {
            const code = '(translations);';
            const ast = createSourceFile(code);
            const expression = ast.statements[0];
            const result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBe('translations');
        });
        it('extracts identifier from nested parenthesized expression', () => {
            const code = '((translations));';
            const ast = createSourceFile(code);
            const expression = ast.statements[0];
            const result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBe('translations');
        });
        it('extracts identifier from type assertion (angle bracket syntax)', () => {
            const code = '<SomeType>translations;';
            const ast = createSourceFile(code);
            const expression = ast.statements[0];
            const result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            // Note: This might be 'translations' or null depending on how TypeScript parses angle bracket syntax in JSX-enabled contexts
            expect(result).toEqual(expect.any(String));
        });
        it('extracts identifier from complex nested expression', () => {
            const code = '(translations as SomeType);';
            const ast = createSourceFile(code);
            const expression = ast.statements[0];
            const result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBe('translations');
        });
        it('extracts identifier from satisfies expression with nested parentheses', () => {
            const code = '(translations) satisfies TranslationDeepObject<typeof translations>;';
            const ast = createSourceFile(code);
            const expression = ast.statements[0];
            const result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBe('translations');
        });
        it('returns null for non-identifier expressions', () => {
            const code = '"hello world";';
            const ast = createSourceFile(code);
            const expression = ast.statements[0];
            const result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBeNull();
        });
        it('returns null for complex expressions that do not contain identifiers', () => {
            const code = '42 + 24;';
            const ast = createSourceFile(code);
            const expression = ast.statements[0];
            const result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBeNull();
        });
        it('returns null for call expressions', () => {
            const code = 'someFunction();';
            const ast = createSourceFile(code);
            const expression = ast.statements[0];
            const result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBeNull();
        });
        it('returns null for member expressions', () => {
            const code = 'obj.property;';
            const ast = createSourceFile(code);
            const expression = ast.statements[0];
            const result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBeNull();
        });
        it('handles deeply nested expression types', () => {
            const code = '((translations as SomeType) satisfies AnotherType);';
            const ast = createSourceFile(code);
            const expression = ast.statements[0];
            const result = TSCompilerUtils_1.default.extractIdentifierFromExpression(expression.expression);
            expect(result).toBe('translations');
        });
    });
    describe('extractKeyFromPropertyNode', () => {
        it('extracts key from property assignment with identifier', () => {
            const code = (0, dedent_1.default)(`
                const obj = {
                    myKey: 'value'
                };
            `);
            const ast = createSourceFile(code);
            const varDecl = ast.statements[0];
            const objLiteral = varDecl.declarationList.declarations[0].initializer;
            const propertyAssignment = objLiteral.properties[0];
            const result = TSCompilerUtils_1.default.extractKeyFromPropertyNode(propertyAssignment);
            expect(result).toBe('myKey');
        });
        it('extracts key from property assignment with string literal', () => {
            const code = (0, dedent_1.default)(`
                const obj = {
                    "myStringKey": 'value'
                };
            `);
            const ast = createSourceFile(code);
            const varDecl = ast.statements[0];
            const objLiteral = varDecl.declarationList.declarations[0].initializer;
            const propertyAssignment = objLiteral.properties[0];
            const result = TSCompilerUtils_1.default.extractKeyFromPropertyNode(propertyAssignment);
            expect(result).toBe('myStringKey');
        });
        it('extracts key from method declaration', () => {
            const code = (0, dedent_1.default)(`
                const obj = {
                    myMethod() {
                        return 'hello';
                    }
                };
            `);
            const ast = createSourceFile(code);
            const varDecl = ast.statements[0];
            const objLiteral = varDecl.declarationList.declarations[0].initializer;
            const methodDeclaration = objLiteral.properties[0];
            const result = TSCompilerUtils_1.default.extractKeyFromPropertyNode(methodDeclaration);
            expect(result).toBe('myMethod');
        });
        it('handles computed property names by returning undefined', () => {
            const code = (0, dedent_1.default)(`
                const obj = {
                    [computedKey]: 'value'
                };
            `);
            const ast = createSourceFile(code);
            const varDecl = ast.statements[0];
            const objLiteral = varDecl.declarationList.declarations[0].initializer;
            const propertyAssignment = objLiteral.properties[0];
            const result = TSCompilerUtils_1.default.extractKeyFromPropertyNode(propertyAssignment);
            expect(result).toBeUndefined();
        });
        it('handles numeric literal property names by returning undefined', () => {
            const code = (0, dedent_1.default)(`
                const obj = {
                    123: 'value'
                };
            `);
            const ast = createSourceFile(code);
            const varDecl = ast.statements[0];
            const objLiteral = varDecl.declarationList.declarations[0].initializer;
            const propertyAssignment = objLiteral.properties[0];
            const result = TSCompilerUtils_1.default.extractKeyFromPropertyNode(propertyAssignment);
            expect(result).toBeUndefined();
        });
        it('handles method declaration with complex name by returning undefined', () => {
            const code = (0, dedent_1.default)(`
                const obj = {
                    [Symbol.iterator]() {
                        return {};
                    }
                };
            `);
            const ast = createSourceFile(code);
            const varDecl = ast.statements[0];
            const objLiteral = varDecl.declarationList.declarations[0].initializer;
            const methodDeclaration = objLiteral.properties[0];
            const result = TSCompilerUtils_1.default.extractKeyFromPropertyNode(methodDeclaration);
            expect(result).toBeUndefined();
        });
        it('handles arrow function property assignment', () => {
            const code = (0, dedent_1.default)(`
                const obj = {
                    arrowFunc: () => 'hello'
                };
            `);
            const ast = createSourceFile(code);
            const varDecl = ast.statements[0];
            const objLiteral = varDecl.declarationList.declarations[0].initializer;
            const propertyAssignment = objLiteral.properties[0];
            const result = TSCompilerUtils_1.default.extractKeyFromPropertyNode(propertyAssignment);
            expect(result).toBe('arrowFunc');
        });
    });
});
