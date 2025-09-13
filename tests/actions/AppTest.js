"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const DateUtils_1 = require("@libs/DateUtils");
require("@libs/Navigation/AppNavigator/AuthScreens");
const OnyxUpdateManager_1 = require("@src/libs/actions/OnyxUpdateManager");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const App = require("../../src/libs/actions/App");
const getOnyxValue_1 = require("../utils/getOnyxValue");
const TestHelper = require("../utils/TestHelper");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
jest.mock('@src/components/ConfirmedRoute.tsx');
(0, OnyxUpdateManager_1.default)();
describe('actions/App', () => {
    beforeAll(() => {
        react_native_onyx_1.default.init({
            keys: ONYXKEYS_1.default,
        });
    });
    beforeEach(() => {
        global.fetch = TestHelper.getGlobalFetchMock();
        return react_native_onyx_1.default.clear().then(waitForBatchedUpdates_1.default);
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    test('lastFullReconnectTime - openApp', async () => {
        // When Open App runs
        App.openApp();
        App.confirmReadyToOpenApp();
        await (0, waitForBatchedUpdates_1.default)();
        // The lastFullReconnectTime should be updated
        expect(await (0, getOnyxValue_1.default)(ONYXKEYS_1.default.LAST_FULL_RECONNECT_TIME)).toBeTruthy();
    });
    test('lastFullReconnectTime - full reconnectApp', async () => {
        // When a full ReconnectApp runs
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.HAS_LOADED_APP, true);
        App.reconnectApp();
        App.confirmReadyToOpenApp();
        await (0, waitForBatchedUpdates_1.default)();
        // The lastFullReconnectTime should be updated
        expect(await (0, getOnyxValue_1.default)(ONYXKEYS_1.default.LAST_FULL_RECONNECT_TIME)).toBeTruthy();
    });
    test('lastFullReconnectTime - incremental reconnectApp', async () => {
        // When an incremental ReconnectApp runs
        await react_native_onyx_1.default.set(ONYXKEYS_1.default.HAS_LOADED_APP, true);
        App.reconnectApp(123);
        App.confirmReadyToOpenApp();
        await (0, waitForBatchedUpdates_1.default)();
        // The lastFullReconnectTime should NOT be updated
        expect(await (0, getOnyxValue_1.default)(ONYXKEYS_1.default.LAST_FULL_RECONNECT_TIME)).toBeUndefined();
    });
    test('trigger full reconnect', async () => {
        const reconnectApp = jest.spyOn(App, 'reconnectApp');
        // When OpenApp runs
        App.openApp();
        App.confirmReadyToOpenApp();
        await (0, waitForBatchedUpdates_1.default)();
        // The lastFullReconnectTime should be updated
        expect(await (0, getOnyxValue_1.default)(ONYXKEYS_1.default.LAST_FULL_RECONNECT_TIME)).toBeTruthy();
        // And when a new reconnectAppIfFullReconnectBefore is received
        react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_RECONNECT_APP_IF_FULL_RECONNECT_BEFORE, DateUtils_1.default.getDBTime());
        await (0, waitForBatchedUpdates_1.default)();
        // Then ReconnectApp should get called with no updateIDFrom to perform a full reconnect
        expect(reconnectApp).toHaveBeenCalledTimes(1);
        expect(reconnectApp).toHaveBeenCalledWith();
    });
    test("don't trigger full reconnect", async () => {
        const reconnectApp = jest.spyOn(App, 'reconnectApp');
        // When OpenApp runs
        App.openApp();
        App.confirmReadyToOpenApp();
        await (0, waitForBatchedUpdates_1.default)();
        // The lastFullReconnectTime should be updated
        expect(await (0, getOnyxValue_1.default)(ONYXKEYS_1.default.LAST_FULL_RECONNECT_TIME)).toBeTruthy();
        // And when a reconnectAppIfFullReconnectBefore is received with a timestamp in the past
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        react_native_onyx_1.default.set(ONYXKEYS_1.default.NVP_RECONNECT_APP_IF_FULL_RECONNECT_BEFORE, DateUtils_1.default.getDBTime(yesterday.toISOString()));
        await (0, waitForBatchedUpdates_1.default)();
        // Then ReconnectApp should NOT get called
        expect(reconnectApp).toHaveBeenCalledTimes(0);
    });
});
