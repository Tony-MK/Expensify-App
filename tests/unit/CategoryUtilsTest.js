"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CategoryUtils_1 = require("@libs/CategoryUtils");
describe(`isMissingCategory`, () => {
    it('returns true if category is undefined', () => {
        expect((0, CategoryUtils_1.isCategoryMissing)(undefined)).toBe(true);
    });
    it('returns true if category is an empty string', () => {
        expect((0, CategoryUtils_1.isCategoryMissing)('')).toBe(true);
    });
    it('returns true if category "none" or "Uncategorized"', () => {
        expect((0, CategoryUtils_1.isCategoryMissing)('none')).toBe(true);
        expect((0, CategoryUtils_1.isCategoryMissing)('Uncategorized')).toBe(true);
    });
    it('returns false if category is a valid string', () => {
        expect((0, CategoryUtils_1.isCategoryMissing)('Travel')).toBe(false);
        expect((0, CategoryUtils_1.isCategoryMissing)('Meals')).toBe(false);
    });
});
