"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_airship_1 = require("@ua/react-native-airship");
const Log_1 = require("@libs/Log");
const parsePushNotificationPayload_1 = require("@libs/Notification/PushNotification/parsePushNotificationPayload");
const CONST_1 = require("@src/CONST");
const parseNotificationAndReportIDs = (pushPayload) => {
    const data = (0, parsePushNotificationPayload_1.default)(pushPayload.extras.payload);
    return {
        notificationID: pushPayload.notificationId,
        reportID: data?.reportID !== undefined ? String(data.reportID) : undefined,
    };
};
const clearReportNotifications = (reportID) => {
    Log_1.default.info('[PushNotification] clearing report notifications', false, { reportID });
    if (!reportID) {
        return;
    }
    react_native_airship_1.default.push
        .getActiveNotifications()
        .then((pushPayloads) => {
        const reportNotificationIDs = pushPayloads.reduce((notificationIDs, pushPayload) => {
            const notification = parseNotificationAndReportIDs(pushPayload);
            if (notification.notificationID && notification.reportID === reportID) {
                notificationIDs.push(notification.notificationID);
            }
            return notificationIDs;
        }, []);
        Log_1.default.info(`[PushNotification] found ${reportNotificationIDs.length} notifications to clear`, false, { reportID });
        reportNotificationIDs.forEach((notificationID) => react_native_airship_1.default.push.clearNotification(notificationID));
    })
        .catch((error) => {
        Log_1.default.alert(`${CONST_1.default.ERROR.ENSURE_BUG_BOT} [PushNotification] BrowserNotifications.clearReportNotifications threw an error. This should never happen.`, { reportID, error });
    });
};
exports.default = clearReportNotifications;
