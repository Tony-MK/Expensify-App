"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const OnyxUpdateManager_1 = require("@src/libs/actions/OnyxUpdateManager");
const Policy = require("@src/libs/actions/Policy/Policy");
const ReportUtils = require("@src/libs/ReportUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const policies_1 = require("../utils/collections/policies");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
(0, OnyxUpdateManager_1.default)();
describe('actions/PolicyProfile', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    let mockFetch;
    beforeEach(() => {
        global.fetch = TestHelper.getGlobalFetchMock();
        mockFetch = fetch;
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    describe('updateWorkspaceDescription', () => {
        it('Update workspace`s description', async () => {
            const fakePolicy = (0, policies_1.default)(0);
            const oldDescription = fakePolicy.description ?? '';
            const newDescription = 'Updated description';
            const parsedDescription = ReportUtils.getParsedComment(newDescription);
            mockFetch?.pause?.();
            react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`, fakePolicy);
            Policy.updateWorkspaceDescription(fakePolicy.id, newDescription, oldDescription);
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.description).toBe(parsedDescription);
                        expect(policy?.pendingFields?.description).toBe(CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE);
                        expect(policy?.errorFields?.description).toBeFalsy();
                        resolve();
                    },
                });
            });
            await mockFetch?.resume?.();
            await (0, waitForBatchedUpdates_1.default)();
            await new Promise((resolve) => {
                const connection = react_native_onyx_1.default.connect({
                    key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${fakePolicy.id}`,
                    waitForCollectionCallback: false,
                    callback: (policy) => {
                        react_native_onyx_1.default.disconnect(connection);
                        expect(policy?.pendingFields?.description).toBeFalsy();
                        resolve();
                    },
                });
            });
        });
    });
});
