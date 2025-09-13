"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const PaginationUtils_1 = require("@libs/PaginationUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
const useReportIsArchived_1 = require("./useReportIsArchived");
/**
 * Get the longest continuous chunk of reportActions including the linked reportAction. If not linking to a specific action, returns the continuous chunk of newest reportActions.
 */
function usePaginatedReportActions(reportID, reportActionID) {
    const nonEmptyStringReportID = (0, getNonEmptyStringOnyxID_1.default)(reportID);
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${nonEmptyStringReportID}`, { canBeMissing: true });
    const isReportArchived = (0, useReportIsArchived_1.default)(report?.reportID);
    const hasWriteAccess = (0, ReportUtils_1.canUserPerformWriteAction)(report, isReportArchived);
    const [sortedAllReportActions] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${nonEmptyStringReportID}`, {
        canEvict: false,
        selector: (allReportActions) => (0, ReportActionsUtils_1.getSortedReportActionsForDisplay)(allReportActions, hasWriteAccess, true),
        canBeMissing: true,
    });
    const [reportActionPages] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS_PAGES}${nonEmptyStringReportID}`, { canBeMissing: true });
    const { data: reportActions, hasNextPage, hasPreviousPage, } = (0, react_1.useMemo)(() => {
        if (!sortedAllReportActions?.length) {
            return { data: [], hasNextPage: false, hasPreviousPage: false };
        }
        return PaginationUtils_1.default.getContinuousChain(sortedAllReportActions, reportActionPages ?? [], (reportAction) => reportAction.reportActionID, reportActionID);
    }, [reportActionID, reportActionPages, sortedAllReportActions]);
    const linkedAction = (0, react_1.useMemo)(() => (reportActionID ? sortedAllReportActions?.find((reportAction) => String(reportAction.reportActionID) === String(reportActionID)) : undefined), [reportActionID, sortedAllReportActions]);
    return {
        reportActions,
        linkedAction,
        sortedAllReportActions,
        hasOlderActions: hasNextPage,
        hasNewerActions: hasPreviousPage,
        report,
    };
}
exports.default = usePaginatedReportActions;
