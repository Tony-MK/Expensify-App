"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const useNetwork_1 = require("./useNetwork");
/**
 * Provides reusable logic to get the functions for loading older/newer reportActions.
 * Used in the report displaying components
 */
function useLoadReportActions({ reportID, reportActionID, reportActions, allReportActionIDs, transactionThreadReport, hasOlderActions, hasNewerActions }) {
    const didLoadOlderChats = (0, react_1.useRef)(false);
    const didLoadNewerChats = (0, react_1.useRef)(false);
    const { isOffline } = (0, useNetwork_1.default)();
    const isFocused = (0, native_1.useIsFocused)();
    const newestReportAction = (0, react_1.useMemo)(() => reportActions?.at(0), [reportActions]);
    const oldestReportAction = (0, react_1.useMemo)(() => reportActions?.at(-1), [reportActions]);
    // Track oldest/newest actions per report in a single pass
    const { currentReportOldest, currentReportNewest, transactionThreadOldest, transactionThreadNewest } = (0, react_1.useMemo)(() => {
        let currentReportNewestAction = null;
        let currentReportOldestAction = null;
        let transactionThreadNewestAction = null;
        let transactionThreadOldestAction = null;
        const allReportActionIDsSet = new Set(allReportActionIDs);
        for (const action of reportActions) {
            // Determine which report this action belongs to
            const isCurrentReport = allReportActionIDsSet.has(action.reportActionID);
            const targetReportID = isCurrentReport ? reportID : transactionThreadReport?.reportID;
            // Track newest/oldest per report
            if (targetReportID === reportID) {
                // Newest = first matching action we encounter
                if (!currentReportNewestAction) {
                    currentReportNewestAction = action;
                }
                // Oldest = last matching action we encounter
                currentReportOldestAction = action;
            }
            else if (!(0, EmptyObject_1.isEmptyObject)(transactionThreadReport) && transactionThreadReport?.reportID === targetReportID) {
                // Same logic for transaction thread
                if (!transactionThreadNewestAction) {
                    transactionThreadNewestAction = action;
                }
                transactionThreadOldestAction = action;
            }
        }
        return {
            currentReportOldest: currentReportOldestAction,
            currentReportNewest: currentReportNewestAction,
            transactionThreadOldest: transactionThreadOldestAction,
            transactionThreadNewest: transactionThreadNewestAction,
        };
    }, [reportActions, allReportActionIDs, reportID, transactionThreadReport]);
    /**
     * Retrieves the next set of reportActions for the chat once we are nearing the end of what we are currently
     * displaying.
     */
    const loadOlderChats = (0, react_1.useCallback)((force = false) => {
        // Only fetch more if we are neither already fetching (so that we don't initiate duplicate requests) nor offline.
        if (!force && isOffline) {
            return;
        }
        // Don't load more reportActions if we're already at the beginning of the chat history
        if (!oldestReportAction || !hasOlderActions) {
            return;
        }
        didLoadOlderChats.current = true;
        if (!(0, EmptyObject_1.isEmptyObject)(transactionThreadReport)) {
            (0, Report_1.getOlderActions)(reportID, currentReportOldest?.reportActionID);
            (0, Report_1.getOlderActions)(transactionThreadReport.reportID, transactionThreadOldest?.reportActionID);
        }
        else {
            (0, Report_1.getOlderActions)(reportID, currentReportOldest?.reportActionID);
        }
    }, [isOffline, oldestReportAction, hasOlderActions, transactionThreadReport, reportID, currentReportOldest?.reportActionID, transactionThreadOldest?.reportActionID]);
    const loadNewerChats = (0, react_1.useCallback)((force = false) => {
        if (!force &&
            (!reportActionID ||
                !isFocused ||
                !newestReportAction ||
                !hasNewerActions ||
                isOffline ||
                // If there was an error only try again once on initial mount. We should also still load
                // more in case we have cached messages.
                didLoadNewerChats.current ||
                newestReportAction.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE)) {
            return;
        }
        didLoadNewerChats.current = true;
        if (!(0, EmptyObject_1.isEmptyObject)(transactionThreadReport)) {
            (0, Report_1.getNewerActions)(reportID, currentReportNewest?.reportActionID);
            (0, Report_1.getNewerActions)(transactionThreadReport.reportID, transactionThreadNewest?.reportActionID);
        }
        else if (newestReportAction) {
            (0, Report_1.getNewerActions)(reportID, newestReportAction.reportActionID);
        }
    }, [
        reportActionID,
        isFocused,
        newestReportAction,
        hasNewerActions,
        isOffline,
        transactionThreadReport,
        reportID,
        currentReportNewest?.reportActionID,
        transactionThreadNewest?.reportActionID,
    ]);
    return {
        loadOlderChats,
        loadNewerChats,
    };
}
exports.default = useLoadReportActions;
