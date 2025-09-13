"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReportUtils_1 = require("@libs/ReportUtils");
const SidebarUtils_1 = require("@libs/SidebarUtils");
const createOnyxDerivedValueConfig_1 = require("@userActions/OnyxDerived/createOnyxDerivedValueConfig");
const utils_1 = require("@userActions/OnyxDerived/utils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
let isFullyComputed = false;
let previousDisplayNames = {};
let previousPersonalDetails;
const prepareReportKeys = (keys) => {
    return [
        ...new Set(keys.map((key) => key
            .replace(ONYXKEYS_1.default.COLLECTION.REPORT_METADATA, ONYXKEYS_1.default.COLLECTION.REPORT)
            .replace(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS, ONYXKEYS_1.default.COLLECTION.REPORT)
            .replace(ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS, ONYXKEYS_1.default.COLLECTION.REPORT))),
    ];
};
const checkDisplayNamesChanged = (personalDetails) => {
    if (!personalDetails) {
        return false;
    }
    // Fast path: if reference hasn't changed, display names are definitely the same
    if (previousPersonalDetails === personalDetails) {
        return false;
    }
    const currentDisplayNames = Object.fromEntries(Object.entries(personalDetails).map(([key, value]) => [key, value?.displayName]));
    if (Object.keys(previousDisplayNames).length === 0) {
        previousDisplayNames = currentDisplayNames;
        previousPersonalDetails = personalDetails;
        return false;
    }
    const currentKeys = Object.keys(currentDisplayNames);
    const previousKeys = Object.keys(previousDisplayNames);
    const displayNamesChanged = currentKeys.length !== previousKeys.length || currentKeys.some((key) => currentDisplayNames[key] !== previousDisplayNames[key]);
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
    compute: ([reports, preferredLocale, transactionViolations, reportActions, reportNameValuePairs, transactions, personalDetails], { currentValue, sourceValues, areAllConnectionsSet }) => {
        if (!areAllConnectionsSet) {
            return {
                reports: {},
                locale: null,
            };
        }
        // Check if display names changed when personal details are updated
        let displayNamesChanged = false;
        if ((0, utils_1.hasKeyTriggeredCompute)(ONYXKEYS_1.default.PERSONAL_DETAILS_LIST, sourceValues)) {
            displayNamesChanged = checkDisplayNamesChanged(personalDetails);
            if (!displayNamesChanged) {
                return currentValue ?? { reports: {}, locale: null };
            }
        }
        // if any of those keys changed, reset the isFullyComputed flag to recompute all reports
        // we need to recompute all report attributes on locale change because the report names are locale dependent
        if ((0, utils_1.hasKeyTriggeredCompute)(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE, sourceValues) || displayNamesChanged) {
            isFullyComputed = false;
        }
        // if we already computed the report attributes and there is no new reports data, return the current value
        if ((isFullyComputed && !sourceValues) || !reports) {
            return currentValue ?? { reports: {}, locale: null };
        }
        const reportUpdates = sourceValues?.[ONYXKEYS_1.default.COLLECTION.REPORT] ?? {};
        const reportMetadataUpdates = sourceValues?.[ONYXKEYS_1.default.COLLECTION.REPORT_METADATA] ?? {};
        const reportActionsUpdates = sourceValues?.[ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS] ?? {};
        const reportNameValuePairsUpdates = sourceValues?.[ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS] ?? {};
        const transactionsUpdates = sourceValues?.[ONYXKEYS_1.default.COLLECTION.TRANSACTION];
        const transactionViolationsUpdates = sourceValues?.[ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS];
        let dataToIterate = Object.keys(reports);
        // check if there are any report-related updates
        const reportUpdatesRelatedToReportActions = new Set();
        for (const actions of Object.values(reportActionsUpdates)) {
            if (!actions) {
                continue;
            }
            for (const reportAction of Object.values(actions)) {
                if (reportAction?.childReportID) {
                    reportUpdatesRelatedToReportActions.add(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportAction.childReportID}`);
                }
            }
        }
        const updates = [
            ...Object.keys(reportUpdates),
            ...Object.keys(reportMetadataUpdates),
            ...Object.keys(reportActionsUpdates),
            ...Object.keys(reportNameValuePairsUpdates),
            ...Array.from(reportUpdatesRelatedToReportActions),
        ];
        if (isFullyComputed) {
            // if there are report-related updates, iterate over the updates
            if (updates.length > 0 || !!transactionsUpdates || !!transactionViolationsUpdates) {
                if (updates.length > 0) {
                    dataToIterate = prepareReportKeys(updates);
                }
                if (!!transactionsUpdates || !!transactionViolationsUpdates) {
                    let transactionReportIDs = [];
                    if (transactionsUpdates) {
                        transactionReportIDs = Object.values(transactionsUpdates).map((transaction) => `${ONYXKEYS_1.default.COLLECTION.REPORT}${transaction?.reportID}`);
                    }
                    // Also handle transaction violations updates by extracting transaction IDs and finding their reports
                    if (transactionViolationsUpdates) {
                        const violationTransactionIDs = Object.keys(transactionViolationsUpdates).map((key) => key.replace(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS, ''));
                        const violationReportIDs = violationTransactionIDs
                            .map((transactionID) => transactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`]?.reportID)
                            .filter(Boolean)
                            .map((reportID) => `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`);
                        // Also include chat reports for expense reports that have violations
                        const chatReportIDs = violationReportIDs
                            .map((reportKey) => reports?.[reportKey]?.chatReportID)
                            .filter(Boolean)
                            .map((chatReportID) => `${ONYXKEYS_1.default.COLLECTION.REPORT}${chatReportID}`);
                        transactionReportIDs = [...transactionReportIDs, ...violationReportIDs, ...chatReportIDs];
                    }
                    dataToIterate.push(...prepareReportKeys(transactionReportIDs));
                }
            }
            else {
                // No updates to process, return current value to prevent unnecessary computation
                return currentValue ?? { reports: {}, locale: null };
            }
        }
        const reportAttributes = dataToIterate.reduce((acc, key) => {
            // source value sends partial data, so we need an entire report object to do computations
            const report = reports[key];
            if (!report || !(0, ReportUtils_1.isValidReport)(report)) {
                return acc;
            }
            const chatReport = reports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${report.chatReportID}`];
            const reportNameValuePair = reportNameValuePairs?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_NAME_VALUE_PAIRS}${report.reportID}`];
            const reportActionsList = reportActions?.[`${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${report.reportID}`];
            const isReportArchived = (0, ReportUtils_1.isArchivedReport)(reportNameValuePair);
            const { hasAnyViolations, requiresAttention, reportErrors } = (0, ReportUtils_1.generateReportAttributes)({
                report,
                chatReport,
                reportActions,
                transactionViolations,
                isReportArchived,
            });
            let brickRoadStatus;
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
                brickRoadStatus,
                requiresAttention,
                reportErrors,
            };
            return acc;
        }, currentValue?.reports ?? {});
        // mark the report attributes as fully computed after first iteration to avoid unnecessary recomputation on all objects
        if (!Object.keys(reportUpdates).length && Object.keys(reports ?? {}).length > 0 && !isFullyComputed) {
            isFullyComputed = true;
        }
        return {
            reports: reportAttributes,
            locale: preferredLocale ?? null,
        };
    },
});
