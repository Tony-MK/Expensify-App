"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = enhanceParameters;
const react_native_onyx_1 = require("react-native-onyx");
const Environment = require("@libs/Environment/Environment");
const getPlatform_1 = require("@libs/getPlatform");
const CONFIG_1 = require("@src/CONFIG");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const package_json_1 = require("../../../package.json");
const NetworkStore_1 = require("./NetworkStore");
// For all requests, we'll send the lastUpdateID that is applied to this client. This will
// allow us to calculate previousUpdateID faster.
let lastUpdateIDAppliedToClient = -1;
// `lastUpdateIDAppliedToClient` is not dependent on any changes on the UI,
// so it is okay to use `connectWithoutView` here.
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.ONYX_UPDATES_LAST_UPDATE_ID_APPLIED_TO_CLIENT,
    callback: (value) => {
        if (value) {
            lastUpdateIDAppliedToClient = value;
        }
        else {
            lastUpdateIDAppliedToClient = -1;
        }
    },
});
// Check if the user is logged in as a delegate and send that if so
let delegate = '';
// To enhance the API parameters, we do not need to depend on the UI,
// so it is okay to use `connectWithoutView` here.
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.ACCOUNT,
    callback: (val) => {
        delegate = val?.delegatedAccess?.delegate ?? '';
    },
});
let stashedSupportLogin = '';
// To enhance the API parameters, we do not need to depend on the UI,
// so it is okay to use `connectWithoutView` here.
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.STASHED_CREDENTIALS,
    callback: (val) => {
        stashedSupportLogin = val?.login ?? '';
    },
});
/**
 * Does this command require an authToken?
 */
function isAuthTokenRequired(command) {
    return !['Log', 'Authenticate', 'BeginSignIn', 'SetPassword'].includes(command);
}
/**
 * Adds default values to our request data
 */
function enhanceParameters(command, parameters) {
    const finalParameters = { ...parameters };
    if (isAuthTokenRequired(command) && !parameters.authToken) {
        finalParameters.authToken = (0, NetworkStore_1.getAuthToken)() ?? null;
    }
    finalParameters.referer = CONFIG_1.default.EXPENSIFY.EXPENSIFY_CASH_REFERER;
    // In addition to the referer (ecash), we pass the platform to help differentiate what device type
    // is sending the request.
    finalParameters.platform = (0, getPlatform_1.default)();
    // This application does not save its authToken in cookies like the classic Expensify app.
    // Setting api_setCookie to false will ensure that the Expensify API doesn't set any cookies
    // and prevents interfering with the cookie authToken that Expensify classic uses.
    finalParameters.api_setCookie = false;
    // Include current user's email in every request and the server logs
    finalParameters.email = parameters.email ?? (0, NetworkStore_1.getCurrentUserEmail)();
    finalParameters.isFromDevEnv = Environment.isDevelopment();
    finalParameters.appversion = package_json_1.default.version;
    finalParameters.clientUpdateID = lastUpdateIDAppliedToClient;
    if (delegate) {
        finalParameters.delegate = delegate;
    }
    if (stashedSupportLogin) {
        finalParameters.stashedSupportLogin = stashedSupportLogin;
    }
    return finalParameters;
}
