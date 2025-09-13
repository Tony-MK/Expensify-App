"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_config_1 = require("react-native-config");
const e2eLogin_1 = require("@libs/E2E/actions/e2eLogin");
const waitForAppLoaded_1 = require("@libs/E2E/actions/waitForAppLoaded");
const client_1 = require("@libs/E2E/client");
const interactions_1 = require("@libs/E2E/interactions");
const getConfigValueOrThrow_1 = require("@libs/E2E/utils/getConfigValueOrThrow");
const CONST_1 = require("@src/CONST");
const NativeCommandsAction_1 = require("../../../../tests/e2e/nativeCommands/NativeCommandsAction");
const test = (config) => {
    // check for login (if already logged in the action will simply resolve)
    console.debug('[E2E] Logging in for money request');
    const name = (0, getConfigValueOrThrow_1.default)('name', config);
    (0, e2eLogin_1.default)().then((neededLogin) => {
        if (neededLogin) {
            return (0, waitForAppLoaded_1.default)().then(() => 
            // we don't want to submit the first login to the results
            client_1.default.submitTestDone());
        }
        console.debug('[E2E] Logged in, getting money request metrics and submitting them…');
        (0, interactions_1.waitForEvent)(CONST_1.default.TIMING.SIDEBAR_LOADED)
            .then(() => (0, interactions_1.tap)('floating-action-button'))
            .then(() => (0, interactions_1.waitForElement)('create-expense'))
            .then(() => (0, interactions_1.tap)('create-expense'))
            .then(() => (0, interactions_1.waitForEvent)(CONST_1.default.TIMING.OPEN_CREATE_EXPENSE))
            .then((entry) => {
            client_1.default.submitTestResults({
                branch: react_native_config_1.default.E2E_BRANCH,
                name: `${name} - Open Manual Tracking`,
                metric: entry.duration,
                unit: 'ms',
            });
        })
            .then(() => (0, interactions_1.waitForElement)('manual'))
            .then(() => (0, interactions_1.tap)('manual'))
            .then(() => client_1.default.sendNativeCommand((0, NativeCommandsAction_1.makeClearCommand)()))
            .then(() => (0, interactions_1.tap)('button_2'))
            .then(() => (0, interactions_1.waitForTextInputValue)('2', 'moneyRequestAmountInput'))
            .then(() => (0, interactions_1.tap)('next-button'))
            .then(() => (0, interactions_1.waitForEvent)(CONST_1.default.TIMING.OPEN_CREATE_EXPENSE_CONTACT))
            .then((entry) => {
            client_1.default.submitTestResults({
                branch: react_native_config_1.default.E2E_BRANCH,
                name: `${name} - Open Contacts`,
                metric: entry.duration,
                unit: 'ms',
            });
        })
            .then(() => (0, interactions_1.waitForElement)('+66 65 490 0617'))
            .then(() => (0, interactions_1.tap)('+66 65 490 0617'))
            .then(() => (0, interactions_1.waitForEvent)(CONST_1.default.TIMING.OPEN_CREATE_EXPENSE_APPROVE))
            .then((entry) => {
            client_1.default.submitTestResults({
                branch: react_native_config_1.default.E2E_BRANCH,
                name: `${name} - Open Create`,
                metric: entry.duration,
                unit: 'ms',
            });
        })
            .then(() => {
            console.debug('[E2E] Test completed successfully, exiting…');
            client_1.default.submitTestDone();
        })
            .catch((err) => {
            console.debug('[E2E] Error while submitting test results:', err);
        });
    });
};
exports.default = test;
