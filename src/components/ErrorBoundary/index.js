"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Log_1 = require("@libs//Log");
const BaseErrorBoundary_1 = require("./BaseErrorBoundary");
const logError = (errorMessage, error, errorInfo) => {
    // Log the error to the server
    Log_1.default.alert(`${errorMessage} - ${error.message}`, { errorInfo }, false);
};
const onUnhandledRejection = (event) => {
    let rejection = event.reason;
    if (event.reason instanceof Error) {
        Log_1.default.alert(`Unhandled Promise Rejection: ${event.reason.message}\nStack: ${event.reason.stack}`, {}, false);
        return;
    }
    if (typeof event.reason === 'object' && event.reason !== null) {
        rejection = JSON.stringify(event.reason);
    }
    Log_1.default.alert(`Unhandled Promise Rejection: ${String(rejection)}`, {}, false);
};
function ErrorBoundary({ errorMessage, children }) {
    // Log unhandled promise rejections to the server
    (0, react_1.useEffect)(() => {
        window.addEventListener('unhandledrejection', onUnhandledRejection);
        return () => window.removeEventListener('unhandledrejection', onUnhandledRejection);
    }, []);
    return (<BaseErrorBoundary_1.default errorMessage={errorMessage} logError={logError}>
            {children}
        </BaseErrorBoundary_1.default>);
}
ErrorBoundary.displayName = 'ErrorBoundary';
exports.default = ErrorBoundary;
