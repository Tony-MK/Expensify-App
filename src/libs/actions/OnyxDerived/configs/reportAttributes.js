"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var ReportUtils_1 = require("@libs/ReportUtils");
var SidebarUtils_1 = require("@libs/SidebarUtils");
var createOnyxDerivedValueConfig_1 = require("@userActions/OnyxDerived/createOnyxDerivedValueConfig");
var utils_1 = require("@userActions/OnyxDerived/utils");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var isFullyComputed = false;
var previousDisplayNames = {};
var previousPersonalDetails;
var prepareReportKeys = function (keys) {
    return __spreadArray([], new Set(keys.map(function (key) {
        return key
            .replace(ONYXKEYS_1.default.COLLECTION.REPORT_METADATA, ONYXKEYS_1.default.COLLECTION.REPORT)
            .replace(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, ONYXKEYS_1.default.COLLECTION.REPORT)
            .replace(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS, ONYXKEYS_1.default.COLLECTION.REPORT);
    })), true);
};
var checkDisplayNamesChanged = function (personalDetails) {
    if (!personalDetails) {
        return false;
    }
    // Fast path: if reference hasn't changed, display names are definitely the same
    if (previousPersonalDetails === personalDetails) {
        return false;
    }
    var currentDisplayNames = Object.fromEntries(Object.entries(personalDetails).map(function (_a) {
        var key = _a[0], value = _a[1];
        return [key, value === null || value === void 0 ? void 0 : value.displayName];
    }));
    if (Object.keys(previousDisplayNames).length === 0) {
        previousDisplayNames = currentDisplayNames;
        previousPersonalDetails = personalDetails;
        return false;
    }
    var currentKeys = Object.keys(currentDisplayNames);
    var previousKeys = Object.keys(previousDisplayNames);
    var displayNamesChanged = currentKeys.length !== previousKeys.length || currentKeys.some(function (key) { return currentDisplayNames[key] !== previousDisplayNames[key]; });
    previousDisplayNames = currentDisplayNames;
    previousPersonalDetails = personalDetails;
    return displayNamesChanged;
};
/**
 * This derived value is used to get the report attributes for the report.
 */
