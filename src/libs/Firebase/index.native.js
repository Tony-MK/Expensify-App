"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-unused-vars */
const crashlytics_1 = require("@react-native-firebase/crashlytics");
const perf_1 = require("@react-native-firebase/perf");
const Environment = require("@libs/Environment/Environment");
const utils_1 = require("./utils");
const crashlytics = (0, crashlytics_1.getCrashlytics)();
const perf = (0, perf_1.getPerformance)();
const traceMap = {};
const startTrace = (customEventName) => {
    const start = global.performance.now();
    if (Environment.isDevelopment()) {
        return;
    }
    if (traceMap[customEventName]) {
        return;
    }
    const attributes = utils_1.default.getAttributes(['accountId', 'personalDetailsLength', 'reportActionsLength', 'reportsLength', 'policiesLength']);
    perf.startTrace(customEventName).then((trace) => {
        Object.entries(attributes).forEach(([name, value]) => {
            trace.putAttribute(name, value);
        });
        traceMap[customEventName] = {
            trace,
            start,
        };
    });
};
const stopTrace = (customEventName) => {
    // Uncomment to inspect logs on release builds
    // const stop = global.performance.now();
    if (Environment.isDevelopment()) {
        return;
    }
    const trace = traceMap[customEventName]?.trace;
    if (!trace) {
        return;
    }
    trace.stop();
    // Uncomment to inspect logs on release builds
    // const start = lodashGet(traceMap, [customEventName, 'start']);
    // Log.info(`sidebar_loaded: ${stop - start} ms`, true);
    delete traceMap[customEventName];
};
const log = (action) => {
    (0, crashlytics_1.log)(crashlytics, action);
};
exports.default = {
    startTrace,
    stopTrace,
    log,
};
