"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../../tests/e2e/config");
const routes_1 = require("../../../tests/e2e/server/routes");
const NetworkInterceptor_1 = require("./utils/NetworkInterceptor");
const SERVER_ADDRESS = `http://localhost:${config_1.default.SERVER_PORT}`;
const defaultHeaders = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'X-E2E-Server-Request': 'true',
};
const defaultRequestInit = {
    headers: defaultHeaders,
};
const sendRequest = (url, data) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'application/json',
            ...defaultHeaders,
        },
        body: JSON.stringify(data),
    }).then((res) => {
        if (res.status === 200) {
            return res;
        }
        const errorMsg = `[E2E] Client failed to send request to "${url}". Returned status: ${res.status}`;
        return res
            .json()
            .then((responseText) => {
            throw new Error(`${errorMsg}: ${responseText}`);
        })
            .catch(() => {
            throw new Error(errorMsg);
        });
    });
};
/**
 * Submits a test result to the server.
 * Note: a test can have multiple test results.
 */
const submitTestResults = (testResult) => {
    console.debug(`[E2E] Submitting test result '${testResult.name}'…`);
    return sendRequest(`${SERVER_ADDRESS}${routes_1.default.testResults}`, testResult).then(() => {
        console.debug(`[E2E] Test result '${testResult.name}' submitted successfully`);
    });
};
const submitTestDone = () => (0, NetworkInterceptor_1.waitForActiveRequestsToBeEmpty)().then(() => fetch(`${SERVER_ADDRESS}${routes_1.default.testDone}`, defaultRequestInit));
let currentActiveTestConfig = null;
const getTestConfig = () => fetch(`${SERVER_ADDRESS}${routes_1.default.testConfig}`, defaultRequestInit)
    .then((res) => res.json())
    .then((config) => {
    currentActiveTestConfig = config;
    return config;
});
const getCurrentActiveTestConfig = () => currentActiveTestConfig;
const sendNativeCommand = (payload) => {
    console.debug(`[E2E] Sending native command '${payload.actionName}'…`);
    return sendRequest(`${SERVER_ADDRESS}${routes_1.default.testNativeCommand}`, payload).then(() => {
        console.debug(`[E2E] Native command '${payload.actionName}' sent successfully`);
    });
};
const updateNetworkCache = (appInstanceId, networkCache) => {
    console.debug('[E2E] Updating network cache…');
    return sendRequest(`${SERVER_ADDRESS}${routes_1.default.testUpdateNetworkCache}`, {
        appInstanceId,
        cache: networkCache,
    }).then(() => {
        console.debug('[E2E] Network cache updated successfully');
    });
};
const getNetworkCache = (appInstanceId) => sendRequest(`${SERVER_ADDRESS}${routes_1.default.testGetNetworkCache}`, { appInstanceId })
    .then((res) => res.json())
    .then((networkCache) => {
    console.debug('[E2E] Network cache fetched successfully');
    return networkCache;
});
exports.default = {
    submitTestResults,
    submitTestDone,
    getTestConfig,
    getCurrentActiveTestConfig,
    sendNativeCommand,
    updateNetworkCache,
    getNetworkCache,
};
