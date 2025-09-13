"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BrowserNotifications_1 = require("./BrowserNotifications");
function showCommentNotification(report, reportAction, onClick) {
    BrowserNotifications_1.default.pushReportCommentNotification(report, reportAction, onClick, true);
}
function showUpdateAvailableNotification() {
    BrowserNotifications_1.default.pushUpdateAvailableNotification();
}
function showModifiedExpenseNotification(_a) {
    var report = _a.report, reportAction = _a.reportAction, movedFromReport = _a.movedFromReport, movedToReport = _a.movedToReport, onClick = _a.onClick;
    BrowserNotifications_1.default.pushModifiedExpenseNotification({ report: report, reportAction: reportAction, movedFromReport: movedFromReport, movedToReport: movedToReport, onClick: onClick, usesIcon: true });
}
function clearReportNotifications(reportID) {
    if (!reportID) {
        return;
    }
    BrowserNotifications_1.default.clearNotifications(function (notificationData) { return notificationData.reportID === reportID; });
}
var LocalNotification = {
    showCommentNotification: showCommentNotification,
    showUpdateAvailableNotification: showUpdateAvailableNotification,
    showModifiedExpenseNotification: showModifiedExpenseNotification,
    clearReportNotifications: clearReportNotifications,
};
exports.default = LocalNotification;
