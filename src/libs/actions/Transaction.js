"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveWaypoint = saveWaypoint;
exports.removeWaypoint = removeWaypoint;
exports.getRoute = getRoute;
exports.updateWaypoints = updateWaypoints;
exports.clearError = clearError;
exports.markAsCash = markAsCash;
exports.dismissDuplicateTransactionViolation = dismissDuplicateTransactionViolation;
exports.getDraftTransactions = getDraftTransactions;
exports.generateTransactionID = generateTransactionID;
exports.setReviewDuplicatesKey = setReviewDuplicatesKey;
exports.abandonReviewDuplicateTransactions = abandonReviewDuplicateTransactions;
exports.openDraftDistanceExpense = openDraftDistanceExpense;
exports.getRecentWaypoints = getRecentWaypoints;
exports.sanitizeRecentWaypoints = sanitizeRecentWaypoints;
exports.getLastModifiedExpense = getLastModifiedExpense;
exports.revert = revert;
exports.changeTransactionsReport = changeTransactionsReport;
exports.setTransactionReport = setTransactionReport;
const date_fns_1 = require("date-fns");
const fast_equals_1 = require("fast-equals");
const clone_1 = require("lodash/clone");
const has_1 = require("lodash/has");
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const CollectionUtils = require("@libs/CollectionUtils");
const DateUtils_1 = require("@libs/DateUtils");
const NextStepUtils_1 = require("@libs/NextStepUtils");
const NumberUtils = require("@libs/NumberUtils");
const NumberUtils_1 = require("@libs/NumberUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const ViolationsUtils_1 = require("@libs/Violations/ViolationsUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Category_1 = require("./Policy/Category");
const Tag_1 = require("./Policy/Tag");
let recentWaypoints = [];
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NVP_RECENT_WAYPOINTS,
    callback: (val) => (recentWaypoints = val ?? []),
});
const allTransactions = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
    callback: (transaction, key) => {
        if (!key || !transaction) {
            return;
        }
        const transactionID = CollectionUtils.extractCollectionItemID(key);
        allTransactions[transactionID] = transaction;
    },
});
let allTransactionDrafts = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT,
    waitForCollectionCallback: true,
    callback: (value) => {
        allTransactionDrafts = value ?? {};
    },
});
let allReports = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT,
    waitForCollectionCallback: true,
    callback: (value) => {
        if (!value) {
            return;
        }
        allReports = value;
    },
});
const allTransactionViolation = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS,
    callback: (transactionViolation, key) => {
        if (!key || !transactionViolation) {
            return;
        }
        const transactionID = CollectionUtils.extractCollectionItemID(key);
        allTransactionViolation[transactionID] = transactionViolation;
    },
});
let allTransactionViolations = [];
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS,
    callback: (val) => (allTransactionViolations = val ?? []),
});
// Helper to safely check for a string 'name' property
function isViolationWithName(violation) {
    return !!(violation && typeof violation === 'object' && typeof violation.name === 'string');
}
function saveWaypoint(transactionID, index, waypoint, isDraft = false) {
    react_native_onyx_1.default.merge(`${isDraft ? ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT : ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, {
        comment: {
            waypoints: {
                [`waypoint${index}`]: waypoint,
            },
            customUnit: {
                quantity: null,
            },
        },
        // We want to reset the amount only for draft transactions (when creating the expense).
        // When modifying an existing transaction, the amount will be updated on the actual IOU update operation.
        ...(isDraft && { amount: CONST_1.default.IOU.DEFAULT_AMOUNT }),
        // Empty out errors when we're saving a new waypoint as this indicates the user is updating their input
        errorFields: {
            route: null,
        },
        // Clear the existing route so that we don't show an old route
        routes: {
            route0: {
                // Clear the existing distance to recalculate next time
                distance: null,
                geometry: {
                    coordinates: null,
                },
            },
        },
    });
    // You can save offline waypoints without verifying the address (we will geocode it on the backend)
    // We're going to prevent saving those addresses in the recent waypoints though since they could be invalid addresses
    // However, in the backend once we verify the address, we will save the waypoint in the recent waypoints NVP
    if (!(0, has_1.default)(waypoint, 'lat') || !(0, has_1.default)(waypoint, 'lng')) {
        return;
    }
    // If current location is used, we would want to avoid saving it as a recent waypoint. This prevents the 'Your Location'
    // text from showing up in the address search suggestions
    if ((0, fast_equals_1.deepEqual)(waypoint?.address, CONST_1.default.YOUR_LOCATION_TEXT)) {
        return;
    }
    const recentWaypointAlreadyExists = recentWaypoints.find((recentWaypoint) => recentWaypoint?.address === waypoint?.address);
    if (!recentWaypointAlreadyExists && waypoint !== null) {
        const clonedWaypoints = (0, clone_1.default)(recentWaypoints);
        const updatedWaypoint = { ...waypoint, pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD };
        clonedWaypoints.unshift(updatedWaypoint);
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_RECENT_WAYPOINTS, clonedWaypoints.slice(0, CONST_1.default.RECENT_WAYPOINTS_NUMBER));
    }
}
function removeWaypoint(transaction, currentIndex, isDraft) {
    // Index comes from the route params and is a string
    const index = Number(currentIndex);
    if (index === -1) {
        return Promise.resolve();
    }
    const existingWaypoints = transaction?.comment?.waypoints ?? {};
    const totalWaypoints = Object.keys(existingWaypoints).length;
    const waypointValues = Object.values(existingWaypoints);
    const removed = waypointValues.splice(index, 1);
    if (removed.length === 0) {
        return Promise.resolve();
    }
    const isRemovedWaypointEmpty = removed.length > 0 && !(0, TransactionUtils_1.waypointHasValidAddress)(removed.at(0) ?? {});
    // When there are only two waypoints we are adding empty waypoint back
    if (totalWaypoints === 2 && (index === 0 || index === totalWaypoints - 1)) {
        waypointValues.splice(index, 0, {});
    }
    const reIndexedWaypoints = {};
    waypointValues.forEach((waypoint, idx) => {
        reIndexedWaypoints[`waypoint${idx}`] = waypoint;
    });
    // Onyx.merge won't remove the null nested object values, this is a workaround
    // to remove nested keys while also preserving other object keys
    // Doing a deep clone of the transaction to avoid mutating the original object and running into a cache issue when using Onyx.set
    let newTransaction = {
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        ...transaction,
        comment: {
            ...transaction?.comment,
            waypoints: reIndexedWaypoints,
            customUnit: {
                ...transaction?.comment?.customUnit,
                quantity: null,
            },
        },
        // We want to reset the amount only for draft transactions (when creating the expense).
        // When modifying an existing transaction, the amount will be updated on the actual IOU update operation.
        ...(isDraft && { amount: CONST_1.default.IOU.DEFAULT_AMOUNT }),
    };
    if (!isRemovedWaypointEmpty) {
        newTransaction = {
            ...newTransaction,
            // Clear any errors that may be present, which apply to the old route
            errorFields: {
                route: null,
            },
            // Clear the existing route so that we don't show an old route
            routes: {
                route0: {
                    // Clear the existing distance to recalculate next time
                    distance: null,
                    geometry: {
                        coordinates: null,
                    },
                },
            },
        };
    }
    if (isDraft) {
        return react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transaction?.transactionID}`, newTransaction);
    }
    return react_native_onyx_1.default.set(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction?.transactionID}`, newTransaction);
}
function getOnyxDataForRouteRequest(transactionID, transactionState = CONST_1.default.TRANSACTION.STATE.CURRENT) {
    let keyPrefix;
    switch (transactionState) {
        case CONST_1.default.TRANSACTION.STATE.DRAFT:
            keyPrefix = ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT;
            break;
        case CONST_1.default.TRANSACTION.STATE.BACKUP:
            keyPrefix = ONYXKEYS_1.default.COLLECTION.TRANSACTION_BACKUP;
            break;
        case CONST_1.default.TRANSACTION.STATE.CURRENT:
        default:
            keyPrefix = ONYXKEYS_1.default.COLLECTION.TRANSACTION;
            break;
    }
    return {
        optimisticData: [
            {
                // Clears any potentially stale error messages from fetching the route
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${keyPrefix}${transactionID}`,
                value: {
                    comment: {
                        isLoading: true,
                    },
                    errorFields: {
                        route: null,
                    },
                },
            },
        ],
        // The route and failure are sent back via pusher in the BE, we are just clearing the loading state here
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${keyPrefix}${transactionID}`,
                value: {
                    comment: {
                        isLoading: false,
                    },
                    // When the user opens the distance request editor and changes the connection from offline to online,
                    // the transaction's pendingFields and pendingAction will be removed, but not transactionBackup.
                    // We clear the pendingFields and pendingAction for the backup here to ensure consistency with the transaction.
                    // Without this, the map will not be clickable if the user dismisses the distance request editor without saving.
                    ...(transactionState === CONST_1.default.TRANSACTION.STATE.BACKUP && {
                        pendingFields: { waypoints: null },
                        pendingAction: null,
                    }),
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${keyPrefix}${transactionID}`,
                value: {
                    comment: {
                        isLoading: false,
                    },
                },
            },
        ],
    };
}
/**
 * Sanitizes the waypoints by removing the pendingAction property.
 *
 * @param waypoints - The collection of waypoints to sanitize.
 * @returns The sanitized collection of waypoints.
 */
