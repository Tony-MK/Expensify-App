"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const en_1 = require("@src/languages/en");
const es_1 = require("@src/languages/es");
const flattenObject_1 = require("@src/languages/flattenObject");
const Localize_1 = require("@src/libs/Localize");
const asMutable_1 = require("@src/types/utils/asMutable");
const arrayDifference_1 = require("@src/utils/arrayDifference");
jest.mock('@src/languages/IntlStore');
const originalTranslations = {
    [CONST_1.default.LOCALES.EN]: (0, flattenObject_1.default)(en_1.default),
    [CONST_1.default.LOCALES.ES]: (0, flattenObject_1.default)(es_1.default),
};
describe('translate', () => {
    test('Test when key is not found in default', () => {
        expect(() => (0, Localize_1.translate)(CONST_1.default.LOCALES.EN, 'testKey4')).toThrow(Error);
    });
    test('Test when key is not found in default (Production Mode)', () => {
        const ORIGINAL_IS_IN_PRODUCTION = CONFIG_1.default.IS_IN_PRODUCTION;
        (0, asMutable_1.default)(CONFIG_1.default).IS_IN_PRODUCTION = true;
        expect((0, Localize_1.translate)(CONST_1.default.LOCALES.EN, 'testKey4')).toBe('testKey4');
        (0, asMutable_1.default)(CONFIG_1.default).IS_IN_PRODUCTION = ORIGINAL_IS_IN_PRODUCTION;
    });
    it('Test when translation value is a function', () => {
        const expectedValue = 'With variable Test Variable';
        const testVariable = 'Test Variable';
        // @ts-expect-error - TranslationPaths doesn't include testKeyGroup.testFunction as a valid key
        expect((0, Localize_1.translate)(CONST_1.default.LOCALES.EN, 'testKeyGroup.testFunction', { testVariable })).toBe(expectedValue);
    });
    it('Test when count value passed to function but output is string', () => {
        const expectedValue = 'Count value is 10';
        const count = 10;
        // @ts-expect-error - TranslationPaths doesn't include pluralizationGroup.countWithoutPluralRules as a valid key
        expect((0, Localize_1.translate)(CONST_1.default.LOCALES.EN, 'pluralizationGroup.countWithoutPluralRules', { count })).toBe(expectedValue);
    });
    it('Test when count value 2 passed to function but there is no rule for the key two', () => {
        const expectedValue = 'Other 2 files are being downloaded.';
        const count = 2;
        // @ts-expect-error - TranslationPaths doesn't include pluralizationGroup.countWithNoCorrespondingRule as a valid key
        expect((0, Localize_1.translate)(CONST_1.default.LOCALES.EN, 'pluralizationGroup.countWithNoCorrespondingRule', { count })).toBe(expectedValue);
    });
    it('Test when count value 0, 1, 100 passed to function', () => {
        // @ts-expect-error - TranslationPaths doesn't include pluralizationGroup.couthWithCorrespondingRule as a valid key
        expect((0, Localize_1.translate)(CONST_1.default.LOCALES.ES, 'pluralizationGroup.couthWithCorrespondingRule', { count: 0 })).toBe('0 artículos');
        // @ts-expect-error - TranslationPaths doesn't include pluralizationGroup.couthWithCorrespondingRule as a valid key
        expect((0, Localize_1.translate)(CONST_1.default.LOCALES.ES, 'pluralizationGroup.couthWithCorrespondingRule', { count: 1 })).toBe('Un artículo');
        // @ts-expect-error - TranslationPaths doesn't include pluralizationGroup.couthWithCorrespondingRule as a valid key
        expect((0, Localize_1.translate)(CONST_1.default.LOCALES.ES, 'pluralizationGroup.couthWithCorrespondingRule', { count: 100 })).toBe('100 artículos');
    });
});
describe('Translation Keys', () => {
    function traverseKeyPath(source) {
        return Object.keys(source);
    }
    const excludeLanguages = [CONST_1.default.LOCALES.EN];
    const languages = Object.keys(originalTranslations).filter((ln) => !excludeLanguages.some((excludeLanguage) => excludeLanguage === ln));
    const mainLanguage = originalTranslations.en;
    const mainLanguageKeys = traverseKeyPath(mainLanguage);
    languages.forEach((ln) => {
        const languageKeys = traverseKeyPath(originalTranslations[ln]);
        it(`Does ${ln} locale have all the keys`, () => {
            const hasAllKeys = (0, arrayDifference_1.default)(mainLanguageKeys, languageKeys);
            if (hasAllKeys.length) {
                console.debug(`🏹 [ ${hasAllKeys.join(', ')} ] are missing from ${ln}.js`);
                Error(`🏹 [ ${hasAllKeys.join(', ')} ] are missing from ${ln}.js`);
            }
            expect(hasAllKeys).toEqual([]);
        });
        it(`Does ${ln} locale have unused keys`, () => {
            const hasAllKeys = (0, arrayDifference_1.default)(languageKeys, mainLanguageKeys);
            if (hasAllKeys.length) {
                console.debug(`🏹 [ ${hasAllKeys.join(', ')} ] are unused keys in ${ln}.js`);
                Error(`🏹 [ ${hasAllKeys.join(', ')} ] are unused keys in ${ln}.js`);
            }
            expect(hasAllKeys).toEqual([]);
        });
    });
});
describe('flattenObject', () => {
    it('It should work correctly', () => {
        const func = ({ content }) => `This is the content: ${content}`;
        const simpleObject = {
            common: {
                yes: 'Yes',
                no: 'No',
            },
            complex: {
                activity: {
                    none: 'No Activity',
                    some: 'Some Activity',
                },
                report: {
                    title: {
                        expense: 'Expense',
                        task: 'Task',
                    },
                    description: {
                        none: 'No description',
                    },
                    content: func,
                },
            },
        };
        const result = (0, flattenObject_1.default)(simpleObject);
        expect(result).toStrictEqual({
            'common.yes': 'Yes',
            'common.no': 'No',
            'complex.activity.none': 'No Activity',
            'complex.activity.some': 'Some Activity',
            'complex.report.title.expense': 'Expense',
            'complex.report.title.task': 'Task',
            'complex.report.description.none': 'No description',
            'complex.report.content': func,
        });
    });
});
