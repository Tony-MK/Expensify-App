"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SuggestionUtils_1 = require("@libs/SuggestionUtils");
const TestHelper_1 = require("../utils/TestHelper");
describe('SuggestionUtils', () => {
    describe('getSortedPersonalDetails', () => {
        it('Should sort using the weight if the weight is different', () => {
            const first = { login: 'John Doe', weight: 1, accountID: 1 };
            const second = { login: 'Jane Doe', weight: 2, accountID: 2 };
            expect((0, SuggestionUtils_1.getSortedPersonalDetails)([second, first], TestHelper_1.localeCompare)).toEqual([first, second]);
        });
        it('Should sort using the displayName if the weight is the same', () => {
            const first = { login: 'águero', weight: 2, accountID: 3 };
            const second = { login: 'Bronn', weight: 2, accountID: 4 };
            const third = { login: 'Carol', weight: 2, accountID: 5 };
            expect((0, SuggestionUtils_1.getSortedPersonalDetails)([second, first, third], TestHelper_1.localeCompare)).toEqual([first, second, third]);
            expect((0, SuggestionUtils_1.getSortedPersonalDetails)([third, second, first], TestHelper_1.localeCompare)).toEqual([first, second, third]);
        });
        it('Should sort using the accountID if both the weight and displayName are the same', () => {
            const first = { login: 'aguero', weight: 2, accountID: 6 };
            const second = { login: 'aguero', weight: 2, accountID: 7 };
            expect((0, SuggestionUtils_1.getSortedPersonalDetails)([second, first], TestHelper_1.localeCompare)).toEqual([first, second]);
        });
        it('Should sort using the displayName with different diacritics if the weight is the same', () => {
            const first = { login: 'águero', weight: 2, accountID: 8 };
            const second = { login: 'aguero', weight: 2, accountID: 8 };
            expect((0, SuggestionUtils_1.getSortedPersonalDetails)([second, first], TestHelper_1.localeCompare)).toEqual([second, first]);
        });
    });
});
