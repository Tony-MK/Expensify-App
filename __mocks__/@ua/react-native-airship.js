"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionStatus = exports.iOS = exports.EventType = void 0;
// eslint-disable-next-line no-restricted-syntax
var EventType;
(function (EventType) {
    EventType["NotificationResponse"] = "com.airship.notification_response";
    EventType["PushReceived"] = "com.airship.push_received";
})(EventType || (exports.EventType = EventType = {}));
// eslint-disable-next-line no-restricted-syntax
var PermissionStatus;
(function (PermissionStatus) {
    PermissionStatus["Granted"] = "granted";
    PermissionStatus["Denied"] = "denied";
    PermissionStatus["NotDetermined"] = "not_determined";
})(PermissionStatus || (exports.PermissionStatus = PermissionStatus = {}));
// eslint-disable-next-line @typescript-eslint/no-namespace
var iOS;
(function (iOS) {
    /**
     * Enum of foreground notification options.
     */
    // eslint-disable-next-line no-restricted-syntax, rulesdir/no-inline-named-export
    let ForegroundPresentationOption;
    (function (ForegroundPresentationOption) {
        /**
         * Play the sound associated with the notification.
         */
        ForegroundPresentationOption["Sound"] = "sound";
        /**
         * Apply the notification's badge value to the app’s icon.
         */
        ForegroundPresentationOption["Badge"] = "badge";
        /**
         * Show the notification in Notification Center. On iOS 13 an older,
         * this will also show the notification as a banner.
         */
        ForegroundPresentationOption["List"] = "list";
        /**
         * Present the notification as a banner. On iOS 13 an older,
         * this will also show the notification in the Notification Center.
         */
        ForegroundPresentationOption["Banner"] = "banner";
    })(ForegroundPresentationOption = iOS.ForegroundPresentationOption || (iOS.ForegroundPresentationOption = {}));
})(iOS || (exports.iOS = iOS = {}));
const pushIOS = jest.fn().mockImplementation(() => ({
    setBadgeNumber: jest.fn(),
    setForegroundPresentationOptions: jest.fn(),
    setForegroundPresentationOptionsCallback: jest.fn(),
}))();
const pushAndroid = jest.fn().mockImplementation(() => ({
    setForegroundDisplayPredicate: jest.fn(),
}))();
const push = jest.fn().mockImplementation(() => ({
    iOS: pushIOS,
    android: pushAndroid,
    enableUserNotifications: () => Promise.resolve(false),
    clearNotifications: jest.fn(),
    getNotificationStatus: () => Promise.resolve({ airshipOptIn: false, systemEnabled: false, airshipEnabled: false }),
    getActiveNotifications: () => Promise.resolve([]),
}))();
const contact = jest.fn().mockImplementation(() => ({
    identify: jest.fn(),
    getNamedUserId: () => Promise.resolve(undefined),
    reset: jest.fn(),
    module: jest.fn(),
}))();
const Airship = {
    addListener: jest.fn(),
    removeAllListeners: jest.fn(),
    push,
    contact,
};
exports.default = Airship;
