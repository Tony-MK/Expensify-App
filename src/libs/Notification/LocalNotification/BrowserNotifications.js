"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Web and desktop implementation only. Do not import for direct use. Use LocalNotification.
const expensify_common_1 = require("expensify-common");
const expensify_logo_round_clearspace_png_1 = require("@assets/images/expensify-logo-round-clearspace.png");
const AppUpdate = require("@libs/actions/AppUpdate");
const ModifiedExpenseMessage_1 = require("@libs/ModifiedExpenseMessage");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils = require("@libs/ReportUtils");
const Sound_1 = require("@libs/Sound");
const focusApp_1 = require("./focusApp");
const notificationCache = {};
/**
 * Checks if the user has granted permission to show browser notifications
 */
function canUseBrowserNotifications() {
    return new Promise((resolve) => {
        // They have no browser notifications so we can't use this feature
        if (!window.Notification) {
            resolve(false);
            return;
        }
        // Check if they previously granted or denied us access to send a notification
        const permissionGranted = Notification.permission === 'granted';
        if (permissionGranted || Notification.permission === 'denied') {
            resolve(permissionGranted);
            return;
        }
        // Check their global preferences for browser notifications and ask permission if they have none
        Notification.requestPermission().then((status) => {
            resolve(status === 'granted');
        });
    });
}
/**
 * Light abstraction around browser push notifications.
 * Checks for permission before determining whether to send.
 *
 * @param icon Path to icon
 * @param data extra data to attach to the notification
 */
function push(title, body = '', icon = '', data = {}, onClick = () => { }, silent = false, tag = '') {
    canUseBrowserNotifications().then((canUseNotifications) => {
        if (!canUseNotifications) {
            return;
        }
        // We cache these notifications so that we can clear them later
        const notificationID = expensify_common_1.Str.guid();
        notificationCache[notificationID] = new Notification(title, {
            body,
            icon: String(icon),
            data,
            silent: true,
            tag,
        });
        if (!silent) {
            (0, Sound_1.default)(Sound_1.SOUNDS.RECEIVE);
        }
        notificationCache[notificationID].onclick = () => {
            onClick();
            window.parent.focus();
            window.focus();
            (0, focusApp_1.default)();
            notificationCache[notificationID].close();
        };
        notificationCache[notificationID].onclose = () => {
            delete notificationCache[notificationID];
        };
    });
}
/**
 * BrowserNotification
 * @namespace
 */
exports.default = {
    /**
     * Create a report comment notification
     *
     * @param usesIcon true if notification uses right circular icon
     */
    pushReportCommentNotification(report, reportAction, onClick, usesIcon = false) {
        let title;
        let body;
        const icon = usesIcon ? expensify_logo_round_clearspace_png_1.default : '';
        const isRoomOrGroupChat = ReportUtils.isChatRoom(report) || ReportUtils.isPolicyExpenseChat(report) || ReportUtils.isGroupChat(report);
        const { person, message } = reportAction;
        const plainTextPerson = person?.map((f) => expensify_common_1.Str.removeSMSDomain(f.text ?? '')).join() ?? '';
        // Specifically target the comment part of the message
        let plainTextMessage = '';
        if (Array.isArray(message)) {
            plainTextMessage = (0, ReportActionsUtils_1.getTextFromHtml)(message?.find((f) => f?.type === 'COMMENT')?.html);
        }
        else {
            plainTextMessage = message?.type === 'COMMENT' ? (0, ReportActionsUtils_1.getTextFromHtml)(message?.html) : '';
        }
        if (isRoomOrGroupChat) {
            const roomName = ReportUtils.getReportName(report);
            title = roomName;
            body = `${plainTextPerson}: ${plainTextMessage}`;
        }
        else {
            title = plainTextPerson;
            body = plainTextMessage;
        }
        const data = {
            reportID: report.reportID,
        };
        push(title, body, icon, data, onClick);
    },
    pushModifiedExpenseNotification({ report, reportAction, movedFromReport, movedToReport, onClick, usesIcon = false }) {
        const title = reportAction.person?.map((f) => f.text).join(', ') ?? '';
        const body = (0, ModifiedExpenseMessage_1.getForReportAction)({
            reportAction,
            policyID: report.policyID,
            movedFromReport,
            movedToReport,
        });
        const icon = usesIcon ? expensify_logo_round_clearspace_png_1.default : '';
        const data = {
            reportID: report.reportID,
        };
        push(title, body, icon, data, onClick);
    },
    /**
     * Create a notification to indicate that an update is available.
     */
    pushUpdateAvailableNotification() {
        push('Update available', 'A new version of this app is available!', '', {}, () => {
            AppUpdate.triggerUpdateAvailable();
        }, false, 'UpdateAvailable');
    },
    /**
     * Clears all open notifications where shouldClearNotification returns true
     *
     * @param shouldClearNotification a function that receives notification.data and returns true/false if the notification should be cleared
     */
    clearNotifications(shouldClearNotification) {
        Object.values(notificationCache)
            .filter((notification) => shouldClearNotification(notification.data))
            .forEach((notification) => notification.close());
    },
};
