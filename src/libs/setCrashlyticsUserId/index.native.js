"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crashlytics_1 = require("@react-native-firebase/crashlytics");
var crashlytics = (0, crashlytics_1.getCrashlytics)();
var setCrashlyticsUserId = function (accountID) {
    (0, crashlytics_1.setUserId)(crashlytics, accountID.toString());
};
exports.default = setCrashlyticsUserId;
