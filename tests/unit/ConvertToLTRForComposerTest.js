"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convertToLTRForComposer_1 = require("@libs/convertToLTRForComposer");
const CONST_1 = require("@src/CONST");
describe('convertToLTRForComposer', () => {
    test('Input without RTL characters remains unchanged', () => {
        // Test when input contains no RTL characters
        const inputText = 'Hello, world!';
        const result = (0, convertToLTRForComposer_1.default)(inputText);
        expect(result).toBe(inputText);
    });
    test('Input with RTL characters is prefixed with LTR marker', () => {
        // Test when input contains RTL characters
        const inputText = 'مثال';
        const result = (0, convertToLTRForComposer_1.default)(inputText);
        expect(result).toBe(`${CONST_1.default.UNICODE.LTR}${inputText}`);
    });
    test('Input with mixed RTL and LTR characters is prefixed with LTR marker', () => {
        // Test when input contains mix of RTL and LTR characters
        const inputText = 'مثال test ';
        const result = (0, convertToLTRForComposer_1.default)(inputText);
        expect(result).toBe(`${CONST_1.default.UNICODE.LTR}${inputText}`);
    });
    test('Input with only space remains unchanged', () => {
        // Test when input contains only spaces
        const inputText = '   ';
        const result = (0, convertToLTRForComposer_1.default)(inputText);
        expect(result).toBe(inputText);
    });
    test('Input with existing LTR marker remains unchanged', () => {
        // Test when input already starts with the LTR marker
        const inputText = `${CONST_1.default.UNICODE.LTR}مثال`;
        const result = (0, convertToLTRForComposer_1.default)(inputText);
        expect(result).toBe(inputText);
    });
    test('Input starting with native emojis remains unchanged', () => {
        // Test when input starts with the native emojis
        const inputText = '🧶';
        const result = (0, convertToLTRForComposer_1.default)(inputText);
        expect(result).toBe(inputText);
    });
    test('Input is empty', () => {
        // Test when input is empty to check for draft comments
        const inputText = '';
        const result = (0, convertToLTRForComposer_1.default)(inputText);
        expect(result.length).toBe(0);
    });
    test('input with special characters remains unchanged', () => {
        // Test when input contains special characters
        const specialCharacters = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '=', '{', '}', '[', ']', '"', ':', ';', '<', '>', '?', '`', '~'];
        specialCharacters.forEach((character) => {
            const result = (0, convertToLTRForComposer_1.default)(character);
            expect(result).toBe(character);
        });
    });
});