function sanitizeRecentWaypoints(waypoints) {
    return Object.entries(waypoints).reduce((acc, [key, waypoint]) => {
        if ('pendingAction' in waypoint) {
            const { pendingAction, ...rest } = waypoint;
            acc[key] = rest;
        }
        else {
            acc[key] = waypoint;
        }
        return acc;
    }, {});
}
/**
 * Gets the route for a set of waypoints
 * Used so we can generate a map view of the provided waypoints
 */
function getRoute(transactionID, waypoints, routeType = CONST_1.default.TRANSACTION.STATE.CURRENT) {
    const parameters = {
        transactionID,
        waypoints: JSON.stringify(sanitizeRecentWaypoints(waypoints)),
    };
    let command;
    switch (routeType) {
        case CONST_1.default.TRANSACTION.STATE.DRAFT:
            command = types_1.READ_COMMANDS.GET_ROUTE_FOR_DRAFT;
            break;
        case CONST_1.default.TRANSACTION.STATE.CURRENT:
            command = types_1.READ_COMMANDS.GET_ROUTE;
            break;
        case CONST_1.default.TRANSACTION.STATE.BACKUP:
            command = types_1.READ_COMMANDS.GET_ROUTE_FOR_BACKUP;
            break;
        default:
            throw new Error('Invalid route type');
    }
    API.read(command, parameters, getOnyxDataForRouteRequest(transactionID, routeType));
}
/**
 * Updates all waypoints stored in the transaction specified by the provided transactionID.
 *
 * @param transactionID - The ID of the transaction to be updated
 * @param waypoints - An object containing all the waypoints
 *                             which will replace the existing ones.
 */
