"use strict";
// Making an exception to this rule here since we don't need an "action" for Log and Log should just be used directly. Creating a Log
// action would likely cause confusion about which one to use. But most other API methods should happen inside an action file.
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable rulesdir/no-api-in-views */
const expensify_common_1 = require("expensify-common");
const react_native_app_logs_1 = require("react-native-app-logs");
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const package_json_1 = require("../../package.json");
const Console_1 = require("./actions/Console");
const Console_2 = require("./Console");
const getPlatform_1 = require("./getPlatform");
const Network_1 = require("./Network");
const requireParameters_1 = require("./requireParameters");
let timeout;
let shouldCollectLogs = false;
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.SHOULD_STORE_LOGS,
    callback: (val) => {
        if (!val) {
            shouldCollectLogs = false;
        }
        shouldCollectLogs = !!val;
    },
});
function LogCommand(parameters) {
    const commandName = 'Log';
    (0, requireParameters_1.default)(['logPacket', 'expensifyCashAppVersion'], parameters, commandName);
    // Note: We are forcing Log to run since it requires no authToken and should only be queued when we are offline.
    // Non-cancellable request: during logout, when requests are cancelled, we don't want to cancel any remaining logs
    return (0, Network_1.post)(commandName, { ...parameters, forceNetworkRequest: true, canCancel: false });
}
/**
 * Network interface for logger.
 */
function serverLoggingCallback(logger, params) {
    const requestParams = params;
    requestParams.shouldProcessImmediately = false;
    requestParams.shouldRetry = false;
    requestParams.expensifyCashAppVersion = `expensifyCash[${(0, getPlatform_1.default)()}]${package_json_1.default.version}`;
    if (requestParams.parameters) {
        requestParams.parameters = JSON.stringify(requestParams.parameters);
    }
    clearTimeout(timeout);
    timeout = setTimeout(() => logger.info('Flushing logs older than 10 minutes', true, {}, true), 10 * 60 * 1000);
    return LogCommand(requestParams);
}
// Note: We are importing Logger from expensify-common because it is used by other platforms. The server and client logging
// callback methods are passed in here so we can decouple the logging library from the logging methods.
const Log = new expensify_common_1.Logger({
    serverLoggingCallback,
    clientLoggingCallback: (message, extraData) => {
        if (!(0, Console_2.shouldAttachLog)(message)) {
            return;
        }
        (0, Console_1.flushAllLogsOnAppLaunch)().then(() => {
            console.debug(message, extraData);
            if (shouldCollectLogs) {
                (0, Console_1.addLog)({ time: new Date(), level: CONST_1.default.DEBUG_CONSOLE.LEVELS.DEBUG, message, extraData });
            }
        });
    },
    maxLogLinesBeforeFlush: 150,
    isDebug: true,
});
timeout = setTimeout(() => Log.info('Flushing logs older than 10 minutes', true, {}, true), 10 * 60 * 1000);
react_native_app_logs_1.default.configure({ appGroupName: 'group.com.expensify.new', interval: -1 });
react_native_app_logs_1.default.registerHandler({
    filter: '[NotificationService]',
    handler: ({ filter, logs }) => {
        logs.forEach((log) => {
            // Both native and JS logs are captured by the filter so we replace the filter before logging to avoid an infinite loop
            const message = `[PushNotification] ${log.message.replace(filter, 'NotificationService -')}`;
            if (log.level === 'error') {
                Log.hmmm(message);
            }
            else {
                Log.info(message);
            }
        });
    },
});
exports.default = Log;
