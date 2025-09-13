"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const NetworkInterceptor_1 = require("@libs/E2E/utils/NetworkInterceptor");
const PersistedRequests_1 = require("@userActions/PersistedRequests");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SequentialQueue = require("../../src/libs/Network/SequentialQueue");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
const request = {
    command: 'ReconnectApp',
    successData: [{ key: 'userMetadata', onyxMethod: 'set', value: { accountID: 1234 } }],
    failureData: [{ key: 'userMetadata', onyxMethod: 'set', value: {} }],
};
beforeAll(() => {
    react_native_onyx_1.default.init({
        keys: ONYXKEYS_1.default,
    });
});
beforeEach(() => {
    global.fetch = TestHelper.getGlobalFetchMock();
    return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
});
describe('SequentialQueue', () => {
    it('should push one request and persist one', () => {
        SequentialQueue.push(request);
        expect((0, PersistedRequests_1.getLength)()).toBe(1);
    });
    it('should push two requests and persist two', () => {
        SequentialQueue.push(request);
        SequentialQueue.push(request);
        expect((0, PersistedRequests_1.getLength)()).toBe(2);
    });
    it('should push two requests with conflict resolution and replace', () => {
        SequentialQueue.push(request);
        const requestWithConflictResolution = {
            command: 'ReconnectApp',
            data: { accountID: 56789 },
            checkAndFixConflictingRequest: (persistedRequests) => {
                // should be one instance of ReconnectApp, get the index to replace it later
                const index = persistedRequests.findIndex((r) => r.command === 'ReconnectApp');
                if (index === -1) {
                    return { conflictAction: { type: 'push' } };
                }
                return {
                    conflictAction: { type: 'replace', index },
                };
            },
        };
        SequentialQueue.push(requestWithConflictResolution);
        expect((0, PersistedRequests_1.getLength)()).toBe(1);
        // We know there is only one request in the queue, so we can get the first one and verify
        // that the persisted request is the second one.
        const persistedRequest = (0, PersistedRequests_1.getAll)().at(0);
        expect(persistedRequest?.data?.accountID).toBe(56789);
    });
    it('should push two requests with conflict resolution and push', () => {
        SequentialQueue.push(request);
        const requestWithConflictResolution = {
            command: 'ReconnectApp',
            data: { accountID: 56789 },
            checkAndFixConflictingRequest: () => {
                return { conflictAction: { type: 'push' } };
            },
        };
        SequentialQueue.push(requestWithConflictResolution);
        expect((0, PersistedRequests_1.getLength)()).toBe(2);
    });
    it('should push two requests with conflict resolution and noAction', () => {
        SequentialQueue.push(request);
        const requestWithConflictResolution = {
            command: 'ReconnectApp',
            data: { accountID: 56789 },
            checkAndFixConflictingRequest: () => {
                return { conflictAction: { type: 'noAction' } };
            },
        };
        SequentialQueue.push(requestWithConflictResolution);
        expect((0, PersistedRequests_1.getLength)()).toBe(1);
    });
    it('should add a new request even if a similar one is ongoing', async () => {
        // .push at the end flush the queue
        SequentialQueue.push(request);
        // wait for Onyx.connect execute the callback and start processing the queue
        await Promise.resolve();
        const requestWithConflictResolution = {
            command: 'ReconnectApp',
            data: { accountID: 56789 },
            checkAndFixConflictingRequest: (persistedRequests) => {
                // should be one instance of ReconnectApp, get the index to replace it later
                const index = persistedRequests.findIndex((r) => r.command === 'ReconnectApp');
                if (index === -1) {
                    return { conflictAction: { type: 'push' } };
                }
                return {
                    conflictAction: { type: 'replace', index },
                };
            },
        };
        SequentialQueue.push(requestWithConflictResolution);
        expect((0, PersistedRequests_1.getLength)()).toBe(2);
    });
    it('should replace request request in queue while a similar one is ongoing', async () => {
        // .push at the end flush the queue
        SequentialQueue.push(request);
        // wait for Onyx.connect execute the callback and start processing the queue
        await Promise.resolve();
        const conflictResolver = (persistedRequests) => {
            // should be one instance of ReconnectApp, get the index to replace it later
            const index = persistedRequests.findIndex((r) => r.command === 'ReconnectApp');
            if (index === -1) {
                return { conflictAction: { type: 'push' } };
            }
            return {
                conflictAction: { type: 'replace', index },
            };
        };
        const requestWithConflictResolution = {
            command: 'ReconnectApp',
            data: { accountID: 56789 },
            checkAndFixConflictingRequest: conflictResolver,
        };
        const requestWithConflictResolution2 = {
            command: 'ReconnectApp',
            data: { accountID: 56789 },
            checkAndFixConflictingRequest: conflictResolver,
        };
        SequentialQueue.push(requestWithConflictResolution);
        SequentialQueue.push(requestWithConflictResolution2);
        expect((0, PersistedRequests_1.getLength)()).toBe(2);
    });
    it('should replace request request in queue while a similar one is ongoing and keep the same index', () => {
        SequentialQueue.push({ command: 'OpenReport' });
        SequentialQueue.push(request);
        const requestWithConflictResolution = {
            command: 'ReconnectApp',
            data: { accountID: 56789 },
            checkAndFixConflictingRequest: (persistedRequests) => {
                // should be one instance of ReconnectApp, get the index to replace it later
                const index = persistedRequests.findIndex((r) => r.command === 'ReconnectApp');
                if (index === -1) {
                    return { conflictAction: { type: 'push' } };
                }
                return {
                    conflictAction: { type: 'replace', index },
                };
            },
        };
        SequentialQueue.push(requestWithConflictResolution);
        SequentialQueue.push({ command: 'AddComment' });
        SequentialQueue.push({ command: 'OpenReport' });
        expect((0, PersistedRequests_1.getLength)()).toBe(4);
        const persistedRequests = (0, PersistedRequests_1.getAll)();
        // We know ReconnectApp is at index 1 in the queue, so we can get it to verify
        // that was replaced by the new request.
        expect(persistedRequests.at(1)?.data?.accountID).toBe(56789);
    });
    // need to test a rance condition between processing the next request and then pushing a new request with conflict resolver
    it('should resolve the conflict and replace the correct request in the queue while a new request is picked up after unpausing', async () => {
        SequentialQueue.pause();
        for (let i = 0; i < 5; i++) {
            SequentialQueue.push({ command: `OpenReport${i}` });
            SequentialQueue.push({ command: `AddComment${i}` });
        }
        SequentialQueue.push(request);
        SequentialQueue.push({ command: 'AddComment6' });
        SequentialQueue.push({ command: 'OpenReport6' });
        // wait for Onyx.connect execute the callback and start processing the queue
        await Promise.resolve();
        const requestWithConflictResolution = {
            command: 'ReconnectApp-replaced',
            data: { accountID: 56789 },
            checkAndFixConflictingRequest: (persistedRequests) => {
                // should be one instance of ReconnectApp, get the index to replace it later
                const index = persistedRequests.findIndex((r) => r.command === 'ReconnectApp');
                if (index === -1) {
                    return { conflictAction: { type: 'push' } };
                }
                return {
                    conflictAction: { type: 'replace', index },
                };
            },
        };
        Promise.resolve().then(() => {
            SequentialQueue.unpause();
        });
        Promise.resolve().then(() => {
            SequentialQueue.push(requestWithConflictResolution);
        });
        await Promise.resolve();
        await (0, NetworkInterceptor_1.waitForActiveRequestsToBeEmpty)();
        const persistedRequests = (0, PersistedRequests_1.getAll)();
        // We know ReconnectApp is at index 9 in the queue, so we can get it to verify
        // that was replaced by the new request.
        expect(persistedRequests.at(9)?.command).toBe('ReconnectApp-replaced');
        expect(persistedRequests.at(9)?.data?.accountID).toBe(56789);
    });
    // I need to test now when moving the request from the queue to the ongoing request the PERSISTED_REQUESTS is decreased and PERSISTED_ONGOING_REQUESTS has the new request
    it('should move the request from the queue to the ongoing request and save it into Onyx', () => {
        const persistedRequest = { ...request, persistWhenOngoing: true, initiatedOffline: false };
        SequentialQueue.push(persistedRequest);
        const connectionId = react_native_onyx_1.default.connect({
            key: ONYXKEYS_1.default.PERSISTED_ONGOING_REQUESTS,
            callback: (ongoingRequest) => {
                if (!ongoingRequest) {
                    return;
                }
                react_native_onyx_1.default.disconnect(connectionId);
                expect(ongoingRequest).toEqual(persistedRequest);
                expect(ongoingRequest).toEqual((0, PersistedRequests_1.getOngoingRequest)());
                expect((0, PersistedRequests_1.getAll)().length).toBe(0);
            },
        });
    });
    it('should get the ongoing request from onyx and start processing it', async () => {
        const persistedRequest = { ...request, persistWhenOngoing: true, initiatedOffline: false };
        react_native_onyx_1.default.set(ONYXKEYS_1.default.PERSISTED_ONGOING_REQUESTS, persistedRequest);
        SequentialQueue.push({ command: 'OpenReport' });
        await Promise.resolve();
        expect(persistedRequest).toEqual((0, PersistedRequests_1.getOngoingRequest)());
        expect((0, PersistedRequests_1.getAll)().length).toBe(1);
    });
});
describe('SequentialQueue - QueueFlushedData', () => {
    it('should add to queueFlushedData', async () => {
        const updates = [{ key: 'userMetadata', onyxMethod: 'set', value: { accountID: 1234 } }];
        await SequentialQueue.saveQueueFlushedData(...updates);
        expect(SequentialQueue.getQueueFlushedData()).toEqual([{ key: 'userMetadata', onyxMethod: 'set', value: { accountID: 1234 } }]);
    });
    it('should clear queueFlushedData', async () => {
        const updates = [{ key: 'userMetadata', onyxMethod: 'set', value: { accountID: 1234 } }];
        await SequentialQueue.saveQueueFlushedData(...updates);
        await SequentialQueue.clearQueueFlushedData();
        expect(SequentialQueue.getQueueFlushedData()).toEqual([]);
    });
});
