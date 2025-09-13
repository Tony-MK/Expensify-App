"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
/**
 * Attempts to lazily import a React component with a retry mechanism on failure.
 * If the initial import fails the function will refresh the page once and retry the import.
 * If the import fails again after the refresh, the error is propagated.
 *
 * @param componentImport - A function that returns a promise resolving to a lazily imported React component.
 * @returns A promise that resolves to the imported component or rejects with an error after a retry attempt.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lazyRetry = function (componentImport) {
    return new Promise((resolve, reject) => {
        // Retrieve the retry status from sessionStorage, defaulting to 'false' if not set
        const hasRefreshed = JSON.parse(sessionStorage.getItem(CONST_1.default.SESSION_STORAGE_KEYS.RETRY_LAZY_REFRESHED) ?? 'false');
        componentImport()
            .then((component) => {
            // Reset the retry status to 'false' on successful import
            sessionStorage.setItem(CONST_1.default.SESSION_STORAGE_KEYS.RETRY_LAZY_REFRESHED, 'false'); // success so reset the refresh
            resolve(component);
        })
            .catch((component) => {
            if (!hasRefreshed) {
                console.error('Failed to lazily import a React component, refreshing the page in order to retry the operation.', component);
                // Set the retry status to 'true' and refresh the page
                sessionStorage.setItem(CONST_1.default.SESSION_STORAGE_KEYS.RETRY_LAZY_REFRESHED, 'true');
                window.location.reload(); // Refresh the page to retry the import
            }
            else {
                console.error('Failed to lazily import a React component after the retry operation!', component);
                // If the import fails again reject with the error to trigger default error handling
                reject(component);
            }
        });
    });
};
exports.default = lazyRetry;
