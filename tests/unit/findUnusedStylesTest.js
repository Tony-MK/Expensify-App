"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var glob_1 = require("glob");
var findUnusedStyles_1 = require("../../scripts/findUnusedStyles");
var dedent_1 = require("../../src/libs/StringUtils/dedent");
jest.mock('fs', function () {
    return (__assign(__assign({}, jest.requireActual('fs')), { readFileSync: jest.fn(), lstatSync: jest.fn() }));
});
jest.mock('glob', function () {
    return (__assign(__assign({}, jest.requireActual('glob')), { globSync: jest.fn() }));
});
var mockReadFileSync = jest.mocked(fs.readFileSync);
var mockLstatSync = jest.mocked(fs.lstatSync);
var mockGlobSync = jest.mocked(glob_1.globSync);
describe('findUnusedStyles', function () {
    var finder;
    beforeEach(function () {
        jest.clearAllMocks();
        mockLstatSync.mockReturnValue({
            isFile: function () { return true; },
        });
    });
    afterEach(function () {
        jest.restoreAllMocks();
    });
    describe('Basic Functionality', function () {
        it('should find no unused styles when styles file is empty', function () {
            // Setup: Empty styles file, no source files
            mockGlobSync.mockReturnValueOnce([]); // No style files (first call in findAllStyleDefinitions)
            mockGlobSync.mockReturnValueOnce([]); // No source files (second call in loadAllFileContents)
            finder = new findUnusedStyles_1.ComprehensiveStylesFinder('/test');
            var result = finder.findUnusedStyles();
            expect(result).toEqual([]);
        });
        it('should detect single unused style', function () {
            var _a, _b;
            // Setup: One style file with one style, no usage
            var stylesContent = (0, dedent_1.default)("\n                const styles = (theme: ThemeColors) => ({\n                    unusedStyle: {\n                        color: 'red',\n                    },\n                }) satisfies Styles;\n            ");
            mockGlobSync
                .mockReturnValueOnce(['src/styles/index.ts']) // Style files (first call)
                .mockReturnValueOnce(['src/components/Test.tsx']); // Source files (second call)
            mockReadFileSync
                .mockReturnValueOnce(stylesContent) // styles file
                .mockReturnValueOnce('// No style usage here'); // component file
            finder = new findUnusedStyles_1.ComprehensiveStylesFinder('/test');
            var result = finder.findUnusedStyles();
            expect(result).toHaveLength(1);
            expect((_a = result.at(0)) === null || _a === void 0 ? void 0 : _a.key).toBe('unusedStyle');
            expect((_b = result.at(0)) === null || _b === void 0 ? void 0 : _b.file).toBe('src/styles/index.ts');
        });
        test('should not report used styles', function () {
            var stylesContent = (0, dedent_1.default)("\n                const styles = (theme: ThemeColors) => ({\n                    usedStyle: {\n                        color: 'blue',\n                    },\n                }) satisfies Styles;\n            ");
            var componentContent = (0, dedent_1.default)("\n                import styles from '@styles';\n                const MyComponent = () => (\n                    <View style={styles.usedStyle} />\n                );\n            ");
            mockGlobSync.mockReturnValueOnce(['src/styles/index.ts']).mockReturnValueOnce(['src/components/Test.tsx']);
            mockReadFileSync.mockReturnValueOnce(stylesContent).mockReturnValueOnce(componentContent);
            finder = new findUnusedStyles_1.ComprehensiveStylesFinder('/test');
            var result = finder.findUnusedStyles();
            expect(result).toHaveLength(0);
        });
    });
    describe('Complex Usage Patterns', function () {
        it('should detect destructured style usage', function () {
            var _a;
            var stylesContent = (0, dedent_1.default)("\n                const styles = (theme: ThemeColors) => ({\n                    destructuredStyle: { color: 'green' },\n                    unusedStyle: { color: 'red' },\n                }) satisfies Styles;\n            ");
            var componentContent = (0, dedent_1.default)("\n                import styles from '@styles';\n                const { destructuredStyle } = styles;\n                const MyComponent = () => <View style={destructuredStyle} />;\n            ");
            setupMockFiles(stylesContent, componentContent);
            var result = finder.findUnusedStyles();
            expect(result).toHaveLength(1);
            expect((_a = result.at(0)) === null || _a === void 0 ? void 0 : _a.key).toBe('unusedStyle');
        });
        it('should detect spread pattern usage', function () {
            var _a;
            var stylesContent = (0, dedent_1.default)("\n                const styles = (theme: ThemeColors) => ({\n                    baseStyle: { padding: 10 },\n                    extendedStyle: {\n                        ...baseStyle,\n                        margin: 5,\n                    },\n                    unusedStyle: { color: 'red' },\n                }) satisfies Styles;\n            ");
            var componentContent = (0, dedent_1.default)("\n                import styles from '@styles';\n                const MyComponent = () => <View style={styles.extendedStyle} />;\n            ");
            setupMockFiles(stylesContent, componentContent);
            var result = finder.findUnusedStyles();
            // When extendedStyle is used, baseStyle should not be unused since it's spread into extendedStyle
            expect(result).toHaveLength(1);
            expect((_a = result.at(0)) === null || _a === void 0 ? void 0 : _a.key).toBe('unusedStyle');
        });
        it('should detect object spread pattern usage', function () {
            var _a;
            var stylesContent = (0, dedent_1.default)("\n                const styles = (theme: ThemeColors) => ({\n                    baseStyle: { p10: { padding: 10 } },\n                    extendedStyle: {\n                        ...baseStyle.p10,\n                        margin: 5,\n                    },\n                    unusedStyle: { color: 'red' },\n                }) satisfies Styles;\n            ");
            var componentContent = (0, dedent_1.default)("\n                import styles from '@styles';\n                const MyComponent = () => <View style={styles.extendedStyle} />;\n            ");
            setupMockFiles(stylesContent, componentContent);
            var result = finder.findUnusedStyles();
            // When extendedStyle is used, baseStyle should not be unused since it's spread into extendedStyle
            expect(result).toHaveLength(1);
            expect((_a = result.at(0)) === null || _a === void 0 ? void 0 : _a.key).toBe('unusedStyle');
        });
        test('should handle dynamic style access', function () {
            var _a;
            var stylesContent = (0, dedent_1.default)("\n                const styles = (theme: ThemeColors) => ({\n                    dynamicStyle: { color: 'purple' },\n                    unusedStyle: { color: 'red' },\n                }) satisfies Styles;\n            ");
            var componentContent = (0, dedent_1.default)("\n                import styles from '@styles';\n                const MyComponent = () => <View style={styles.dynamicStyle} />;\n            ");
            setupMockFiles(stylesContent, componentContent);
            var result = finder.findUnusedStyles();
            expect(result).toHaveLength(1);
            expect((_a = result.at(0)) === null || _a === void 0 ? void 0 : _a.key).toBe('unusedStyle');
        });
    });
    describe('Utils/Generators/Themes Integration', function () {
        test('should detect styles used in utils files', function () {
            var _a;
            var stylesContent = (0, dedent_1.default)("\n                const styles = (theme: ThemeColors) => ({\n                    utilUsedStyle: { fontWeight: 'bold' },\n                    unusedStyle: { color: 'red' },\n                }) satisfies Styles;\n            ");
            var utilContent = (0, dedent_1.default)("\n                import styles from '../index';\n                export const getBoldText = () => styles.utilUsedStyle;\n            ");
            mockGlobSync.mockReturnValueOnce(['src/styles/index.ts']).mockReturnValueOnce(['src/styles/utils/text.ts']);
            mockReadFileSync.mockReturnValueOnce(stylesContent).mockReturnValueOnce(utilContent);
            finder = new findUnusedStyles_1.ComprehensiveStylesFinder('/test');
            var result = finder.findUnusedStyles();
            expect(result).toHaveLength(1);
            expect((_a = result.at(0)) === null || _a === void 0 ? void 0 : _a.key).toBe('unusedStyle');
        });
    });
    describe('Edge Cases', function () {
        test('should ignore styles mentioned in comments', function () {
            var _a;
            var stylesContent = (0, dedent_1.default)("\n                const styles = (theme: ThemeColors) => ({\n                    commentedStyle: { color: 'orange' },\n                }) satisfies Styles;\n            ");
            var componentContent = (0, dedent_1.default)("\n                // This component uses styles.commentedStyle\n                /* \n                 * Also mentioning styles.commentedStyle here\n                 */\n                const MyComponent = () => <View />;\n            ");
            setupMockFiles(stylesContent, componentContent);
            var result = finder.findUnusedStyles();
            expect(result).toHaveLength(1);
            expect((_a = result.at(0)) === null || _a === void 0 ? void 0 : _a.key).toBe('commentedStyle');
        });
        test('should skip helper constants in styles/index.ts', function () {
            var stylesContent = (0, dedent_1.default)("\n                const touchCalloutNone = { WebkitTouchCallout: 'none' };\n                const lineHeightBadge = { lineHeight: 16 };\n                \n                const styles = (theme: ThemeColors) => ({\n                    realStyle: { \n                        ...touchCalloutNone,\n                        color: 'blue' \n                    },\n                }) satisfies Styles;\n            ");
            var componentContent = (0, dedent_1.default)("\n                import styles from '@styles';\n                const MyComponent = () => <View style={styles.realStyle} />;\n            ");
            setupMockFiles(stylesContent, componentContent);
            var result = finder.findUnusedStyles();
            // Should not include touchCalloutNone or lineHeightBadge
            expect(result).toHaveLength(0);
        });
        test('should handle malformed TypeScript files gracefully', function () {
            var stylesContent = (0, dedent_1.default)("\n                const styles = (theme: ThemeColors) => ({\n                    validStyle: { color: 'blue' },\n                }) satisfies Styles;\n            ");
            var malformedContent = (0, dedent_1.default)("\n                import styles from '@styles';\n                const MyComponent = () => {\n                    // Syntax error - missing closing brace\n                    return <View style={styles.validStyle}\n            ");
            setupMockFiles(stylesContent, malformedContent);
            // Should not throw an error
            expect(function () {
                var result = finder.findUnusedStyles();
                expect(result).toHaveLength(0); // Style is used despite syntax error
            }).not.toThrow();
        });
    });
    describe('Error Handling', function () {
        test('should handle file read errors gracefully', function () {
            mockGlobSync.mockReturnValueOnce(['src/styles/index.ts']).mockReturnValueOnce(['src/components/Test.tsx']);
            mockReadFileSync
                .mockImplementationOnce(function () {
                throw new Error('File not found');
            })
                .mockReturnValueOnce('const MyComponent = () => <View />;');
            finder = new findUnusedStyles_1.ComprehensiveStylesFinder('/test');
            expect(function () { return finder.findUnusedStyles(); }).not.toThrow();
        });
        test('should handle directory instead of file', function () {
            mockGlobSync.mockReturnValueOnce(['src/styles/index.ts']).mockReturnValueOnce(['src/components/Test.tsx']);
            mockReadFileSync.mockReturnValueOnce('const styles = () => ({});');
            // Mock lstatSync to indicate it's a directory, not a file
            mockLstatSync.mockReturnValueOnce({
                isFile: function () { return false; },
            });
            finder = new findUnusedStyles_1.ComprehensiveStylesFinder('/test');
            expect(function () { return finder.findUnusedStyles(); }).not.toThrow();
        });
    });
    describe('Performance Tests', function () {
        test('should handle large number of styles efficiently', function () {
            var manyStyles = Array.from({ length: 1000 }, function (_, i) { return "style".concat(i, ": { color: 'color").concat(i, "' },"); }).join('\n');
            var stylesContent = (0, dedent_1.default)("\n                const styles = (theme: ThemeColors) => ({\n                    ".concat(manyStyles, "\n                }) satisfies Styles;\n            "));
            // Use only the first style
            var componentContent = (0, dedent_1.default)("\n                import styles from '@styles';\n                const MyComponent = () => <View style={styles.style0} />;\n            ");
            setupMockFiles(stylesContent, componentContent);
            var start = Date.now();
            var result = finder.findUnusedStyles();
            var end = Date.now();
            expect(result).toHaveLength(999); // All except style0
            expect(end - start).toBeLessThan(5000); // Should complete within 5 seconds
        });
    });
    // Helper function to setup common mock scenarios
    function setupMockFiles(stylesContent, componentContent) {
        // First call: finding style files
        mockGlobSync.mockReturnValueOnce(['src/styles/index.ts']);
        // Second call: finding all source files
        mockGlobSync.mockReturnValueOnce(['src/components/Test.tsx']);
        // File reads: first for style file, then for component file
        mockReadFileSync.mockReturnValueOnce(stylesContent).mockReturnValueOnce(componentContent);
        finder = new findUnusedStyles_1.ComprehensiveStylesFinder('/test');
    }
});
