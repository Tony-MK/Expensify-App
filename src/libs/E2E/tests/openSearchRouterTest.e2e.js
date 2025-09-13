"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_config_1 = require("react-native-config");
const E2EGenericPressableWrapper = require("@components/Pressable/GenericPressable/index.e2e");
const e2eLogin_1 = require("@libs/E2E/actions/e2eLogin");
const waitForAppLoaded_1 = require("@libs/E2E/actions/waitForAppLoaded");
const client_1 = require("@libs/E2E/client");
const getConfigValueOrThrow_1 = require("@libs/E2E/utils/getConfigValueOrThrow");
const getPromiseWithResolve_1 = require("@libs/E2E/utils/getPromiseWithResolve");
const Performance_1 = require("@libs/Performance");
const CONST_1 = require("@src/CONST");
const test = (config) => {
    // check for login (if already logged in the action will simply resolve)
    console.debug('[E2E] Logging in for new search router');
    const name = (0, getConfigValueOrThrow_1.default)('name', config);
    (0, e2eLogin_1.default)().then((neededLogin) => {
        if (neededLogin) {
            return (0, waitForAppLoaded_1.default)().then(() => 
            // we don't want to submit the first login to the results
            client_1.default.submitTestDone());
        }
        console.debug('[E2E] Logged in, getting search router metrics and submitting them…');
        const [openSearchRouterPromise, openSearchRouterResolve] = (0, getPromiseWithResolve_1.default)();
        const [loadSearchOptionsPromise, loadSearchOptionsResolve] = (0, getPromiseWithResolve_1.default)();
        Promise.all([openSearchRouterPromise, loadSearchOptionsPromise]).then(() => {
            console.debug(`[E2E] Submitting!`);
            client_1.default.submitTestDone();
        });
        Performance_1.default.subscribeToMeasurements((entry) => {
            console.debug(`[E2E] Entry: ${JSON.stringify(entry)}`);
            if (entry.name === CONST_1.default.TIMING.SIDEBAR_LOADED) {
                const props = E2EGenericPressableWrapper.getPressableProps('searchButton');
                if (!props) {
                    console.debug('[E2E] Search button not found, failing test!');
                    client_1.default.submitTestResults({
                        branch: react_native_config_1.default.E2E_BRANCH,
                        error: 'Search button not found',
                        name: `${name} Open Search Router TTI`,
                    }).then(() => client_1.default.submitTestDone());
                    return;
                }
                if (!props.onPress) {
                    console.debug('[E2E] Search button found but onPress prop was not present, failing test!');
                    client_1.default.submitTestResults({
                        branch: react_native_config_1.default.E2E_BRANCH,
                        error: 'Search button found but onPress prop was not present',
                        name: `${name} Open Search Router TTI`,
                    }).then(() => client_1.default.submitTestDone());
                    return;
                }
                // Open the search router
                props.onPress();
            }
            if (entry.name === CONST_1.default.TIMING.OPEN_SEARCH) {
                client_1.default.submitTestResults({
                    branch: react_native_config_1.default.E2E_BRANCH,
                    name: `${name} Open Search Router TTI`,
                    metric: entry.duration,
                    unit: 'ms',
                })
                    .then(() => {
                    openSearchRouterResolve();
                    console.debug('[E2E] Done with search, exiting…');
                })
                    .catch((err) => {
                    console.debug('[E2E] Error while submitting test results:', err);
                });
            }
            if (entry.name === CONST_1.default.TIMING.LOAD_SEARCH_OPTIONS) {
                client_1.default.submitTestResults({
                    branch: react_native_config_1.default.E2E_BRANCH,
                    name: `${name} Load Search Options`,
                    metric: entry.duration,
                    unit: 'ms',
                })
                    .then(() => {
                    loadSearchOptionsResolve();
                    console.debug('[E2E] Done with loading search options, exiting…');
                })
                    .catch((err) => {
                    console.debug('[E2E] Error while submitting test results:', err);
                });
            }
            console.debug(`[E2E] Submitting!`);
        });
    });
};
exports.default = test;
