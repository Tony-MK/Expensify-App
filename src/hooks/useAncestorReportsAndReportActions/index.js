"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var useOnyx_1 = require("@hooks/useOnyx");
var ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
/**
 * Custom hook to retrieve all ancestor reports and their associated report actions for a given reportID.
 * It traverses up the report hierarchy using parentReportID and parentReportActionID.
 *
 * @param reportID - The ID of the report for which to fetch ancestor reports and actions.
 * @param includeTransactionThreads - Whether to include transaction threads.
 */
function useAncestorReportsAndReportActions(reportID, includeTransactionThreads) {
    if (includeTransactionThreads === void 0) { includeTransactionThreads = false; }
    var ancestorReports = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, {
        canBeMissing: false,
        selector: function (allReports) {
            var reports = {};
            var currentReport = allReports === null || allReports === void 0 ? void 0 : allReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID)];
            while (currentReport) {
                reports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(currentReport.reportID)] = currentReport;
                currentReport = allReports === null || allReports === void 0 ? void 0 : allReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(currentReport.parentReportID)];
            }
            return reports;
        },
    })[0];
    var ancestorReportsAndReportActions = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, {
        canBeMissing: false,
        selector: function (allReportActions) {
            var _a, _b;
            var reportsAndReportActions = [];
            var _c = (_a = ancestorReports === null || ancestorReports === void 0 ? void 0 : ancestorReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID)]) !== null && _a !== void 0 ? _a : { parentReportID: undefined, parentReportActionID: undefined }, parentReportID = _c.parentReportID, parentReportActionID = _c.parentReportActionID;
            while (parentReportID) {
                var parentReport = ancestorReports === null || ancestorReports === void 0 ? void 0 : ancestorReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(parentReportID)];
                var parentReportAction = (_b = allReportActions === null || allReportActions === void 0 ? void 0 : allReportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(parentReportID)]) === null || _b === void 0 ? void 0 : _b["".concat(parentReportActionID)];
                if (!parentReport ||
                    !parentReportAction ||
                    // We exclude ancestor reports when their parent's ReportAction is a transaction-thread action,
                    // except for sent-money and report-preview actions. ReportActionsListItemRenderer does not render
                    // the ReportActionItemParentAction when the parent (first) action is a transaction-thread (unless it's a sent-money action)
                    // or a report-preview action, so we skip those ancestors to match the renderer's behavior.
                    (!includeTransactionThreads &&
                        (((0, ReportActionsUtils_1.isTransactionThread)(parentReportAction) && !(0, ReportActionsUtils_1.isSentMoneyReportAction)(parentReportAction)) || (0, ReportActionsUtils_1.isReportPreviewAction)(parentReportAction)))) {
                    break;
                }
                // `unshift` to maintain the order from the top-most ancestor down to the immediate parent.
                reportsAndReportActions.unshift({ report: parentReport, reportAction: parentReportAction });
                /*
                As we traverse up the report hierarchy, we need to reassign `parentReportActionID`
                to the parent's own `parentReportActionID`.
                
                Otherwise, the same report action will be pushed repeatedly, causing
                `ancestorReportsAndReportActions` to contain malformed data.

                Example of malformed data:
                Report 3 -> parentReportID = "r_2", parentReportActionID = "a_1"
                Report 2 -> parentReportID = "r_1", parentReportActionID = "a_1"
                Report 1 -> parentReportID = null,  parentReportActionID = "a_1"

                Resulting `ancestorReportsAndReportActions`:
                [
                    {"r_1": "a_1"},
                    {"r_2": "a_1"},
                    {"r_3": "a_1"},
                ]

                Where:
                    - "r_1" is the Report with reportID = "r_1"
                    - "a_1" is the ReportAction with reportActionID = "a_1"

                Problem:
                    - Every ancestor report is paired with the same report action (e.g., "a_1").
                    - The ancestor's report action does not reflect the true report-to-action relationship.

                Expected behavior:
                    - Each ancestor report should be paired with its own corresponding `parentReportActionID`.
                    - Ensure `ancestorReportsAndReportActions` reflects the true report-to-action relationships.
                */
                parentReportActionID = parentReport.parentReportActionID;
                // Without reassigning `parentReportID` to the parent's own `parentReportID`, the loop keeps checking the same valid `parentReportID`,
                // causing an infinite loop and fails to traverses up the report hierarchy.
                parentReportID = parentReport.parentReportID;
            }
            return reportsAndReportActions;
        },
    })[0];
    return { report: ancestorReports === null || ancestorReports === void 0 ? void 0 : ancestorReports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID)], ancestorReportsAndReportActions: ancestorReportsAndReportActions !== null && ancestorReportsAndReportActions !== void 0 ? ancestorReportsAndReportActions : [] };
}
exports.default = useAncestorReportsAndReportActions;
