"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequentialQueueRequestThrottle = void 0;
exports.flush = flush;
exports.getCurrentRequest = getCurrentRequest;
exports.isPaused = isPaused;
exports.isRunning = isRunning;
exports.pause = pause;
exports.process = process;
exports.push = push;
exports.resetQueue = resetQueue;
exports.unpause = unpause;
exports.waitForIdle = waitForIdle;
exports.getQueueFlushedData = getQueueFlushedData;
exports.saveQueueFlushedData = saveQueueFlushedData;
exports.clearQueueFlushedData = clearQueueFlushedData;
const react_native_onyx_1 = require("react-native-onyx");
const PersistedRequests_1 = require("@libs/actions/PersistedRequests");
const QueuedOnyxUpdates_1 = require("@libs/actions/QueuedOnyxUpdates");
const ActiveClientManager_1 = require("@libs/ActiveClientManager");
const Log_1 = require("@libs/Log");
const Request_1 = require("@libs/Request");
const RequestThrottle_1 = require("@libs/RequestThrottle");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const NetworkStore_1 = require("./NetworkStore");
let shouldFailAllRequests;
// Use connectWithoutView since this is for network data and don't affect to any UI
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.NETWORK,
    callback: (network) => {
        if (!network) {
            return;
        }
        shouldFailAllRequests = !!network.shouldFailAllRequests;
    },
});
let resolveIsReadyPromise;
let isReadyPromise = new Promise((resolve) => {
    resolveIsReadyPromise = resolve;
});
// Resolve the isReadyPromise immediately so that the queue starts working as soon as the page loads
resolveIsReadyPromise?.();
let isSequentialQueueRunning = false;
let currentRequestPromise = null;
let isQueuePaused = false;
const sequentialQueueRequestThrottle = new RequestThrottle_1.default('SequentialQueue');
exports.sequentialQueueRequestThrottle = sequentialQueueRequestThrottle;
/**
 * Puts the queue into a paused state so that no requests will be processed
 */
function pause() {
    if (isQueuePaused) {
        Log_1.default.info('[SequentialQueue] Queue already paused');
        return;
    }
    Log_1.default.info('[SequentialQueue] Pausing the queue');
    isQueuePaused = true;
}
/**
 * Gets the current Onyx queued updates, apply them and clear the queue if the queue is not paused.
 */
function flushOnyxUpdatesQueue() {
    // The only situation where the queue is paused is if we found a gap between the app current data state and our server's. If that happens,
    // we'll trigger async calls to make the client updated again. While we do that, we don't want to insert anything in Onyx.
    if (isQueuePaused) {
        Log_1.default.info('[SequentialQueue] Queue already paused');
        return;
    }
    return (0, QueuedOnyxUpdates_1.flushQueue)();
}
let queueFlushedDataToStore = [];
// Use connectWithoutView since this is for network queue and don't affect to any UI
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.QUEUE_FLUSHED_DATA,
    callback: (val) => {
        if (!val) {
            return;
        }
        queueFlushedDataToStore = val;
    },
});
function saveQueueFlushedData(...onyxUpdates) {
    const newValue = [...queueFlushedDataToStore, ...onyxUpdates];
    // eslint-disable-next-line rulesdir/prefer-actions-set-data
    return react_native_onyx_1.default.set(ONYXKEYS_1.default.QUEUE_FLUSHED_DATA, newValue).then(() => {
        Log_1.default.info('[SequentialQueue] QueueFlushedData has been stored.', false, { newValue });
    });
}
function clearQueueFlushedData() {
    // eslint-disable-next-line rulesdir/prefer-actions-set-data
    return react_native_onyx_1.default.set(ONYXKEYS_1.default.QUEUE_FLUSHED_DATA, null).then(() => {
        queueFlushedDataToStore.length = 0;
        Log_1.default.info('[SequentialQueue] QueueFlushedData has been cleared.');
    });
}
function getQueueFlushedData() {
    return queueFlushedDataToStore;
}
/**
 * Process any persisted requests, when online, one at a time until the queue is empty.
 *
 * If a request fails due to some kind of network error, such as a request being throttled or when our backend is down, then we retry it with an exponential back off process until a response
 * is successfully returned. The first time a request fails we set a random, small, initial wait time. After waiting, we retry the request. If there are subsequent failures the request wait
 * time is doubled creating an exponential back off in the frequency of requests hitting the server. Since the initial wait time is random and it increases exponentially, the load of
 * requests to our backend is evenly distributed and it gradually decreases with time, which helps the servers catch up.
 */
