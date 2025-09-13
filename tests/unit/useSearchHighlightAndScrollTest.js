"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const react_native_1 = require("@testing-library/react-native");
const useSearchHighlightAndScroll_1 = require("@hooks/useSearchHighlightAndScroll");
const Search_1 = require("@libs/actions/Search");
const CONST_1 = require("@src/CONST");
jest.mock('@libs/actions/Search');
jest.mock('@react-navigation/native', () => ({
    useIsFocused: jest.fn(() => true),
    createNavigationContainerRef: () => ({}),
}));
jest.mock('@rnmapbox/maps', () => ({
    __esModule: true,
    default: {},
    MarkerView: {},
    setAccessToken: jest.fn(),
}));
jest.mock('@react-native-community/geolocation', () => ({
    setRNConfiguration: jest.fn(),
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
}));
const mockUseIsFocused = jest.fn().mockReturnValue(true);
afterEach(() => {
    jest.clearAllMocks();
});
describe('useSearchHighlightAndScroll', () => {
    const baseProps = {
        searchResults: {
            data: {
                personalDetailsList: {},
            },
            search: {
                hasMoreResults: false,
                hasResults: true,
                offset: 0,
                status: CONST_1.default.SEARCH.STATUS.EXPENSE.ALL,
                type: 'expense',
                isLoading: false,
            },
        },
        transactions: {},
        previousTransactions: {},
        reportActions: {},
        previousReportActions: {},
        queryJSON: {
            type: 'expense',
            status: CONST_1.default.SEARCH.STATUS.EXPENSE.ALL,
            sortBy: 'date',
            sortOrder: 'desc',
            filters: { operator: 'and', left: 'tag', right: '' },
            inputQuery: 'type:expense',
            flatFilters: [],
            hash: 123,
            recentSearchHash: 456,
            similarSearchHash: 789,
        },
        searchKey: undefined,
        shouldCalculateTotals: false,
        offset: 0,
    };
    it('should not trigger search when collections are empty', () => {
        (0, react_native_1.renderHook)(() => (0, useSearchHighlightAndScroll_1.default)(baseProps));
        expect(Search_1.search).not.toHaveBeenCalled();
    });
    it('should trigger search when new transaction added and focused', () => {
        const initialProps = {
            ...baseProps,
            transactions: { '1': { transactionID: '1' } },
            previousTransactions: { '1': { transactionID: '1' } },
        };
        const { rerender } = (0, react_native_1.renderHook)((props) => (0, useSearchHighlightAndScroll_1.default)(props), {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            initialProps,
        });
        const updatedProps = {
            ...baseProps,
            transactions: {
                '1': { transactionID: '1' },
                '2': { transactionID: '2' },
            },
            previousTransactions: { '1': { transactionID: '1' } },
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        rerender(updatedProps);
        expect(Search_1.search).toHaveBeenCalledWith({ queryJSON: baseProps.queryJSON, searchKey: undefined, offset: 0, shouldCalculateTotals: false });
    });
    it('should not trigger search when not focused', () => {
        mockUseIsFocused.mockReturnValue(false);
        const { rerender } = (0, react_native_1.renderHook)((props) => (0, useSearchHighlightAndScroll_1.default)(props), {
            initialProps: baseProps,
        });
        const updatedProps = {
            ...baseProps,
            transactions: { '1': { transactionID: '1' } },
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        rerender(updatedProps);
        expect(Search_1.search).not.toHaveBeenCalled();
    });
    it('should trigger search for chat when report actions added and focused', () => {
        mockUseIsFocused.mockReturnValue(true);
        const chatProps = {
            ...baseProps,
            queryJSON: { ...baseProps.queryJSON, type: 'chat' },
            reportActions: {
                reportActions_1: {
                    '1': { actionName: 'EXISTING', reportActionID: '1' },
                },
            },
            previousReportActions: {
                reportActions_1: {
                    '1': { actionName: 'EXISTING', reportActionID: '1' },
                },
            },
        };
        const { rerender } = (0, react_native_1.renderHook)((props) => (0, useSearchHighlightAndScroll_1.default)(props), {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            initialProps: chatProps,
        });
        const updatedProps = {
            ...chatProps,
            reportActions: {
                reportActions_1: {
                    '1': { actionName: 'EXISTING', reportActionID: '1' },
                    '2': { actionName: 'ADDCOMMENT', reportActionID: '2' },
                },
            },
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        rerender(updatedProps);
        expect(Search_1.search).toHaveBeenCalledWith({ queryJSON: chatProps.queryJSON, searchKey: undefined, offset: 0, shouldCalculateTotals: false });
    });
    it('should not trigger search when new transaction removed and focused', () => {
        const initialProps = {
            ...baseProps,
            transactions: {
                '1': { transactionID: '1' },
                '2': { transactionID: '2' },
            },
            previousTransactions: {
                '1': { transactionID: '1' },
                '2': { transactionID: '2' },
            },
        };
        const { rerender } = (0, react_native_1.renderHook)((props) => (0, useSearchHighlightAndScroll_1.default)(props), {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            initialProps,
        });
        const updatedProps = {
            ...baseProps,
            transactions: {
                '1': { transactionID: '1' },
            },
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        rerender(updatedProps);
        expect(Search_1.search).not.toHaveBeenCalled();
    });
    it('should not trigger search for chat when report actions removed and focused', () => {
        mockUseIsFocused.mockReturnValue(true);
        const chatProps = {
            ...baseProps,
            queryJSON: { ...baseProps.queryJSON, type: 'chat' },
            reportActions: {
                reportActions_1: {
                    '1': { actionName: 'EXISTING', reportActionID: '1' },
                    '2': { actionName: 'ADDCOMMENT', reportActionID: '2' },
                },
            },
            previousReportActions: {
                reportActions_1: {
                    '1': { actionName: 'EXISTING', reportActionID: '1' },
                    '2': { actionName: 'ADDCOMMENT', reportActionID: '2' },
                },
            },
        };
        const { rerender } = (0, react_native_1.renderHook)((props) => (0, useSearchHighlightAndScroll_1.default)(props), {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            initialProps: chatProps,
        });
        const updatedProps = {
            ...chatProps,
            reportActions: {
                reportActions_1: {
                    '1': { actionName: 'EXISTING', reportActionID: '1' },
                },
            },
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        rerender(updatedProps);
        expect(Search_1.search).not.toHaveBeenCalled();
    });
});
