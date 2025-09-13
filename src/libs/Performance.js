"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fast_equals_1 = require("fast-equals");
const isObject_1 = require("lodash/isObject");
const transform_1 = require("lodash/transform");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_performance_1 = require("react-native-performance");
const CONST_1 = require("@src/CONST");
const isE2ETestSession_1 = require("./E2E/isE2ETestSession");
const getComponentDisplayName_1 = require("./getComponentDisplayName");
const Metrics_1 = require("./Metrics");
/**
 * Deep diff between two objects. Useful for figuring out what changed about an object from one render to the next so
 * that state and props updates can be optimized.
 */
function diffObject(object, base) {
    function changes(obj, comparisonObject) {
        return (0, transform_1.default)(obj, (result, value, key) => {
            if ((0, fast_equals_1.deepEqual)(value, comparisonObject[key])) {
                return;
            }
            // eslint-disable-next-line no-param-reassign
            result[key] = (0, isObject_1.default)(value) && (0, isObject_1.default)(comparisonObject[key]) ? changes(value, comparisonObject[key]) : value;
        });
    }
    return changes(object, base);
}
function measureFailSafe(measureName, startOrMeasureOptions, endMark) {
    try {
        react_native_performance_1.default.measure(measureName, startOrMeasureOptions, endMark);
    }
    catch (error) {
        // Sometimes there might be no start mark recorded and the measure will fail with an error
        if (error instanceof Error) {
            console.debug(error.message);
        }
    }
}
/**
 * Measures the TTI (time to interactive) time starting from the `nativeLaunchStart` event.
 * To be called when the app is considered to be interactive.
 */
function measureTTI(endMark) {
    // Make sure TTI is captured when the app is really usable
    react_native_1.InteractionManager.runAfterInteractions(() => {
        requestAnimationFrame(() => {
            measureFailSafe('TTI', 'nativeLaunchStart', endMark);
            // We don't want an alert to show:
            // - on builds with performance metrics collection disabled by a feature flag
            // - e2e test sessions
            if (!(0, Metrics_1.default)() || (0, isE2ETestSession_1.default)()) {
                return;
            }
            printPerformanceMetrics();
        });
    });
}
/*
 * Monitor native marks that we want to put on the timeline
 */
const nativeMarksObserver = new react_native_performance_1.PerformanceObserver((list, _observer) => {
    list.getEntries().forEach((entry) => {
        if (entry.name === 'nativeLaunchEnd') {
            measureFailSafe('nativeLaunch', 'nativeLaunchStart', 'nativeLaunchEnd');
        }
        if (entry.name === 'downloadEnd') {
            measureFailSafe('jsBundleDownload', 'downloadStart', 'downloadEnd');
        }
        if (entry.name === 'runJsBundleEnd') {
            measureFailSafe('runJsBundle', 'runJsBundleStart', 'runJsBundleEnd');
        }
        if (entry.name === 'appCreationEnd') {
            measureFailSafe('appCreation', 'appCreationStart', 'appCreationEnd');
            measureFailSafe('nativeLaunchEnd_To_appCreationStart', 'nativeLaunchEnd', 'appCreationStart');
        }
        if (entry.name === 'contentAppeared') {
            measureFailSafe('appCreationEnd_To_contentAppeared', 'appCreationEnd', 'contentAppeared');
        }
        // At this point we've captured and processed all the native marks we're interested in
        // and are not expecting to have more thus we can safely disconnect the observer
        if (entry.name === 'runJsBundleEnd' || entry.name === 'downloadEnd') {
            _observer.disconnect();
        }
    });
});
function setNativeMarksObserverEnabled(enabled = false) {
    if (!enabled) {
        nativeMarksObserver.disconnect();
        return;
    }
    nativeMarksObserver.disconnect();
    nativeMarksObserver.observe({ type: 'react-native-mark', buffered: true });
}
/**
 * Monitor for "_end" marks and capture "_start" to "_end" measures, including events recorded in the native layer before the app fully initializes.
 */
