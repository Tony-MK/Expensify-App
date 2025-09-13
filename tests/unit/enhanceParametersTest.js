"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const react_native_onyx_1 = require("react-native-onyx");
const package_json_1 = require("../../package.json");
const CONFIG_1 = require("../../src/CONFIG");
const enhanceParameters_1 = require("../../src/libs/Network/enhanceParameters");
const ONYXKEYS_1 = require("../../src/ONYXKEYS");
const waitForBatchedUpdates_1 = require("../utils/waitForBatchedUpdates");
beforeEach(() => react_native_onyx_1.default.clear());
test('Enhance parameters adds correct parameters for Log command with no authToken', () => {
    const command = 'Log';
    const parameters = { testParameter: 'test' };
    const email = 'test-user@test.com';
    const authToken = 'test-token';
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { email, authToken });
    return (0, waitForBatchedUpdates_1.default)().then(() => {
        const finalParameters = (0, enhanceParameters_1.default)(command, parameters);
        expect(finalParameters).toEqual({
            testParameter: 'test',
            api_setCookie: false,
            appversion: package_json_1.default.version,
            email,
            isFromDevEnv: true,
            platform: 'ios',
            referer: CONFIG_1.default.EXPENSIFY.EXPENSIFY_CASH_REFERER,
            clientUpdateID: -1,
        });
    });
});
test('Enhance parameters adds correct parameters for a command that requires authToken', () => {
    const command = 'Report_AddComment';
    const parameters = { testParameter: 'test' };
    const email = 'test-user@test.com';
    const authToken = 'test-token';
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { email, authToken });
    return (0, waitForBatchedUpdates_1.default)().then(() => {
        const finalParameters = (0, enhanceParameters_1.default)(command, parameters);
        expect(finalParameters).toEqual({
            testParameter: 'test',
            api_setCookie: false,
            appversion: package_json_1.default.version,
            email,
            isFromDevEnv: true,
            platform: 'ios',
            authToken,
            clientUpdateID: -1,
            referer: CONFIG_1.default.EXPENSIFY.EXPENSIFY_CASH_REFERER,
        });
    });
});
