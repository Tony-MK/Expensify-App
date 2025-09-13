"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = markAllPolicyReportsAsRead;
const react_native_onyx_1 = require("react-native-onyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Report_1 = require("./actions/Report");
const ReportActionsUtils_1 = require("./ReportActionsUtils");
const ReportUtils_1 = require("./ReportUtils");
let allReports = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT,
    waitForCollectionCallback: true,
    callback: (value) => {
        allReports = value;
    },
});
let allReportActions = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
    waitForCollectionCallback: true,
    callback: (value) => {
        allReportActions = value;
    },
});
function markAllPolicyReportsAsRead(policyID) {
    let delay = 0;
    Object.keys(allReports ?? {}).forEach((key) => {
        const report = allReports?.[key];
        const chatReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.chatReportID}`];
        const oneTransactionThreadReportID = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(report, chatReport, allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report?.reportID}`]);
        const oneTransactionThreadReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${oneTransactionThreadReportID}`];
        if (report?.policyID !== policyID || !(0, ReportUtils_1.isUnread)(report, oneTransactionThreadReport)) {
            return;
        }
        setTimeout(() => {
            (0, Report_1.readNewestAction)(report?.reportID);
        }, delay);
        delay += 1000;
    });
}