function process() {
    // When the queue is paused, return early. This prevents any new requests from happening. The queue will be flushed again when the queue is unpaused.
    if (isQueuePaused) {
        Log_1.default.info('[SequentialQueue] Unable to process. Queue is paused.');
        return Promise.resolve();
    }
    if ((0, NetworkStore_1.isOffline)()) {
        Log_1.default.info('[SequentialQueue] Unable to process. We are offline.');
        return Promise.resolve();
    }
    const persistedRequests = (0, PersistedRequests_1.getAll)();
    if (persistedRequests.length === 0) {
        Log_1.default.info('[SequentialQueue] Unable to process. No requests to process.');
        return Promise.resolve();
    }
    const requestToProcess = (0, PersistedRequests_1.processNextRequest)();
    if (!requestToProcess) {
        Log_1.default.info('[SequentialQueue] Unable to process. No next request to handle.');
        return Promise.resolve();
    }
    // Set the current request to a promise awaiting its processing so that getCurrentRequest can be used to take some action after the current request has processed.
    currentRequestPromise = (0, Request_1.processWithMiddleware)(requestToProcess, true)
        .then((response) => {
        // A response might indicate that the queue should be paused. This happens when a gap in onyx updates is detected between the client and the server and
        // that gap needs resolved before the queue can continue.
        if (response?.shouldPauseQueue) {
            Log_1.default.info("[SequentialQueue] Handled 'shouldPauseQueue' in response. Pausing the queue.");
            pause();
        }
        Log_1.default.info('[SequentialQueue] Removing persisted request because it was processed successfully.', false, { request: requestToProcess });
        (0, PersistedRequests_1.endRequestAndRemoveFromQueue)(requestToProcess);
        if (requestToProcess.queueFlushedData) {
            Log_1.default.info('[SequentialQueue] Will store queueFlushedData.', false, { queueFlushedData: requestToProcess.queueFlushedData });
            saveQueueFlushedData(...requestToProcess.queueFlushedData);
        }
        sequentialQueueRequestThrottle.clear();
        return process();
    })
        .catch((error) => {
        // On sign out we cancel any in flight requests from the user. Since that user is no longer signed in their requests should not be retried.
        // Duplicate records don't need to be retried as they just mean the record already exists on the server
        if (error.name === CONST_1.default.ERROR.REQUEST_CANCELLED || error.message === CONST_1.default.ERROR.DUPLICATE_RECORD || shouldFailAllRequests) {
            if (shouldFailAllRequests) {
                react_native_onyx_1.default.update(requestToProcess.failureData ?? []);
            }
            Log_1.default.info("[SequentialQueue] Removing persisted request because it failed and doesn't need to be retried.", false, { error, request: requestToProcess });
            (0, PersistedRequests_1.endRequestAndRemoveFromQueue)(requestToProcess);
            sequentialQueueRequestThrottle.clear();
            return process();
        }
        (0, PersistedRequests_1.rollbackOngoingRequest)();
        return sequentialQueueRequestThrottle
            .sleep(error, requestToProcess.command)
            .then(process)
            .catch(() => {
            react_native_onyx_1.default.update(requestToProcess.failureData ?? []);
            Log_1.default.info('[SequentialQueue] Removing persisted request because it failed too many times.', false, { error, request: requestToProcess });
            (0, PersistedRequests_1.endRequestAndRemoveFromQueue)(requestToProcess);
            sequentialQueueRequestThrottle.clear();
            return process();
        });
    });
    return currentRequestPromise;
}
/**
 * @param shouldResetPromise Determines whether the isReadyPromise should be reset.
 * A READ request will wait until all the WRITE requests are done, using the isReadyPromise promise.
 * Resetting can cause unresolved READ requests to hang if tied to the old promise,
 * so some cases (e.g., unpausing) require skipping the reset to maintain proper behavior.
 */
function flush(shouldResetPromise = true) {
    // When the queue is paused, return early. This will keep an requests in the queue and they will get flushed again when the queue is unpaused
    if (isQueuePaused) {
        Log_1.default.info('[SequentialQueue] Unable to flush. Queue is paused.');
        return;
    }
    if (isSequentialQueueRunning) {
        Log_1.default.info('[SequentialQueue] Unable to flush. Queue is already running.');
        return;
    }
    if ((0, PersistedRequests_1.getAll)().length === 0 && (0, QueuedOnyxUpdates_1.isEmpty)()) {
        Log_1.default.info('[SequentialQueue] Unable to flush. No requests or queued Onyx updates to process.');
        return;
    }
    // ONYXKEYS.PERSISTED_REQUESTS is shared across clients, thus every client/tab will have a copy
    // It is very important to only process the queue from leader client otherwise requests will be duplicated.
    if (!(0, ActiveClientManager_1.isClientTheLeader)()) {
        Log_1.default.info('[SequentialQueue] Unable to flush. Client is not the leader.');
        return;
    }
    isSequentialQueueRunning = true;
    if (shouldResetPromise) {
        // Reset the isReadyPromise so that the queue will be flushed as soon as the request is finished
        isReadyPromise = new Promise((resolve) => {
            resolveIsReadyPromise = resolve;
        });
    }
    // Ensure persistedRequests are read from storage before proceeding with the queue
    // Use connectWithoutView since this is for network queue and don't affect to any UI
    const connection = react_native_onyx_1.default.connectWithoutView({
        key: ONYXKEYS_1.default.PERSISTED_REQUESTS,
        // We exceptionally opt out of reusing the connection here to avoid extra callback calls due to
        // an existing connection already made in PersistedRequests.ts.
        reuseConnection: false,
        callback: () => {
            react_native_onyx_1.default.disconnect(connection);
            process().finally(() => {
                Log_1.default.info('[SequentialQueue] Finished processing queue.');
                isSequentialQueueRunning = false;
                if ((0, NetworkStore_1.isOffline)() || (0, PersistedRequests_1.getAll)().length === 0) {
                    resolveIsReadyPromise?.();
                }
                currentRequestPromise = null;
                // The queue can be paused when we sync the data with backend so we should only update the Onyx data when the queue is empty
                if ((0, PersistedRequests_1.getAll)().length === 0) {
                    flushOnyxUpdatesQueue()?.then(() => {
                        const queueFlushedData = getQueueFlushedData();
                        if (queueFlushedData.length === 0) {
                            return;
                        }
                        Log_1.default.info('[SequentialQueue] Will store queueFlushedData.', false, { queueFlushedData });
                        react_native_onyx_1.default.update(queueFlushedData).then(() => {
                            Log_1.default.info('[SequentialQueue] QueueFlushedData has been stored.', false, { queueFlushedData });
                            clearQueueFlushedData();
                        });
                    });
                }
            });
        },
    });
}
/**
 * Unpauses the queue and flushes all the requests that were in it or were added to it while paused
 */
