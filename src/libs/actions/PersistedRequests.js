"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear = clear;
exports.save = save;
exports.getAll = getAll;
exports.endRequestAndRemoveFromQueue = endRequestAndRemoveFromQueue;
exports.update = update;
exports.getLength = getLength;
exports.getOngoingRequest = getOngoingRequest;
exports.processNextRequest = processNextRequest;
exports.updateOngoingRequest = updateOngoingRequest;
exports.rollbackOngoingRequest = rollbackOngoingRequest;
exports.deleteRequestsByIndices = deleteRequestsByIndices;
const fast_equals_1 = require("fast-equals");
const react_native_onyx_1 = require("react-native-onyx");
const Log_1 = require("@libs/Log");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
let persistedRequests = [];
let ongoingRequest = null;
// We have opted for connectWithoutView here as this module is strictly non-UI
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.PERSISTED_REQUESTS,
    callback: (val) => {
        Log_1.default.info('[PersistedRequests] hit Onyx connect callback', false, { isValNullish: val == null });
        persistedRequests = val ?? [];
        if (ongoingRequest && persistedRequests.length > 0) {
            const nextRequestToProcess = persistedRequests.at(0);
            // We try to remove the next request from the persistedRequests if it is the same as ongoingRequest
            // so we don't process it twice.
            if ((0, fast_equals_1.deepEqual)(nextRequestToProcess, ongoingRequest)) {
                persistedRequests = persistedRequests.slice(1);
            }
        }
    },
});
// We have opted for connectWithoutView here as this module is strictly non-UI
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.PERSISTED_ONGOING_REQUESTS,
    callback: (val) => {
        ongoingRequest = val ?? null;
    },
});
/**
 * This promise is only used by tests. DO NOT USE THIS PROMISE IN THE APPLICATION CODE
 */
function clear() {
    ongoingRequest = null;
    react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSISTED_ONGOING_REQUESTS, null);
    return react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSISTED_REQUESTS, []);
}
function getLength() {
    // Making it backwards compatible with the old implementation
    return persistedRequests.length + (ongoingRequest ? 1 : 0);
}
function save(requestToPersist) {
    // If the command is not in the keepLastInstance array, add the new request as usual
    const requests = [...persistedRequests, requestToPersist];
    persistedRequests = requests;
    react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSISTED_REQUESTS, requests).then(() => {
        Log_1.default.info(`[SequentialQueue] '${requestToPersist.command}' command queued. Queue length is ${getLength()}`);
    });
}
function endRequestAndRemoveFromQueue(requestToRemove) {
    ongoingRequest = null;
    /**
     * We only remove the first matching request because the order of requests matters.
     * If we were to remove all matching requests, we can end up with a final state that is different than what the user intended.
     */
    const requests = [...persistedRequests];
    const index = requests.findIndex((persistedRequest) => (0, fast_equals_1.deepEqual)(persistedRequest, requestToRemove));
    if (index !== -1) {
        requests.splice(index, 1);
    }
    persistedRequests = requests;
    react_native_onyx_1.default.multiSet({
        [ONYXKEYS_1.default.PERSISTED_REQUESTS]: persistedRequests,
        [ONYXKEYS_1.default.PERSISTED_ONGOING_REQUESTS]: null,
    }).then(() => {
        Log_1.default.info(`[SequentialQueue] '${requestToRemove.command}' removed from the queue. Queue length is ${getLength()}`);
    });
}
function deleteRequestsByIndices(indices) {
    // Create a Set from the indices array for efficient lookup
    const indicesSet = new Set(indices);
    // Create a new array excluding elements at the specified indices
    persistedRequests = persistedRequests.filter((_, index) => !indicesSet.has(index));
    // Update the persisted requests in storage or state as necessary
    react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSISTED_REQUESTS, persistedRequests).then(() => {
        Log_1.default.info(`Multiple (${indices.length}) requests removed from the queue. Queue length is ${persistedRequests.length}`);
    });
}
function update(oldRequestIndex, newRequest) {
    const requests = [...persistedRequests];
    const oldRequest = requests.at(oldRequestIndex);
    Log_1.default.info('[PersistedRequests] Updating a request', false, { oldRequest, newRequest, oldRequestIndex });
    requests.splice(oldRequestIndex, 1, newRequest);
    persistedRequests = requests;
    react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSISTED_REQUESTS, requests);
}
function updateOngoingRequest(newRequest) {
    Log_1.default.info('[PersistedRequests] Updating the ongoing request', false, { ongoingRequest, newRequest });
    ongoingRequest = newRequest;
    if (newRequest.persistWhenOngoing) {
        react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSISTED_ONGOING_REQUESTS, newRequest);
    }
}
function processNextRequest() {
    if (ongoingRequest) {
        Log_1.default.info(`Ongoing Request already set returning same one ${ongoingRequest.commandName}`);
        return ongoingRequest;
    }
    // You must handle the case where there are no requests to process
    if (persistedRequests.length === 0) {
        throw new Error('No requests to process');
    }
    ongoingRequest = persistedRequests.shift() ?? null;
    if (ongoingRequest && ongoingRequest.persistWhenOngoing) {
        react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSISTED_ONGOING_REQUESTS, ongoingRequest);
    }
    return ongoingRequest;
}
function rollbackOngoingRequest() {
    if (!ongoingRequest) {
        return;
    }
    // Prepend ongoingRequest to persistedRequests
    persistedRequests.unshift({ ...ongoingRequest, isRollback: true });
    // Clear the ongoingRequest
    ongoingRequest = null;
}
function getAll() {
    return persistedRequests;
}
function getOngoingRequest() {
    return ongoingRequest;
}
