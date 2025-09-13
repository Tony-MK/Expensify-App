"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiRoot = getApiRoot;
exports.getCommandURL = getCommandURL;
exports.isUsingStagingApi = isUsingStagingApi;
const react_native_onyx_1 = require("react-native-onyx");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const proxyConfig_1 = require("../../config/proxyConfig");
const Environment_1 = require("./Environment/Environment");
// To avoid rebuilding native apps, native apps use production config for both staging and prod
// We use the async environment check because it works on all platforms
let ENV_NAME = CONST_1.default.ENVIRONMENT.PRODUCTION;
let shouldUseStagingServer = false;
(0, Environment_1.getEnvironment)().then((envName) => {
    ENV_NAME = envName;
    // We connect here, so we have the updated ENV_NAME when Onyx callback runs
    // We only use the value of shouldUseStagingServer to determine which server we should point to.
    // Since they aren't connected to a UI anywhere, it's OK to use connectWithoutView()
    react_native_onyx_1.default.connectWithoutView({
        key: ONYXKEYS_1.default.SHOULD_USE_STAGING_SERVER,
        callback: (value) => {
            // Toggling between APIs is not allowed on production and internal dev environment
            if (ENV_NAME === CONST_1.default.ENVIRONMENT.PRODUCTION || CONFIG_1.default.IS_USING_LOCAL_WEB) {
                shouldUseStagingServer = false;
                return;
            }
            const defaultToggleState = ENV_NAME === CONST_1.default.ENVIRONMENT.STAGING || ENV_NAME === CONST_1.default.ENVIRONMENT.ADHOC;
            shouldUseStagingServer = value ?? defaultToggleState;
        },
    });
});
/**
 * Get the currently used API endpoint, unless forceProduction is set to true
 * (Non-production environments allow for dynamically switching the API)
 */
function getApiRoot(request, forceProduction = false) {
    const shouldUseSecure = request?.shouldUseSecure ?? false;
    if (shouldUseStagingServer && forceProduction !== true) {
        if (CONFIG_1.default.IS_USING_WEB_PROXY && !request?.shouldSkipWebProxy) {
            return shouldUseSecure ? proxyConfig_1.default.STAGING_SECURE : proxyConfig_1.default.STAGING;
        }
        return shouldUseSecure ? CONFIG_1.default.EXPENSIFY.STAGING_SECURE_API_ROOT : CONFIG_1.default.EXPENSIFY.STAGING_API_ROOT;
    }
    if (request?.shouldSkipWebProxy) {
        return shouldUseSecure ? CONFIG_1.default.EXPENSIFY.SECURE_EXPENSIFY_URL : CONFIG_1.default.EXPENSIFY.EXPENSIFY_URL;
    }
    return shouldUseSecure ? CONFIG_1.default.EXPENSIFY.DEFAULT_SECURE_API_ROOT : CONFIG_1.default.EXPENSIFY.DEFAULT_API_ROOT;
}
/**
 * Get the command url for the given request
 * @param - the name of the API command
 */
function getCommandURL(request) {
    // If request.command already contains ? then we don't need to append it
    return `${getApiRoot(request)}api/${request.command}${request.command.includes('?') ? '' : '?'}`;
}
/**
 * Check if we're currently using the staging API root
 */
function isUsingStagingApi() {
    return shouldUseStagingServer;
}
