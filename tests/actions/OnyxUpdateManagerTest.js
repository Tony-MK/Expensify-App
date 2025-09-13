"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const OnyxUtils_1 = require("react-native-onyx/dist/OnyxUtils");
// eslint-disable-next-line no-restricted-syntax -- this is required to allow mocking
const AppImport = require("@libs/actions/App");
const applyOnyxUpdatesReliably_1 = require("@libs/actions/applyOnyxUpdatesReliably");
// eslint-disable-next-line no-restricted-syntax -- this is required to allow mocking
const OnyxUpdateManagerExports = require("@libs/actions/OnyxUpdateManager");
// eslint-disable-next-line no-restricted-syntax -- this is required to allow mocking
const OnyxUpdateManagerUtilsImport = require("@libs/actions/OnyxUpdateManager/utils");
// eslint-disable-next-line no-restricted-syntax -- this is required to allow mocking
const ApplyUpdatesImport = require("@libs/actions/OnyxUpdateManager/utils/applyUpdates");
const SequentialQueue_1 = require("@libs/Network/SequentialQueue");
const CONST_1 = require("@src/CONST");
const OnyxUpdateManager_1 = require("@src/libs/actions/OnyxUpdateManager");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const OnyxUpdateMockUtils_1 = require("../utils/OnyxUpdateMockUtils");
jest.mock('@userActions/OnyxUpdates');
jest.mock('@userActions/App');
jest.mock('@userActions/OnyxUpdateManager/utils');
jest.mock('@userActions/OnyxUpdateManager/utils/applyUpdates', () => {
    const ApplyUpdatesImplementation = jest.requireActual('@userActions/OnyxUpdateManager/utils/applyUpdates');
    return {
        applyUpdates: jest.fn((updates) => ApplyUpdatesImplementation.applyUpdates(updates)),
    };
});
jest.mock('@hooks/useScreenWrapperTransitionStatus', () => ({
    default: () => ({
        didScreenTransitionEnd: true,
    }),
}));
jest.mock('@src/libs/SearchUIUtils', () => ({
    getSuggestedSearches: jest.fn().mockReturnValue({}),
}));
const App = AppImport;
const ApplyUpdates = ApplyUpdatesImport;
const OnyxUpdateManagerUtils = OnyxUpdateManagerUtilsImport;
const TEST_USER_ACCOUNT_ID = 1;
const REPORT_ID = 'testReport1';
const ONYX_KEY = `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${REPORT_ID}`;
const exampleReportAction = {
    actionName: CONST_1.default.REPORT.ACTIONS.TYPE.ADD_COMMENT,
    actorAccountID: TEST_USER_ACCOUNT_ID,
    automatic: false,
    avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_3.png',
    message: [{ type: 'COMMENT', html: 'Testing a comment', text: 'Testing a comment', translationKey: '' }],
    person: [{ type: 'TEXT', style: 'strong', text: 'Test User' }],
    shouldShow: true,
};
const initialData = { report1: exampleReportAction, report2: exampleReportAction, report3: exampleReportAction };
const mockUpdate1 = OnyxUpdateMockUtils_1.default.createUpdate(1, [
    {
        onyxMethod: OnyxUtils_1.default.METHOD.SET,
        key: ONYX_KEY,
        value: initialData,
    },
]);
const mockUpdate2 = OnyxUpdateMockUtils_1.default.createUpdate(2, [
    {
        onyxMethod: OnyxUtils_1.default.METHOD.MERGE,
        key: ONYX_KEY,
        value: {
            report1: null,
        },
    },
]);
const report2PersonDiff = {
    person: [
        { type: 'TEXT', style: 'light', text: 'Other Test User' },
        { type: 'TEXT', style: 'light', text: 'Other Test User 2' },
    ],
};
const report3AvatarDiff = {
    avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_5.png',
};
const mockUpdate3 = OnyxUpdateMockUtils_1.default.createUpdate(3, [
    {
        onyxMethod: OnyxUtils_1.default.METHOD.MERGE,
        key: ONYX_KEY,
        value: {
            report2: report2PersonDiff,
            report3: report3AvatarDiff,
        },
    },
]);
const mockUpdate4 = OnyxUpdateMockUtils_1.default.createUpdate(4, [
    {
        onyxMethod: OnyxUtils_1.default.METHOD.MERGE,
        key: ONYX_KEY,
        value: {
            report3: null,
        },
    },
]);
const report2AvatarDiff = {
    avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_6.png',
};
const report4 = {
    ...exampleReportAction,
    automatic: true,
};
const mockUpdate5 = OnyxUpdateMockUtils_1.default.createUpdate(5, [
    {
        onyxMethod: OnyxUtils_1.default.METHOD.MERGE,
        key: ONYX_KEY,
        value: {
            report2: report2AvatarDiff,
            report4,
        },
    },
]);
(0, OnyxUpdateManager_1.default)();
describe('actions/OnyxUpdateManager', () => {
    let reportActions;
    beforeAll(() => {
        react_native_onyx_1.default.init({ keys: ONYXKEYS_1.default });
        react_native_onyx_1.default.connect({
            key: ONYX_KEY,
            callback: (val) => (reportActions = val),
        });
    });
    beforeEach(async () => {
        jest.clearAllMocks();
        await react_native_onyx_1.default.clear();
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.ONYX_UPDATES_LAST_UPDATE_ID_APPLIED_TO_CLIENT, 1);
        await react_native_onyx_1.default.set(ONYX_KEY, initialData);
        OnyxUpdateManagerUtils.mockValues.beforeValidateAndApplyDeferredUpdates = undefined;
        App.mockValues.missingOnyxUpdatesToBeApplied = undefined;
        OnyxUpdateManagerExports.resetDeferralLogicVariables();
    });
    it('should trigger Onyx update gap handling', async () => {
        // Since we don't want to trigger actual GetMissingOnyxUpdates calls to the server/backend,
        // we have to mock the results of these calls. By setting the missingOnyxUpdatesToBeApplied
        // property on the mock, we can simulate the results of the GetMissingOnyxUpdates calls.
        App.mockValues.missingOnyxUpdatesToBeApplied = [mockUpdate2, mockUpdate3];
        (0, applyOnyxUpdatesReliably_1.default)(mockUpdate2);
        // Delay all later updates, so that the update 2 has time to be written to storage and for the
        // ONYXKEYS.ONYX_UPDATES_LAST_UPDATE_ID_APPLIED_TO_CLIENT to be updated.
        await new Promise((resolve) => {
            setTimeout(resolve, 0);
        });
        (0, applyOnyxUpdatesReliably_1.default)(mockUpdate4);
        (0, applyOnyxUpdatesReliably_1.default)(mockUpdate3);
        return OnyxUpdateManagerExports.queryPromise.then(() => {
            const expectedResult = {
                report2: {
                    ...exampleReportAction,
                    ...report2PersonDiff,
                },
            };
            expect(reportActions).toEqual(expectedResult);
            // GetMissingOnyxUpdates should have been called for the gap between update 2 and 4.
            // Since we queued update 4 before update 3, there's a gap to resolve, before we apply the deferred updates.
            expect(App.getMissingOnyxUpdates).toHaveBeenCalledTimes(1);
            expect(App.getMissingOnyxUpdates).toHaveBeenNthCalledWith(1, 2, 3);
            // After the missing updates have been applied, the applicable updates after
            // all locally applied updates should be applied. (4)
            expect(ApplyUpdates.applyUpdates).toHaveBeenCalledTimes(1);
            // eslint-disable-next-line @typescript-eslint/naming-convention
            expect(ApplyUpdates.applyUpdates).toHaveBeenNthCalledWith(1, { 4: mockUpdate4 });
        });
    });
    it('should trigger 2 GetMissingOnyxUpdates calls, because the deferred updates have gaps', async () => {
        // Since we don't want to trigger actual GetMissingOnyxUpdates calls to the server/backend,
        // we have to mock the results of these calls. By setting the missingOnyxUpdatesToBeApplied
        // property on the mock, we can simulate the results of the GetMissingOnyxUpdates calls.
        App.mockValues.missingOnyxUpdatesToBeApplied = [mockUpdate1, mockUpdate2];
        (0, applyOnyxUpdatesReliably_1.default)(mockUpdate3);
        (0, applyOnyxUpdatesReliably_1.default)(mockUpdate5);
        let finishFirstCall;
        const firstGetMissingOnyxUpdatesCallFinished = new Promise((resolve) => {
            finishFirstCall = resolve;
        });
        OnyxUpdateManagerUtils.mockValues.beforeValidateAndApplyDeferredUpdates = () => {
            // After the first GetMissingOnyxUpdates call has been resolved,
            // we have to set the mocked results of for the second call.
            App.mockValues.missingOnyxUpdatesToBeApplied = [mockUpdate3, mockUpdate4];
            finishFirstCall();
            return Promise.resolve();
        };
        return firstGetMissingOnyxUpdatesCallFinished
            .then(() => OnyxUpdateManagerExports.queryPromise)
            .then(() => {
            const expectedResult = {
                report2: {
                    ...exampleReportAction,
                    ...report2PersonDiff,
                    ...report2AvatarDiff,
                },
                report4,
            };
            expect(reportActions).toEqual(expectedResult);
            // GetMissingOnyxUpdates should have been called twice, once for the gap between update 1 and 3,
            // and once for the gap between update 3 and 5.
            // We always fetch missing updates from the lastUpdateIDAppliedToClient
            // to previousUpdateID of the first deferred update. First 1-2, second 3-4
            expect(App.getMissingOnyxUpdates).toHaveBeenCalledTimes(2);
            expect(App.getMissingOnyxUpdates).toHaveBeenNthCalledWith(1, 1, 2);
            expect(App.getMissingOnyxUpdates).toHaveBeenNthCalledWith(2, 3, 4);
            // Since we have two GetMissingOnyxUpdates calls, there will be two sets of applicable updates.
            // The first applicable update will be 3, after missing updates 1-2 have been applied.
            // The second applicable update will be 5, after missing updates 3-4 have been applied.
            expect(ApplyUpdates.applyUpdates).toHaveBeenCalledTimes(2);
            // eslint-disable-next-line @typescript-eslint/naming-convention
            expect(ApplyUpdates.applyUpdates).toHaveBeenNthCalledWith(1, { 3: mockUpdate3 });
            // eslint-disable-next-line @typescript-eslint/naming-convention
            expect(ApplyUpdates.applyUpdates).toHaveBeenNthCalledWith(2, { 5: mockUpdate5 });
        });
    });
    it('should pause SequentialQueue while missing updates are being fetched', async () => {
        // Since we don't want to trigger actual GetMissingOnyxUpdates calls to the server/backend,
        // we have to mock the results of these calls. By setting the missingOnyxUpdatesToBeApplied
        // property on the mock, we can simulate the results of the GetMissingOnyxUpdates calls.
        App.mockValues.missingOnyxUpdatesToBeApplied = [mockUpdate1, mockUpdate2];
        (0, applyOnyxUpdatesReliably_1.default)(mockUpdate3);
        (0, applyOnyxUpdatesReliably_1.default)(mockUpdate5);
        const assertAfterFirstGetMissingOnyxUpdates = () => {
            // While the fetching of missing updates and the validation and application of the deferred updates is running,
            // the SequentialQueue should be paused.
            expect((0, SequentialQueue_1.isPaused)()).toBeTruthy();
            expect(App.getMissingOnyxUpdates).toHaveBeenCalledTimes(1);
            expect(App.getMissingOnyxUpdates).toHaveBeenNthCalledWith(1, 1, 2);
        };
        const assertAfterSecondGetMissingOnyxUpdates = () => {
            // The SequentialQueue should still be paused.
            expect((0, SequentialQueue_1.isPaused)()).toBeTruthy();
            expect((0, SequentialQueue_1.isRunning)()).toBeFalsy();
            expect(App.getMissingOnyxUpdates).toHaveBeenCalledTimes(2);
            expect(App.getMissingOnyxUpdates).toHaveBeenNthCalledWith(2, 3, 4);
        };
        let firstCallFinished = false;
        OnyxUpdateManagerUtils.mockValues.beforeValidateAndApplyDeferredUpdates = () => {
            if (firstCallFinished) {
                assertAfterSecondGetMissingOnyxUpdates();
                return Promise.resolve();
            }
            assertAfterFirstGetMissingOnyxUpdates();
            // After the first GetMissingOnyxUpdates call has been resolved,
            // we have to set the mocked results of for the second call.
            App.mockValues.missingOnyxUpdatesToBeApplied = [mockUpdate3, mockUpdate4];
            firstCallFinished = true;
            return Promise.resolve();
        };
        return OnyxUpdateManagerExports.queryPromise.then(() => {
            // Once the OnyxUpdateManager has finished filling the gaps, the SequentialQueue should be unpaused again.
            // It must not necessarily be running, because it might not have been flushed yet.
            expect((0, SequentialQueue_1.isPaused)()).toBeFalsy();
            expect(App.getMissingOnyxUpdates).toHaveBeenCalledTimes(2);
        });
    });
});
