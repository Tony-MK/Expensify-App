"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const Alert_1 = require("@components/Alert");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Network_1 = require("./actions/Network");
const UpdateRequired_1 = require("./actions/UpdateRequired");
const types_1 = require("./API/types");
const ApiUtils_1 = require("./ApiUtils");
const HttpsError_1 = require("./Errors/HttpsError");
const prepareRequestPayload_1 = require("./prepareRequestPayload");
let shouldFailAllRequests = false;
let shouldForceOffline = false;
const ABORT_COMMANDS = {
    All: 'All',
    [types_1.READ_COMMANDS.SEARCH_FOR_REPORTS]: types_1.READ_COMMANDS.SEARCH_FOR_REPORTS,
};
// We have used `connectWithoutView` here because HttpUtils is not connected to any UI component
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.NETWORK,
    callback: (network) => {
        if (!network) {
            return;
        }
        shouldFailAllRequests = !!network.shouldFailAllRequests;
        shouldForceOffline = !!network.shouldForceOffline;
    },
});
// We use the AbortController API to terminate pending request in `cancelPendingRequests`
const abortControllerMap = new Map();
abortControllerMap.set(ABORT_COMMANDS.All, new AbortController());
abortControllerMap.set(ABORT_COMMANDS.SearchForReports, new AbortController());
/**
 * The API commands that require the skew calculation
 */
const addSkewList = [types_1.WRITE_COMMANDS.OPEN_REPORT, types_1.SIDE_EFFECT_REQUEST_COMMANDS.RECONNECT_APP, types_1.WRITE_COMMANDS.OPEN_APP];
/**
 * Regex to get API command from the command
 */
const APICommandRegex = /\/api\/([^&?]+)\??.*/;
/**
 * Send an HTTP request, and attempt to resolve the json response.
 * If there is a network error, we'll set the application offline.
 */
