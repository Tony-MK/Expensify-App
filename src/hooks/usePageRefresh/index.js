"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const differenceInMilliseconds_1 = require("date-fns/differenceInMilliseconds");
const react_error_boundary_1 = require("react-error-boundary");
const CONST_1 = require("@src/CONST");
const usePageRefresh = () => {
    const { resetBoundary } = (0, react_error_boundary_1.useErrorBoundary)();
    return (isChunkLoadError) => {
        const lastRefreshTimestamp = JSON.parse(sessionStorage.getItem(CONST_1.default.SESSION_STORAGE_KEYS.LAST_REFRESH_TIMESTAMP) ?? 'null');
        if (!isChunkLoadError && (lastRefreshTimestamp === null || (0, differenceInMilliseconds_1.differenceInMilliseconds)(Date.now(), Number(lastRefreshTimestamp)) > CONST_1.default.ERROR_WINDOW_RELOAD_TIMEOUT)) {
            resetBoundary();
            sessionStorage.setItem(CONST_1.default.SESSION_STORAGE_KEYS.LAST_REFRESH_TIMESTAMP, Date.now().toString());
            return;
        }
        window.location.reload();
        sessionStorage.removeItem(CONST_1.default.SESSION_STORAGE_KEYS.LAST_REFRESH_TIMESTAMP);
    };
};
exports.default = usePageRefresh;
