"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAllRelatedReportActionErrors = clearAllRelatedReportActionErrors;
const react_native_onyx_1 = require("react-native-onyx");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Report_1 = require("./Report");
let allReportActions;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
    waitForCollectionCallback: true,
    callback: (value) => (allReportActions = value),
});
let allReports;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT,
    waitForCollectionCallback: true,
    callback: (value) => {
        allReports = value;
    },
});
function clearReportActionErrors(reportID, reportAction, keys) {
    const originalReportID = (0, ReportUtils_1.getOriginalReportID)(reportID, reportAction);
    if (!reportAction?.reportActionID) {
        return;
    }
    if (reportAction.pendingAction === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD || reportAction.isOptimisticAction) {
        // Delete the optimistic action
        react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${originalReportID}`, {
            [reportAction.reportActionID]: null,
        });
        // If there's a linked transaction, delete that too
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const linkedTransactionID = (0, ReportActionsUtils_1.getLinkedTransactionID)(reportAction.reportActionID, originalReportID);
        if (linkedTransactionID) {
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${linkedTransactionID}`, null);
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportAction.childReportID}`, null);
        }
        // Delete the failed task report too
        const taskReportID = (0, ReportActionsUtils_1.getReportActionMessage)(reportAction)?.taskReportID;
        if (taskReportID && (0, ReportActionsUtils_1.isCreatedTaskReportAction)(reportAction)) {
            (0, Report_1.deleteReport)(taskReportID);
        }
        return;
    }
    if (keys) {
        const errors = {};
        keys.forEach((key) => {
            errors[key] = null;
        });
        react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${originalReportID}`, {
            [reportAction.reportActionID]: {
                errors,
            },
        });
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${originalReportID}`, {
        [reportAction.reportActionID]: {
            errors: null,
        },
    });
}
/**
 *
ignore: `undefined` means we want to check both parent and children report actions
ignore: `parent` or `child` means we want to ignore checking parent or child report actions because they've been previously checked
 */
function clearAllRelatedReportActionErrors(reportID, reportAction, ignore, keys) {
    const errorKeys = keys ?? Object.keys(reportAction?.errors ?? {});
    if (!reportAction || errorKeys.length === 0 || !reportID) {
        return;
    }
    clearReportActionErrors(reportID, reportAction, keys);
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    if (report?.parentReportID && report?.parentReportActionID && ignore !== 'parent') {
        const parentReportAction = (0, ReportActionsUtils_1.getReportAction)(report.parentReportID, report.parentReportActionID);
        const parentErrorKeys = Object.keys(parentReportAction?.errors ?? {}).filter((err) => errorKeys.includes(err));
        clearAllRelatedReportActionErrors(report.parentReportID, parentReportAction, 'child', parentErrorKeys);
    }
    if (reportAction.childReportID && ignore !== 'child') {
        const childActions = allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${reportAction.childReportID}`] ?? {};
        Object.values(childActions).forEach((action) => {
            const childErrorKeys = Object.keys(action.errors ?? {}).filter((err) => errorKeys.includes(err));
            clearAllRelatedReportActionErrors(reportAction.childReportID, action, 'parent', childErrorKeys);
        });
    }
}
