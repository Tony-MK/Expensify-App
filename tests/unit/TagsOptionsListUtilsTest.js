"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TagsOptionsListUtils_1 = require("@libs/TagsOptionsListUtils");
const CONST_1 = require("@src/CONST");
const IntlStore_1 = require("@src/languages/IntlStore");
const policies_1 = require("../utils/collections/policies");
const transaction_1 = require("../utils/collections/transaction");
const TestHelper_1 = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
describe('TagsOptionsListUtils', () => {
    beforeAll(() => {
        IntlStore_1.default.load(CONST_1.default.LOCALES.EN);
        return (0, waitForBatchedUpdates_1.default)();
    });
    it('getTagListSections()', () => {
        const search = 'ing';
        const emptySearch = '';
        const wrongSearch = 'bla bla';
        const employeeSearch = 'Employee Office';
        const recentlyUsedTags = ['Engineering', 'HR'];
        const selectedOptions = [
            {
                name: 'Medical',
                enabled: true,
                accountID: undefined,
            },
        ];
        const smallTagsList = {
            Engineering: {
                enabled: false,
                name: 'Engineering',
                accountID: undefined,
            },
            Medical: {
                enabled: true,
                name: 'Medical',
                accountID: undefined,
            },
            Accounting: {
                enabled: true,
                name: 'Accounting',
                accountID: undefined,
            },
            HR: {
                enabled: true,
                name: 'HR',
                accountID: undefined,
                pendingAction: 'delete',
            },
            EmployeeMealsOffice: {
                enabled: true,
                name: 'Employee Meals Office',
                accountID: undefined,
            },
        };
        const smallResultList = [
            {
                title: '',
                shouldShow: false,
                // data sorted alphabetically by name
                data: [
                    {
                        text: 'Accounting',
                        keyForList: 'Accounting',
                        searchText: 'Accounting',
                        tooltipText: 'Accounting',
                        isDisabled: false,
                        isSelected: false,
                        pendingAction: undefined,
                    },
                    {
                        text: 'Employee Meals Office',
                        keyForList: 'Employee Meals Office',
                        searchText: 'Employee Meals Office',
                        tooltipText: 'Employee Meals Office',
                        isDisabled: false,
                        isSelected: false,
                        pendingAction: undefined,
                    },
                    {
                        text: 'HR',
                        keyForList: 'HR',
                        searchText: 'HR',
                        tooltipText: 'HR',
                        isDisabled: true,
                        isSelected: false,
                        pendingAction: 'delete',
                    },
                    {
                        text: 'Medical',
                        keyForList: 'Medical',
                        searchText: 'Medical',
                        tooltipText: 'Medical',
                        isDisabled: false,
                        isSelected: false,
                        pendingAction: undefined,
                    },
                ],
            },
        ];
        const smallSearchResultList = [
            {
                title: '',
                shouldShow: true,
                data: [
                    {
                        text: 'Accounting',
                        keyForList: 'Accounting',
                        searchText: 'Accounting',
                        tooltipText: 'Accounting',
                        isDisabled: false,
                        isSelected: false,
                        pendingAction: undefined,
                    },
                ],
            },
        ];
        const employeeSearchResultList = [
            {
                title: '',
                shouldShow: true,
                data: [
                    {
                        text: 'Employee Meals Office',
                        keyForList: 'Employee Meals Office',
                        searchText: 'Employee Meals Office',
                        tooltipText: 'Employee Meals Office',
                        isDisabled: false,
                        isSelected: false,
                        pendingAction: undefined,
                    },
                ],
            },
        ];
        const smallWrongSearchResultList = [
            {
                title: '',
                shouldShow: true,
                data: [],
            },
        ];
        const largeTagsList = {
            Engineering: {
                enabled: false,
                name: 'Engineering',
                accountID: undefined,
            },
            Medical: {
                enabled: true,
                name: 'Medical',
                accountID: undefined,
            },
            Accounting: {
                enabled: true,
                name: 'Accounting',
                accountID: undefined,
            },
            HR: {
                enabled: true,
                name: 'HR',
                accountID: undefined,
            },
            Food: {
                enabled: true,
                name: 'Food',
                accountID: undefined,
            },
            Traveling: {
                enabled: false,
                name: 'Traveling',
                accountID: undefined,
            },
            Cleaning: {
                enabled: true,
                name: 'Cleaning',
                accountID: undefined,
            },
            Software: {
                enabled: true,
                name: 'Software',
                accountID: undefined,
            },
            OfficeSupplies: {
                enabled: false,
                name: 'Office Supplies',
                accountID: undefined,
            },
            Taxes: {
                enabled: true,
                name: 'Taxes',
                accountID: undefined,
                pendingAction: 'delete',
            },
            Benefits: {
                enabled: true,
                name: 'Benefits',
                accountID: undefined,
            },
        };
        const largeResultList = [
            {
                title: '',
                shouldShow: true,
                data: [
                    {
                        text: 'Medical',
                        keyForList: 'Medical',
                        searchText: 'Medical',
                        tooltipText: 'Medical',
                        isDisabled: false,
                        isSelected: true,
                        pendingAction: undefined,
                    },
                ],
            },
            {
                title: 'Recent',
                shouldShow: true,
                data: [
                    {
                        text: 'HR',
                        keyForList: 'HR',
                        searchText: 'HR',
                        tooltipText: 'HR',
                        isDisabled: false,
                        isSelected: false,
                        pendingAction: undefined,
                    },
                ],
            },
            {
                title: 'All',
                shouldShow: true,
                // data sorted alphabetically by name
                data: [
                    {
                        text: 'Accounting',
                        keyForList: 'Accounting',
                        searchText: 'Accounting',
                        tooltipText: 'Accounting',
                        isDisabled: false,
                        isSelected: false,
                        pendingAction: undefined,
                    },
                    {
                        text: 'Benefits',
                        keyForList: 'Benefits',
                        searchText: 'Benefits',
                        tooltipText: 'Benefits',
                        isDisabled: false,
                        isSelected: false,
                        pendingAction: undefined,
                    },
                    {
                        text: 'Cleaning',
                        keyForList: 'Cleaning',
                        searchText: 'Cleaning',
                        tooltipText: 'Cleaning',
                        isDisabled: false,
                        isSelected: false,
                        pendingAction: undefined,
                    },
                    {
                        text: 'Food',
                        keyForList: 'Food',
                        searchText: 'Food',
                        tooltipText: 'Food',
                        isDisabled: false,
                        isSelected: false,
                        pendingAction: undefined,
                    },
                    {
                        text: 'HR',
                        keyForList: 'HR',
                        searchText: 'HR',
                        tooltipText: 'HR',
                        isDisabled: false,
                        isSelected: false,
                        pendingAction: undefined,
                    },
                    {
                        text: 'Software',
                        keyForList: 'Software',
                        searchText: 'Software',
                        tooltipText: 'Software',
                        isDisabled: false,
                        isSelected: false,
                        pendingAction: undefined,
                    },
                    {
                        text: 'Taxes',
                        keyForList: 'Taxes',
                        searchText: 'Taxes',
                        tooltipText: 'Taxes',
                        isDisabled: true,
                        isSelected: false,
                        pendingAction: 'delete',
                    },
                ],
            },
        ];
        const largeSearchResultList = [
            {
                title: '',
                shouldShow: true,
                data: [
                    {
                        text: 'Accounting',
                        keyForList: 'Accounting',
                        searchText: 'Accounting',
                        tooltipText: 'Accounting',
                        isDisabled: false,
                        isSelected: false,
                        pendingAction: undefined,
                    },
                    {
                        text: 'Cleaning',
                        keyForList: 'Cleaning',
                        searchText: 'Cleaning',
                        tooltipText: 'Cleaning',
                        isDisabled: false,
                        isSelected: false,
                        pendingAction: undefined,
                    },
                ],
            },
        ];
        const largeWrongSearchResultList = [
            {
                title: '',
                shouldShow: true,
                data: [],
            },
        ];
        const smallResult = (0, TagsOptionsListUtils_1.getTagListSections)({ searchValue: emptySearch, tags: smallTagsList, localeCompare: TestHelper_1.localeCompare });
        expect(smallResult).toStrictEqual(smallResultList);
        const smallSearchResult = (0, TagsOptionsListUtils_1.getTagListSections)({ searchValue: search, tags: smallTagsList, localeCompare: TestHelper_1.localeCompare });
        expect(smallSearchResult).toStrictEqual(smallSearchResultList);
        const employeeSearchResult = (0, TagsOptionsListUtils_1.getTagListSections)({ searchValue: employeeSearch, tags: smallTagsList, localeCompare: TestHelper_1.localeCompare });
        expect(employeeSearchResult).toStrictEqual(employeeSearchResultList);
        const smallWrongSearchResult = (0, TagsOptionsListUtils_1.getTagListSections)({ searchValue: wrongSearch, tags: smallTagsList, localeCompare: TestHelper_1.localeCompare });
        expect(smallWrongSearchResult).toStrictEqual(smallWrongSearchResultList);
        const largeResult = (0, TagsOptionsListUtils_1.getTagListSections)({ searchValue: emptySearch, selectedOptions, tags: largeTagsList, recentlyUsedTags, localeCompare: TestHelper_1.localeCompare });
        expect(largeResult).toStrictEqual(largeResultList);
        const largeSearchResult = (0, TagsOptionsListUtils_1.getTagListSections)({ searchValue: search, selectedOptions, tags: largeTagsList, recentlyUsedTags, localeCompare: TestHelper_1.localeCompare });
        expect(largeSearchResult).toStrictEqual(largeSearchResultList);
        const largeWrongSearchResult = (0, TagsOptionsListUtils_1.getTagListSections)({
            searchValue: wrongSearch,
            selectedOptions,
            tags: largeTagsList,
            recentlyUsedTags,
            localeCompare: TestHelper_1.localeCompare,
        });
        expect(largeWrongSearchResult).toStrictEqual(largeWrongSearchResultList);
    });
    it('sortTags', () => {
        const createTagObjects = (names) => names.map((name) => ({ name, enabled: true }));
        const unorderedTagNames = ['10bc', 'b', '0a', '1', '中国', 'b10', '!', '2', '0', '@', 'a1', 'a', '3', 'b1', '日本', '$', '20', '20a', '#', 'a20', 'c', '10'];
        const expectedOrderNames = ['!', '@', '#', '$', '0', '0a', '1', '2', '3', '10', '10bc', '20', '20a', 'a', 'a1', 'a20', 'b', 'b1', 'b10', 'c', '中国', '日本'];
        const unorderedTags = createTagObjects(unorderedTagNames);
        const expectedOrder = createTagObjects(expectedOrderNames);
        expect((0, TagsOptionsListUtils_1.sortTags)(unorderedTags, TestHelper_1.localeCompare)).toStrictEqual(expectedOrder);
        const unorderedTagNames2 = ['0', 'a1', '1', 'b1', '3', '10', 'b10', 'a', '2', 'c', '20', 'a20', 'b'];
        const expectedOrderNames2 = ['0', '1', '2', '3', '10', '20', 'a', 'a1', 'a20', 'b', 'b1', 'b10', 'c'];
        const unorderedTags2 = createTagObjects(unorderedTagNames2);
        const expectedOrder2 = createTagObjects(expectedOrderNames2);
        expect((0, TagsOptionsListUtils_1.sortTags)(unorderedTags2, TestHelper_1.localeCompare)).toStrictEqual(expectedOrder2);
        const unorderedTagNames3 = [
            '61',
            '39',
            '97',
            '93',
            '77',
            '71',
            '22',
            '27',
            '30',
            '64',
            '91',
            '24',
            '33',
            '60',
            '21',
            '85',
            '59',
            '76',
            '42',
            '67',
            '13',
            '96',
            '84',
            '44',
            '68',
            '31',
            '62',
            '87',
            '50',
            '4',
            '100',
            '12',
            '28',
            '49',
            '53',
            '5',
            '45',
            '14',
            '55',
            '78',
            '11',
            '35',
            '75',
            '18',
            '9',
            '80',
            '54',
            '2',
            '34',
            '48',
            '81',
            '6',
            '73',
            '15',
            '98',
            '25',
            '8',
            '99',
            '17',
            '90',
            '47',
            '1',
            '10',
            '38',
            '66',
            '57',
            '23',
            '86',
            '29',
            '3',
            '65',
            '74',
            '19',
            '56',
            '63',
            '20',
            '7',
            '32',
            '46',
            '70',
            '26',
            '16',
            '83',
            '37',
            '58',
            '43',
            '36',
            '69',
            '79',
            '72',
            '41',
            '94',
            '95',
            '82',
            '51',
            '52',
            '89',
            '88',
            '40',
            '92',
        ];
        const expectedOrderNames3 = [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
            '25',
            '26',
            '27',
            '28',
            '29',
            '30',
            '31',
            '32',
            '33',
            '34',
            '35',
            '36',
            '37',
            '38',
            '39',
            '40',
            '41',
            '42',
            '43',
            '44',
            '45',
            '46',
            '47',
            '48',
            '49',
            '50',
            '51',
            '52',
            '53',
            '54',
            '55',
            '56',
            '57',
            '58',
            '59',
            '60',
            '61',
            '62',
            '63',
            '64',
            '65',
            '66',
            '67',
            '68',
            '69',
            '70',
            '71',
            '72',
            '73',
            '74',
            '75',
            '76',
            '77',
            '78',
            '79',
            '80',
            '81',
            '82',
            '83',
            '84',
            '85',
            '86',
            '87',
            '88',
            '89',
            '90',
            '91',
            '92',
            '93',
            '94',
            '95',
            '96',
            '97',
            '98',
            '99',
            '100',
        ];
        const unorderedTags3 = createTagObjects(unorderedTagNames3);
        const expectedOrder3 = createTagObjects(expectedOrderNames3);
        expect((0, TagsOptionsListUtils_1.sortTags)(unorderedTags3, TestHelper_1.localeCompare)).toStrictEqual(expectedOrder3);
    });
    it('sortTags by object works the same', () => {
        const tagsObject = {
            name: 'Tag',
            orderWeight: 0,
            required: false,
            tags: {
                OfficeSupplies: {
                    enabled: true,
                    name: 'OfficeSupplies',
                },
                DisabledTag: {
                    enabled: false,
                    name: 'DisabledTag',
                },
                Car: {
                    enabled: true,
                    name: 'Car',
                },
            },
        };
        const sorted = (0, TagsOptionsListUtils_1.sortTags)(tagsObject.tags, TestHelper_1.localeCompare);
        expect(Array.isArray(sorted)).toBe(true);
        // Expect to be sorted alphabetically
        expect(sorted.at(0)?.name).toBe('Car');
        expect(sorted.at(1)?.name).toBe('DisabledTag');
        expect(sorted.at(2)?.name).toBe('OfficeSupplies');
    });
    describe('getTagVisibility', () => {
        const mockPolicy = (0, policies_1.default)(1, 'corporate', 'Test Policy');
        const mockTransaction = (0, transaction_1.default)(1);
        const mockPolicyTags = {
            tagList1: {
                name: 'Category',
                required: true,
                tags: {
                    tag1: { name: 'Tag1', enabled: true },
                    tag2: { name: 'Tag2', enabled: false },
                },
                orderWeight: 0,
            },
            tagList2: {
                name: 'Subcategory',
                required: false,
                tags: {
                    tag3: { name: 'Tag3', enabled: true },
                    tag4: { name: 'Tag4', enabled: true },
                },
                orderWeight: 1,
            },
        };
        it('should hide all tags when shouldShowTags is false', () => {
            const result = (0, TagsOptionsListUtils_1.getTagVisibility)({
                shouldShowTags: false,
                policy: mockPolicy,
                policyTags: mockPolicyTags,
                transaction: mockTransaction,
            });
            expect(result).toEqual([
                { isTagRequired: true, shouldShow: false },
                { isTagRequired: false, shouldShow: false },
            ]);
        });
        it('should show all tags when shouldShowTags is true and no dependent/multilevel tags', () => {
            const result = (0, TagsOptionsListUtils_1.getTagVisibility)({
                shouldShowTags: true,
                policy: mockPolicy,
                policyTags: mockPolicyTags,
                transaction: mockTransaction,
            });
            expect(result).toEqual([
                { isTagRequired: true, shouldShow: true },
                { isTagRequired: false, shouldShow: true },
            ]);
        });
        it('should show tags when multilevel tags are enabled and have enabled options', () => {
            const policyTagsWithEnabledOptions = {
                tagList1: {
                    name: 'Category',
                    required: true,
                    tags: {
                        tag1: { name: 'Tag1', enabled: true },
                        tag2: { name: 'Tag2', enabled: true },
                    },
                    orderWeight: 0,
                },
                tagList2: {
                    name: 'Subcategory',
                    required: false,
                    tags: {
                        tag3: { name: 'Tag3', enabled: true },
                        tag4: { name: 'Tag4', enabled: true },
                    },
                    orderWeight: 1,
                },
            };
            const result = (0, TagsOptionsListUtils_1.getTagVisibility)({
                shouldShowTags: true,
                policy: mockPolicy,
                policyTags: policyTagsWithEnabledOptions,
                transaction: mockTransaction,
            });
            expect(result).toEqual([
                { isTagRequired: true, shouldShow: true },
                { isTagRequired: false, shouldShow: true },
            ]);
        });
        it('should hide tags when multilevel tags are enabled but have no enabled options', () => {
            const policyTagsWithDisabledOptions = {
                tagList1: {
                    name: 'Category',
                    required: true,
                    tags: {
                        tag1: { name: 'Tag1', enabled: false },
                        tag2: { name: 'Tag2', enabled: false },
                    },
                    orderWeight: 0,
                },
                tagList2: {
                    name: 'Subcategory',
                    required: false,
                    tags: {
                        tag3: { name: 'Tag3', enabled: false },
                        tag4: { name: 'Tag4', enabled: false },
                    },
                    orderWeight: 1,
                },
            };
            const result = (0, TagsOptionsListUtils_1.getTagVisibility)({
                shouldShowTags: true,
                policy: mockPolicy,
                policyTags: policyTagsWithDisabledOptions,
                transaction: mockTransaction,
            });
            expect(result).toEqual([
                { isTagRequired: true, shouldShow: false },
                { isTagRequired: false, shouldShow: false },
            ]);
        });
        it('should handle empty policyTags', () => {
            const result = (0, TagsOptionsListUtils_1.getTagVisibility)({
                shouldShowTags: true,
                policy: mockPolicy,
                policyTags: undefined,
                transaction: mockTransaction,
            });
            expect(result).toEqual([]);
        });
        it('should handle undefined policy', () => {
            const result = (0, TagsOptionsListUtils_1.getTagVisibility)({
                shouldShowTags: true,
                policy: undefined,
                policyTags: mockPolicyTags,
                transaction: mockTransaction,
            });
            expect(result).toEqual([
                { isTagRequired: true, shouldShow: true },
                { isTagRequired: false, shouldShow: true },
            ]);
        });
        it('should handle undefined transaction', () => {
            const result = (0, TagsOptionsListUtils_1.getTagVisibility)({
                shouldShowTags: true,
                policy: mockPolicy,
                policyTags: mockPolicyTags,
                transaction: undefined,
            });
            expect(result).toEqual([
                { isTagRequired: true, shouldShow: true },
                { isTagRequired: false, shouldShow: true },
            ]);
        });
    });
});
