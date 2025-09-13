"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const CONST_1 = require("@src/CONST");
const shouldReportActivity_1 = require("./shouldReportActivity");
let appState = CONST_1.default.APP_STATE.ACTIVE;
/**
 * Listener that will only fire the callback when the user has become active.
 * @returns callback to unsubscribe
 */
function addBecameActiveListener(callback) {
    function appStateChangeCallback(state) {
        if (shouldReportActivity_1.default && (appState === CONST_1.default.APP_STATE.INACTIVE || appState === CONST_1.default.APP_STATE.BACKGROUND) && state === CONST_1.default.APP_STATE.ACTIVE) {
            callback();
        }
        appState = state;
    }
    const appStateChangeSubscription = react_native_1.AppState.addEventListener('change', appStateChangeCallback);
    return () => {
        if (!appStateChangeSubscription) {
            return;
        }
        appStateChangeSubscription.remove();
    };
}
exports.default = {
    addBecameActiveListener,
};
