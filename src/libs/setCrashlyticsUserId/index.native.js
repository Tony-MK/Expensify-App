"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crashlytics_1 = require("@react-native-firebase/crashlytics");
const crashlytics = (0, crashlytics_1.getCrashlytics)();
const setCrashlyticsUserId = (accountID) => {
    (0, crashlytics_1.setUserId)(crashlytics, accountID.toString());
};
exports.default = setCrashlyticsUserId;
