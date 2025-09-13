"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.post = post;
exports.clearProcessQueueInterval = clearProcessQueueInterval;
const ActiveClientManager = require("@libs/ActiveClientManager");
const CONST_1 = require("@src/CONST");
const package_json_1 = require("../../../package.json");
const MainQueue_1 = require("./MainQueue");
const SequentialQueue_1 = require("./SequentialQueue");
// React Native uses a number for the timer id, but Web/NodeJS uses a Timeout object
let processQueueInterval;
// We must wait until the ActiveClientManager is ready so that we ensure only the "leader" tab processes any persisted requests
ActiveClientManager.isReady().then(() => {
    (0, SequentialQueue_1.flush)();
    // Start main queue and process once every n ms delay
    processQueueInterval = setInterval(MainQueue_1.process, CONST_1.default.NETWORK.PROCESS_REQUEST_DELAY_MS);
});
/**
 * Clear any existing intervals during test runs
 * This is to prevent previous intervals interfering with other tests
 */
function clearProcessQueueInterval() {
    if (!processQueueInterval) {
        return;
    }
    clearInterval(processQueueInterval);
}
/**
 * Perform a queued post request
 */
function post(command, data = {}, type = CONST_1.default.NETWORK.METHOD.POST, shouldUseSecure = false) {
    return new Promise((resolve, reject) => {
        const request = {
            command,
            data,
            type,
            shouldUseSecure,
        };
        // By default, request are retry-able and cancellable
        // (e.g. any requests currently happening when the user logs out are cancelled)
        request.data = {
            ...data,
            shouldRetry: data?.shouldRetry ?? true,
            canCancel: data?.canCancel ?? true,
            appversion: package_json_1.default.version,
        };
        // Add promise handlers to any request that we are not persisting
        request.resolve = resolve;
        request.reject = reject;
        // Add the request to a queue of actions to perform
        (0, MainQueue_1.push)(request);
        // This check is mainly used to prevent API commands from triggering calls to MainQueue.process() from inside the context of a previous
        // call to MainQueue.process() e.g. calling a Log command without this would cause the requests in mainQueue to double process
        // since we call Log inside MainQueue.process().
        const shouldProcessImmediately = request?.data?.shouldProcessImmediately ?? true;
        if (!shouldProcessImmediately) {
            return;
        }
        // Try to fire off the request as soon as it's queued so we don't add a delay to every queued command
        (0, MainQueue_1.process)();
    });
}
