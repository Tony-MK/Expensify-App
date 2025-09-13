"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crashlytics_1 = require("@react-native-firebase/crashlytics");
const crashlytics = (0, crashlytics_1.getCrashlytics)();
const testCrash = () => {
    (0, crashlytics_1.crash)(crashlytics);
};
exports.default = testCrash;