const customMarksObserver = new react_native_performance_1.PerformanceObserver((list) => {
    list.getEntriesByType('mark').forEach((mark) => {
        if (mark.name.endsWith('_end')) {
            const end = mark.name;
            const name = end.replace(/_end$/, '');
            const start = `${name}_start`;
            measureFailSafe(name, start, end);
        }
        // Capture any custom measures or metrics below
        if (mark.name === `${CONST_1.default.TIMING.SIDEBAR_LOADED}_end`) {
            measureFailSafe('contentAppeared_To_screenTTI', 'contentAppeared', mark.name);
            measureTTI(mark.name);
        }
    });
});
function setCustomMarksObserverEnabled(enabled = false) {
    if (!enabled) {
        customMarksObserver.disconnect();
        return;
    }
    customMarksObserver.disconnect();
    customMarksObserver.observe({ type: 'mark', buffered: true });
}
function getPerformanceMetrics() {
    return [
        ...react_native_performance_1.default.getEntriesByName('nativeLaunch'),
        ...react_native_performance_1.default.getEntriesByName('nativeLaunchEnd_To_appCreationStart'),
        ...react_native_performance_1.default.getEntriesByName('appCreation'),
        ...react_native_performance_1.default.getEntriesByName('appCreationEnd_To_contentAppeared'),
        ...react_native_performance_1.default.getEntriesByName('contentAppeared_To_screenTTI'),
        ...react_native_performance_1.default.getEntriesByName('runJsBundle'),
        ...react_native_performance_1.default.getEntriesByName('jsBundleDownload'),
        ...react_native_performance_1.default.getEntriesByName('TTI'),
        ...react_native_performance_1.default.getEntriesByName('regularAppStart'),
        ...react_native_performance_1.default.getEntriesByName('appStartedToReady'),
    ].filter((entry) => entry.duration > 0);
}
function getPerformanceMeasures() {
    return react_native_performance_1.default.getEntriesByType('measure');
}
/**
 * Outputs performance stats. We alert these so that they are easy to access in release builds.
 */
function printPerformanceMetrics() {
    const stats = getPerformanceMetrics();
    const statsAsText = stats.map((entry) => `\u2022 ${entry.name}: ${entry.duration.toFixed(1)}ms`).join('\n');
    if (stats.length > 0) {
        react_native_1.Alert.alert('Performance', statsAsText);
    }
}
function subscribeToMeasurements(callback) {
    const observer = new react_native_performance_1.PerformanceObserver((list) => {
        list.getEntriesByType('measure').forEach(callback);
    });
    observer.observe({ type: 'measure', buffered: true });
    return () => observer.disconnect();
}
/**
 * Add a start mark to the performance entries
 */
function markStart(name, detail) {
    return react_native_performance_1.default.mark(`${name}_start`, { detail });
}
/**
 * Add an end mark to the performance entries
 * A measure between start and end is captured automatically
 */
function markEnd(name, detail) {
    return react_native_performance_1.default.mark(`${name}_end`, { detail });
}
/**
 * Put data emitted by Profiler components on the timeline
 * @param id the "id" prop of the Profiler tree that has just committed
 * @param phase either "mount" (if the tree just mounted) or "update" (if it re-rendered)
 * @param actualDuration time spent rendering the committed update
 * @param baseDuration estimated time to render the entire subtree without memoization
 * @param startTime when React began rendering this update
 * @param commitTime when React committed this update
 */
function traceRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
    return react_native_performance_1.default.measure(id, {
        start: startTime,
        duration: actualDuration,
        detail: {
            phase,
            baseDuration,
            commitTime,
        },
    });
}
/**
 * A HOC that captures render timings of the Wrapped component
 */
function withRenderTrace({ id }) {
    if (!(0, Metrics_1.default)()) {
        return (WrappedComponent) => WrappedComponent;
    }
    return (WrappedComponent) => {
        const WithRenderTrace = (0, react_1.forwardRef)((props, ref) => (<react_1.Profiler id={id} onRender={traceRender}>
                <WrappedComponent 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props} ref={ref}/>
            </react_1.Profiler>));
        WithRenderTrace.displayName = `withRenderTrace(${(0, getComponentDisplayName_1.default)(WrappedComponent)})`;
        return WithRenderTrace;
    };
}
function enableMonitoring() {
    (0, react_native_performance_1.setResourceLoggingEnabled)(true);
    setNativeMarksObserverEnabled(true);
    setCustomMarksObserverEnabled(true);
}
function disableMonitoring() {
    (0, react_native_performance_1.setResourceLoggingEnabled)(false);
    setNativeMarksObserverEnabled(false);
    setCustomMarksObserverEnabled(false);
}
exports.default = {
    diffObject,
    measureFailSafe,
    measureTTI,
    enableMonitoring,
    disableMonitoring,
    getPerformanceMetrics,
    getPerformanceMeasures,
    printPerformanceMetrics,
    subscribeToMeasurements,
    markStart,
    markEnd,
    withRenderTrace,
};
