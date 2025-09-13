"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crashlytics_1 = require("@react-native-firebase/crashlytics");
const react_1 = require("react");
const Log_1 = require("@libs/Log");
const BaseErrorBoundary_1 = require("./BaseErrorBoundary");
const crashlytics = (0, crashlytics_1.getCrashlytics)();
const logError = (errorMessage, error, errorInfo) => {
    // Log the error to the server
    Log_1.default.alert(`${errorMessage} - ${error.message}`, { errorInfo }, false);
    /* On native we also log the error to crashlytics
     * Since the error was handled we need to manually tell crashlytics about it */
    (0, crashlytics_1.log)(crashlytics, `errorInfo: ${errorInfo}`);
    (0, crashlytics_1.recordError)(crashlytics, error);
};
function ErrorBoundary({ errorMessage, children }) {
    return (<BaseErrorBoundary_1.default errorMessage={errorMessage} logError={logError}>
            {children}
        </BaseErrorBoundary_1.default>);
}
ErrorBoundary.displayName = 'ErrorBoundary';
exports.default = ErrorBoundary;
