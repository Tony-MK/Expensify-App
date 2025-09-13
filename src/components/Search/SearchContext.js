"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
exports.SearchContextProvider = SearchContextProvider;
exports.useSearchContext = useSearchContext;
const react_1 = require("react");
const ReportUtils_1 = require("@libs/ReportUtils");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const CONST_1 = require("@src/CONST");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const defaultSearchContextData = {
    currentSearchHash: -1,
    currentSearchKey: undefined,
    currentSearchQueryJSON: undefined,
    selectedTransactions: {},
    selectedTransactionIDs: [],
    selectedReports: [],
    isOnSearch: false,
    shouldTurnOffSelectionMode: false,
    shouldResetSearchQuery: false,
};
const defaultSearchContext = {
    ...defaultSearchContextData,
    lastSearchType: undefined,
    areAllMatchingItemsSelected: false,
    showSelectAllMatchingItems: false,
    shouldShowFiltersBarLoading: false,
    setLastSearchType: () => { },
    setCurrentSearchHashAndKey: () => { },
    setCurrentSearchQueryJSON: () => { },
    setSelectedTransactions: () => { },
    removeTransaction: () => { },
    clearSelectedTransactions: () => { },
    setShouldShowFiltersBarLoading: () => { },
    shouldShowSelectAllMatchingItems: () => { },
    selectAllMatchingItems: () => { },
    setShouldResetSearchQuery: () => { },
};
const Context = react_1.default.createContext(defaultSearchContext);
exports.Context = Context;
function SearchContextProvider({ children }) {
    const [showSelectAllMatchingItems, shouldShowSelectAllMatchingItems] = (0, react_1.useState)(false);
    const [areAllMatchingItemsSelected, selectAllMatchingItems] = (0, react_1.useState)(false);
    const [shouldShowFiltersBarLoading, setShouldShowFiltersBarLoading] = (0, react_1.useState)(false);
    const [lastSearchType, setLastSearchType] = (0, react_1.useState)(undefined);
    const [searchContextData, setSearchContextData] = (0, react_1.useState)(defaultSearchContextData);
    const areTransactionsEmpty = (0, react_1.useRef)(true);
    const setCurrentSearchHashAndKey = (0, react_1.useCallback)((searchHash, searchKey) => {
        setSearchContextData((prevState) => {
            if (searchHash === prevState.currentSearchHash && searchKey === prevState.currentSearchKey) {
                return prevState;
            }
            return {
                ...prevState,
                currentSearchHash: searchHash,
                currentSearchKey: searchKey,
            };
        });
    }, []);
    const setCurrentSearchQueryJSON = (0, react_1.useCallback)((searchQueryJSON) => {
        setSearchContextData((prevState) => {
            if (searchQueryJSON === prevState.currentSearchQueryJSON) {
                return prevState;
            }
            return {
                ...prevState,
                currentSearchQueryJSON: searchQueryJSON,
            };
        });
    }, []);
    const setSelectedTransactions = (0, react_1.useCallback)((selectedTransactions, data = []) => {
        if (selectedTransactions instanceof Array) {
            if (!selectedTransactions.length && areTransactionsEmpty.current) {
                areTransactionsEmpty.current = true;
                return;
            }
            areTransactionsEmpty.current = false;
            return setSearchContextData((prevState) => ({
                ...prevState,
                selectedTransactionIDs: selectedTransactions,
            }));
        }
        // When selecting transactions, we also need to manage the reports to which these transactions belong. This is done to ensure proper exporting to CSV.
        let selectedReports = [];
        if (data.length && data.every(SearchUIUtils_1.isTransactionReportGroupListItemType)) {
            selectedReports = data
                .filter((item) => (0, ReportUtils_1.isMoneyRequestReport)(item) && item.transactions.length > 0 && item.transactions.every(({ keyForList }) => selectedTransactions[keyForList]?.isSelected))
                .map(({ reportID, action = CONST_1.default.SEARCH.ACTION_TYPES.VIEW, total = CONST_1.default.DEFAULT_NUMBER_ID, policyID, allActions = [action] }) => ({
                reportID,
                action,
                total,
                policyID,
                allActions,
            }));
        }
        else if (data.length && data.every(SearchUIUtils_1.isTransactionListItemType)) {
            selectedReports = data
                .filter(({ keyForList }) => !!keyForList && selectedTransactions[keyForList]?.isSelected)
                .map(({ reportID, action = CONST_1.default.SEARCH.ACTION_TYPES.VIEW, amount: total = CONST_1.default.DEFAULT_NUMBER_ID, policyID, allActions = [action] }) => ({
                reportID,
                action,
                total,
                policyID,
                allActions,
            }));
        }
        setSearchContextData((prevState) => ({
            ...prevState,
            selectedTransactions,
            shouldTurnOffSelectionMode: false,
            selectedReports,
        }));
    }, []);
    const clearSelectedTransactions = (0, react_1.useCallback)((searchHashOrClearIDsFlag, shouldTurnOffSelectionMode = false) => {
        if (typeof searchHashOrClearIDsFlag === 'boolean') {
            setSelectedTransactions([]);
            return;
        }
        if (searchHashOrClearIDsFlag === searchContextData.currentSearchHash) {
            return;
        }
        if (searchContextData.selectedReports.length === 0 && (0, EmptyObject_1.isEmptyObject)(searchContextData.selectedTransactions) && !searchContextData.shouldTurnOffSelectionMode) {
            return;
        }
        setSearchContextData((prevState) => ({
            ...prevState,
            shouldTurnOffSelectionMode,
            selectedTransactions: {},
            selectedReports: [],
        }));
        // Unselect all transactions and hide the "select all matching items" option
        shouldShowSelectAllMatchingItems(false);
        selectAllMatchingItems(false);
    }, [
        searchContextData.currentSearchHash,
        searchContextData.selectedReports.length,
        searchContextData.selectedTransactions,
        searchContextData.shouldTurnOffSelectionMode,
        setSelectedTransactions,
    ]);
    const removeTransaction = (0, react_1.useCallback)((transactionID) => {
        if (!transactionID) {
            return;
        }
        const selectedTransactionIDs = searchContextData.selectedTransactionIDs;
        if (!(0, EmptyObject_1.isEmptyObject)(searchContextData.selectedTransactions)) {
            const newSelectedTransactions = Object.entries(searchContextData.selectedTransactions).reduce((acc, [key, value]) => {
                if (key === transactionID) {
                    return acc;
                }
                acc[key] = value;
                return acc;
            }, {});
            setSearchContextData((prevState) => ({
                ...prevState,
                selectedTransactions: newSelectedTransactions,
            }));
        }
        if (selectedTransactionIDs.length > 0) {
            setSearchContextData((prevState) => ({
                ...prevState,
                selectedTransactionIDs: selectedTransactionIDs.filter((ID) => transactionID !== ID),
            }));
        }
    }, [searchContextData.selectedTransactionIDs, searchContextData.selectedTransactions]);
    const setShouldResetSearchQuery = (0, react_1.useCallback)((shouldReset) => {
        setSearchContextData((prevState) => ({
            ...prevState,
            shouldResetSearchQuery: shouldReset,
        }));
    }, []);
    const searchContext = (0, react_1.useMemo)(() => ({
        ...searchContextData,
        removeTransaction,
        setCurrentSearchHashAndKey,
        setCurrentSearchQueryJSON,
        setSelectedTransactions,
        clearSelectedTransactions,
        shouldShowFiltersBarLoading,
        setShouldShowFiltersBarLoading,
        lastSearchType,
        setLastSearchType,
        showSelectAllMatchingItems,
        shouldShowSelectAllMatchingItems,
        areAllMatchingItemsSelected,
        selectAllMatchingItems,
        setShouldResetSearchQuery,
    }), [
        searchContextData,
        removeTransaction,
        setCurrentSearchHashAndKey,
        setCurrentSearchQueryJSON,
        setSelectedTransactions,
        clearSelectedTransactions,
        shouldShowFiltersBarLoading,
        lastSearchType,
        shouldShowSelectAllMatchingItems,
        showSelectAllMatchingItems,
        areAllMatchingItemsSelected,
        setShouldResetSearchQuery,
    ]);
    return <Context.Provider value={searchContext}>{children}</Context.Provider>;
}
/**
 * Note: `selectedTransactionIDs` and `selectedTransactions` are two separate properties.
 * Setting or clearing one of them does not influence the other.
 * IDs should be used if transaction details are not required.
 */
function useSearchContext() {
    return (0, react_1.useContext)(Context);
}
SearchContextProvider.displayName = 'SearchContextProvider';
