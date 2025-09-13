"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const useOnyx_1 = require("@hooks/useOnyx");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
/**
 * Custom hook to retrieve all ancestor reports and their associated report actions for a given reportID.
 * It traverses up the report hierarchy using parentReportID and parentReportActionID.
 *
 * @param reportID - The ID of the report for which to fetch ancestor reports and actions.
 * @param includeTransactionThreads - Whether to include transaction threads.
 */
function useAncestorReportsAndReportActions(reportID, includeTransactionThreads = false) {
    const [ancestorReports] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, {
        canBeMissing: false,
        selector: (allReports) => {
            const reports = {};
            let currentReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
            while (currentReport) {
                reports[`${ONYXKEYS_1.default.COLLECTION.REPORT}${currentReport.reportID}`] = currentReport;
                currentReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${currentReport.parentReportID}`];
            }
            return reports;
        },
    });
    const [ancestorReportsAndReportActions] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, {
        canBeMissing: false,
        selector: (allReportActions) => {
            const reportsAndReportActions = [];
            let { parentReportID, parentReportActionID } = ancestorReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`] ?? { parentReportID: undefined, parentReportActionID: undefined };
            while (parentReportID) {
                const parentReport = ancestorReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${parentReportID}`];
                const parentReportAction = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${parentReportID}`]?.[`${parentReportActionID}`];
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
    });
    return { report: ancestorReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`], ancestorReportsAndReportActions: ancestorReportsAndReportActions ?? [] };
}
exports.default = useAncestorReportsAndReportActions;
