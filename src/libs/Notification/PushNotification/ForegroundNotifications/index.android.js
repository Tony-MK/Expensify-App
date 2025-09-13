"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_airship_1 = require("@ua/react-native-airship");
const shouldShowPushNotification_1 = require("@libs/Notification/PushNotification/shouldShowPushNotification");
function configureForegroundNotifications() {
    react_native_airship_1.default.push.android.setForegroundDisplayPredicate((pushPayload) => Promise.resolve((0, shouldShowPushNotification_1.default)(pushPayload)));
}
function disableForegroundNotifications() {
    react_native_airship_1.default.push.android.setForegroundDisplayPredicate(() => Promise.resolve(false));
}
const ForegroundNotifications = {
    configureForegroundNotifications,
    disableForegroundNotifications,
};
exports.default = ForegroundNotifications;
