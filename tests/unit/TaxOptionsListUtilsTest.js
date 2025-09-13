"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TaxOptionsListUtils_1 = require("@libs/TaxOptionsListUtils");
const IntlStore_1 = require("@src/languages/IntlStore");
const TestHelper_1 = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
describe('TaxOptionsListUtils', () => {
    beforeAll(() => {
        IntlStore_1.default.load('en');
        return (0, waitForBatchedUpdates_1.default)();
    });
    it('getTaxRatesSection()', () => {
        const search = 'rate';
        const emptySearch = '';
        const tokenizeSearch = 'Tax 2';
        const wrongSearch = 'bla bla';
        const taxRatesWithDefault = {
            name: 'Tax',
            defaultExternalID: 'CODE1',
            defaultValue: '0%',
            foreignTaxDefault: 'CODE1',
            taxes: {
                CODE2: {
                    name: 'Tax rate 2',
                    value: '3%',
                    code: 'CODE2',
                    modifiedName: 'Tax rate 2 (3%)',
                    pendingAction: 'delete',
                },
                CODE3: {
                    name: 'Tax option 3',
                    value: '5%',
                    code: 'CODE3',
                    modifiedName: 'Tax option 3 (5%)',
                    pendingAction: undefined,
                },
                CODE1: {
                    name: 'Tax exempt 1',
                    value: '0%',
                    code: 'CODE1',
                    modifiedName: 'Tax exempt 1 (0%) • Default',
                    pendingAction: undefined,
                },
            },
        };
        const policy = {
            taxRates: taxRatesWithDefault,
        };
        const transaction = {
            taxCode: 'CODE1',
        };
        const resultList = [
            {
                data: [
                    {
                        code: 'CODE1',
                        isDisabled: false,
                        isSelected: undefined,
                        keyForList: 'Tax exempt 1 (0%) • Default',
                        searchText: 'Tax exempt 1 (0%) • Default',
                        text: 'Tax exempt 1 (0%) • Default',
                        tooltipText: 'Tax exempt 1 (0%) • Default',
                        pendingAction: undefined,
                    },
                    {
                        code: 'CODE3',
                        isDisabled: false,
                        isSelected: undefined,
                        keyForList: 'Tax option 3 (5%)',
                        searchText: 'Tax option 3 (5%)',
                        text: 'Tax option 3 (5%)',
                        tooltipText: 'Tax option 3 (5%)',
                        pendingAction: undefined,
                    },
                    {
                        code: 'CODE2',
                        isDisabled: true,
                        isSelected: undefined,
                        keyForList: 'Tax rate 2 (3%)',
                        searchText: 'Tax rate 2 (3%)',
                        text: 'Tax rate 2 (3%)',
                        tooltipText: 'Tax rate 2 (3%)',
                        pendingAction: 'delete',
                    },
                ],
                shouldShow: false,
                title: '',
            },
        ];
        const searchResultList = [
            {
                data: [
                    {
                        code: 'CODE2',
                        isDisabled: true,
                        isSelected: undefined,
                        keyForList: 'Tax rate 2 (3%)',
                        searchText: 'Tax rate 2 (3%)',
                        text: 'Tax rate 2 (3%)',
                        tooltipText: 'Tax rate 2 (3%)',
                        pendingAction: 'delete',
                    },
                ],
                shouldShow: true,
                title: '',
            },
        ];
        const wrongSearchResultList = [
            {
                data: [],
                shouldShow: true,
                title: '',
            },
        ];
        const result = (0, TaxOptionsListUtils_1.getTaxRatesSection)({
            policy,
            searchValue: emptySearch,
            localeCompare: TestHelper_1.localeCompare,
            transaction,
        });
        expect(result).toStrictEqual(resultList);
        const searchResult = (0, TaxOptionsListUtils_1.getTaxRatesSection)({
            policy,
            searchValue: search,
            localeCompare: TestHelper_1.localeCompare,
            transaction,
        });
        expect(searchResult).toStrictEqual(searchResultList);
        const tokenizeSearchResult = (0, TaxOptionsListUtils_1.getTaxRatesSection)({
            policy,
            searchValue: tokenizeSearch,
            localeCompare: TestHelper_1.localeCompare,
            transaction,
        });
        expect(tokenizeSearchResult).toStrictEqual(searchResultList);
        const wrongSearchResult = (0, TaxOptionsListUtils_1.getTaxRatesSection)({
            policy,
            searchValue: wrongSearch,
            localeCompare: TestHelper_1.localeCompare,
            transaction,
        });
        expect(wrongSearchResult).toStrictEqual(wrongSearchResultList);
    });
});
