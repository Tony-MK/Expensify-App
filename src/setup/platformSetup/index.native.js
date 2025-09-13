"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const crashlytics_1 = require("@react-native-firebase/crashlytics");
const Metrics_1 = require("@libs/Metrics");
const Performance_1 = require("@libs/Performance");
const CONFIG_1 = require("@src/CONFIG");
const crashlytics = (0, crashlytics_1.getCrashlytics)();
function default_1() {
    // We do not want to send crash reports if we are on a locally built release version of the app.
    // Crashlytics is disabled by default for debug builds, but not local release builds so we are using
    // an environment variable to enable them in the staging & production apps and opt-out everywhere else.
    if (!CONFIG_1.default.SEND_CRASH_REPORTS) {
        (0, crashlytics_1.setCrashlyticsCollectionEnabled)(crashlytics, false);
    }
    if ((0, Metrics_1.default)()) {
        Performance_1.default.enableMonitoring();
    }
}
