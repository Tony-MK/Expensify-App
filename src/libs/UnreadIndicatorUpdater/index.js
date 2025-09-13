"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerUnreadUpdate = void 0;
exports.getUnreadReportsForUnreadIndicator = getUnreadReportsForUnreadIndicator;
const debounce_1 = require("lodash/debounce");
const react_native_onyx_1 = require("react-native-onyx");
const memoize_1 = require("@libs/memoize");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils = require("@libs/ReportUtils");
const Navigation_1 = require("@navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const updateUnread_1 = require("./updateUnread");
let allReports = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT,
    waitForCollectionCallback: true,
    callback: (value) => {
        allReports = value;
    },
});
let allReportNameValuePairs = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS,
    waitForCollectionCallback: true,
    callback: (value) => {
        allReportNameValuePairs = value;
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
function getUnreadReportsForUnreadIndicator(reports, currentReportID) {
    return Object.values(reports ?? {}).filter((report) => {
        const notificationPreference = ReportUtils.getReportNotificationPreference(report);
        const chatReport = reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.chatReportID}`];
        const oneTransactionThreadReportID = (0, ReportActionsUtils_1.getOneTransactionThreadReportID)(report, chatReport, allReportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report?.reportID}`]);
        const oneTransactionThreadReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${oneTransactionThreadReportID}`];
        const nameValuePairs = allReportNameValuePairs?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report?.reportID}`];
        const isReportArchived = ReportUtils.isArchivedReport(nameValuePairs);
        return (ReportUtils.isUnread(report, oneTransactionThreadReport, isReportArchived) &&
            ReportUtils.shouldReportBeInOptionList({
                report,
                chatReport,
                currentReportId: currentReportID,
                betas: [],
                doesReportHaveViolations: false,
                isInFocusMode: false,
                excludeEmptyChats: false,
                isReportArchived,
            }) &&
            /**
             * Chats with hidden preference remain invisible in the LHN and are not considered "unread."
             * They are excluded from the LHN rendering, but not filtered from the "option list."
             * This ensures they appear in Search, but not in the LHN or unread count.
             *
             * Furthermore, muted reports may or may not appear in the LHN depending on priority mode,
             * but they should not be considered in the unread indicator count.
             */
            !ReportUtils.isHiddenForCurrentUser(notificationPreference) &&
            notificationPreference !== CONST_1.default.REPORT.NOTIFICATION_PREFERENCE.MUTE);
    });
}
const memoizedGetUnreadReportsForUnreadIndicator = (0, memoize_1.default)(getUnreadReportsForUnreadIndicator, { maxArgs: 1 });
const triggerUnreadUpdate = (0, debounce_1.default)(() => {
    const currentReportID = Navigation_1.navigationRef?.isReady?.() ? Navigation_1.default.getTopmostReportId() : undefined;
    // We want to keep notification count consistent with what can be accessed from the LHN list
    const unreadReports = memoizedGetUnreadReportsForUnreadIndicator(allReports, currentReportID);
    (0, updateUnread_1.default)(unreadReports.length);
}, CONST_1.default.TIMING.UNREAD_UPDATE_DEBOUNCE_TIME);
exports.triggerUnreadUpdate = triggerUnreadUpdate;
Navigation_1.navigationRef?.addListener?.('state', () => {
    triggerUnreadUpdate();
});
