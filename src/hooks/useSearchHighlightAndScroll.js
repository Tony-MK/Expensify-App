"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Search_1 = require("@libs/actions/Search");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useNetwork_1 = require("./useNetwork");
const usePrevious_1 = require("./usePrevious");
/**
 * Hook used to trigger a search when a new transaction or report action is added and handle highlighting and scrolling.
 */
function useSearchHighlightAndScroll({ searchResults, transactions, previousTransactions, reportActions, previousReportActions, queryJSON, searchKey, offset, shouldCalculateTotals, }) {
    const isFocused = (0, native_1.useIsFocused)();
    const { isOffline } = (0, useNetwork_1.default)();
    // Ref to track if the search was triggered by this hook
    const triggeredByHookRef = (0, react_1.useRef)(false);
    const searchTriggeredRef = (0, react_1.useRef)(false);
    const hasNewItemsRef = (0, react_1.useRef)(false);
    const previousSearchResults = (0, usePrevious_1.default)(searchResults?.data);
    const [newSearchResultKey, setNewSearchResultKey] = (0, react_1.useState)(null);
    const highlightedIDs = (0, react_1.useRef)(new Set());
    const initializedRef = (0, react_1.useRef)(false);
    const hasPendingSearchRef = (0, react_1.useRef)(false);
    const isChat = queryJSON.type === CONST_1.default.SEARCH.DATA_TYPES.CHAT;
    const existingSearchResultIDs = (0, react_1.useMemo)(() => {
        if (!searchResults?.data) {
            return [];
        }
        return isChat ? extractReportActionIDsFromSearchResults(searchResults.data) : extractTransactionIDsFromSearchResults(searchResults.data);
    }, [searchResults?.data, isChat]);
    // Trigger search when a new report action is added while on chat or when a new transaction is added for the other search types.
    (0, react_1.useEffect)(() => {
        const previousTransactionsIDs = Object.keys(previousTransactions ?? {});
        const transactionsIDs = Object.keys(transactions ?? {});
        const reportActionsIDs = Object.values(reportActions ?? {})
            .map((actions) => Object.keys(actions ?? {}))
            .flat();
        const previousReportActionsIDs = Object.values(previousReportActions ?? {})
            .map((actions) => Object.keys(actions ?? {}))
            .flat();
        // Only proceed if we have previous data to compare against
        // This prevents triggering on initial data load
        if (previousTransactionsIDs.length === 0 && previousReportActionsIDs.length === 0) {
            return;
        }
        const previousTransactionsIDsSet = new Set(previousTransactionsIDs);
        const previousReportActionsIDsSet = new Set(previousReportActionsIDs);
        const hasTransactionsIDsChange = transactionsIDs.length !== previousTransactionsIDs.length || transactionsIDs.some((id) => !previousTransactionsIDsSet.has(id));
        const hasReportActionsIDsChange = reportActionsIDs.some((id) => !previousReportActionsIDsSet.has(id));
        // Check if there is a change in the transactions or report actions list
        if ((!isChat && hasTransactionsIDsChange) || hasReportActionsIDsChange || hasPendingSearchRef.current) {
            // If we're not focused or offline, don't trigger search
            if (!isFocused || isOffline) {
                hasPendingSearchRef.current = true;
                return;
            }
            hasPendingSearchRef.current = false;
            const newIDs = isChat ? reportActionsIDs : transactionsIDs;
            const existingSearchResultIDsSet = new Set(existingSearchResultIDs);
            const hasAGenuinelyNewID = newIDs.some((id) => !existingSearchResultIDsSet.has(id));
            // Only skip search if there are no new items AND search results aren't empty
            // This ensures deletions that result in empty data still trigger search
            if (!hasAGenuinelyNewID && existingSearchResultIDs.length > 0) {
                const newIDsSet = new Set(newIDs);
                const hasDeletedID = existingSearchResultIDs.some((id) => !newIDsSet.has(id));
                if (!hasDeletedID) {
                    return;
                }
            }
            // We only want to highlight new items if the addition of transactions or report actions triggered the search.
            // This is because, on deletion of items, the backend sometimes returns old items in place of the deleted ones.
            // We don't want to highlight these old items, even if they appear new in the current search results.
            hasNewItemsRef.current = isChat ? reportActionsIDs.length > previousReportActionsIDs.length : transactionsIDs.length > previousTransactionsIDs.length;
            // Set the flag indicating the search is triggered by the hook
            triggeredByHookRef.current = true;
            // Trigger the search
            react_native_1.InteractionManager.runAfterInteractions(() => {
                (0, Search_1.search)({ queryJSON, searchKey, offset, shouldCalculateTotals });
            });
            // Set the ref to prevent further triggers until reset
            searchTriggeredRef.current = true;
        }
    }, [
        isFocused,
        transactions,
        previousTransactions,
        queryJSON,
        searchKey,
        offset,
        shouldCalculateTotals,
        reportActions,
        previousReportActions,
        isChat,
        searchResults?.data,
        existingSearchResultIDs,
        isOffline,
    ]);
    // Initialize the set with existing IDs only once
    (0, react_1.useEffect)(() => {
        if (initializedRef.current || !searchResults?.data) {
            return;
        }
        highlightedIDs.current = new Set(existingSearchResultIDs);
        initializedRef.current = true;
    }, [searchResults?.data, isChat, existingSearchResultIDs]);
    // Detect new items (transactions or report actions)
    (0, react_1.useEffect)(() => {
        if (!previousSearchResults || !searchResults?.data) {
            return;
        }
        if (isChat) {
            const previousReportActionIDs = extractReportActionIDsFromSearchResults(previousSearchResults);
            const currentReportActionIDs = extractReportActionIDsFromSearchResults(searchResults.data);
            // Find new report action IDs that are not in the previousReportActionIDs and not already highlighted
            const newReportActionIDs = currentReportActionIDs.filter((id) => !previousReportActionIDs.includes(id) && !highlightedIDs.current.has(id));
            if (!triggeredByHookRef.current || newReportActionIDs.length === 0 || !hasNewItemsRef.current) {
                return;
            }
            const newReportActionID = newReportActionIDs.at(0) ?? '';
            const newReportActionKey = `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${newReportActionID}`;
            setNewSearchResultKey(newReportActionKey);
            highlightedIDs.current.add(newReportActionID);
        }
        else {
            const previousTransactionIDs = extractTransactionIDsFromSearchResults(previousSearchResults);
            const currentTransactionIDs = extractTransactionIDsFromSearchResults(searchResults.data);
            // Find new transaction IDs that are not in the previousTransactionIDs and not already highlighted
            const newTransactionIDs = currentTransactionIDs.filter((id) => !previousTransactionIDs.includes(id) && !highlightedIDs.current.has(id));
            if (!triggeredByHookRef.current || newTransactionIDs.length === 0 || !hasNewItemsRef.current) {
                return;
            }
            const newTransactionID = newTransactionIDs.at(0) ?? '';
            const newTransactionKey = `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${newTransactionID}`;
            setNewSearchResultKey(newTransactionKey);
            highlightedIDs.current.add(newTransactionID);
        }
    }, [searchResults?.data, previousSearchResults, isChat]);
    // Reset newSearchResultKey after it's been used
    (0, react_1.useEffect)(() => {
        if (newSearchResultKey === null) {
            return;
        }
        const timer = setTimeout(() => {
            setNewSearchResultKey(null);
        }, CONST_1.default.ANIMATED_HIGHLIGHT_START_DURATION);
        return () => clearTimeout(timer);
    }, [newSearchResultKey]);
    /**
     * Callback to handle scrolling to the new search result.
     */
    const handleSelectionListScroll = (0, react_1.useCallback)((data, ref) => {
        // Early return if there's no ref, new transaction wasn't brought in by this hook
        // or there's no new search result key
        if (!ref || !triggeredByHookRef.current || newSearchResultKey === null) {
            return;
        }
        // Extract the transaction/report action ID from the newSearchResultKey
        const newID = newSearchResultKey.replace(isChat ? ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS : ONYXKEYS_1.default.COLLECTION.TRANSACTION, '');
        // Find the index of the new transaction/report action in the data array
        const indexOfNewItem = data.findIndex((item) => {
            if (isChat) {
                if ('reportActionID' in item && item.reportActionID === newID) {
                    return true;
                }
            }
            else {
                // Handle TransactionListItemType
                if ('transactionID' in item && item.transactionID === newID) {
                    return true;
                }
                // Handle TransactionGroupListItemType with transactions array
                if ('transactions' in item && Array.isArray(item.transactions)) {
                    return item.transactions.some((transaction) => transaction?.transactionID === newID);
                }
            }
            return false;
        });
        // Early return if the new item is not found in the data array
        if (indexOfNewItem <= 0) {
            return;
        }
        // Perform the scrolling action
        ref.scrollToIndex(indexOfNewItem);
        // Reset the trigger flag to prevent unintended future scrolls and highlights
        triggeredByHookRef.current = false;
    }, [newSearchResultKey, isChat]);
    return { newSearchResultKey, handleSelectionListScroll };
}
/**
 * Helper function to extract transaction IDs from search results data.
 */
function extractTransactionIDsFromSearchResults(searchResultsData) {
    const transactionIDs = [];
    Object.values(searchResultsData).forEach((item) => {
        // Check for transactionID directly on the item (TransactionListItemType)
        if (item?.transactionID) {
            transactionIDs.push(item.transactionID);
        }
        // Check for transactions array within the item (TransactionGroupListItemType)
        if (Array.isArray(item?.transactions)) {
            item.transactions.forEach((transaction) => {
                if (!transaction?.transactionID) {
                    return;
                }
                transactionIDs.push(transaction.transactionID);
            });
        }
    });
    return transactionIDs;
}
/**
 * Helper function to extract report action IDs from search results data.
 */
function extractReportActionIDsFromSearchResults(searchResultsData) {
    return Object.keys(searchResultsData ?? {})
        .filter(SearchUIUtils_1.isReportActionEntry)
        .map((key) => Object.keys(searchResultsData[key] ?? {}))
        .flat();
}
exports.default = useSearchHighlightAndScroll;
