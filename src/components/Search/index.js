"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const FullPageErrorView_1 = require("@components/BlockingViews/FullPageErrorView");
const FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
const SearchTableHeader_1 = require("@components/SelectionList/SearchTableHeader");
const SearchRowSkeleton_1 = require("@components/Skeletons/SearchRowSkeleton");
const useCardFeedsForDisplay_1 = require("@hooks/useCardFeedsForDisplay");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSearchHighlightAndScroll_1 = require("@hooks/useSearchHighlightAndScroll");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
const Search_1 = require("@libs/actions/Search");
const Timing_1 = require("@libs/actions/Timing");
const DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
const Log_1 = require("@libs/Log");
const isSearchTopmostFullScreenRoute_1 = require("@libs/Navigation/helpers/isSearchTopmostFullScreenRoute");
const Performance_1 = require("@libs/Performance");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const Navigation_1 = require("@navigation/Navigation");
const EmptySearchView_1 = require("@pages/Search/EmptySearchView");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const arraysEqual_1 = require("@src/utils/arraysEqual");
const SearchContext_1 = require("./SearchContext");
const SearchList_1 = require("./SearchList");
const SearchScopeProvider_1 = require("./SearchScopeProvider");
const expenseHeaders = (0, SearchTableHeader_1.getExpenseHeaders)();
function mapTransactionItemToSelectedEntry(item, reportActions, outstandingReportsByPolicyID) {
    return [
        item.keyForList,
        {
            isSelected: true,
            canDelete: item.canDelete,
            canHold: item.canHold,
            isHeld: (0, TransactionUtils_1.isOnHold)(item),
            canUnhold: item.canUnhold,
            canChangeReport: (0, ReportUtils_1.canEditFieldOfMoneyRequest)((0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActions, item.transactionID), CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, undefined, outstandingReportsByPolicyID),
            action: item.action,
            reportID: item.reportID,
            policyID: item.policyID,
            amount: item.modifiedAmount ?? item.amount,
            convertedAmount: item.convertedAmount,
            convertedCurrency: item.convertedCurrency,
        },
    ];
}
function mapToTransactionItemWithAdditionalInfo(item, selectedTransactions, canSelectMultiple, shouldAnimateInHighlight, hash) {
    return { ...item, shouldAnimateInHighlight, isSelected: selectedTransactions[item.keyForList]?.isSelected && canSelectMultiple, hash };
}
function mapToItemWithAdditionalInfo(item, selectedTransactions, canSelectMultiple, shouldAnimateInHighlight, hash) {
    if ((0, SearchUIUtils_1.isTaskListItemType)(item)) {
        return {
            ...item,
            shouldAnimateInHighlight,
            hash,
        };
    }
    if ((0, SearchUIUtils_1.isReportActionListItemType)(item)) {
        return {
            ...item,
            shouldAnimateInHighlight,
            hash,
        };
    }
    return (0, SearchUIUtils_1.isTransactionListItemType)(item)
        ? mapToTransactionItemWithAdditionalInfo(item, selectedTransactions, canSelectMultiple, shouldAnimateInHighlight, hash)
        : {
            ...item,
            shouldAnimateInHighlight,
            transactions: item.transactions?.map((transaction) => mapToTransactionItemWithAdditionalInfo(transaction, selectedTransactions, canSelectMultiple, shouldAnimateInHighlight, hash)),
            isSelected: item?.transactions?.length > 0 &&
                item.transactions?.filter((t) => !(0, TransactionUtils_1.isTransactionPendingDelete)(t)).every((transaction) => selectedTransactions[transaction.keyForList]?.isSelected && canSelectMultiple),
            hash,
        };
}
function prepareTransactionsList(item, selectedTransactions, reportActions, outstandingReportsByPolicyID) {
    if (selectedTransactions[item.keyForList]?.isSelected) {
        const { [item.keyForList]: omittedTransaction, ...transactions } = selectedTransactions;
        return transactions;
    }
    return {
        ...selectedTransactions,
        [item.keyForList]: {
            isSelected: true,
            canDelete: item.canDelete,
            canHold: item.canHold,
            isHeld: (0, TransactionUtils_1.isOnHold)(item),
            canUnhold: item.canUnhold,
            canChangeReport: (0, ReportUtils_1.canEditFieldOfMoneyRequest)((0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActions, item.transactionID), CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, undefined, outstandingReportsByPolicyID),
            action: item.action,
            reportID: item.reportID,
            policyID: item.policyID,
            amount: Math.abs(item.modifiedAmount || item.amount),
            convertedAmount: item.convertedAmount,
            convertedCurrency: item.convertedCurrency,
        },
    };
}
function Search({ queryJSON, searchResults, onSearchListScroll, contentContainerStyle, handleSearch, isMobileSelectionModeEnabled }) {
    const { isOffline } = (0, useNetwork_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout for enabling the selection mode on small screens only
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    const { isSmallScreenWidth, isLargeScreenWidth } = (0, useResponsiveLayout_1.default)();
    const navigation = (0, native_1.useNavigation)();
    const isFocused = (0, native_1.useIsFocused)();
    const { setCurrentSearchHashAndKey, setCurrentSearchQueryJSON, setSelectedTransactions, selectedTransactions, clearSelectedTransactions, shouldTurnOffSelectionMode, setShouldShowFiltersBarLoading, lastSearchType, shouldShowSelectAllMatchingItems, areAllMatchingItemsSelected, selectAllMatchingItems, shouldResetSearchQuery, setShouldResetSearchQuery, } = (0, SearchContext_1.useSearchContext)();
    const [offset, setOffset] = (0, react_1.useState)(0);
    const [transactions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, { canBeMissing: true });
    const previousTransactions = (0, usePrevious_1.default)(transactions);
    const [reportActions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, { canBeMissing: true });
    const [savedSearches] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SAVED_SEARCHES, { canBeMissing: true });
    const [outstandingReportsByPolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID, { canBeMissing: true });
    const [violations] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, { canBeMissing: true });
    const [archivedReportsIdSet = new Set()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS, {
        canBeMissing: true,
        selector: (all) => {
            const ids = new Set();
            if (!all) {
                return ids;
            }
            const prefixLength = ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS.length;
            for (const [key, value] of Object.entries(all)) {
                if ((0, ReportUtils_1.isArchivedReport)(value)) {
                    const reportID = key.slice(prefixLength);
                    ids.add(reportID);
                }
            }
            return ids;
        },
    });
    // Create a selector for only the reportActions needed to determine if a report has been exported or not, grouped by report
    const [exportReportActions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, {
        canEvict: false,
        canBeMissing: true,
        selector: (allReportActions) => {
            return Object.fromEntries(Object.entries(allReportActions ?? {}).map(([reportID, reportActionsGroup]) => {
                const filteredReportActions = Object.values(reportActionsGroup ?? {}).filter((action) => (0, ReportActionsUtils_1.isExportIntegrationAction)(action) || (0, ReportActionsUtils_1.isIntegrationMessageAction)(action));
                return [reportID, filteredReportActions];
            }));
        },
    });
    const { defaultCardFeed } = (0, useCardFeedsForDisplay_1.default)();
    const [accountID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false, selector: (s) => s?.accountID });
    const suggestedSearches = (0, react_1.useMemo)(() => (0, SearchUIUtils_1.getSuggestedSearches)(accountID, defaultCardFeed?.id), [defaultCardFeed?.id, accountID]);
    const { type, status, sortBy, sortOrder, hash, similarSearchHash, groupBy } = queryJSON;
    const searchKey = (0, react_1.useMemo)(() => Object.values(suggestedSearches).find((search) => search.similarSearchHash === similarSearchHash)?.key, [suggestedSearches, similarSearchHash]);
    const shouldCalculateTotals = (0, react_1.useMemo)(() => {
        if (offset !== 0) {
            return false;
        }
        const savedSearchValues = Object.values(savedSearches ?? {});
        if (!savedSearchValues.length && !searchKey) {
            return false;
        }
        const eligibleSearchKeys = [
            CONST_1.default.SEARCH.SEARCH_KEYS.SUBMIT,
            CONST_1.default.SEARCH.SEARCH_KEYS.APPROVE,
            CONST_1.default.SEARCH.SEARCH_KEYS.PAY,
            CONST_1.default.SEARCH.SEARCH_KEYS.EXPORT,
            CONST_1.default.SEARCH.SEARCH_KEYS.STATEMENTS,
            CONST_1.default.SEARCH.SEARCH_KEYS.UNAPPROVED_CASH,
            CONST_1.default.SEARCH.SEARCH_KEYS.UNAPPROVED_CARD,
            CONST_1.default.SEARCH.SEARCH_KEYS.RECONCILIATION,
        ];
        if (eligibleSearchKeys.includes(searchKey)) {
            return true;
        }
        for (const savedSearch of savedSearchValues) {
            const searchData = (0, SearchQueryUtils_1.buildSearchQueryJSON)(savedSearch.query);
            if (searchData && searchData.similarSearchHash === similarSearchHash) {
                return true;
            }
        }
        return false;
    }, [offset, savedSearches, searchKey, similarSearchHash]);
    const previousReportActions = (0, usePrevious_1.default)(reportActions);
    const reportActionsArray = (0, react_1.useMemo)(() => Object.values(reportActions ?? {})
        .filter((reportAction) => !!reportAction)
        .flatMap((filteredReportActions) => Object.values(filteredReportActions ?? {})), [reportActions]);
    const { translate, localeCompare, formatPhoneNumber } = (0, useLocalize_1.default)();
    const searchListRef = (0, react_1.useRef)(null);
    const clearTransactionsAndSetHashAndKey = (0, react_1.useCallback)(() => {
        clearSelectedTransactions(hash);
        setCurrentSearchHashAndKey(hash, searchKey);
        setCurrentSearchQueryJSON(queryJSON);
    }, [hash, searchKey, clearSelectedTransactions, setCurrentSearchHashAndKey, setCurrentSearchQueryJSON, queryJSON]);
    (0, native_1.useFocusEffect)(clearTransactionsAndSetHashAndKey);
    (0, react_1.useEffect)(() => {
        clearTransactionsAndSetHashAndKey();
        // Trigger once on mount (e.g., on page reload), when RHP is open and screen is not focused
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    const isSearchResultsEmpty = !searchResults?.data || (0, SearchUIUtils_1.isSearchResultsEmpty)(searchResults);
    (0, react_1.useEffect)(() => {
        if (!isFocused) {
            return;
        }
        const selectedKeys = Object.keys(selectedTransactions).filter((transactionKey) => selectedTransactions[transactionKey]);
        if (selectedKeys.length === 0 && isMobileSelectionModeEnabled && shouldTurnOffSelectionMode) {
            (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
        }
        // We don't want to run the effect on isFocused change as we only need it to early return when it is false.
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTransactions, isMobileSelectionModeEnabled, shouldTurnOffSelectionMode]);
    (0, react_1.useEffect)(() => {
        if (!isFocused) {
            return;
        }
        const selectedKeys = Object.keys(selectedTransactions).filter((transactionKey) => selectedTransactions[transactionKey]);
        if (!isSmallScreenWidth) {
            if (selectedKeys.length === 0 && isMobileSelectionModeEnabled) {
                (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
            }
            return;
        }
        if (selectedKeys.length > 0 && !isMobileSelectionModeEnabled && !isSearchResultsEmpty) {
            (0, MobileSelectionMode_1.turnOnMobileSelectionMode)();
        }
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSmallScreenWidth, selectedTransactions, isMobileSelectionModeEnabled]);
    (0, react_1.useEffect)(() => {
        const focusedRoute = (0, native_1.findFocusedRoute)(Navigation_1.navigationRef.getRootState());
        const isMigratedModalDisplayed = focusedRoute?.name === NAVIGATORS_1.default.MIGRATED_USER_MODAL_NAVIGATOR || focusedRoute?.name === SCREENS_1.default.MIGRATED_USER_WELCOME_MODAL.ROOT;
        if ((!isFocused && !isMigratedModalDisplayed) || isOffline) {
            return;
        }
        handleSearch({ queryJSON, searchKey, offset, shouldCalculateTotals });
        // We don't need to run the effect on change of isFocused.
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleSearch, isOffline, offset, queryJSON, searchKey, shouldCalculateTotals]);
    (0, react_1.useEffect)(() => {
        (0, Search_1.openSearch)();
    }, []);
    const { newSearchResultKey, handleSelectionListScroll } = (0, useSearchHighlightAndScroll_1.default)({
        searchResults,
        transactions,
        previousTransactions,
        queryJSON,
        searchKey,
        offset,
        shouldCalculateTotals,
        reportActions,
        previousReportActions,
    });
    // There's a race condition in Onyx which makes it return data from the previous Search, so in addition to checking that the data is loaded
    // we also need to check that the searchResults matches the type and status of the current search
    const isDataLoaded = (0, SearchUIUtils_1.isSearchDataLoaded)(searchResults, queryJSON);
    const shouldShowLoadingState = !isOffline && (!isDataLoaded || (!!searchResults?.search.isLoading && Array.isArray(searchResults?.data) && searchResults?.data.length === 0));
    const shouldShowLoadingMoreItems = !shouldShowLoadingState && searchResults?.search?.isLoading && searchResults?.search?.offset > 0;
    const prevIsSearchResultEmpty = (0, usePrevious_1.default)(isSearchResultsEmpty);
    const data = (0, react_1.useMemo)(() => {
        if (searchResults === undefined || !isDataLoaded) {
            return [];
        }
        // Group-by option cannot be used for chats or tasks
        const isChat = type === CONST_1.default.SEARCH.DATA_TYPES.CHAT;
        const isTask = type === CONST_1.default.SEARCH.DATA_TYPES.TASK;
        if (groupBy && (isChat || isTask)) {
            return [];
        }
        return (0, SearchUIUtils_1.getSections)(type, searchResults.data, accountID, formatPhoneNumber, groupBy, exportReportActions, searchKey, archivedReportsIdSet, queryJSON);
    }, [searchKey, exportReportActions, groupBy, isDataLoaded, searchResults, type, archivedReportsIdSet, formatPhoneNumber, accountID, queryJSON]);
    (0, react_1.useEffect)(() => {
        /** We only want to display the skeleton for the status filters the first time we load them for a specific data type */
        setShouldShowFiltersBarLoading(shouldShowLoadingState && lastSearchType !== type);
    }, [lastSearchType, setShouldShowFiltersBarLoading, shouldShowLoadingState, type]);
    // When new data load, selectedTransactions is updated in next effect. We use this flag to whether selection is updated
    const isRefreshingSelection = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        if (!isFocused) {
            return;
        }
        if (type === CONST_1.default.SEARCH.DATA_TYPES.CHAT) {
            return;
        }
        const newTransactionList = {};
        if (groupBy) {
            data.forEach((transactionGroup) => {
                if (!Object.hasOwn(transactionGroup, 'transactions') || !('transactions' in transactionGroup)) {
                    return;
                }
                transactionGroup.transactions.forEach((transaction) => {
                    if (!Object.keys(selectedTransactions).includes(transaction.transactionID) && !areAllMatchingItemsSelected) {
                        return;
                    }
                    newTransactionList[transaction.transactionID] = {
                        action: transaction.action,
                        canHold: transaction.canHold,
                        isHeld: (0, TransactionUtils_1.isOnHold)(transaction),
                        canUnhold: transaction.canUnhold,
                        canChangeReport: (0, ReportUtils_1.canEditFieldOfMoneyRequest)((0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActionsArray, transaction.transactionID), CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, undefined, outstandingReportsByPolicyID),
                        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                        isSelected: areAllMatchingItemsSelected || selectedTransactions[transaction.transactionID].isSelected,
                        canDelete: transaction.canDelete,
                        reportID: transaction.reportID,
                        policyID: transaction.policyID,
                        amount: transaction.modifiedAmount ?? transaction.amount,
                        convertedAmount: transaction.convertedAmount,
                        convertedCurrency: transaction.convertedCurrency,
                    };
                });
            });
        }
        else {
            data.forEach((transaction) => {
                if (!Object.hasOwn(transaction, 'transactionID') || !('transactionID' in transaction)) {
                    return;
                }
                if (!Object.keys(selectedTransactions).includes(transaction.transactionID) && !areAllMatchingItemsSelected) {
                    return;
                }
                newTransactionList[transaction.transactionID] = {
                    action: transaction.action,
                    canHold: transaction.canHold,
                    isHeld: (0, TransactionUtils_1.isOnHold)(transaction),
                    canUnhold: transaction.canUnhold,
                    canChangeReport: (0, ReportUtils_1.canEditFieldOfMoneyRequest)((0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActionsArray, transaction.transactionID), CONST_1.default.EDIT_REQUEST_FIELD.REPORT, undefined, undefined, outstandingReportsByPolicyID),
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    isSelected: areAllMatchingItemsSelected || selectedTransactions[transaction.transactionID].isSelected,
                    canDelete: transaction.canDelete,
                    reportID: transaction.reportID,
                    policyID: transaction.policyID,
                    amount: transaction.modifiedAmount ?? transaction.amount,
                    convertedAmount: transaction.convertedAmount,
                    convertedCurrency: transaction.convertedCurrency,
                };
            });
        }
        if ((0, EmptyObject_1.isEmptyObject)(newTransactionList)) {
            return;
        }
        setSelectedTransactions(newTransactionList, data);
        isRefreshingSelection.current = true;
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [data, setSelectedTransactions, areAllMatchingItemsSelected, isFocused, outstandingReportsByPolicyID]);
    (0, react_1.useEffect)(() => {
        if (!isSearchResultsEmpty || prevIsSearchResultEmpty) {
            return;
        }
        (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
    }, [isSearchResultsEmpty, prevIsSearchResultEmpty]);
    (0, react_1.useEffect)(() => () => {
        if ((0, isSearchTopmostFullScreenRoute_1.default)()) {
            return;
        }
        clearSelectedTransactions();
        (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
    }, [isFocused, clearSelectedTransactions]);
    // When selectedTransactions is updated, we confirm that selection is refreshed
    (0, react_1.useEffect)(() => {
        isRefreshingSelection.current = false;
    }, [selectedTransactions]);
    (0, react_1.useEffect)(() => {
        if (!isFocused) {
            return;
        }
        if (!data.length || isRefreshingSelection.current) {
            return;
        }
        const areItemsGrouped = !!groupBy;
        const flattenedItems = areItemsGrouped ? data.flatMap((item) => item.transactions) : data;
        const areAllItemsSelected = flattenedItems.length === Object.keys(selectedTransactions).length;
        // If the user has selected all the expenses in their view but there are more expenses matched by the search
        // give them the option to select all matching expenses
        shouldShowSelectAllMatchingItems(!!(areAllItemsSelected && searchResults?.search?.hasMoreResults));
        if (!areAllItemsSelected) {
            selectAllMatchingItems(false);
        }
    }, [isFocused, data, searchResults?.search?.hasMoreResults, selectedTransactions, selectAllMatchingItems, shouldShowSelectAllMatchingItems, groupBy]);
    const toggleTransaction = (0, react_1.useCallback)((item, itemTransactions) => {
        if ((0, SearchUIUtils_1.isReportActionListItemType)(item)) {
            return;
        }
        if ((0, SearchUIUtils_1.isTaskListItemType)(item)) {
            return;
        }
        if ((0, SearchUIUtils_1.isTransactionListItemType)(item)) {
            if (!item.keyForList) {
                return;
            }
            if ((0, TransactionUtils_1.isTransactionPendingDelete)(item)) {
                return;
            }
            setSelectedTransactions(prepareTransactionsList(item, selectedTransactions, reportActionsArray, outstandingReportsByPolicyID), data);
            return;
        }
        const currentTransactions = itemTransactions ?? item.transactions;
        if (currentTransactions.some((transaction) => selectedTransactions[transaction.keyForList]?.isSelected)) {
            const reducedSelectedTransactions = { ...selectedTransactions };
            currentTransactions.forEach((transaction) => {
                delete reducedSelectedTransactions[transaction.keyForList];
            });
            setSelectedTransactions(reducedSelectedTransactions, data);
            return;
        }
        setSelectedTransactions({
            ...selectedTransactions,
            ...Object.fromEntries(currentTransactions
                .filter((t) => !(0, TransactionUtils_1.isTransactionPendingDelete)(t))
                .map((transactionItem) => mapTransactionItemToSelectedEntry(transactionItem, reportActionsArray, outstandingReportsByPolicyID))),
        }, data);
    }, [data, reportActionsArray, selectedTransactions, outstandingReportsByPolicyID, setSelectedTransactions]);
    const onSelectRow = (0, react_1.useCallback)((item) => {
        if (isMobileSelectionModeEnabled) {
            toggleTransaction(item);
            return;
        }
        const isTransactionItem = (0, SearchUIUtils_1.isTransactionListItemType)(item);
        const backTo = Navigation_1.default.getActiveRoute();
        // If we're trying to open a transaction without a transaction thread, let's create the thread and navigate the user
        if (isTransactionItem && item.transactionThreadReportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID) {
            const iouReportAction = (0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActionsArray, item.transactionID);
            (0, SearchUIUtils_1.createAndOpenSearchTransactionThread)(item, iouReportAction, hash, backTo);
            return;
        }
        if ((0, SearchUIUtils_1.isTransactionMemberGroupListItemType)(item)) {
            const newFlatFilters = queryJSON.flatFilters.filter((filter) => filter.key !== CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM);
            newFlatFilters.push({ key: CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM, filters: [{ operator: CONST_1.default.SEARCH.SYNTAX_OPERATORS.EQUAL_TO, value: item.accountID }] });
            const newQueryJSON = { ...queryJSON, groupBy: undefined, flatFilters: newFlatFilters };
            const newQuery = (0, SearchQueryUtils_1.buildSearchQueryString)(newQueryJSON);
            const newQueryJSONWithHash = (0, SearchQueryUtils_1.buildSearchQueryJSON)(newQuery);
            if (!newQueryJSONWithHash) {
                return;
            }
            handleSearch({ queryJSON: newQueryJSONWithHash, searchKey, offset: 0, shouldCalculateTotals: false });
            return;
        }
        if ((0, SearchUIUtils_1.isTransactionCardGroupListItemType)(item)) {
            const newFlatFilters = queryJSON.flatFilters.filter((filter) => filter.key !== CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID);
            newFlatFilters.push({ key: CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID, filters: [{ operator: CONST_1.default.SEARCH.SYNTAX_OPERATORS.EQUAL_TO, value: item.cardID }] });
            const newQueryJSON = { ...queryJSON, groupBy: undefined, flatFilters: newFlatFilters };
            const newQuery = (0, SearchQueryUtils_1.buildSearchQueryString)(newQueryJSON);
            const newQueryJSONWithHash = (0, SearchQueryUtils_1.buildSearchQueryJSON)(newQuery);
            if (!newQueryJSONWithHash) {
                return;
            }
            handleSearch({ queryJSON: newQueryJSONWithHash, searchKey, offset: 0, shouldCalculateTotals: false });
            return;
        }
        if ((0, SearchUIUtils_1.isTransactionWithdrawalIDGroupListItemType)(item)) {
            const newFlatFilters = queryJSON.flatFilters.filter((filter) => filter.key !== CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_ID);
            newFlatFilters.push({ key: CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_ID, filters: [{ operator: CONST_1.default.SEARCH.SYNTAX_OPERATORS.EQUAL_TO, value: item.entryID }] });
            const newQueryJSON = { ...queryJSON, groupBy: undefined, flatFilters: newFlatFilters };
            const newQuery = (0, SearchQueryUtils_1.buildSearchQueryString)(newQueryJSON);
            const newQueryJSONWithHash = (0, SearchQueryUtils_1.buildSearchQueryJSON)(newQuery);
            if (!newQueryJSONWithHash) {
                return;
            }
            handleSearch({ queryJSON: newQueryJSONWithHash, searchKey, offset: 0, shouldCalculateTotals: false });
            return;
        }
        const isFromSelfDM = item.reportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID;
        const reportID = isTransactionItem && (!item.isFromOneTransactionReport || isFromSelfDM) && item.transactionThreadReportID !== CONST_1.default.REPORT.UNREPORTED_REPORT_ID
            ? item.transactionThreadReportID
            : item.reportID;
        if (!reportID) {
            return;
        }
        Performance_1.default.markStart(CONST_1.default.TIMING.OPEN_REPORT_SEARCH);
        Timing_1.default.start(CONST_1.default.TIMING.OPEN_REPORT_SEARCH);
        if ((0, SearchUIUtils_1.isTransactionGroupListItemType)(item)) {
            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_MONEY_REQUEST_REPORT.getRoute({ reportID, backTo }));
            return;
        }
        if ((0, SearchUIUtils_1.isReportActionListItemType)(item)) {
            const reportActionID = item.reportActionID;
            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_REPORT.getRoute({ reportID, reportActionID, backTo }));
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.SEARCH_REPORT.getRoute({ reportID, backTo }));
    }, [isMobileSelectionModeEnabled, toggleTransaction, queryJSON, handleSearch, searchKey, reportActionsArray, hash]);
    const currentColumns = (0, react_1.useMemo)(() => {
        if (!searchResults?.data) {
            return [];
        }
        const columns = (0, SearchUIUtils_1.getColumnsToShow)(accountID, searchResults?.data, false, searchResults?.search?.type === CONST_1.default.SEARCH.DATA_TYPES.TASK);
        return Object.keys(columns).filter((col) => columns[col]);
    }, [accountID, searchResults?.data, searchResults?.search?.type]);
    const opacity = (0, react_native_reanimated_1.useSharedValue)(1);
    const animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        opacity: opacity.get(),
    }));
    const previousColumns = (0, usePrevious_1.default)(currentColumns);
    const [columnsToShow, setColumnsToShow] = (0, react_1.useState)([]);
    // If columns have changed, trigger an animation before settings columnsToShow to prevent
    // new columns appearing before the fade out animation happens
    (0, react_1.useEffect)(() => {
        if ((previousColumns && currentColumns && (0, arraysEqual_1.default)(previousColumns, currentColumns)) || offset === 0 || isSmallScreenWidth) {
            setColumnsToShow(currentColumns);
            return;
        }
        opacity.set((0, react_native_reanimated_1.withTiming)(0, { duration: CONST_1.default.SEARCH.ANIMATION.FADE_DURATION }, () => {
            setColumnsToShow(currentColumns);
            opacity.set((0, react_native_reanimated_1.withTiming)(1, { duration: CONST_1.default.SEARCH.ANIMATION.FADE_DURATION }));
        }));
    }, [previousColumns, currentColumns, setColumnsToShow, opacity, offset, isSmallScreenWidth]);
    const isChat = type === CONST_1.default.SEARCH.DATA_TYPES.CHAT;
    const isTask = type === CONST_1.default.SEARCH.DATA_TYPES.TASK;
    const canSelectMultiple = !isChat && !isTask && (!isSmallScreenWidth || isMobileSelectionModeEnabled) && groupBy !== CONST_1.default.SEARCH.GROUP_BY.WITHDRAWAL_ID;
    const ListItem = (0, SearchUIUtils_1.getListItem)(type, status, groupBy);
    const sortedSelectedData = (0, react_1.useMemo)(() => (0, SearchUIUtils_1.getSortedSections)(type, status, data, localeCompare, sortBy, sortOrder, groupBy).map((item) => {
        const baseKey = isChat
            ? `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${item.reportActionID}`
            : `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${item.transactionID}`;
        // Check if the base key matches the newSearchResultKey (TransactionListItemType)
        const isBaseKeyMatch = baseKey === newSearchResultKey;
        // Check if any transaction within the transactions array (TransactionGroupListItemType) matches the newSearchResultKey
        const isAnyTransactionMatch = !isChat &&
            item?.transactions?.some((transaction) => {
                const transactionKey = `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`;
                return transactionKey === newSearchResultKey;
            });
        // Determine if either the base key or any transaction key matches
        const shouldAnimateInHighlight = isBaseKeyMatch || isAnyTransactionMatch;
        return mapToItemWithAdditionalInfo(item, selectedTransactions, canSelectMultiple, shouldAnimateInHighlight, hash);
    }), [type, status, data, sortBy, sortOrder, groupBy, isChat, newSearchResultKey, selectedTransactions, canSelectMultiple, localeCompare, hash]);
    const hasErrors = Object.keys(searchResults?.errors ?? {}).length > 0 && !isOffline;
    (0, react_1.useEffect)(() => {
        const currentRoute = Navigation_1.default.getActiveRouteWithoutParams();
        if (hasErrors && (currentRoute === '/' || (shouldResetSearchQuery && currentRoute === '/search'))) {
            // Use requestAnimationFrame to safely update navigation params without overriding the current route
            requestAnimationFrame(() => {
                Navigation_1.default.setParams({ q: (0, SearchQueryUtils_1.buildCannedSearchQuery)() });
            });
            if (shouldResetSearchQuery) {
                setShouldResetSearchQuery(false);
            }
        }
    }, [hasErrors, queryJSON, searchResults, shouldResetSearchQuery, setShouldResetSearchQuery]);
    const fetchMoreResults = (0, react_1.useCallback)(() => {
        if (!isFocused || !searchResults?.search?.hasMoreResults || shouldShowLoadingState || shouldShowLoadingMoreItems) {
            return;
        }
        setOffset(offset + CONST_1.default.SEARCH.RESULTS_PAGE_SIZE);
    }, [isFocused, offset, searchResults?.search?.hasMoreResults, shouldShowLoadingMoreItems, shouldShowLoadingState]);
    const toggleAllTransactions = (0, react_1.useCallback)(() => {
        const areItemsGrouped = !!groupBy;
        const totalSelected = Object.keys(selectedTransactions).length;
        if (totalSelected > 0) {
            clearSelectedTransactions();
            return;
        }
        if (areItemsGrouped) {
            setSelectedTransactions(Object.fromEntries(data.flatMap((item) => item.transactions
                .filter((t) => !(0, TransactionUtils_1.isTransactionPendingDelete)(t))
                .map((transactionItem) => mapTransactionItemToSelectedEntry(transactionItem, reportActionsArray, outstandingReportsByPolicyID)))), data);
            return;
        }
        setSelectedTransactions(Object.fromEntries(data
            .filter((t) => !(0, TransactionUtils_1.isTransactionPendingDelete)(t))
            .map((transactionItem) => mapTransactionItemToSelectedEntry(transactionItem, reportActionsArray, outstandingReportsByPolicyID))), data);
    }, [clearSelectedTransactions, data, groupBy, reportActionsArray, selectedTransactions, setSelectedTransactions, outstandingReportsByPolicyID]);
    const onLayout = (0, react_1.useCallback)(() => handleSelectionListScroll(sortedSelectedData, searchListRef.current), [handleSelectionListScroll, sortedSelectedData]);
    const areAllOptionalColumnsHidden = (0, react_1.useMemo)(() => {
        const canBeMissingColumns = expenseHeaders.filter((header) => header.canBeMissing).map((header) => header.columnName);
        return canBeMissingColumns.every((column) => !columnsToShow.includes(column));
    }, [columnsToShow]);
    if (shouldShowLoadingState) {
        return (<react_native_reanimated_1.default.View entering={react_native_reanimated_1.FadeIn.duration(CONST_1.default.SEARCH.ANIMATION.FADE_DURATION)} exiting={react_native_reanimated_1.FadeOut.duration(CONST_1.default.SEARCH.ANIMATION.FADE_DURATION)} style={[styles.flex1]}>
                <SearchRowSkeleton_1.default shouldAnimate containerStyle={shouldUseNarrowLayout ? styles.searchListContentContainerStyles : styles.mt3}/>
            </react_native_reanimated_1.default.View>);
    }
    if (searchResults === undefined) {
        Log_1.default.alert('[Search] Undefined search type');
        return <FullPageOfflineBlockingView_1.default>{null}</FullPageOfflineBlockingView_1.default>;
    }
    if (hasErrors) {
        return (<react_native_1.View style={[shouldUseNarrowLayout ? styles.searchListContentContainerStyles : styles.mt3, styles.flex1]}>
                <FullPageErrorView_1.default shouldShow subtitleStyle={styles.textSupporting} title={translate('errorPage.title', { isBreakLine: shouldUseNarrowLayout })} subtitle={translate('errorPage.subtitle')}/>
            </react_native_1.View>);
    }
    const visibleDataLength = data.filter((item) => item.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || isOffline).length;
    if ((0, SearchUIUtils_1.shouldShowEmptyState)(isDataLoaded, visibleDataLength, searchResults?.search?.type)) {
        return (<react_native_1.View style={[shouldUseNarrowLayout ? styles.searchListContentContainerStyles : styles.mt3, styles.flex1]}>
                <EmptySearchView_1.default similarSearchHash={similarSearchHash} type={type} groupBy={groupBy} hasResults={searchResults?.search?.hasResults}/>
            </react_native_1.View>);
    }
    const onSortPress = (column, order) => {
        const newQuery = (0, SearchQueryUtils_1.buildSearchQueryString)({ ...queryJSON, sortBy: column, sortOrder: order });
        navigation.setParams({ q: newQuery });
    };
    const shouldShowYear = (0, SearchUIUtils_1.shouldShowYear)(searchResults?.data);
    const { shouldShowAmountInWideColumn, shouldShowTaxAmountInWideColumn } = (0, SearchUIUtils_1.getWideAmountIndicators)(searchResults?.data);
    const shouldShowSorting = !groupBy;
    const shouldShowTableHeader = isLargeScreenWidth && !isChat && !groupBy;
    const tableHeaderVisible = (canSelectMultiple || shouldShowTableHeader) && (!groupBy || groupBy === CONST_1.default.SEARCH.GROUP_BY.REPORTS);
    return (<SearchScopeProvider_1.default isOnSearch>
            <react_native_reanimated_1.default.View style={[styles.flex1, animatedStyle]}>
                <SearchList_1.default ref={searchListRef} data={sortedSelectedData} ListItem={ListItem} onSelectRow={onSelectRow} onCheckboxPress={toggleTransaction} onAllCheckboxPress={toggleAllTransactions} canSelectMultiple={canSelectMultiple} shouldPreventLongPressRow={isChat || isTask} isFocused={isFocused} SearchTableHeader={!shouldShowTableHeader ? undefined : (<SearchTableHeader_1.default canSelectMultiple={canSelectMultiple} columns={columnsToShow} type={searchResults?.search.type} onSortPress={onSortPress} sortOrder={sortOrder} sortBy={sortBy} shouldShowYear={shouldShowYear} isAmountColumnWide={shouldShowAmountInWideColumn} isTaxAmountColumnWide={shouldShowTaxAmountInWideColumn} shouldShowSorting={shouldShowSorting} areAllOptionalColumnsHidden={areAllOptionalColumnsHidden} groupBy={groupBy}/>)} contentContainerStyle={{ ...contentContainerStyle, ...styles.pb3 }} containerStyle={[styles.pv0, !tableHeaderVisible && !isSmallScreenWidth && styles.pt3]} shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} onScroll={onSearchListScroll} onEndReachedThreshold={0.75} onEndReached={fetchMoreResults} ListFooterComponent={shouldShowLoadingMoreItems ? (<SearchRowSkeleton_1.default shouldAnimate fixedNumItems={5}/>) : undefined} queryJSON={queryJSON} columns={columnsToShow} areAllOptionalColumnsHidden={areAllOptionalColumnsHidden} violations={violations} onLayout={onLayout} isMobileSelectionModeEnabled={isMobileSelectionModeEnabled} shouldAnimate={type === CONST_1.default.SEARCH.DATA_TYPES.EXPENSE}/>
            </react_native_reanimated_1.default.View>
        </SearchScopeProvider_1.default>);
}
Search.displayName = 'Search';
exports.default = Search;
