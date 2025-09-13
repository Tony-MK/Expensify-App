"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_config_1 = require("react-native-config");
const e2eLogin_1 = require("@libs/E2E/actions/e2eLogin");
const waitForAppLoaded_1 = require("@libs/E2E/actions/waitForAppLoaded");
const client_1 = require("@libs/E2E/client");
const getConfigValueOrThrow_1 = require("@libs/E2E/utils/getConfigValueOrThrow");
const Performance_1 = require("@libs/Performance");
const test = (config) => {
    const name = (0, getConfigValueOrThrow_1.default)('name', config);
    // check for login (if already logged in the action will simply resolve)
    (0, e2eLogin_1.default)().then((neededLogin) => {
        if (neededLogin) {
            return (0, waitForAppLoaded_1.default)().then(() => 
            // we don't want to submit the first login to the results
            client_1.default.submitTestDone());
        }
        console.debug('[E2E] Logged in, getting metrics and submitting them…');
        // collect performance metrics and submit
        const metrics = Performance_1.default.getPerformanceMetrics();
        // promises in sequence without for-loop
        Promise.all(metrics.map((metric) => client_1.default.submitTestResults({
            branch: react_native_config_1.default.E2E_BRANCH,
            name: `${name} ${metric.name}`,
            metric: metric.duration,
            unit: 'ms',
        })))
            .then(() => {
            console.debug('[E2E] Done, exiting…');
            client_1.default.submitTestDone();
        })
            .catch((err) => {
            console.debug('[E2E] Error while submitting test results:', err);
        });
    });
};
exports.default = test;
