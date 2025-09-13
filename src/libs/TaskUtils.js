"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isActiveTaskEditRoute = isActiveTaskEditRoute;
exports.getTaskReportActionMessage = getTaskReportActionMessage;
exports.getTaskTitle = getTaskTitle;
exports.getTaskTitleFromReport = getTaskTitleFromReport;
exports.getTaskCreatedMessage = getTaskCreatedMessage;
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const Localize_1 = require("./Localize");
const Navigation_1 = require("./Navigation/Navigation");
const Parser_1 = require("./Parser");
const ReportActionsUtils_1 = require("./ReportActionsUtils");
let allReports = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT,
    waitForCollectionCallback: true,
    callback: (value) => {
        allReports = value;
    },
});
/**
 * Check if the active route belongs to task edit flow.
 */
function isActiveTaskEditRoute(reportID) {
    if (!reportID) {
        return false;
    }
    return [ROUTES_1.default.TASK_TITLE, ROUTES_1.default.TASK_ASSIGNEE, ROUTES_1.default.REPORT_DESCRIPTION].map((route) => route.getRoute(reportID)).some(Navigation_1.default.isActiveRoute);
}
/**
 * Given the Task reportAction name, return the appropriate message to be displayed and copied to clipboard.
 */
function getTaskReportActionMessage(action) {
    switch (action?.actionName) {
        case CONST_1.default.REPORT.ACTIONS.TYPE.TASK_COMPLETED:
            return { text: (0, Localize_1.translateLocal)('task.messages.completed') };
        case CONST_1.default.REPORT.ACTIONS.TYPE.TASK_CANCELLED:
            return { text: (0, Localize_1.translateLocal)('task.messages.canceled') };
        case CONST_1.default.REPORT.ACTIONS.TYPE.TASK_REOPENED:
            return { text: (0, Localize_1.translateLocal)('task.messages.reopened') };
        case CONST_1.default.REPORT.ACTIONS.TYPE.TASK_EDITED:
            return {
                text: (0, ReportActionsUtils_1.getReportActionText)(action),
                html: (0, ReportActionsUtils_1.getReportActionHtml)(action),
            };
        default:
            return { text: (0, Localize_1.translateLocal)('task.task') };
    }
}
function getTaskTitleFromReport(taskReport, fallbackTitle = '', shouldReturnMarkdown = false) {
    // We need to check for reportID, not just reportName, because when a receiver opens the task for the first time,
    // an optimistic report is created with the only property - reportName: 'Chat report',
    // and it will be displayed as the task title without checking for reportID to be present.
    const title = taskReport?.reportID && taskReport.reportName ? taskReport.reportName : fallbackTitle;
    return shouldReturnMarkdown ? Parser_1.default.htmlToMarkdown(title) : Parser_1.default.htmlToText(title).trim();
}
function getTaskTitle(taskReportID, fallbackTitle = '', shouldReturnMarkdown = false) {
    const taskReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${taskReportID}`];
    return getTaskTitleFromReport(taskReport, fallbackTitle, shouldReturnMarkdown);
}
function getTaskCreatedMessage(reportAction, shouldReturnMarkdown = false) {
    const taskReportID = reportAction?.childReportID;
    const taskTitle = getTaskTitle(taskReportID, reportAction?.childReportName, shouldReturnMarkdown);
    return taskTitle ? (0, Localize_1.translateLocal)('task.messages.created', { title: taskTitle }) : '';
}
