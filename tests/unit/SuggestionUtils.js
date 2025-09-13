"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SuggestionUtils_1 = require("@libs/SuggestionUtils");
var TestHelper_1 = require("../utils/TestHelper");
describe('SuggestionUtils', function () {
    describe('getSortedPersonalDetails', function () {
        it('Should sort using the weight if the weight is different', function () {
            var first = { login: 'John Doe', weight: 1, accountID: 1 };
            var second = { login: 'Jane Doe', weight: 2, accountID: 2 };
            expect((0, SuggestionUtils_1.getSortedPersonalDetails)([second, first], TestHelper_1.localeCompare)).toEqual([first, second]);
        });
        it('Should sort using the displayName if the weight is the same', function () {
            var first = { login: 'águero', weight: 2, accountID: 3 };
            var second = { login: 'Bronn', weight: 2, accountID: 4 };
            var third = { login: 'Carol', weight: 2, accountID: 5 };
            expect((0, SuggestionUtils_1.getSortedPersonalDetails)([second, first, third], TestHelper_1.localeCompare)).toEqual([first, second, third]);
            expect((0, SuggestionUtils_1.getSortedPersonalDetails)([third, second, first], TestHelper_1.localeCompare)).toEqual([first, second, third]);
        });
        it('Should sort using the accountID if both the weight and displayName are the same', function () {
            var first = { login: 'aguero', weight: 2, accountID: 6 };
            var second = { login: 'aguero', weight: 2, accountID: 7 };
            expect((0, SuggestionUtils_1.getSortedPersonalDetails)([second, first], TestHelper_1.localeCompare)).toEqual([first, second]);
        });
        it('Should sort using the displayName with different diacritics if the weight is the same', function () {
            var first = { login: 'águero', weight: 2, accountID: 8 };
            var second = { login: 'aguero', weight: 2, accountID: 8 };
            expect((0, SuggestionUtils_1.getSortedPersonalDetails)([second, first], TestHelper_1.localeCompare)).toEqual([second, first]);
        });
    });
});
