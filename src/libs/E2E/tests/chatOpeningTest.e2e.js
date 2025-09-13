"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_config_1 = require("react-native-config");
const e2eLogin_1 = require("@libs/E2E/actions/e2eLogin");
const waitForAppLoaded_1 = require("@libs/E2E/actions/waitForAppLoaded");
const client_1 = require("@libs/E2E/client");
const getConfigValueOrThrow_1 = require("@libs/E2E/utils/getConfigValueOrThrow");
const getPromiseWithResolve_1 = require("@libs/E2E/utils/getPromiseWithResolve");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Performance_1 = require("@libs/Performance");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const test = (config) => {
    // check for login (if already logged in the action will simply resolve)
    console.debug('[E2E] Logging in for chat opening');
    const reportID = (0, getConfigValueOrThrow_1.default)('reportID', config);
    const name = (0, getConfigValueOrThrow_1.default)('name', config);
    (0, e2eLogin_1.default)().then((neededLogin) => {
        if (neededLogin) {
            return (0, waitForAppLoaded_1.default)().then(() => 
            // we don't want to submit the first login to the results
            client_1.default.submitTestDone());
        }
        console.debug('[E2E] Logged in, getting chat opening metrics and submitting them…');
        const [chatTTIPromise, chatTTIResolve] = (0, getPromiseWithResolve_1.default)();
        chatTTIPromise.then(() => {
            console.debug(`[E2E] Submitting!`);
            client_1.default.submitTestDone();
        });
        Performance_1.default.subscribeToMeasurements((entry) => {
            if (entry.name === CONST_1.default.TIMING.SIDEBAR_LOADED) {
                console.debug(`[E2E] Sidebar loaded, navigating to report…`);
                Performance_1.default.markStart(CONST_1.default.TIMING.OPEN_REPORT);
                Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID));
                return;
            }
            console.debug(`[E2E] Entry: ${JSON.stringify(entry)}`);
            if (entry.name === CONST_1.default.TIMING.OPEN_REPORT) {
                client_1.default.submitTestResults({
                    branch: react_native_config_1.default.E2E_BRANCH,
                    name: `${name} Chat TTI`,
                    metric: entry.duration,
                    unit: 'ms',
                })
                    .then(() => {
                    console.debug('[E2E] Done with chat TTI tracking, exiting…');
                    chatTTIResolve();
                })
                    .catch((err) => {
                    console.debug('[E2E] Error while submitting test results:', err);
                });
            }
        });
    });
};
exports.default = test;
