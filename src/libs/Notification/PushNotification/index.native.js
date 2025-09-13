"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_airship_1 = require("@ua/react-native-airship");
const Log_1 = require("@libs/Log");
const ShortcutManager_1 = require("@libs/ShortcutManager");
const CONFIG_1 = require("@src/CONFIG");
const ForegroundNotifications_1 = require("./ForegroundNotifications");
const NotificationType_1 = require("./NotificationType");
const parsePushNotificationPayload_1 = require("./parsePushNotificationPayload");
const notificationEventActionMap = {};
/**
 * Handle a push notification event, and trigger and bound actions.
 */
function pushNotificationEventCallback(eventType, notification) {
    const actionMap = notificationEventActionMap[eventType] ?? {};
    const data = (0, parsePushNotificationPayload_1.default)(notification.extras.payload);
    Log_1.default.info(`[PushNotification] Callback triggered for ${eventType}`);
    if (!data) {
        Log_1.default.warn('[PushNotification] Notification has null or undefined payload, not executing any callback.');
        return;
    }
    if (!data.type) {
        Log_1.default.warn('[PushNotification] No type value provided in payload, not executing any callback.');
        return;
    }
    const action = actionMap[data.type];
    if (!action) {
        Log_1.default.warn('[PushNotification] No callback set up: ', {
            event: eventType,
            notificationType: data.type,
        });
        return;
    }
    /**
     * The action callback should return a promise. It's very important we return that promise so that
     * when these callbacks are run in Android's background process (via Headless JS), the process waits
     * for the promise to resolve before quitting
     */
    return action(data);
}
/**
 * Configure push notifications and register callbacks. This is separate from namedUser registration because it needs to be executed
 * from a headless JS process, outside of any react lifecycle.
 *
 * WARNING: Moving or changing this code could break Push Notification processing in non-obvious ways.
 *          DO NOT ALTER UNLESS YOU KNOW WHAT YOU'RE DOING. See this PR for details: https://github.com/Expensify/App/pull/3877
 */
const init = () => {
    // Setup event listeners
    react_native_airship_1.default.addListener(react_native_airship_1.EventType.PushReceived, (notification) => pushNotificationEventCallback(react_native_airship_1.EventType.PushReceived, notification.pushPayload));
    // Note: the NotificationResponse event has a nested PushReceived event,
    // so event.notification refers to the same thing as notification above ^
    react_native_airship_1.default.addListener(react_native_airship_1.EventType.NotificationResponse, (event) => pushNotificationEventCallback(react_native_airship_1.EventType.NotificationResponse, event.pushPayload));
    ForegroundNotifications_1.default.configureForegroundNotifications();
};
/**
 * Register this device for push notifications for the given notificationID.
 */
const register = (notificationID) => {
    react_native_airship_1.default.contact
        .getNamedUserId()
        .then((userID) => {
        // In the HybridApp, the contact identity is set on the YAPL side after sign-in.
        // Since the Airship instance is shared between NewDot and OldDot,
        // NewDot users won't see the push notification permission prompt as we return early in this case.
        // Therefore, we cannot handle the HybridApp scenario here.
        if (!CONFIG_1.default.IS_HYBRID_APP && userID === notificationID.toString()) {
            // No need to register again for this notificationID.
            return;
        }
        // Get permissions to display push notifications if not determined (prompts user on iOS, but not Android)
        react_native_airship_1.default.push.getNotificationStatus().then(({ notificationPermissionStatus }) => {
            if (notificationPermissionStatus !== react_native_airship_1.PermissionStatus.NotDetermined) {
                return;
            }
            react_native_airship_1.default.push.enableUserNotifications().then((isEnabled) => {
                if (isEnabled) {
                    return;
                }
                Log_1.default.info('[PushNotification] User has disabled visible push notifications for this app.');
            });
        });
        // Register this device as a named user in AirshipAPI.
        // Regardless of the user's opt-in status, we still want to receive silent push notifications.
        Log_1.default.info(`[PushNotification] Subscribing to notifications`);
        react_native_airship_1.default.contact.identify(notificationID.toString());
    })
        .catch((error) => {
        Log_1.default.warn('[PushNotification] Failed to register for push notifications! Reason: ', error);
    });
};
/**
 * Deregister this device from push notifications.
 */
const deregister = () => {
    Log_1.default.info('[PushNotification] Unsubscribing from push notifications.');
    react_native_airship_1.default.contact.reset();
    react_native_airship_1.default.removeAllListeners(react_native_airship_1.EventType.PushReceived);
    react_native_airship_1.default.removeAllListeners(react_native_airship_1.EventType.NotificationResponse);
    ForegroundNotifications_1.default.disableForegroundNotifications();
    ShortcutManager_1.default.removeAllDynamicShortcuts();
};
/**
 * Bind a callback to a push notification of a given type.
 * See https://github.com/Expensify/Web-Expensify/blob/main/lib/MobilePushNotifications.php for the various
 * types of push notifications sent, along with the data that they provide.
 *
 * Note: This implementation allows for only one callback to be bound to an Event/Type pair. For example,
 *       if we attempt to bind two callbacks to the PushReceived event for reportComment notifications,
 *       the second will overwrite the first.
 *
 * @param triggerEvent - The event that should trigger this callback. Should be one of UrbanAirship.EventType
 */
function bind(triggerEvent, notificationType, callback) {
    let actionMap = notificationEventActionMap[triggerEvent];
    if (!actionMap) {
        actionMap = {};
    }
    actionMap[notificationType] = callback;
    notificationEventActionMap[triggerEvent] = actionMap;
}
/**
 * Bind a callback to be executed when a push notification of a given type is received.
 */
const onReceived = (notificationType, callback) => {
    bind(react_native_airship_1.EventType.PushReceived, notificationType, callback);
};
/**
 * Bind a callback to be executed when a push notification of a given type is tapped by the user.
 */
const onSelected = (notificationType, callback) => {
    bind(react_native_airship_1.EventType.NotificationResponse, notificationType, callback);
};
/**
 * Clear all push notifications
 */
const clearNotifications = () => {
    react_native_airship_1.default.push.clearNotifications();
};
const PushNotification = {
    init,
    register,
    deregister,
    onReceived,
    onSelected,
    TYPE: NotificationType_1.default,
    clearNotifications,
};
exports.default = PushNotification;
