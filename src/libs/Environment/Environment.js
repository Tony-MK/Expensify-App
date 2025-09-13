"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvironment = void 0;
exports.isInternalTestBuild = isInternalTestBuild;
exports.isDevelopment = isDevelopment;
exports.isProduction = isProduction;
exports.getEnvironmentURL = getEnvironmentURL;
exports.getOldDotEnvironmentURL = getOldDotEnvironmentURL;
exports.getOldDotURLFromEnvironment = getOldDotURLFromEnvironment;
const react_native_config_1 = require("react-native-config");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const getEnvironment_1 = require("./getEnvironment");
exports.getEnvironment = getEnvironment_1.default;
const ENVIRONMENT_URLS = {
    [CONST_1.default.ENVIRONMENT.DEV]: CONST_1.default.DEV_NEW_EXPENSIFY_URL + CONFIG_1.default.DEV_PORT,
    [CONST_1.default.ENVIRONMENT.STAGING]: CONST_1.default.STAGING_NEW_EXPENSIFY_URL,
    [CONST_1.default.ENVIRONMENT.PRODUCTION]: CONST_1.default.NEW_EXPENSIFY_URL,
    [CONST_1.default.ENVIRONMENT.ADHOC]: CONST_1.default.STAGING_NEW_EXPENSIFY_URL,
};
const OLDDOT_ENVIRONMENT_URLS = {
    [CONST_1.default.ENVIRONMENT.DEV]: CONST_1.default.INTERNAL_DEV_EXPENSIFY_URL,
    [CONST_1.default.ENVIRONMENT.STAGING]: CONST_1.default.STAGING_EXPENSIFY_URL,
    [CONST_1.default.ENVIRONMENT.PRODUCTION]: CONST_1.default.EXPENSIFY_URL,
    [CONST_1.default.ENVIRONMENT.ADHOC]: CONST_1.default.STAGING_EXPENSIFY_URL,
};
/**
 * Are we running the app in development?
 */
function isDevelopment() {
    return (react_native_config_1.default?.ENVIRONMENT ?? CONST_1.default.ENVIRONMENT.DEV) === CONST_1.default.ENVIRONMENT.DEV;
}
/**
 * Are we running the app in production?
 */
function isProduction() {
    return (0, getEnvironment_1.default)().then((environment) => environment === CONST_1.default.ENVIRONMENT.PRODUCTION);
}
/**
 * Are we running an internal test build?
 */
function isInternalTestBuild() {
    return !!((react_native_config_1.default?.ENVIRONMENT ?? CONST_1.default.ENVIRONMENT.DEV) === CONST_1.default.ENVIRONMENT.ADHOC && (react_native_config_1.default?.PULL_REQUEST_NUMBER ?? ''));
}
/**
 * Get the URL based on the environment we are in
 */
function getEnvironmentURL() {
    return new Promise((resolve) => {
        (0, getEnvironment_1.default)().then((environment) => resolve(ENVIRONMENT_URLS[environment]));
    });
}
/**
 * Given the environment get the corresponding oldDot URL
 */
function getOldDotURLFromEnvironment(environment) {
    return OLDDOT_ENVIRONMENT_URLS[environment];
}
/**
 * Get the corresponding oldDot URL based on the environment we are in
 */
function getOldDotEnvironmentURL() {
    return (0, getEnvironment_1.default)().then((environment) => OLDDOT_ENVIRONMENT_URLS[environment]);
}