function unpause() {
    if (!isQueuePaused) {
        Log_1.default.info('[SequentialQueue] Unable to unpause queue. We are already processing.');
        return;
    }
    const numberOfPersistedRequests = (0, PersistedRequests_1.getAll)().length || 0;
    Log_1.default.info(`[SequentialQueue] Unpausing the queue and flushing ${numberOfPersistedRequests} requests`);
    isQueuePaused = false;
    // If there are no persisted requests, we need to flush the Onyx updates queue
    if (numberOfPersistedRequests === 0) {
        flushOnyxUpdatesQueue();
    }
    // When the queue is paused and then unpaused, we call flush which by defaults recreates the isReadyPromise.
    // After all the WRITE requests are done, the isReadyPromise is resolved, but since it's a new instance of promise,
    // the pending READ request never received the resolved callback. That's why we don't want to recreate
    // the promise when unpausing the queue.
    flush(false);
}
function isRunning() {
    return isSequentialQueueRunning;
}
function isPaused() {
    return isQueuePaused;
}
// Flush the queue when the connection resumes
(0, NetworkStore_1.onReconnection)(flush);
function handleConflictActions(conflictAction, newRequest) {
    if (conflictAction.type === 'push') {
        (0, PersistedRequests_1.save)(newRequest);
    }
    else if (conflictAction.type === 'replace') {
        (0, PersistedRequests_1.update)(conflictAction.index, conflictAction.request ?? newRequest);
    }
    else if (conflictAction.type === 'delete') {
        (0, PersistedRequests_1.deleteRequestsByIndices)(conflictAction.indices);
        if (conflictAction.pushNewRequest) {
            (0, PersistedRequests_1.save)(newRequest);
        }
        if (conflictAction.nextAction) {
            handleConflictActions(conflictAction.nextAction, newRequest);
        }
    }
    else {
        Log_1.default.info(`[SequentialQueue] No action performed to command ${newRequest.command} and it will be ignored.`);
    }
}
function push(newRequest) {
    const { checkAndFixConflictingRequest } = newRequest;
    if (checkAndFixConflictingRequest) {
        const requests = (0, PersistedRequests_1.getAll)();
        const { conflictAction } = checkAndFixConflictingRequest(requests);
        Log_1.default.info(`[SequentialQueue] Conflict action for command ${newRequest.command} - ${conflictAction.type}:`);
        // don't try to serialize a function.
        // eslint-disable-next-line no-param-reassign
        delete newRequest.checkAndFixConflictingRequest;
        handleConflictActions(conflictAction, newRequest);
    }
    else {
        // Add request to Persisted Requests so that it can be retried if it fails
        (0, PersistedRequests_1.save)(newRequest);
    }
    // If we are offline we don't need to trigger the queue to empty as it will happen when we come back online
    if ((0, NetworkStore_1.isOffline)()) {
        return;
    }
    // If the queue is running this request will run once it has finished processing the current batch
    if (isSequentialQueueRunning) {
        isReadyPromise.then(() => flush(true));
        return;
    }
    flush(true);
}
function getCurrentRequest() {
    if (currentRequestPromise === null) {
        return Promise.resolve();
    }
    return currentRequestPromise;
}
/**
 * Returns a promise that resolves when the sequential queue is done processing all persisted write requests.
 */
function waitForIdle() {
    return isReadyPromise;
}
/**
 * Clear any pending requests during test runs
 * This is to prevent previous requests interfering with other tests
 */
function resetQueue() {
    isSequentialQueueRunning = false;
    currentRequestPromise = null;
    isQueuePaused = false;
    isReadyPromise = new Promise((resolve) => {
        resolveIsReadyPromise = resolve;
    });
    resolveIsReadyPromise?.();
}