exports.default = (0, createOnyxDerivedValueConfig_1.default)({
    key: ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES,
    dependencies: [
        ONYXKEYS_1.default.COLLECTION.REPORT,
        ONYXKEYS_1.default.NVP_PREFERRED_LOCALE,
        ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS,
        ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS,
        ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS,
        ONYXKEYS_1.default.COLLECTION.TRANSACTION,
        ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
        ONYXKEYS_1.default.COLLECTION.POLICY,
        ONYXKEYS_1.default.COLLECTION.REPORT_METADATA,
    ],
    compute: function (_a, _b) {
        var _c, _d, _e, _f, _g;
        var reports = _a[0], preferredLocale = _a[1], transactionViolations = _a[2], reportActions = _a[3], reportNameValuePairs = _a[4], transactions = _a[5], personalDetails = _a[6];
        var currentValue = _b.currentValue, sourceValues = _b.sourceValues, areAllConnectionsSet = _b.areAllConnectionsSet;
        if (!areAllConnectionsSet) {
            return {
                reports: {},
                locale: null,
            };
        }
        // Check if display names changed when personal details are updated
        var displayNamesChanged = false;
        if ((0, utils_1.hasKeyTriggeredCompute)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, sourceValues)) {
            displayNamesChanged = checkDisplayNamesChanged(personalDetails);
            if (!displayNamesChanged) {
                return currentValue !== null && currentValue !== void 0 ? currentValue : { reports: {}, locale: null };
            }
        }
        // if any of those keys changed, reset the isFullyComputed flag to recompute all reports
        // we need to recompute all report attributes on locale change because the report names are locale dependent
        if ((0, utils_1.hasKeyTriggeredCompute)(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE, sourceValues) || displayNamesChanged) {
            isFullyComputed = false;
        }
        // if we already computed the report attributes and there is no new reports data, return the current value
        if ((isFullyComputed && !sourceValues) || !reports) {
            return currentValue !== null && currentValue !== void 0 ? currentValue : { reports: {}, locale: null };
        }
        var reportUpdates = (_c = sourceValues === null || sourceValues === void 0 ? void 0 : sourceValues[ONYXKEYS_1.default.COLLECTION.REPORT]) !== null && _c !== void 0 ? _c : {};
        var reportMetadataUpdates = (_d = sourceValues === null || sourceValues === void 0 ? void 0 : sourceValues[ONYXKEYS_1.default.COLLECTION.REPORT_METADATA]) !== null && _d !== void 0 ? _d : {};
        var reportActionsUpdates = (_e = sourceValues === null || sourceValues === void 0 ? void 0 : sourceValues[ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS]) !== null && _e !== void 0 ? _e : {};
        var reportNameValuePairsUpdates = (_f = sourceValues === null || sourceValues === void 0 ? void 0 : sourceValues[ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS]) !== null && _f !== void 0 ? _f : {};
        var transactionsUpdates = sourceValues === null || sourceValues === void 0 ? void 0 : sourceValues[ONYXKEYS_1.default.COLLECTION.TRANSACTION];
        var transactionViolationsUpdates = sourceValues === null || sourceValues === void 0 ? void 0 : sourceValues[ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS];
        var dataToIterate = Object.keys(reports);
        // check if there are any report-related updates
        var reportUpdatesRelatedToReportActions = new Set();
        for (var _i = 0, _h = Object.values(reportActionsUpdates); _i < _h.length; _i++) {
            var actions = _h[_i];
            if (!actions) {
                continue;
            }
            for (var _j = 0, _k = Object.values(actions); _j < _k.length; _j++) {
                var reportAction = _k[_j];
                if (reportAction === null || reportAction === void 0 ? void 0 : reportAction.childReportID) {
                    reportUpdatesRelatedToReportActions.add("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportAction.childReportID));
                }
            }
        }
        var updates = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], Object.keys(reportUpdates), true), Object.keys(reportMetadataUpdates), true), Object.keys(reportActionsUpdates), true), Object.keys(reportNameValuePairsUpdates), true), Array.from(reportUpdatesRelatedToReportActions), true);
        if (isFullyComputed) {
            // if there are report-related updates, iterate over the updates
            if (updates.length > 0 || !!transactionsUpdates || !!transactionViolationsUpdates) {
                if (updates.length > 0) {
                    dataToIterate = prepareReportKeys(updates);
                }
                if (!!transactionsUpdates || !!transactionViolationsUpdates) {
                    var transactionReportIDs = [];
                    if (transactionsUpdates) {
                        transactionReportIDs = Object.values(transactionsUpdates).map(function (transaction) { return "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(transaction === null || transaction === void 0 ? void 0 : transaction.reportID); });
                    }
                    // Also handle transaction violations updates by extracting transaction IDs and finding their reports
                    if (transactionViolationsUpdates) {
                        var violationTransactionIDs = Object.keys(transactionViolationsUpdates).map(function (key) { return key.replace(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, ''); });
                        var violationReportIDs = violationTransactionIDs
                            .map(function (transactionID) { var _a; return (_a = transactions === null || transactions === void 0 ? void 0 : transactions["".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat(transactionID)]) === null || _a === void 0 ? void 0 : _a.reportID; })
                            .filter(Boolean)
                            .map(function (reportID) { return "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID); });
                        // Also include chat reports for expense reports that have violations
                        var chatReportIDs = violationReportIDs
                            .map(function (reportKey) { var _a; return (_a = reports === null || reports === void 0 ? void 0 : reports[reportKey]) === null || _a === void 0 ? void 0 : _a.chatReportID; })
                            .filter(Boolean)
                            .map(function (chatReportID) { return "".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(chatReportID); });
                        transactionReportIDs = __spreadArray(__spreadArray(__spreadArray([], transactionReportIDs, true), violationReportIDs, true), chatReportIDs, true);
                    }
                    dataToIterate.push.apply(dataToIterate, prepareReportKeys(transactionReportIDs));
                }
            }
            else {
                // No updates to process, return current value to prevent unnecessary computation
                return currentValue !== null && currentValue !== void 0 ? currentValue : { reports: {}, locale: null };
            }
        }
        var reportAttributes = dataToIterate.reduce(function (acc, key) {
            // source value sends partial data, so we need an entire report object to do computations
            var report = reports[key];
            if (!report || !(0, ReportUtils_1.isValidReport)(report)) {
                return acc;
            }
            var chatReport = reports === null || reports === void 0 ? void 0 : reports["".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(report.chatReportID)];
            var reportNameValuePair = reportNameValuePairs === null || reportNameValuePairs === void 0 ? void 0 : reportNameValuePairs["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS).concat(report.reportID)];
            var reportActionsList = reportActions === null || reportActions === void 0 ? void 0 : reportActions["".concat(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS).concat(report.reportID)];
            var isReportArchived = (0, ReportUtils_1.isArchivedReport)(reportNameValuePair);
            var _a = (0, ReportUtils_1.generateReportAttributes)({
                report: report,
                chatReport: chatReport,
                reportActions: reportActions,
                transactionViolations: transactionViolations,
                isReportArchived: isReportArchived,
            }), hasAnyViolations = _a.hasAnyViolations, requiresAttention = _a.requiresAttention, reportErrors = _a.reportErrors;
            var brickRoadStatus;
            // if report has errors or violations, show red dot
            if (SidebarUtils_1.default.shouldShowRedBrickRoad(report, chatReport, reportActionsList, hasAnyViolations, reportErrors, transactions, transactionViolations, !!isReportArchived)) {
                brickRoadStatus = CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR;
            }
            // if report does not have error, check if it should show green dot
            if (brickRoadStatus !== CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR && requiresAttention) {
                brickRoadStatus = CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.INFO;
            }
            acc[report.reportID] = {
                reportName: (0, ReportUtils_1.generateReportName)(report),
                isEmpty: (0, ReportUtils_1.generateIsEmptyReport)(report, isReportArchived),
                brickRoadStatus: brickRoadStatus,
                requiresAttention: requiresAttention,
                reportErrors: reportErrors,
            };
            return acc;
        }, (_g = currentValue === null || currentValue === void 0 ? void 0 : currentValue.reports) !== null && _g !== void 0 ? _g : {});
        // mark the report attributes as fully computed after first iteration to avoid unnecessary recomputation on all objects
        if (!Object.keys(reportUpdates).length && Object.keys(reports !== null && reports !== void 0 ? reports : {}).length > 0 && !isFullyComputed) {
            isFullyComputed = true;
        }
        return {
            reports: reportAttributes,
            locale: preferredLocale !== null && preferredLocale !== void 0 ? preferredLocale : null,
        };
    },
});
