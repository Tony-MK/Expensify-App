"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
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
    console.debug('[E2E] Logging in for comment linking');
    const reportID = (0, getConfigValueOrThrow_1.default)('reportID', config);
    const linkedReportID = (0, getConfigValueOrThrow_1.default)('linkedReportID', config);
    const linkedReportActionID = (0, getConfigValueOrThrow_1.default)('linkedReportActionID', config);
    const name = (0, getConfigValueOrThrow_1.default)('name', config);
    const startTestTime = Date.now();
    console.debug('[E2E] Test started at:', startTestTime);
    (0, e2eLogin_1.default)().then((neededLogin) => {
        if (neededLogin) {
            return (0, waitForAppLoaded_1.default)().then(() => client_1.default.submitTestDone());
        }
        const [appearMessagePromise, appearMessageResolve] = (0, getPromiseWithResolve_1.default)();
        const [openReportPromise, openReportResolve] = (0, getPromiseWithResolve_1.default)();
        let lastVisibleMessageId;
        let verificationStarted = false;
        let hasNavigatedToLinkedMessage = false;
        const subscription = react_native_1.DeviceEventEmitter.addListener('onViewableItemsChanged', (res) => {
            console.debug('[E2E] Viewable items event triggered at:', Date.now());
            // update the last visible message
            lastVisibleMessageId = res?.at(0)?.item?.reportActionID;
            console.debug('[E2E] Current visible message:', lastVisibleMessageId);
            if (!verificationStarted && lastVisibleMessageId === linkedReportActionID) {
                console.debug('[E2E] Target message found, starting verification');
                verificationStarted = true;
                setTimeout(() => {
                    console.debug('[E2E] Verification timeout completed');
                    console.debug('[E2E] Last visible message ID:', lastVisibleMessageId);
                    console.debug('[E2E] Expected message ID:', linkedReportActionID);
                    subscription.remove();
                    if (lastVisibleMessageId === linkedReportActionID) {
                        console.debug('[E2E] Message position verified successfully');
                        appearMessageResolve();
                    }
                    else {
                        console.debug('[E2E] Linked message not found, failing test!');
                        client_1.default.submitTestResults({
                            branch: react_native_config_1.default.E2E_BRANCH,
                            error: 'Linked message not found',
                            name: `${name} test can't find linked message`,
                        }).then(() => client_1.default.submitTestDone());
                    }
                }, 3000);
            }
        });
        Promise.all([appearMessagePromise, openReportPromise])
            .then(() => {
            console.debug('[E2E] Test completed successfully at:', Date.now());
            console.debug('[E2E] Total test duration:', Date.now() - startTestTime, 'ms');
            client_1.default.submitTestDone();
        })
            .catch((err) => {
            console.debug('[E2E] Error while submitting test results:', err);
        });
        Performance_1.default.subscribeToMeasurements((entry) => {
            console.debug(`[E2E] Performance entry captured: ${entry.name} at ${entry.startTime}, duration: ${entry.duration} ms`);
            if (entry.name === CONST_1.default.TIMING.SIDEBAR_LOADED) {
                console.debug('[E2E] Sidebar loaded, navigating to a report at:', Date.now());
                const startNavigateTime = Date.now();
                Performance_1.default.markStart(CONST_1.default.TIMING.OPEN_REPORT);
                Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID));
                console.debug('[E2E] Navigation to report took:', Date.now() - startNavigateTime, 'ms');
                return;
            }
            if (entry.name === CONST_1.default.TIMING.OPEN_REPORT && !hasNavigatedToLinkedMessage) {
                console.debug('[E2E] Navigating to the linked report action at:', Date.now());
                const startLinkedNavigateTime = Date.now();
                hasNavigatedToLinkedMessage = true; // Set flag to prevent duplicate navigation
                Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(linkedReportID, linkedReportActionID));
                console.debug('[E2E] Navigation to linked report took:', Date.now() - startLinkedNavigateTime, 'ms');
                client_1.default.submitTestResults({
                    branch: react_native_config_1.default.E2E_BRANCH,
                    name,
                    metric: entry.duration,
                    unit: 'ms',
                });
                openReportResolve();
            }
        });
    });
};
exports.default = test;
