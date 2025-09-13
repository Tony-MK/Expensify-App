"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = initialize;
exports.getUpdateContext = getUpdateContext;
var react_native_onyx_1 = require("react-native-onyx");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var betas;
var betaConfiguration;
var allReports;
var allPolicies;
var allReportNameValuePairs;
var allTransactions;
var isInitialized = false;
var connectionsInitializedCount = 0;
var totalConnections = 6;
var initializationPromise = null;
/**
 * Initialize persistent connections to Onyx data needed for OptimisticReportNames
 * This is called lazily when OptimisticReportNames functionality is first used
 * Returns a Promise that resolves when all connections have received their initial data
 *
 * We use Onyx.connectWithoutView because we do not use this in React components and this logic is not tied directly to the UI.
 * This is a centralized system that needs access to all objects of several types, so that when any updates affect
 * the computed report names, we can compute the new names according to the formula and add the necessary updates.
 * It wouldn't be possible to do this without connecting to all the data.
 *
 */
function initialize() {
    if (isInitialized) {
        return Promise.resolve();
    }
    if (initializationPromise) {
        return initializationPromise;
    }
    initializationPromise = new Promise(function (resolve) {
        var incrementInitialization = function () {
            connectionsInitializedCount++;
            if (connectionsInitializedCount === totalConnections) {
                isInitialized = true;
                resolve();
            }
        };
        // Connect to BETAS
        react_native_onyx_1.default.connectWithoutView({
            key: ONYXKEYS_1.default.BETAS,
            callback: function (val) {
                betas = val;
                incrementInitialization();
            },
        });
        // Connect to BETA_CONFIGURATION
        react_native_onyx_1.default.connectWithoutView({
            key: ONYXKEYS_1.default.BETA_CONFIGURATION,
            callback: function (val) {
                betaConfiguration = val;
                incrementInitialization();
            },
        });
        // Connect to all REPORTS
        react_native_onyx_1.default.connectWithoutView({
            key: ONYXKEYS_1.default.COLLECTION.REPORT,
            waitForCollectionCallback: true,
            callback: function (val) {
                var _a;
                allReports = (_a = val) !== null && _a !== void 0 ? _a : {};
                incrementInitialization();
            },
        });
        // Connect to all POLICIES
        react_native_onyx_1.default.connectWithoutView({
            key: ONYXKEYS_1.default.COLLECTION.POLICY,
            waitForCollectionCallback: true,
            callback: function (val) {
                var _a;
                allPolicies = (_a = val) !== null && _a !== void 0 ? _a : {};
                incrementInitialization();
            },
        });
        // Connect to all REPORT_NAME_VALUE_PAIRS
        react_native_onyx_1.default.connectWithoutView({
            key: ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS,
            waitForCollectionCallback: true,
            callback: function (val) {
                var _a;
                allReportNameValuePairs = (_a = val) !== null && _a !== void 0 ? _a : {};
                incrementInitialization();
            },
        });
        // Connect to all TRANSACTIONS
        react_native_onyx_1.default.connectWithoutView({
            key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
            waitForCollectionCallback: true,
            callback: function (val) {
                var _a;
                allTransactions = (_a = val) !== null && _a !== void 0 ? _a : {};
                incrementInitialization();
            },
        });
    });
    return initializationPromise;
}
/**
 * Get the current update context synchronously
 * Must be called after initialize() has completed
 */
function getUpdateContext() {
    if (!isInitialized) {
        throw new Error('OptimisticReportNamesConnectionManager not initialized. Call initialize() first.');
    }
    return {
        betas: betas,
        betaConfiguration: betaConfiguration,
        allReports: allReports !== null && allReports !== void 0 ? allReports : {},
        allPolicies: allPolicies !== null && allPolicies !== void 0 ? allPolicies : {},
        allReportNameValuePairs: allReportNameValuePairs !== null && allReportNameValuePairs !== void 0 ? allReportNameValuePairs : {},
        allTransactions: allTransactions !== null && allTransactions !== void 0 ? allTransactions : {},
    };
}