function processHTTPRequest(url, method = 'get', body = null, abortSignal = undefined) {
    const startTime = new Date().valueOf();
    return fetch(url, {
        // We hook requests to the same Controller signal, so we can cancel them all at once
        signal: abortSignal,
        method,
        body,
        // On Web fetch already defaults to 'omit' for credentials, but it seems that this is not the case for the ReactNative implementation
        // so to avoid sending cookies with the request we set it to 'omit' explicitly
        // this avoids us sending specially the expensifyWeb cookie, which makes a CSRF token required
        // more on that here: https://stackoverflowteams.com/c/expensify/questions/93
        credentials: 'omit',
    })
        .then((response) => {
        // We are calculating the skew to minimize the delay when posting the messages
        const match = url.match(APICommandRegex)?.[1];
        if (match && addSkewList.includes(match) && response.headers) {
            const dateHeaderValue = response.headers.get('Date');
            const serverTime = dateHeaderValue ? new Date(dateHeaderValue).valueOf() : new Date().valueOf();
            const endTime = new Date().valueOf();
            const latency = (endTime - startTime) / 2;
            const skew = serverTime - startTime + latency;
            (0, Network_1.setTimeSkew)(dateHeaderValue ? skew : 0);
        }
        return response;
    })
        .then((response) => {
        // Test mode where all requests will succeed in the server, but fail to return a response
        if (shouldFailAllRequests || shouldForceOffline) {
            throw new HttpsError_1.default({
                message: CONST_1.default.ERROR.FAILED_TO_FETCH,
            });
        }
        if (!response.ok) {
            // Expensify site is down or there was an internal server error, or something temporary like a Bad Gateway, or unknown error occurred
            const serviceInterruptedStatuses = [
                CONST_1.default.HTTP_STATUS.INTERNAL_SERVER_ERROR,
                CONST_1.default.HTTP_STATUS.BAD_GATEWAY,
                CONST_1.default.HTTP_STATUS.GATEWAY_TIMEOUT,
                CONST_1.default.HTTP_STATUS.UNKNOWN_ERROR,
            ];
            if (serviceInterruptedStatuses.indexOf(response.status) > -1) {
                throw new HttpsError_1.default({
                    message: CONST_1.default.ERROR.EXPENSIFY_SERVICE_INTERRUPTED,
                    status: response.status.toString(),
                    title: 'Issue connecting to Expensify site',
                });
            }
            if (response.status === CONST_1.default.HTTP_STATUS.TOO_MANY_REQUESTS) {
                throw new HttpsError_1.default({
                    message: CONST_1.default.ERROR.THROTTLED,
                    status: response.status.toString(),
                    title: 'API request throttled',
                });
            }
            throw new HttpsError_1.default({
                message: response.statusText,
                status: response.status.toString(),
            });
        }
        return response.json();
    })
        .then((response) => {
        // Some retried requests will result in a "Unique Constraints Violation" error from the server, which just means the record already exists
        if (response.jsonCode === CONST_1.default.JSON_CODE.BAD_REQUEST && response.message === CONST_1.default.ERROR_TITLE.DUPLICATE_RECORD) {
            throw new HttpsError_1.default({
                message: CONST_1.default.ERROR.DUPLICATE_RECORD,
                status: CONST_1.default.JSON_CODE.BAD_REQUEST.toString(),
                title: CONST_1.default.ERROR_TITLE.DUPLICATE_RECORD,
            });
        }
        // Auth is down or timed out while making a request
        if (response.jsonCode === CONST_1.default.JSON_CODE.EXP_ERROR && response.title === CONST_1.default.ERROR_TITLE.SOCKET && response.type === CONST_1.default.ERROR_TYPE.SOCKET) {
            throw new HttpsError_1.default({
                message: CONST_1.default.ERROR.EXPENSIFY_SERVICE_INTERRUPTED,
                status: CONST_1.default.JSON_CODE.EXP_ERROR.toString(),
                title: CONST_1.default.ERROR_TITLE.SOCKET,
            });
        }
        if (response.data && (response.data?.authWriteCommands?.length ?? 0)) {
            const { phpCommandName, authWriteCommands } = response.data;
            const message = `The API command ${phpCommandName} is doing too many Auth writes. Count ${authWriteCommands.length}, commands: ${authWriteCommands.join(', ')}. If you modified this command, you MUST refactor it to remove the extra Auth writes. Otherwise, update the allowed write count in Web-Expensify APIWriteCommands.`;
            (0, Alert_1.default)('Too many auth writes', message);
        }
        if (response.jsonCode === CONST_1.default.JSON_CODE.UPDATE_REQUIRED) {
            // Trigger a modal and disable the app as the user needs to upgrade to the latest minimum version to continue
            (0, UpdateRequired_1.alertUser)();
        }
        return response;
    });
}
/**
 * Makes XHR request
 * @param command the name of the API command
 * @param data parameters for the API command
 * @param type HTTP request type (get/post)
 * @param shouldUseSecure should we use the secure server
 */
function xhr(command, data, type = CONST_1.default.NETWORK.METHOD.POST, shouldUseSecure = false, initiatedOffline = false) {
    return (0, prepareRequestPayload_1.default)(command, data, initiatedOffline).then((formData) => {
        const url = (0, ApiUtils_1.getCommandURL)({ shouldUseSecure, command });
        const abortSignalController = data.canCancel ? (abortControllerMap.get(command) ?? abortControllerMap.get(ABORT_COMMANDS.All)) : undefined;
        return processHTTPRequest(url, type, formData, abortSignalController?.signal);
    });
}
function cancelPendingRequests(command = ABORT_COMMANDS.All) {
    const controller = abortControllerMap.get(command);
    controller?.abort();
    // We create a new instance because once `abort()` is called any future requests using the same controller would
    // automatically get rejected: https://dom.spec.whatwg.org/#abortcontroller-api-integration
    abortControllerMap.set(command, new AbortController());
}
exports.default = {
    xhr,
    cancelPendingRequests,
    processHTTPRequest,
};
