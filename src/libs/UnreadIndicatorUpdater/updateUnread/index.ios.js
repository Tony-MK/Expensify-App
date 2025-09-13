"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_airship_1 = require("@ua/react-native-airship");
/**
 * Set the App Icon badge with the number of
 * unread messages on iOS
 */
const updateUnread = (totalCount) => {
    react_native_airship_1.default.push.iOS.setBadgeNumber(totalCount);
};
exports.default = updateUnread;
