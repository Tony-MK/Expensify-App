"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_airship_1 = require("@ua/react-native-airship");
const shouldShowPushNotification_1 = require("@libs/Notification/PushNotification/shouldShowPushNotification");
function configureForegroundNotifications() {
    // Set our default iOS foreground presentation to be loud with a banner
    // More info here https://developer.apple.com/documentation/usernotifications/unusernotificationcenterdelegate/1649518-usernotificationcenter
    react_native_airship_1.default.push.iOS.setForegroundPresentationOptions([
        react_native_airship_1.iOS.ForegroundPresentationOption.List,
        react_native_airship_1.iOS.ForegroundPresentationOption.Banner,
        react_native_airship_1.iOS.ForegroundPresentationOption.Sound,
        react_native_airship_1.iOS.ForegroundPresentationOption.Badge,
    ]);
    // Set a callback to override our foreground presentation per notification depending on the app's current state.
    // Returning null keeps the default presentation. Returning [] uses no presentation (hides the notification).
    react_native_airship_1.default.push.iOS.setForegroundPresentationOptionsCallback((pushPayload) => Promise.resolve((0, shouldShowPushNotification_1.default)(pushPayload) ? null : []));
}
function disableForegroundNotifications() {
    react_native_airship_1.default.push.iOS.setForegroundPresentationOptionsCallback(() => Promise.resolve([]));
}
const ForegroundNotifications = {
    configureForegroundNotifications,
    disableForegroundNotifications,
};
exports.default = ForegroundNotifications;
