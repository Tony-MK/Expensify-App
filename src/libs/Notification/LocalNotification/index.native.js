"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Local Notifications are not currently supported on mobile so we'll just no-op here.
const LocalNotification = {
    showCommentNotification: () => { },
    showUpdateAvailableNotification: () => { },
    showModifiedExpenseNotification: () => { },
    clearReportNotifications: () => { },
};
exports.default = LocalNotification;