function updateWaypoints(transactionID, waypoints, isDraft = false) {
    return react_native_onyx_1.default.merge(`${isDraft ? ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT : ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, {
        comment: {
            waypoints,
            customUnit: {
                quantity: null,
            },
        },
        // We want to reset the amount only for draft transactions (when creating the expense).
        // When modifying an existing transaction, the amount will be updated on the actual IOU update operation.
        ...(isDraft && { amount: CONST_1.default.IOU.DEFAULT_AMOUNT }),
        // Empty out errors when we're saving new waypoints as this indicates the user is updating their input
        errorFields: {
            route: null,
        },
        // Clear the existing route so that we don't show an old route
        routes: {
            route0: {
                // Clear the existing distance to recalculate next time
                distance: null,
                geometry: {
                    coordinates: null,
                },
            },
        },
    });
}
/**
 * Dismisses the duplicate transaction violation for the provided transactionIDs
 * and updates the transaction to include the dismissed violation in the comment.
 */
function dismissDuplicateTransactionViolation(transactionIDs, dismissedPersonalDetails) {
    const currentTransactionViolations = transactionIDs.map((id) => ({ transactionID: id, violations: allTransactionViolation?.[id] ?? [] }));
    const currentTransactions = transactionIDs.map((id) => allTransactions?.[id]);
    const transactionsReportActions = currentTransactions.map((transaction) => (0, ReportActionsUtils_1.getIOUActionForReportID)(transaction.reportID, transaction.transactionID));
    const optimisticDismissedViolationReportActions = transactionsReportActions.map(() => {
        return (0, ReportUtils_1.buildOptimisticDismissedViolationReportAction)({ reason: 'manual', violationName: CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION });
    });
    const optimisticData = [];
    const failureData = [];
    const optimisticReportActions = transactionsReportActions.map((action, index) => {
        const optimisticDismissedViolationReportAction = optimisticDismissedViolationReportActions.at(index);
        return {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${action?.childReportID}`,
            value: optimisticDismissedViolationReportAction
                ? {
                    [optimisticDismissedViolationReportAction.reportActionID]: optimisticDismissedViolationReportAction,
                }
                : undefined,
        };
    });
    const optimisticDataTransactionViolations = currentTransactionViolations.map((transactionViolations) => ({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionViolations.transactionID}`,
        value: transactionViolations.violations?.filter((violation) => violation.name !== CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION),
    }));
    optimisticData.push(...optimisticDataTransactionViolations);
    optimisticData.push(...optimisticReportActions);
    const optimisticDataTransactions = currentTransactions.map((transaction) => ({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`,
        value: {
            ...transaction,
            comment: {
                ...transaction.comment,
                dismissedViolations: {
                    duplicatedTransaction: {
                        [dismissedPersonalDetails.login ?? '']: (0, date_fns_1.getUnixTime)(new Date()),
                    },
                },
            },
        },
    }));
    optimisticData.push(...optimisticDataTransactions);
    const failureDataTransactionViolations = currentTransactionViolations.map((transactionViolations) => ({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionViolations.transactionID}`,
        value: transactionViolations.violations?.map((violation) => violation),
    }));
    const failureDataTransaction = currentTransactions.map((transaction) => ({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`,
        value: {
            ...transaction,
        },
    }));
    const failureReportActions = transactionsReportActions.map((action, index) => {
        const optimisticDismissedViolationReportAction = optimisticDismissedViolationReportActions.at(index);
        return {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${action?.childReportID}`,
            value: optimisticDismissedViolationReportAction
                ? {
                    [optimisticDismissedViolationReportAction.reportActionID]: null,
                }
                : undefined,
        };
    });
    failureData.push(...failureDataTransactionViolations);
    failureData.push(...failureDataTransaction);
    failureData.push(...failureReportActions);
    const successData = transactionsReportActions.map((action, index) => {
        const optimisticDismissedViolationReportAction = optimisticDismissedViolationReportActions.at(index);
        return {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${action?.childReportID}`,
            value: optimisticDismissedViolationReportAction
                ? {
                    [optimisticDismissedViolationReportAction.reportActionID]: null,
                }
                : undefined,
        };
    });
    // We are creating duplicate resolved report actions for each duplicate transactions and all the report actions
    // should be correctly linked with their parent report but the BE is sometimes linking report actions to different
    // parent reports than the one we set optimistically, resulting in duplicate report actions. Therefore, we send the BE
    // random report action ids and onSuccessData we reset the report actions we added optimistically to avoid duplicate actions.
    const params = {
        name: CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION,
        transactionIDList: transactionIDs.join(','),
        reportActionIDList: optimisticDismissedViolationReportActions.map(() => NumberUtils.rand64()).join(','),
    };
    API.write(types_1.WRITE_COMMANDS.DISMISS_VIOLATION, params, {
        optimisticData,
        successData,
        failureData,
    });
}
function setReviewDuplicatesKey(values) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.REVIEW_DUPLICATES}`, {
        ...values,
    });
}
function abandonReviewDuplicateTransactions() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.REVIEW_DUPLICATES, null);
}
function clearError(transactionID) {
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, { errors: null, errorFields: { route: null, waypoints: null, routes: null } });
}
function getLastModifiedExpense(reportID) {
    const modifiedExpenseActions = Object.values((0, ReportActionsUtils_1.getAllReportActions)(reportID)).filter(ReportActionsUtils_1.isModifiedExpenseAction);
    modifiedExpenseActions.sort((a, b) => Number(a.reportActionID) - Number(b.reportActionID));
    return (0, ReportActionsUtils_1.getOriginalMessage)(modifiedExpenseActions.at(-1));
}
function revert(transaction, originalMessage) {
    if (!transaction || !originalMessage?.oldAmount || !originalMessage.oldCurrency || !('amount' in originalMessage) || !('currency' in originalMessage)) {
        return;
    }
    react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`, {
        modifiedAmount: transaction?.amount && transaction?.amount < 0 ? -Math.abs(originalMessage.oldAmount) : originalMessage.oldAmount,
        modifiedCurrency: originalMessage.oldCurrency,
    });
}
function markAsCash(transactionID, transactionThreadReportID) {
    if (!transactionID || !transactionThreadReportID) {
        return;
    }
    const optimisticReportAction = (0, ReportUtils_1.buildOptimisticDismissedViolationReportAction)({
        reason: 'manual',
        violationName: CONST_1.default.VIOLATIONS.RTER,
    });
    const optimisticReportActions = {
        [optimisticReportAction.reportActionID]: optimisticReportAction,
    };
    const onyxData = {
        optimisticData: [
            // Optimistically dismissing the violation, removing it from the list of violations
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
                value: allTransactionViolations.filter((violation) => violation.name !== CONST_1.default.VIOLATIONS.RTER),
            },
            // Optimistically adding the system message indicating we dismissed the violation
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReportID}`,
                value: optimisticReportActions,
            },
        ],
        failureData: [
            // Rolling back the dismissal of the violation
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`,
                value: allTransactionViolations,
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReportID}`,
                value: {
                    [optimisticReportAction.reportActionID]: null,
                },
            },
        ],
    };
    const parameters = {
        transactionID,
        reportActionID: optimisticReportAction.reportActionID,
    };
    return API.write(types_1.WRITE_COMMANDS.MARK_AS_CASH, parameters, onyxData);
}
function openDraftDistanceExpense() {
    const onyxData = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: ONYXKEYS_1.default.NVP_RECENT_WAYPOINTS,
                // By optimistically setting the recent waypoints to an empty array, no further loading attempts will be made
                value: [],
            },
        ],
    };
    API.read(types_1.READ_COMMANDS.OPEN_DRAFT_DISTANCE_EXPENSE, null, onyxData);
}
function getRecentWaypoints() {
    return recentWaypoints;
}
/**
 * Returns a client generated 16 character hexadecimal value for the transactionID
 */
function generateTransactionID() {
    return NumberUtils.generateHexadecimalValue(16);
}
function setTransactionReport(transactionID, transaction, isDraft) {
    react_native_onyx_1.default.merge(`${isDraft ? ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT : ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`, transaction);
}
function changeTransactionsReport(transactionIDs, reportID, isASAPSubmitBetaEnabled, accountID, email, policy, reportNextStep) {
    const newReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
    const transactions = transactionIDs.map((id) => allTransactions?.[id]).filter((t) => t !== undefined);
    const transactionIDToReportActionAndThreadData = {};
    const updatedReportTotals = {};
    const updatedReportNonReimbursableTotals = {};
    const updatedReportUnheldNonReimbursableTotals = {};
    // Store current violations for each transaction to restore on failure
    const currentTransactionViolations = {};
    transactionIDs.forEach((id) => {
        currentTransactionViolations[id] = allTransactionViolation?.[id] ?? [];
    });
    const optimisticData = [];
    const failureData = [];
    const successData = [];
    const existingSelfDMReportID = (0, ReportUtils_1.findSelfDMReportID)();
    let selfDMReport;
    let selfDMCreatedReportAction;
    if (!existingSelfDMReportID && reportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID) {
        const currentTime = DateUtils_1.default.getDBTime();
        selfDMReport = (0, ReportUtils_1.buildOptimisticSelfDMReport)(currentTime);
        selfDMCreatedReportAction = (0, ReportUtils_1.buildOptimisticCreatedReportAction)(email ?? '', currentTime);
        // Add optimistic updates for self DM report
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${selfDMReport.reportID}`,
            value: {
                ...selfDMReport,
                pendingFields: {
                    createChat: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
                },
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${selfDMReport.reportID}`,
            value: { isOptimisticReport: true },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${selfDMReport.reportID}`,
            value: {
                [selfDMCreatedReportAction.reportActionID]: selfDMCreatedReportAction,
            },
        });
        // Add success data for self DM report
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${selfDMReport.reportID}`,
            value: {
                pendingFields: {
                    createChat: null,
                },
            },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${selfDMReport.reportID}`,
            value: { isOptimisticReport: false },
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${selfDMReport.reportID}`,
            value: {
                [selfDMCreatedReportAction.reportActionID]: {
                    pendingAction: null,
                },
            },
        });
        // Add failure data for self DM report
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${selfDMReport.reportID}`,
            value: null,
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_METADATA}${selfDMReport.reportID}`,
            value: null,
        }, {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${selfDMReport.reportID}`,
            value: null,
        });
    }
    let transactionsMoved = false;
    let shouldFixViolations = false;
    const policyTagList = (0, Tag_1.getPolicyTagsData)(policy?.id);
    const policyCategories = (0, Category_1.getPolicyCategoriesData)(policy?.id);
    const policyHasDependentTags = (0, PolicyUtils_1.hasDependentTags)(policy, policyTagList);
    transactions.forEach((transaction) => {
        const isUnreportedExpense = !transaction.reportID || transaction.reportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID;
        const selfDMReportID = existingSelfDMReportID ?? selfDMReport?.reportID;
        const oldIOUAction = (0, ReportActionsUtils_1.getIOUActionForReportID)(isUnreportedExpense ? selfDMReportID : transaction.reportID, transaction.transactionID);
        if (!transaction.reportID || transaction.reportID === reportID) {
            return;
        }
        transactionsMoved = true;
        const oldReportID = transaction.reportID;
        const oldReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${oldReportID}`];
        // 1. Optimistically change the reportID on the passed transactions
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`,
            value: {
                reportID,
            },
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`,
            value: {
                reportID,
            },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`,
            value: {
                reportID: transaction.reportID,
            },
        });
        // Optimistically clear all violations for the transaction when moving to self DM report
        if (reportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID) {
            const duplicateViolation = currentTransactionViolations?.[transaction.transactionID]?.find((violation) => violation.name === CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION);
            const duplicateTransactionIDs = duplicateViolation?.data?.duplicates;
            if (duplicateTransactionIDs) {
                duplicateTransactionIDs.forEach((id) => {
                    optimisticData.push({
                        onyxMethod: react_native_onyx_1.default.METHOD.SET,
                        key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${id}`,
                        value: allTransactionViolations.filter((violation) => violation.name !== CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION),
                    });
                });
            }
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction.transactionID}`,
                value: null,
            });
            successData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction.transactionID}`,
                value: null,
            });
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction.transactionID}`,
                value: currentTransactionViolations[transaction.transactionID],
            });
        }
        let transactionReimbursable = transaction.reimbursable;
        // 2. Calculate transaction violations if moving transaction to a workspace
        if ((0, PolicyUtils_1.isPaidGroupPolicy)(policy) && policy?.id) {
            const violationData = ViolationsUtils_1.default.getViolationsOnyxData(transaction, currentTransactionViolations[transaction.transactionID] ?? [], policy, policyTagList, policyCategories, policyHasDependentTags, false);
            optimisticData.push(violationData);
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction.transactionID}`,
                value: allTransactionViolation?.[transaction.transactionID],
            });
            const transactionHasViolations = Array.isArray(violationData.value) && violationData.value.length > 0;
            const hasOtherViolationsBesideDuplicates = Array.isArray(violationData.value) &&
                !violationData.value.every((violation) => {
                    if (!isViolationWithName(violation)) {
                        return false;
                    }
                    return violation.name === CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION;
                });
            if (transactionHasViolations && hasOtherViolationsBesideDuplicates) {
                shouldFixViolations = true;
            }
            if (policy?.disabledFields?.reimbursable) {
                transactionReimbursable = policy?.defaultReimbursable;
                optimisticData.push({
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`,
                    value: {
                        reimbursable: transactionReimbursable,
                    },
                });
                failureData.push({
                    onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                    key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transaction.transactionID}`,
                    value: {
                        reimbursable: transaction?.reimbursable,
                    },
                });
            }
        }
        // 3. Keep track of the new report totals
        const isUnreported = reportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID;
        const targetReportID = isUnreported ? selfDMReportID : reportID;
        const transactionAmount = (0, TransactionUtils_1.getAmount)(transaction);
        if (oldReport) {
            updatedReportTotals[oldReportID] = (updatedReportTotals[oldReportID] ? updatedReportTotals[oldReportID] : (oldReport?.total ?? 0)) + transactionAmount;
            updatedReportNonReimbursableTotals[oldReportID] =
                (updatedReportNonReimbursableTotals[oldReportID] ? updatedReportNonReimbursableTotals[oldReportID] : (oldReport?.nonReimbursableTotal ?? 0)) +
                    (transaction?.reimbursable ? 0 : transactionAmount);
            updatedReportUnheldNonReimbursableTotals[oldReportID] =
                (updatedReportUnheldNonReimbursableTotals[oldReportID] ? updatedReportUnheldNonReimbursableTotals[oldReportID] : (oldReport?.unheldNonReimbursableTotal ?? 0)) +
                    (transaction?.reimbursable && !(0, TransactionUtils_1.isOnHold)(transaction) ? 0 : transactionAmount);
        }
        if (reportID && newReport) {
            updatedReportTotals[targetReportID] = (updatedReportTotals[targetReportID] ? updatedReportTotals[targetReportID] : (newReport.total ?? 0)) - transactionAmount;
            updatedReportNonReimbursableTotals[targetReportID] =
                (updatedReportNonReimbursableTotals[targetReportID] ? updatedReportNonReimbursableTotals[targetReportID] : (newReport.nonReimbursableTotal ?? 0)) -
                    (transactionReimbursable ? 0 : transactionAmount);
            updatedReportUnheldNonReimbursableTotals[targetReportID] =
                (updatedReportUnheldNonReimbursableTotals[targetReportID] ? updatedReportUnheldNonReimbursableTotals[targetReportID] : (newReport.unheldNonReimbursableTotal ?? 0)) -
                    (transactionReimbursable && !(0, TransactionUtils_1.isOnHold)(transaction) ? 0 : transactionAmount);
        }
        // 4. Optimistically update the IOU action reportID
        const optimisticMoneyRequestReportActionID = (0, NumberUtils_1.rand64)();
        const originalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(oldIOUAction);
        const newIOUAction = {
            ...oldIOUAction,
            originalMessage: {
                ...originalMessage,
                IOUReportID: reportID,
                type: isUnreported ? CONST_1.default.IOU.REPORT_ACTION_TYPE.TRACK : CONST_1.default.IOU.REPORT_ACTION_TYPE.CREATE,
            },
            reportActionID: optimisticMoneyRequestReportActionID,
            pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
            actionName: oldIOUAction?.actionName ?? CONST_1.default.REPORT.ACTIONS.TYPE.MOVED_TRANSACTION,
            created: oldIOUAction?.created ?? DateUtils_1.default.getDBTime(),
        };
        const trackExpenseActionableWhisper = isUnreportedExpense ? (0, ReportActionsUtils_1.getTrackExpenseActionableWhisper)(transaction.transactionID, selfDMReportID) : undefined;
        if (oldIOUAction) {
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${targetReportID}`,
                value: {
                    [newIOUAction.reportActionID]: newIOUAction,
                },
            });
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${isUnreportedExpense ? selfDMReportID : oldReportID}`,
                value: {
                    [oldIOUAction.reportActionID]: {
                        previousMessage: oldIOUAction.message,
                        message: [
                            {
                                type: CONST_1.default.REPORT.MESSAGE.TYPE.COMMENT,
                                html: '',
                                text: '',
                                isEdited: true,
                                isDeletedParentAction: false,
                            },
                        ],
                        originalMessage: {
                            IOUTransactionID: null,
                        },
                        errors: undefined,
                    },
                    ...(trackExpenseActionableWhisper ? { [trackExpenseActionableWhisper.reportActionID]: null } : {}),
                },
            });
        }
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${targetReportID}`,
            value: {
                [newIOUAction.reportActionID]: { pendingAction: null },
            },
        });
        if (oldIOUAction) {
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${targetReportID}`,
                value: {
                    [newIOUAction.reportActionID]: null,
                },
            }, {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${isUnreportedExpense ? selfDMReportID : oldReportID}`,
                value: {
                    [oldIOUAction.reportActionID]: oldIOUAction,
                    ...(trackExpenseActionableWhisper ? { [trackExpenseActionableWhisper.reportActionID]: trackExpenseActionableWhisper } : {}),
                },
            });
        }
        // 5. Optimistically update the transaction thread and all threads in the transaction thread
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${newIOUAction.childReportID}`,
            value: {
                parentReportID: targetReportID,
                parentReportActionID: optimisticMoneyRequestReportActionID,
                policyID: reportID !== CONST_1.default.REPORT.UNREPORTED_REPORT_ID && newReport ? newReport.policyID : CONST_1.default.POLICY.ID_FAKE,
            },
        });
        if (oldIOUAction) {
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${oldIOUAction.childReportID}`,
                value: {
                    parentReportID: isUnreportedExpense ? selfDMReportID : oldReportID,
                    optimisticMoneyRequestReportActionID: oldIOUAction.reportActionID,
                    policyID: allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${oldIOUAction.reportActionID}`]?.policyID,
                },
            });
        }
        // 6. (Optional) Create transactionThread if it doesn't exist
        let transactionThreadReportID = newIOUAction.childReportID;
        let transactionThreadCreatedReportActionID;
        if (!transactionThreadReportID) {
            const optimisticTransactionThread = (0, ReportUtils_1.buildTransactionThread)(newIOUAction, reportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID ? undefined : newReport);
            const optimisticCreatedActionForTransactionThread = (0, ReportUtils_1.buildOptimisticCreatedReportAction)(email ?? '');
            transactionThreadReportID = optimisticTransactionThread.reportID;
            transactionThreadCreatedReportActionID = optimisticCreatedActionForTransactionThread.reportActionID;
            newIOUAction.childReportID = transactionThreadReportID;
            optimisticData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${optimisticTransactionThread.reportID}`,
                value: { ...optimisticTransactionThread, pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD },
            }, {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticTransactionThread.reportID}`,
                value: { [optimisticCreatedActionForTransactionThread.reportActionID]: optimisticCreatedActionForTransactionThread },
            }, {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${targetReportID}`,
                value: { [newIOUAction.reportActionID]: { childReportID: optimisticTransactionThread.reportID } },
            });
            successData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${optimisticTransactionThread.reportID}`,
                value: { pendingAction: null },
            }, {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticTransactionThread.reportID}`,
                value: { [optimisticCreatedActionForTransactionThread.reportActionID]: { pendingAction: null } },
            });
            failureData.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${optimisticTransactionThread.reportID}`,
                value: null,
            }, {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${optimisticTransactionThread.reportID}`,
                value: { [optimisticCreatedActionForTransactionThread.reportActionID]: null },
            }, {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${targetReportID}`,
                value: { [newIOUAction.reportActionID]: { childReportID: null } },
            });
        }
        // 7. Add MOVED_TRANSACTION or UNREPORTED_TRANSACTION report actions
        const movedAction = reportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID
            ? (0, ReportUtils_1.buildOptimisticUnreportedTransactionAction)(transactionThreadReportID, oldReportID)
            : (0, ReportUtils_1.buildOptimisticMovedTransactionAction)(transactionThreadReportID, reportID);
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReportID}`,
            value: { [movedAction?.reportActionID]: movedAction },
        });
        successData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReportID}`,
            value: { [movedAction?.reportActionID]: { pendingAction: null } },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS}${transactionThreadReportID}`,
            value: { [movedAction?.reportActionID]: null },
        });
        // Create base transaction data object
        const baseTransactionData = {
            movedReportActionID: movedAction.reportActionID,
            moneyRequestPreviewReportActionID: newIOUAction.reportActionID,
            ...(oldIOUAction && !oldIOUAction.childReportID
                ? {
                    transactionThreadReportID,
                    transactionThreadCreatedReportActionID,
                }
                : {}),
        };
        if (!existingSelfDMReportID && reportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID) {
            // Add self DM data to transaction data
            transactionIDToReportActionAndThreadData[transaction.transactionID] = {
                ...baseTransactionData,
                selfDMReportID: selfDMReport.reportID,
                selfDMCreatedReportActionID: selfDMCreatedReportAction.reportActionID,
            };
        }
        else {
            transactionIDToReportActionAndThreadData[transaction.transactionID] = baseTransactionData;
        }
    });
    if (!transactionsMoved) {
        return;
    }
    // 8. Update the report totals
    Object.entries(updatedReportTotals).forEach(([reportIDToUpdate, total]) => {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportIDToUpdate}`,
            value: { total },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportIDToUpdate}`,
            value: { total: allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportIDToUpdate}`]?.total },
        });
    });
    Object.entries(updatedReportNonReimbursableTotals).forEach(([reportIDToUpdate, total]) => {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportIDToUpdate}`,
            value: { nonReimbursableTotal: total },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportIDToUpdate}`,
            value: { nonReimbursableTotal: allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportIDToUpdate}`]?.nonReimbursableTotal },
        });
    });
    Object.entries(updatedReportUnheldNonReimbursableTotals).forEach(([reportIDToUpdate, total]) => {
        optimisticData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportIDToUpdate}`,
            value: { unheldNonReimbursableTotal: total },
        });
        failureData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${reportIDToUpdate}`,
            value: {
                unheldNonReimbursableTotal: allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportIDToUpdate}`]?.unheldNonReimbursableTotal,
            },
        });
    });
    const reportTransactions = (0, ReportUtils_1.getReportTransactions)(reportID);
    reportTransactions.forEach((transaction) => {
        if (!(0, PolicyUtils_1.isPaidGroupPolicy)(policy) || !policy?.id) {
            return;
        }
        const violationData = ViolationsUtils_1.default.getViolationsOnyxData(transaction, currentTransactionViolations[transaction.transactionID] ?? [], policy, policyTagList, policyCategories, policyHasDependentTags, false);
        const hasOtherViolationsBesideDuplicates = Array.isArray(violationData.value) &&
            !violationData.value.every((violation) => {
                if (!isViolationWithName(violation)) {
                    return false;
                }
                return violation.name === CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION;
            });
        if (Array.isArray(violationData.value) && violationData.value.length > 0 && hasOtherViolationsBesideDuplicates) {
            shouldFixViolations = true;
        }
    });
    // 9. Update next step for report
    const nextStepReport = { ...newReport, total: updatedReportTotals[reportID] ?? newReport?.total, reportID: newReport?.reportID ?? reportID };
    const hasViolations = (0, ReportUtils_1.hasViolations)(nextStepReport?.reportID, allTransactionViolation);
    const optimisticNextStep = (0, NextStepUtils_1.buildNextStepNew)(nextStepReport, policy, accountID, email, hasViolations, isASAPSubmitBetaEnabled, nextStepReport.statusNum ?? CONST_1.default.REPORT.STATUS_NUM.OPEN, shouldFixViolations);
    optimisticData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${reportID}`,
        value: optimisticNextStep,
    });
    failureData.push({
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
        key: `${ONYXKEYS_1.default.COLLECTION.NEXT_STEP}${reportID}`,
        value: reportNextStep,
    });
    const parameters = {
        transactionList: transactionIDs.join(','),
        reportID,
        transactionIDToReportActionAndThreadData: JSON.stringify(transactionIDToReportActionAndThreadData),
    };
    API.write(types_1.WRITE_COMMANDS.CHANGE_TRANSACTIONS_REPORT, parameters, {
        optimisticData,
        successData,
        failureData,
    });
}
function getDraftTransactions(draftTransactions) {
    return Object.values(draftTransactions ?? allTransactionDrafts ?? {}).filter((transaction) => !!transaction);
}
