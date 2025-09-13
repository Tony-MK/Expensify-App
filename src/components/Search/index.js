"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var FullPageErrorView_1 = require("@components/BlockingViews/FullPageErrorView");
var FullPageOfflineBlockingView_1 = require("@components/BlockingViews/FullPageOfflineBlockingView");
var SearchTableHeader_1 = require("@components/SelectionList/SearchTableHeader");
var SearchRowSkeleton_1 = require("@components/Skeletons/SearchRowSkeleton");
var useCardFeedsForDisplay_1 = require("@hooks/useCardFeedsForDisplay");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var useOnyx_1 = require("@hooks/useOnyx");
var usePrevious_1 = require("@hooks/usePrevious");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useSearchHighlightAndScroll_1 = require("@hooks/useSearchHighlightAndScroll");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
var Search_1 = require("@libs/actions/Search");
var Timing_1 = require("@libs/actions/Timing");
var DeviceCapabilities_1 = require("@libs/DeviceCapabilities");
var Log_1 = require("@libs/Log");
var isSearchTopmostFullScreenRoute_1 = require("@libs/Navigation/helpers/isSearchTopmostFullScreenRoute");
var Performance_1 = require("@libs/Performance");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ReportUtils_1 = require("@libs/ReportUtils");
var SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
var SearchUIUtils_1 = require("@libs/SearchUIUtils");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var Navigation_1 = require("@navigation/Navigation");
var EmptySearchView_1 = require("@pages/Search/EmptySearchView");
var CONST_1 = require("@src/CONST");
var NAVIGATORS_1 = require("@src/NAVIGATORS");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var SCREENS_1 = require("@src/SCREENS");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
var arraysEqual_1 = require("@src/utils/arraysEqual");
var SearchContext_1 = require("./SearchContext");
var SearchList_1 = require("./SearchList");
var SearchScopeProvider_1 = require("./SearchScopeProvider");
var expenseHeaders = (0, SearchTableHeader_1.getExpenseHeaders)();
function mapTransactionItemToSelectedEntry(item, reportActions, outstandingReportsByPolicyID) {
    var _a;
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
            amount: (_a = item.modifiedAmount) !== null && _a !== void 0 ? _a : item.amount,
            convertedAmount: item.convertedAmount,
            convertedCurrency: item.convertedCurrency,
        },
    ];
}
function mapToTransactionItemWithAdditionalInfo(item, selectedTransactions, canSelectMultiple, shouldAnimateInHighlight, hash) {
    var _a;
    return __assign(__assign({}, item), { shouldAnimateInHighlight: shouldAnimateInHighlight, isSelected: ((_a = selectedTransactions[item.keyForList]) === null || _a === void 0 ? void 0 : _a.isSelected) && canSelectMultiple, hash: hash });
}
function mapToItemWithAdditionalInfo(item, selectedTransactions, canSelectMultiple, shouldAnimateInHighlight, hash) {
    var _a, _b, _c;
    if ((0, SearchUIUtils_1.isTaskListItemType)(item)) {
        return __assign(__assign({}, item), { shouldAnimateInHighlight: shouldAnimateInHighlight, hash: hash });
    }
    if ((0, SearchUIUtils_1.isReportActionListItemType)(item)) {
        return __assign(__assign({}, item), { shouldAnimateInHighlight: shouldAnimateInHighlight, hash: hash });
    }
    return (0, SearchUIUtils_1.isTransactionListItemType)(item)
        ? mapToTransactionItemWithAdditionalInfo(item, selectedTransactions, canSelectMultiple, shouldAnimateInHighlight, hash)
        : __assign(__assign({}, item), { shouldAnimateInHighlight: shouldAnimateInHighlight, transactions: (_a = item.transactions) === null || _a === void 0 ? void 0 : _a.map(function (transaction) {
                return mapToTransactionItemWithAdditionalInfo(transaction, selectedTransactions, canSelectMultiple, shouldAnimateInHighlight, hash);
            }), isSelected: ((_b = item === null || item === void 0 ? void 0 : item.transactions) === null || _b === void 0 ? void 0 : _b.length) > 0 &&
                ((_c = item.transactions) === null || _c === void 0 ? void 0 : _c.filter(function (t) { return !(0, TransactionUtils_1.isTransactionPendingDelete)(t); }).every(function (transaction) { var _a; return ((_a = selectedTransactions[transaction.keyForList]) === null || _a === void 0 ? void 0 : _a.isSelected) && canSelectMultiple; })), hash: hash });
}
function prepareTransactionsList(item, selectedTransactions, reportActions, outstandingReportsByPolicyID) {
    var _a;
    var _b;
    if ((_b = selectedTransactions[item.keyForList]) === null || _b === void 0 ? void 0 : _b.isSelected) {
        var _c = selectedTransactions, _d = item.keyForList, omittedTransaction = _c[_d], transactions = __rest(_c, [typeof _d === "symbol" ? _d : _d + ""]);
        return transactions;
    }
    return __assign(__assign({}, selectedTransactions), (_a = {}, _a[item.keyForList] = {
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
    }, _a));
}
function Search(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j;
    var queryJSON = _a.queryJSON, searchResults = _a.searchResults, onSearchListScroll = _a.onSearchListScroll, contentContainerStyle = _a.contentContainerStyle, handleSearch = _a.handleSearch, isMobileSelectionModeEnabled = _a.isMobileSelectionModeEnabled;
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var styles = (0, useThemeStyles_1.default)();
    // We need to use isSmallScreenWidth instead of shouldUseNarrowLayout for enabling the selection mode on small screens only
    // eslint-disable-next-line rulesdir/prefer-shouldUseNarrowLayout-instead-of-isSmallScreenWidth
    var _k = (0, useResponsiveLayout_1.default)(), isSmallScreenWidth = _k.isSmallScreenWidth, isLargeScreenWidth = _k.isLargeScreenWidth;
    var navigation = (0, native_1.useNavigation)();
    var isFocused = (0, native_1.useIsFocused)();
    var _l = (0, SearchContext_1.useSearchContext)(), setCurrentSearchHashAndKey = _l.setCurrentSearchHashAndKey, setCurrentSearchQueryJSON = _l.setCurrentSearchQueryJSON, setSelectedTransactions = _l.setSelectedTransactions, selectedTransactions = _l.selectedTransactions, clearSelectedTransactions = _l.clearSelectedTransactions, shouldTurnOffSelectionMode = _l.shouldTurnOffSelectionMode, setShouldShowFiltersBarLoading = _l.setShouldShowFiltersBarLoading, lastSearchType = _l.lastSearchType, shouldShowSelectAllMatchingItems = _l.shouldShowSelectAllMatchingItems, areAllMatchingItemsSelected = _l.areAllMatchingItemsSelected, selectAllMatchingItems = _l.selectAllMatchingItems, shouldResetSearchQuery = _l.shouldResetSearchQuery, setShouldResetSearchQuery = _l.setShouldResetSearchQuery;
    var _m = (0, react_1.useState)(0), offset = _m[0], setOffset = _m[1];
    var transactions = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, { canBeMissing: true })[0];
    var previousTransactions = (0, usePrevious_1.default)(transactions);
    var reportActions = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, { canBeMissing: true })[0];
    var savedSearches = (0, useOnyx_1.default)(ONYXKEYS_1.default.SAVED_SEARCHES, { canBeMissing: true })[0];
    var outstandingReportsByPolicyID = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.OUTSTANDING_REPORTS_BY_POLICY_ID, { canBeMissing: true })[0];
    var violations = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, { canBeMissing: true })[0];
    var _o = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS, {
        canBeMissing: true,
        selector: function (all) {
            var ids = new Set();
            if (!all) {
                return ids;
            }
            var prefixLength = ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS.length;
            for (var _i = 0, _a = Object.entries(all); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                if ((0, ReportUtils_1.isArchivedReport)(value)) {
                    var reportID = key.slice(prefixLength);
                    ids.add(reportID);
                }
            }
            return ids;
        },
    })[0], archivedReportsIdSet = _o === void 0 ? new Set() : _o;
    // Create a selector for only the reportActions needed to determine if a report has been exported or not, grouped by report
    var exportReportActions = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, {
        canEvict: false,
        canBeMissing: true,
        selector: function (allReportActions) {
            return Object.fromEntries(Object.entries(allReportActions !== null && allReportActions !== void 0 ? allReportActions : {}).map(function (_a) {
                var reportID = _a[0], reportActionsGroup = _a[1];
                var filteredReportActions = Object.values(reportActionsGroup !== null && reportActionsGroup !== void 0 ? reportActionsGroup : {}).filter(function (action) { return (0, ReportActionsUtils_1.isExportIntegrationAction)(action) || (0, ReportActionsUtils_1.isIntegrationMessageAction)(action); });
                return [reportID, filteredReportActions];
            }));
        },
    })[0];
    var defaultCardFeed = (0, useCardFeedsForDisplay_1.default)().defaultCardFeed;
    var accountID = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false, selector: function (s) { return s === null || s === void 0 ? void 0 : s.accountID; } })[0];
    var suggestedSearches = (0, react_1.useMemo)(function () { return (0, SearchUIUtils_1.getSuggestedSearches)(accountID, defaultCardFeed === null || defaultCardFeed === void 0 ? void 0 : defaultCardFeed.id); }, [defaultCardFeed === null || defaultCardFeed === void 0 ? void 0 : defaultCardFeed.id, accountID]);
    var type = queryJSON.type, status = queryJSON.status, sortBy = queryJSON.sortBy, sortOrder = queryJSON.sortOrder, hash = queryJSON.hash, similarSearchHash = queryJSON.similarSearchHash, groupBy = queryJSON.groupBy;
    var searchKey = (0, react_1.useMemo)(function () { var _a; return (_a = Object.values(suggestedSearches).find(function (search) { return search.similarSearchHash === similarSearchHash; })) === null || _a === void 0 ? void 0 : _a.key; }, [suggestedSearches, similarSearchHash]);
    var shouldCalculateTotals = (0, react_1.useMemo)(function () {
        if (offset !== 0) {
            return false;
        }
        var savedSearchValues = Object.values(savedSearches !== null && savedSearches !== void 0 ? savedSearches : {});
        if (!savedSearchValues.length && !searchKey) {
            return false;
        }
        var eligibleSearchKeys = [
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
        for (var _i = 0, savedSearchValues_1 = savedSearchValues; _i < savedSearchValues_1.length; _i++) {
            var savedSearch = savedSearchValues_1[_i];
            var searchData = (0, SearchQueryUtils_1.buildSearchQueryJSON)(savedSearch.query);
            if (searchData && searchData.similarSearchHash === similarSearchHash) {
                return true;
            }
        }
        return false;
    }, [offset, savedSearches, searchKey, similarSearchHash]);
    var previousReportActions = (0, usePrevious_1.default)(reportActions);
    var reportActionsArray = (0, react_1.useMemo)(function () {
        return Object.values(reportActions !== null && reportActions !== void 0 ? reportActions : {})
            .filter(function (reportAction) { return !!reportAction; })
            .flatMap(function (filteredReportActions) { return Object.values(filteredReportActions !== null && filteredReportActions !== void 0 ? filteredReportActions : {}); });
    }, [reportActions]);
    var _p = (0, useLocalize_1.default)(), translate = _p.translate, localeCompare = _p.localeCompare, formatPhoneNumber = _p.formatPhoneNumber;
    var searchListRef = (0, react_1.useRef)(null);
    var clearTransactionsAndSetHashAndKey = (0, react_1.useCallback)(function () {
        clearSelectedTransactions(hash);
        setCurrentSearchHashAndKey(hash, searchKey);
        setCurrentSearchQueryJSON(queryJSON);
    }, [hash, searchKey, clearSelectedTransactions, setCurrentSearchHashAndKey, setCurrentSearchQueryJSON, queryJSON]);
    (0, native_1.useFocusEffect)(clearTransactionsAndSetHashAndKey);
    (0, react_1.useEffect)(function () {
        clearTransactionsAndSetHashAndKey();
        // Trigger once on mount (e.g., on page reload), when RHP is open and screen is not focused
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    var isSearchResultsEmpty = !(searchResults === null || searchResults === void 0 ? void 0 : searchResults.data) || (0, SearchUIUtils_1.isSearchResultsEmpty)(searchResults);
    (0, react_1.useEffect)(function () {
        if (!isFocused) {
            return;
        }
        var selectedKeys = Object.keys(selectedTransactions).filter(function (transactionKey) { return selectedTransactions[transactionKey]; });
        if (selectedKeys.length === 0 && isMobileSelectionModeEnabled && shouldTurnOffSelectionMode) {
            (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
        }
        // We don't want to run the effect on isFocused change as we only need it to early return when it is false.
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTransactions, isMobileSelectionModeEnabled, shouldTurnOffSelectionMode]);
    (0, react_1.useEffect)(function () {
        if (!isFocused) {
            return;
        }
        var selectedKeys = Object.keys(selectedTransactions).filter(function (transactionKey) { return selectedTransactions[transactionKey]; });
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
    (0, react_1.useEffect)(function () {
        var focusedRoute = (0, native_1.findFocusedRoute)(Navigation_1.navigationRef.getRootState());
        var isMigratedModalDisplayed = (focusedRoute === null || focusedRoute === void 0 ? void 0 : focusedRoute.name) === NAVIGATORS_1.default.MIGRATED_USER_MODAL_NAVIGATOR || (focusedRoute === null || focusedRoute === void 0 ? void 0 : focusedRoute.name) === SCREENS_1.default.MIGRATED_USER_WELCOME_MODAL.ROOT;
        if ((!isFocused && !isMigratedModalDisplayed) || isOffline) {
            return;
        }
        handleSearch({ queryJSON: queryJSON, searchKey: searchKey, offset: offset, shouldCalculateTotals: shouldCalculateTotals });
        // We don't need to run the effect on change of isFocused.
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleSearch, isOffline, offset, queryJSON, searchKey, shouldCalculateTotals]);
    (0, react_1.useEffect)(function () {
        (0, Search_1.openSearch)();
    }, []);
    var _q = (0, useSearchHighlightAndScroll_1.default)({
        searchResults: searchResults,
        transactions: transactions,
        previousTransactions: previousTransactions,
        queryJSON: queryJSON,
        searchKey: searchKey,
        offset: offset,
        shouldCalculateTotals: shouldCalculateTotals,
        reportActions: reportActions,
        previousReportActions: previousReportActions,
    }), newSearchResultKey = _q.newSearchResultKey, handleSelectionListScroll = _q.handleSelectionListScroll;
    // There's a race condition in Onyx which makes it return data from the previous Search, so in addition to checking that the data is loaded
    // we also need to check that the searchResults matches the type and status of the current search
    var isDataLoaded = (0, SearchUIUtils_1.isSearchDataLoaded)(searchResults, queryJSON);
    var shouldShowLoadingState = !isOffline && (!isDataLoaded || (!!(searchResults === null || searchResults === void 0 ? void 0 : searchResults.search.isLoading) && Array.isArray(searchResults === null || searchResults === void 0 ? void 0 : searchResults.data) && (searchResults === null || searchResults === void 0 ? void 0 : searchResults.data.length) === 0));
    var shouldShowLoadingMoreItems = !shouldShowLoadingState && ((_b = searchResults === null || searchResults === void 0 ? void 0 : searchResults.search) === null || _b === void 0 ? void 0 : _b.isLoading) && ((_c = searchResults === null || searchResults === void 0 ? void 0 : searchResults.search) === null || _c === void 0 ? void 0 : _c.offset) > 0;
    var prevIsSearchResultEmpty = (0, usePrevious_1.default)(isSearchResultsEmpty);
    var data = (0, react_1.useMemo)(function () {
        if (searchResults === undefined || !isDataLoaded) {
            return [];
        }
        // Group-by option cannot be used for chats or tasks
        var isChat = type === CONST_1.default.SEARCH.DATA_TYPES.CHAT;
        var isTask = type === CONST_1.default.SEARCH.DATA_TYPES.TASK;
        if (groupBy && (isChat || isTask)) {
            return [];
        }
        return (0, SearchUIUtils_1.getSections)(type, searchResults.data, accountID, formatPhoneNumber, groupBy, exportReportActions, searchKey, archivedReportsIdSet, queryJSON);
    }, [searchKey, exportReportActions, groupBy, isDataLoaded, searchResults, type, archivedReportsIdSet, formatPhoneNumber, accountID, queryJSON]);
    (0, react_1.useEffect)(function () {
        /** We only want to display the skeleton for the status filters the first time we load them for a specific data type */
        setShouldShowFiltersBarLoading(shouldShowLoadingState && lastSearchType !== type);
    }, [lastSearchType, setShouldShowFiltersBarLoading, shouldShowLoadingState, type]);
    // When new data load, selectedTransactions is updated in next effect. We use this flag to whether selection is updated
    var isRefreshingSelection = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        if (!isFocused) {
            return;
        }
        if (type === CONST_1.default.SEARCH.DATA_TYPES.CHAT) {
            return;
        }
        var newTransactionList = {};
        if (groupBy) {
            data.forEach(function (transactionGroup) {
                if (!Object.hasOwn(transactionGroup, 'transactions') || !('transactions' in transactionGroup)) {
                    return;
                }
                transactionGroup.transactions.forEach(function (transaction) {
                    var _a;
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
                        amount: (_a = transaction.modifiedAmount) !== null && _a !== void 0 ? _a : transaction.amount,
                        convertedAmount: transaction.convertedAmount,
                        convertedCurrency: transaction.convertedCurrency,
                    };
                });
            });
        }
        else {
            data.forEach(function (transaction) {
                var _a;
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
                    amount: (_a = transaction.modifiedAmount) !== null && _a !== void 0 ? _a : transaction.amount,
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
    (0, react_1.useEffect)(function () {
        if (!isSearchResultsEmpty || prevIsSearchResultEmpty) {
            return;
        }
        (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
    }, [isSearchResultsEmpty, prevIsSearchResultEmpty]);
    (0, react_1.useEffect)(function () { return function () {
        if ((0, isSearchTopmostFullScreenRoute_1.default)()) {
            return;
        }
        clearSelectedTransactions();
        (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
    }; }, [isFocused, clearSelectedTransactions]);
    // When selectedTransactions is updated, we confirm that selection is refreshed
    (0, react_1.useEffect)(function () {
        isRefreshingSelection.current = false;
    }, [selectedTransactions]);
    (0, react_1.useEffect)(function () {
        var _a;
        if (!isFocused) {
            return;
        }
        if (!data.length || isRefreshingSelection.current) {
            return;
        }
        var areItemsGrouped = !!groupBy;
        var flattenedItems = areItemsGrouped ? data.flatMap(function (item) { return item.transactions; }) : data;
        var areAllItemsSelected = flattenedItems.length === Object.keys(selectedTransactions).length;
        // If the user has selected all the expenses in their view but there are more expenses matched by the search
        // give them the option to select all matching expenses
        shouldShowSelectAllMatchingItems(!!(areAllItemsSelected && ((_a = searchResults === null || searchResults === void 0 ? void 0 : searchResults.search) === null || _a === void 0 ? void 0 : _a.hasMoreResults)));
        if (!areAllItemsSelected) {
            selectAllMatchingItems(false);
        }
    }, [isFocused, data, (_d = searchResults === null || searchResults === void 0 ? void 0 : searchResults.search) === null || _d === void 0 ? void 0 : _d.hasMoreResults, selectedTransactions, selectAllMatchingItems, shouldShowSelectAllMatchingItems, groupBy]);
    var toggleTransaction = (0, react_1.useCallback)(function (item, itemTransactions) {
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
        var currentTransactions = itemTransactions !== null && itemTransactions !== void 0 ? itemTransactions : item.transactions;
        if (currentTransactions.some(function (transaction) { var _a; return (_a = selectedTransactions[transaction.keyForList]) === null || _a === void 0 ? void 0 : _a.isSelected; })) {
            var reducedSelectedTransactions_1 = __assign({}, selectedTransactions);
            currentTransactions.forEach(function (transaction) {
                delete reducedSelectedTransactions_1[transaction.keyForList];
            });
            setSelectedTransactions(reducedSelectedTransactions_1, data);
            return;
        }
        setSelectedTransactions(__assign(__assign({}, selectedTransactions), Object.fromEntries(currentTransactions
            .filter(function (t) { return !(0, TransactionUtils_1.isTransactionPendingDelete)(t); })
            .map(function (transactionItem) { return mapTransactionItemToSelectedEntry(transactionItem, reportActionsArray, outstandingReportsByPolicyID); }))), data);
    }, [data, reportActionsArray, selectedTransactions, outstandingReportsByPolicyID, setSelectedTransactions]);
    var onSelectRow = (0, react_1.useCallback)(function (item) {
        if (isMobileSelectionModeEnabled) {
            toggleTransaction(item);
            return;
        }
        var isTransactionItem = (0, SearchUIUtils_1.isTransactionListItemType)(item);
        var backTo = Navigation_1.default.getActiveRoute();
        // If we're trying to open a transaction without a transaction thread, let's create the thread and navigate the user
        if (isTransactionItem && item.transactionThreadReportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID) {
            var iouReportAction = (0, ReportActionsUtils_1.getIOUActionForTransactionID)(reportActionsArray, item.transactionID);
            (0, SearchUIUtils_1.createAndOpenSearchTransactionThread)(item, iouReportAction, hash, backTo);
            return;
        }
        if ((0, SearchUIUtils_1.isTransactionMemberGroupListItemType)(item)) {
            var newFlatFilters = queryJSON.flatFilters.filter(function (filter) { return filter.key !== CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM; });
            newFlatFilters.push({ key: CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.FROM, filters: [{ operator: CONST_1.default.SEARCH.SYNTAX_OPERATORS.EQUAL_TO, value: item.accountID }] });
            var newQueryJSON = __assign(__assign({}, queryJSON), { groupBy: undefined, flatFilters: newFlatFilters });
            var newQuery = (0, SearchQueryUtils_1.buildSearchQueryString)(newQueryJSON);
            var newQueryJSONWithHash = (0, SearchQueryUtils_1.buildSearchQueryJSON)(newQuery);
            if (!newQueryJSONWithHash) {
                return;
            }
            handleSearch({ queryJSON: newQueryJSONWithHash, searchKey: searchKey, offset: 0, shouldCalculateTotals: false });
            return;
        }
        if ((0, SearchUIUtils_1.isTransactionCardGroupListItemType)(item)) {
            var newFlatFilters = queryJSON.flatFilters.filter(function (filter) { return filter.key !== CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID; });
            newFlatFilters.push({ key: CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.CARD_ID, filters: [{ operator: CONST_1.default.SEARCH.SYNTAX_OPERATORS.EQUAL_TO, value: item.cardID }] });
            var newQueryJSON = __assign(__assign({}, queryJSON), { groupBy: undefined, flatFilters: newFlatFilters });
            var newQuery = (0, SearchQueryUtils_1.buildSearchQueryString)(newQueryJSON);
            var newQueryJSONWithHash = (0, SearchQueryUtils_1.buildSearchQueryJSON)(newQuery);
            if (!newQueryJSONWithHash) {
                return;
            }
            handleSearch({ queryJSON: newQueryJSONWithHash, searchKey: searchKey, offset: 0, shouldCalculateTotals: false });
            return;
        }
        if ((0, SearchUIUtils_1.isTransactionWithdrawalIDGroupListItemType)(item)) {
            var newFlatFilters = queryJSON.flatFilters.filter(function (filter) { return filter.key !== CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_ID; });
            newFlatFilters.push({ key: CONST_1.default.SEARCH.SYNTAX_FILTER_KEYS.WITHDRAWAL_ID, filters: [{ operator: CONST_1.default.SEARCH.SYNTAX_OPERATORS.EQUAL_TO, value: item.entryID }] });
            var newQueryJSON = __assign(__assign({}, queryJSON), { groupBy: undefined, flatFilters: newFlatFilters });
            var newQuery = (0, SearchQueryUtils_1.buildSearchQueryString)(newQueryJSON);
            var newQueryJSONWithHash = (0, SearchQueryUtils_1.buildSearchQueryJSON)(newQuery);
            if (!newQueryJSONWithHash) {
                return;
            }
            handleSearch({ queryJSON: newQueryJSONWithHash, searchKey: searchKey, offset: 0, shouldCalculateTotals: false });
            return;
        }
        var isFromSelfDM = item.reportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID;
        var reportID = isTransactionItem && (!item.isFromOneTransactionReport || isFromSelfDM) && item.transactionThreadReportID !== CONST_1.default.REPORT.UNREPORTED_REPORT_ID
            ? item.transactionThreadReportID
            : item.reportID;
        if (!reportID) {
            return;
        }
        Performance_1.default.markStart(CONST_1.default.TIMING.OPEN_REPORT_SEARCH);
        Timing_1.default.start(CONST_1.default.TIMING.OPEN_REPORT_SEARCH);
        if ((0, SearchUIUtils_1.isTransactionGroupListItemType)(item)) {
            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_MONEY_REQUEST_REPORT.getRoute({ reportID: reportID, backTo: backTo }));
            return;
        }
        if ((0, SearchUIUtils_1.isReportActionListItemType)(item)) {
            var reportActionID = item.reportActionID;
            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_REPORT.getRoute({ reportID: reportID, reportActionID: reportActionID, backTo: backTo }));
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.SEARCH_REPORT.getRoute({ reportID: reportID, backTo: backTo }));
    }, [isMobileSelectionModeEnabled, toggleTransaction, queryJSON, handleSearch, searchKey, reportActionsArray, hash]);
    var currentColumns = (0, react_1.useMemo)(function () {
        var _a;
        if (!(searchResults === null || searchResults === void 0 ? void 0 : searchResults.data)) {
            return [];
        }
        var columns = (0, SearchUIUtils_1.getColumnsToShow)(accountID, searchResults === null || searchResults === void 0 ? void 0 : searchResults.data, false, ((_a = searchResults === null || searchResults === void 0 ? void 0 : searchResults.search) === null || _a === void 0 ? void 0 : _a.type) === CONST_1.default.SEARCH.DATA_TYPES.TASK);
        return Object.keys(columns).filter(function (col) { return columns[col]; });
    }, [accountID, searchResults === null || searchResults === void 0 ? void 0 : searchResults.data, (_e = searchResults === null || searchResults === void 0 ? void 0 : searchResults.search) === null || _e === void 0 ? void 0 : _e.type]);
    var opacity = (0, react_native_reanimated_1.useSharedValue)(1);
    var animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        opacity: opacity.get(),
    }); });
    var previousColumns = (0, usePrevious_1.default)(currentColumns);
    var _r = (0, react_1.useState)([]), columnsToShow = _r[0], setColumnsToShow = _r[1];
    // If columns have changed, trigger an animation before settings columnsToShow to prevent
    // new columns appearing before the fade out animation happens
    (0, react_1.useEffect)(function () {
        if ((previousColumns && currentColumns && (0, arraysEqual_1.default)(previousColumns, currentColumns)) || offset === 0 || isSmallScreenWidth) {
            setColumnsToShow(currentColumns);
            return;
        }
        opacity.set((0, react_native_reanimated_1.withTiming)(0, { duration: CONST_1.default.SEARCH.ANIMATION.FADE_DURATION }, function () {
            setColumnsToShow(currentColumns);
            opacity.set((0, react_native_reanimated_1.withTiming)(1, { duration: CONST_1.default.SEARCH.ANIMATION.FADE_DURATION }));
        }));
    }, [previousColumns, currentColumns, setColumnsToShow, opacity, offset, isSmallScreenWidth]);
    var isChat = type === CONST_1.default.SEARCH.DATA_TYPES.CHAT;
    var isTask = type === CONST_1.default.SEARCH.DATA_TYPES.TASK;
    var canSelectMultiple = !isChat && !isTask && (!isSmallScreenWidth || isMobileSelectionModeEnabled) && groupBy !== CONST_1.default.SEARCH.GROUP_BY.WITHDRAWAL_ID;
    var ListItem = (0, SearchUIUtils_1.getListItem)(type, status, groupBy);
    var sortedSelectedData = (0, react_1.useMemo)(function () {
        return (0, SearchUIUtils_1.getSortedSections)(type, status, data, localeCompare, sortBy, sortOrder, groupBy).map(function (item) {
            var _a;
            var baseKey = isChat
                ? "".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(item.reportActionID)
                : "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(item.transactionID);
            // Check if the base key matches the newSearchResultKey (TransactionListItemType)
            var isBaseKeyMatch = baseKey === newSearchResultKey;
            // Check if any transaction within the transactions array (TransactionGroupListItemType) matches the newSearchResultKey
            var isAnyTransactionMatch = !isChat &&
                ((_a = item === null || item === void 0 ? void 0 : item.transactions) === null || _a === void 0 ? void 0 : _a.some(function (transaction) {
                    var transactionKey = "".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transaction.transactionID);
                    return transactionKey === newSearchResultKey;
                }));
            // Determine if either the base key or any transaction key matches
            var shouldAnimateInHighlight = isBaseKeyMatch || isAnyTransactionMatch;
            return mapToItemWithAdditionalInfo(item, selectedTransactions, canSelectMultiple, shouldAnimateInHighlight, hash);
        });
    }, [type, status, data, sortBy, sortOrder, groupBy, isChat, newSearchResultKey, selectedTransactions, canSelectMultiple, localeCompare, hash]);
    var hasErrors = Object.keys((_f = searchResults === null || searchResults === void 0 ? void 0 : searchResults.errors) !== null && _f !== void 0 ? _f : {}).length > 0 && !isOffline;
    (0, react_1.useEffect)(function () {
        var currentRoute = Navigation_1.default.getActiveRouteWithoutParams();
        if (hasErrors && (currentRoute === '/' || (shouldResetSearchQuery && currentRoute === '/search'))) {
            // Use requestAnimationFrame to safely update navigation params without overriding the current route
            requestAnimationFrame(function () {
                Navigation_1.default.setParams({ q: (0, SearchQueryUtils_1.buildCannedSearchQuery)() });
            });
            if (shouldResetSearchQuery) {
                setShouldResetSearchQuery(false);
            }
        }
    }, [hasErrors, queryJSON, searchResults, shouldResetSearchQuery, setShouldResetSearchQuery]);
    var fetchMoreResults = (0, react_1.useCallback)(function () {
        var _a;
        if (!isFocused || !((_a = searchResults === null || searchResults === void 0 ? void 0 : searchResults.search) === null || _a === void 0 ? void 0 : _a.hasMoreResults) || shouldShowLoadingState || shouldShowLoadingMoreItems) {
            return;
        }
        setOffset(offset + CONST_1.default.SEARCH.RESULTS_PAGE_SIZE);
    }, [isFocused, offset, (_g = searchResults === null || searchResults === void 0 ? void 0 : searchResults.search) === null || _g === void 0 ? void 0 : _g.hasMoreResults, shouldShowLoadingMoreItems, shouldShowLoadingState]);
    var toggleAllTransactions = (0, react_1.useCallback)(function () {
        var areItemsGrouped = !!groupBy;
        var totalSelected = Object.keys(selectedTransactions).length;
        if (totalSelected > 0) {
            clearSelectedTransactions();
            return;
        }
        if (areItemsGrouped) {
            setSelectedTransactions(Object.fromEntries(data.flatMap(function (item) {
                return item.transactions
                    .filter(function (t) { return !(0, TransactionUtils_1.isTransactionPendingDelete)(t); })
                    .map(function (transactionItem) { return mapTransactionItemToSelectedEntry(transactionItem, reportActionsArray, outstandingReportsByPolicyID); });
            })), data);
            return;
        }
        setSelectedTransactions(Object.fromEntries(data
            .filter(function (t) { return !(0, TransactionUtils_1.isTransactionPendingDelete)(t); })
            .map(function (transactionItem) { return mapTransactionItemToSelectedEntry(transactionItem, reportActionsArray, outstandingReportsByPolicyID); })), data);
    }, [clearSelectedTransactions, data, groupBy, reportActionsArray, selectedTransactions, setSelectedTransactions, outstandingReportsByPolicyID]);
    var onLayout = (0, react_1.useCallback)(function () { return handleSelectionListScroll(sortedSelectedData, searchListRef.current); }, [handleSelectionListScroll, sortedSelectedData]);
    var areAllOptionalColumnsHidden = (0, react_1.useMemo)(function () {
        var canBeMissingColumns = expenseHeaders.filter(function (header) { return header.canBeMissing; }).map(function (header) { return header.columnName; });
        return canBeMissingColumns.every(function (column) { return !columnsToShow.includes(column); });
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
    var visibleDataLength = data.filter(function (item) { return item.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE || isOffline; }).length;
    if ((0, SearchUIUtils_1.shouldShowEmptyState)(isDataLoaded, visibleDataLength, (_h = searchResults === null || searchResults === void 0 ? void 0 : searchResults.search) === null || _h === void 0 ? void 0 : _h.type)) {
        return (<react_native_1.View style={[shouldUseNarrowLayout ? styles.searchListContentContainerStyles : styles.mt3, styles.flex1]}>
                <EmptySearchView_1.default similarSearchHash={similarSearchHash} type={type} groupBy={groupBy} hasResults={(_j = searchResults === null || searchResults === void 0 ? void 0 : searchResults.search) === null || _j === void 0 ? void 0 : _j.hasResults}/>
            </react_native_1.View>);
    }
    var onSortPress = function (column, order) {
        var newQuery = (0, SearchQueryUtils_1.buildSearchQueryString)(__assign(__assign({}, queryJSON), { sortBy: column, sortOrder: order }));
        navigation.setParams({ q: newQuery });
    };
    var shouldShowYear = (0, SearchUIUtils_1.shouldShowYear)(searchResults === null || searchResults === void 0 ? void 0 : searchResults.data);
    var _s = (0, SearchUIUtils_1.getWideAmountIndicators)(searchResults === null || searchResults === void 0 ? void 0 : searchResults.data), shouldShowAmountInWideColumn = _s.shouldShowAmountInWideColumn, shouldShowTaxAmountInWideColumn = _s.shouldShowTaxAmountInWideColumn;
    var shouldShowSorting = !groupBy;
    var shouldShowTableHeader = isLargeScreenWidth && !isChat && !groupBy;
    var tableHeaderVisible = (canSelectMultiple || shouldShowTableHeader) && (!groupBy || groupBy === CONST_1.default.SEARCH.GROUP_BY.REPORTS);
    return (<SearchScopeProvider_1.default isOnSearch>
            <react_native_reanimated_1.default.View style={[styles.flex1, animatedStyle]}>
                <SearchList_1.default ref={searchListRef} data={sortedSelectedData} ListItem={ListItem} onSelectRow={onSelectRow} onCheckboxPress={toggleTransaction} onAllCheckboxPress={toggleAllTransactions} canSelectMultiple={canSelectMultiple} shouldPreventLongPressRow={isChat || isTask} isFocused={isFocused} SearchTableHeader={!shouldShowTableHeader ? undefined : (<SearchTableHeader_1.default canSelectMultiple={canSelectMultiple} columns={columnsToShow} type={searchResults === null || searchResults === void 0 ? void 0 : searchResults.search.type} onSortPress={onSortPress} sortOrder={sortOrder} sortBy={sortBy} shouldShowYear={shouldShowYear} isAmountColumnWide={shouldShowAmountInWideColumn} isTaxAmountColumnWide={shouldShowTaxAmountInWideColumn} shouldShowSorting={shouldShowSorting} areAllOptionalColumnsHidden={areAllOptionalColumnsHidden} groupBy={groupBy}/>)} contentContainerStyle={__assign(__assign({}, contentContainerStyle), styles.pb3)} containerStyle={[styles.pv0, !tableHeaderVisible && !isSmallScreenWidth && styles.pt3]} shouldPreventDefaultFocusOnSelectRow={!(0, DeviceCapabilities_1.canUseTouchScreen)()} onScroll={onSearchListScroll} onEndReachedThreshold={0.75} onEndReached={fetchMoreResults} ListFooterComponent={shouldShowLoadingMoreItems ? (<SearchRowSkeleton_1.default shouldAnimate fixedNumItems={5}/>) : undefined} queryJSON={queryJSON} columns={columnsToShow} areAllOptionalColumnsHidden={areAllOptionalColumnsHidden} violations={violations} onLayout={onLayout} isMobileSelectionModeEnabled={isMobileSelectionModeEnabled} shouldAnimate={type === CONST_1.default.SEARCH.DATA_TYPES.EXPENSE}/>
            </react_native_reanimated_1.default.View>
        </SearchScopeProvider_1.default>);
}
Search.displayName = 'Search';
exports.default = Search;
