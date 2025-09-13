"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = shouldShowPushNotification;
const Log_1 = require("@libs/Log");
const ReportActionUtils = require("@libs/ReportActionsUtils");
const Report = require("@userActions/Report");
const parsePushNotificationPayload_1 = require("./parsePushNotificationPayload");
/**
 * Returns whether the given Airship notification should be shown depending on the current state of the app
 */
function shouldShowPushNotification(pushPayload) {
    Log_1.default.info('[PushNotification] push notification received', false, { pushPayload });
    const data = (0, parsePushNotificationPayload_1.default)(pushPayload.extras.payload);
    if (!data) {
        return true;
    }
    let shouldShow = false;
    if (data.type === 'transaction') {
        shouldShow = true;
    }
    else {
        const reportAction = ReportActionUtils.getLatestReportActionFromOnyxData(data.onyxData ?? null);
        shouldShow = Report.shouldShowReportActionNotification(String(data.reportID), reportAction, true);
    }
    Log_1.default.info(`[PushNotification] ${shouldShow ? 'Showing' : 'Not showing'} notification`);
    return shouldShow;
}
