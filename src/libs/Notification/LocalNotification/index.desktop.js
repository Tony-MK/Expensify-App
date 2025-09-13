"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BrowserNotifications_1 = require("./BrowserNotifications");
function showCommentNotification(report, reportAction, onClick) {
    BrowserNotifications_1.default.pushReportCommentNotification(report, reportAction, onClick);
}
function showUpdateAvailableNotification() {
    BrowserNotifications_1.default.pushUpdateAvailableNotification();
}
function showModifiedExpenseNotification({ report, reportAction, movedFromReport, movedToReport, onClick }) {
    BrowserNotifications_1.default.pushModifiedExpenseNotification({ report, reportAction, movedFromReport, movedToReport, onClick });
}
function clearReportNotifications(reportID) {
    if (!reportID) {
        return;
    }
    BrowserNotifications_1.default.clearNotifications((notificationData) => notificationData.reportID === reportID);
}
const LocalNotification = {
    showCommentNotification,
    showUpdateAvailableNotification,
    showModifiedExpenseNotification,
    clearReportNotifications,
};
exports.default = LocalNotification;
