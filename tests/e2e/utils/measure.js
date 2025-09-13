"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stop = exports.start = void 0;
const profiler_1 = require("@perf-profiler/profiler");
const reporter_1 = require("@perf-profiler/reporter");
const types_1 = require("@perf-profiler/types");
const Logger = require("./logger");
let measures = [];
const POLLING_STOPPED = {
    stop: () => {
        throw new Error('Cannot stop polling on a stopped profiler');
    },
};
let polling = POLLING_STOPPED;
const start = (bundleId, { onAttachFailed }) => {
    // clear our measurements results
    measures = [];
    polling = profiler_1.profiler.pollPerformanceMeasures(bundleId, {
        onMeasure: (measure) => {
            measures.push(measure);
        },
        onPidChanged: () => {
            onAttachFailed();
        },
    });
    Logger.info(`Starting performance measurements for ${bundleId}`);
};
exports.start = start;
const stop = (whoTriggered) => {
    Logger.info(`Stop performance measurements... Was triggered by ${whoTriggered}`);
    polling.stop();
    polling = POLLING_STOPPED;
    const average = (0, reporter_1.getAverageCpuUsagePerProcess)(measures);
    const uiThread = average.find(({ processName }) => processName === types_1.ThreadNames.ANDROID.UI)?.cpuUsage;
    // most likely this line needs to be updated when we migrate to RN 0.74 with bridgeless mode
    const jsThread = average.find(({ processName }) => processName === types_1.ThreadNames.RN.JS_ANDROID)?.cpuUsage;
    const cpu = (0, reporter_1.getAverageCpuUsage)(measures);
    const fps = (0, reporter_1.getAverageFPSUsage)(measures);
    const ram = (0, reporter_1.getAverageRAMUsage)(measures);
    return {
        uiThread,
        jsThread,
        cpu,
        fps,
        ram,
    };
};
exports.stop = stop;
