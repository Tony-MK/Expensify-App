"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_config_1 = require("react-native-config");
const react_native_reanimated_1 = require("react-native-reanimated");
const e2eLogin_1 = require("@libs/E2E/actions/e2eLogin");
const waitForAppLoaded_1 = require("@libs/E2E/actions/waitForAppLoaded");
const waitForKeyboard_1 = require("@libs/E2E/actions/waitForKeyboard");
const client_1 = require("@libs/E2E/client");
const getConfigValueOrThrow_1 = require("@libs/E2E/utils/getConfigValueOrThrow");
const getPromiseWithResolve_1 = require("@libs/E2E/utils/getPromiseWithResolve");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Performance_1 = require("@libs/Performance");
const index_e2e_1 = require("@pages/home/report/ReportActionCompose/ComposerWithSuggestions/index.e2e");
const ReportActionCompose_1 = require("@pages/home/report/ReportActionCompose/ReportActionCompose");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const NativeCommands = require("../../../../tests/e2e/nativeCommands/NativeCommandsAction");
const test = (config) => {
    // check for login (if already logged in the action will simply resolve)
    console.debug('[E2E] Logging in for typing');
    const reportID = (0, getConfigValueOrThrow_1.default)('reportID', config);
    const message = (0, getConfigValueOrThrow_1.default)('message', config);
    const name = (0, getConfigValueOrThrow_1.default)('name', config);
    (0, e2eLogin_1.default)().then((neededLogin) => {
        if (neededLogin) {
            return (0, waitForAppLoaded_1.default)().then(() => 
            // we don't want to submit the first login to the results
            client_1.default.submitTestDone());
        }
        console.debug('[E2E] Logged in, getting typing metrics and submitting them…');
        const [renderTimesPromise, renderTimesResolve] = (0, getPromiseWithResolve_1.default)();
        const [messageSentPromise, messageSentResolve] = (0, getPromiseWithResolve_1.default)();
        Promise.all([renderTimesPromise, messageSentPromise]).then(() => {
            console.debug(`[E2E] Submitting!`);
            client_1.default.submitTestDone();
        });
        Performance_1.default.subscribeToMeasurements((entry) => {
            if (entry.name === CONST_1.default.TIMING.SEND_MESSAGE) {
                client_1.default.submitTestResults({
                    branch: react_native_config_1.default.E2E_BRANCH,
                    name: `${name} Message sent`,
                    metric: entry.duration,
                    unit: 'ms',
                }).then(messageSentResolve);
                return;
            }
            if (entry.name !== CONST_1.default.TIMING.SIDEBAR_LOADED) {
                return;
            }
            console.debug(`[E2E] Sidebar loaded, navigating to a report…`);
            // Crowded Policy (Do Not Delete) Report, has a input bar available:
            Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID));
            // Wait until keyboard is visible (so we are focused on the input):
            (0, waitForKeyboard_1.default)().then(() => {
                console.debug(`[E2E] Keyboard visible, typing…`);
                client_1.default.sendNativeCommand(NativeCommands.makeBackspaceCommand())
                    .then(() => {
                    (0, index_e2e_1.resetRerenderCount)();
                    return Promise.resolve();
                })
                    .then(() => client_1.default.sendNativeCommand(NativeCommands.makeTypeTextCommand('A')))
                    .then(() => new Promise((resolve) => {
                    setTimeout(() => {
                        const rerenderCount = (0, index_e2e_1.getRerenderCount)();
                        client_1.default.submitTestResults({
                            branch: react_native_config_1.default.E2E_BRANCH,
                            name: `${name} Composer typing rerender count`,
                            metric: rerenderCount,
                            unit: 'renders',
                        })
                            .then(renderTimesResolve)
                            .then(resolve);
                    }, 3000);
                }))
                    .then(() => client_1.default.sendNativeCommand(NativeCommands.makeBackspaceCommand()))
                    .then(() => client_1.default.sendNativeCommand(NativeCommands.makeTypeTextCommand(message)))
                    .then(() => (0, react_native_reanimated_1.runOnUI)(ReportActionCompose_1.onSubmitAction)())
                    .catch((error) => {
                    console.error('[E2E] Error while test', error);
                    client_1.default.submitTestDone();
                });
            });
        });
    });
};
exports.default = test;
