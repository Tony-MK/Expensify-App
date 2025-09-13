"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
// we need "dirty" object key names in these tests
const getUpdatedSubstitutionsMap_1 = require("@src/components/Search/SearchRouter/getUpdatedSubstitutionsMap");
describe('getUpdatedSubstitutionsMap should return updated and cleaned substitutions map', () => {
    test('when there were no substitutions', () => {
        const userTypedQuery = 'foo bar';
        const substitutionsMock = {};
        const result = (0, getUpdatedSubstitutionsMap_1.getUpdatedSubstitutionsMap)(userTypedQuery, substitutionsMock);
        expect(result).toStrictEqual({});
    });
    test('when query has a substitution and it did not change', () => {
        const userTypedQuery = 'foo from:Mat';
        const substitutionsMock = {
            'from:Mat': '@mateusz',
        };
        const result = (0, getUpdatedSubstitutionsMap_1.getUpdatedSubstitutionsMap)(userTypedQuery, substitutionsMock);
        expect(result).toStrictEqual({
            'from:Mat': '@mateusz',
        });
    });
    test('when query has a substitution and it changed', () => {
        const userTypedQuery = 'foo from:Johnny';
        const substitutionsMock = {
            'from:Steven': '@steven',
        };
        const result = (0, getUpdatedSubstitutionsMap_1.getUpdatedSubstitutionsMap)(userTypedQuery, substitutionsMock);
        expect(result).toStrictEqual({});
    });
    test('when query has multiple substitutions and some changed but some stayed', () => {
        // cspell:disable-next-line
        const userTypedQuery = 'from:Johnny to:Steven category:Fruitzzzz';
        const substitutionsMock = {
            'from:Johnny': '@johnny',
            'to:Steven': '@steven',
            'from:OldName': '@oldName',
            'category:Fruit': '123456',
        };
        const result = (0, getUpdatedSubstitutionsMap_1.getUpdatedSubstitutionsMap)(userTypedQuery, substitutionsMock);
        expect(result).toStrictEqual({
            'from:Johnny': '@johnny',
            'to:Steven': '@steven',
        });
    });
});
