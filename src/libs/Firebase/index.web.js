"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const performance_1 = require("@firebase/performance");
const Environment = require("@libs/Environment/Environment");
const firebaseWebConfig_1 = require("./firebaseWebConfig");
const utils_1 = require("./utils");
const traceMap = {};
const startTrace = (customEventName) => {
    const start = global.performance.now();
    if (Environment.isDevelopment()) {
        return;
    }
    if (traceMap[customEventName]) {
        return;
    }
    const perfTrace = (0, performance_1.trace)(firebaseWebConfig_1.firebasePerfWeb, customEventName);
    const attributes = utils_1.default.getAttributes(['accountId', 'personalDetailsLength', 'reportActionsLength', 'reportsLength', 'policiesLength']);
    Object.entries(attributes).forEach(([name, value]) => {
        perfTrace.putAttribute(name, value);
    });
    traceMap[customEventName] = {
        trace: perfTrace,
        start,
    };
    perfTrace.start();
};
const stopTrace = (customEventName) => {
    if (Environment.isDevelopment()) {
        return;
    }
    const perfTrace = traceMap[customEventName]?.trace;
    if (!perfTrace) {
        return;
    }
    perfTrace.stop();
    delete traceMap[customEventName];
};
const log = () => {
    // crashlytics is not supported on WEB
};
exports.default = {
    startTrace,
    stopTrace,
    log,
};
