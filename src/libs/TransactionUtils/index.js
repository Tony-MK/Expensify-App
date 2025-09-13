"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOriginalTransactionWithSplitInfo = exports.getDistanceInMeters = void 0;
exports.buildOptimisticTransaction = buildOptimisticTransaction;
exports.calculateTaxAmount = calculateTaxAmount;
exports.getWorkspaceTaxesSettingsName = getWorkspaceTaxesSettingsName;
exports.getDefaultTaxCode = getDefaultTaxCode;
exports.transformedTaxRates = transformedTaxRates;
exports.getTaxValue = getTaxValue;
exports.getTaxName = getTaxName;
exports.getEnabledTaxRateCount = getEnabledTaxRateCount;
exports.getUpdatedTransaction = getUpdatedTransaction;
exports.getDescription = getDescription;
exports.getRequestType = getRequestType;
exports.getExpenseType = getExpenseType;
exports.isManualRequest = isManualRequest;
exports.isScanRequest = isScanRequest;
exports.getAmount = getAmount;
exports.getAttendees = getAttendees;
exports.getTaxAmount = getTaxAmount;
exports.getTaxCode = getTaxCode;
exports.getCurrency = getCurrency;
exports.getCardID = getCardID;
exports.getOriginalCurrency = getOriginalCurrency;
exports.getOriginalAmount = getOriginalAmount;
exports.getFormattedAttendees = getFormattedAttendees;
exports.getMerchant = getMerchant;
exports.hasAnyTransactionWithoutRTERViolation = hasAnyTransactionWithoutRTERViolation;
exports.getMerchantOrDescription = getMerchantOrDescription;
exports.getMCCGroup = getMCCGroup;
exports.getCreated = getCreated;
exports.getFormattedCreated = getFormattedCreated;
exports.getCategory = getCategory;
exports.getBillable = getBillable;
exports.getTag = getTag;
exports.getTagArrayFromName = getTagArrayFromName;
exports.getTagForDisplay = getTagForDisplay;
exports.getTransactionViolations = getTransactionViolations;
exports.hasReceipt = hasReceipt;
exports.hasEReceipt = hasEReceipt;
exports.hasRoute = hasRoute;
exports.isReceiptBeingScanned = isReceiptBeingScanned;
exports.didReceiptScanSucceed = didReceiptScanSucceed;
exports.getValidWaypoints = getValidWaypoints;
exports.getValidDuplicateTransactionIDs = getValidDuplicateTransactionIDs;
exports.isDistanceRequest = isDistanceRequest;
exports.isManualDistanceRequest = isManualDistanceRequest;
exports.isFetchingWaypointsFromServer = isFetchingWaypointsFromServer;
exports.isExpensifyCardTransaction = isExpensifyCardTransaction;
exports.isCardTransaction = isCardTransaction;
exports.isDuplicate = isDuplicate;
exports.isPending = isPending;
exports.isPosted = isPosted;
exports.isOnHold = isOnHold;
exports.isOnHoldByTransactionID = isOnHoldByTransactionID;
exports.getWaypoints = getWaypoints;
exports.isAmountMissing = isAmountMissing;
exports.isMerchantMissing = isMerchantMissing;
exports.isPartialMerchant = isPartialMerchant;
exports.isPartial = isPartial;
exports.isCreatedMissing = isCreatedMissing;
exports.areRequiredFieldsEmpty = areRequiredFieldsEmpty;
exports.hasMissingSmartscanFields = hasMissingSmartscanFields;
exports.hasPendingRTERViolation = hasPendingRTERViolation;
exports.allHavePendingRTERViolation = allHavePendingRTERViolation;
exports.hasPendingUI = hasPendingUI;
exports.getWaypointIndex = getWaypointIndex;
exports.waypointHasValidAddress = waypointHasValidAddress;
exports.getRecentTransactions = getRecentTransactions;
exports.hasReservationList = hasReservationList;
exports.hasViolation = hasViolation;
exports.hasDuplicateTransactions = hasDuplicateTransactions;
exports.hasBrokenConnectionViolation = hasBrokenConnectionViolation;
exports.shouldShowBrokenConnectionViolation = shouldShowBrokenConnectionViolation;
exports.shouldShowBrokenConnectionViolationForMultipleTransactions = shouldShowBrokenConnectionViolationForMultipleTransactions;
exports.hasNoticeTypeViolation = hasNoticeTypeViolation;
exports.hasWarningTypeViolation = hasWarningTypeViolation;
exports.isCustomUnitRateIDForP2P = isCustomUnitRateIDForP2P;
exports.getRateID = getRateID;
exports.compareDuplicateTransactionFields = compareDuplicateTransactionFields;
exports.getTransactionID = getTransactionID;
exports.buildNewTransactionAfterReviewingDuplicates = buildNewTransactionAfterReviewingDuplicates;
exports.buildMergeDuplicatesParams = buildMergeDuplicatesParams;
exports.getReimbursable = getReimbursable;
exports.isPayAtEndExpense = isPayAtEndExpense;
exports.removeSettledAndApprovedTransactions = removeSettledAndApprovedTransactions;
exports.removeTransactionFromDuplicateTransactionViolation = removeTransactionFromDuplicateTransactionViolation;
exports.getCardName = getCardName;
exports.hasReceiptSource = hasReceiptSource;
exports.shouldShowAttendees = shouldShowAttendees;
exports.getAllSortedTransactions = getAllSortedTransactions;
exports.getFormattedPostedDate = getFormattedPostedDate;
exports.getCategoryTaxCodeAndAmount = getCategoryTaxCodeAndAmount;
exports.isPerDiemRequest = isPerDiemRequest;
exports.isViolationDismissed = isViolationDismissed;
exports.isBrokenConnectionViolation = isBrokenConnectionViolation;
exports.shouldShowRTERViolationMessage = shouldShowRTERViolationMessage;
exports.isPartialTransaction = isPartialTransaction;
exports.isPendingCardOrScanningTransaction = isPendingCardOrScanningTransaction;
exports.isScanning = isScanning;
exports.checkIfShouldShowMarkAsCashButton = checkIfShouldShowMarkAsCashButton;
exports.getTransactionPendingAction = getTransactionPendingAction;
exports.isTransactionPendingDelete = isTransactionPendingDelete;
exports.createUnreportedExpenseSections = createUnreportedExpenseSections;
exports.isDemoTransaction = isDemoTransaction;
exports.shouldShowViolation = shouldShowViolation;
exports.isUnreportedAndHasInvalidDistanceRateTransaction = isUnreportedAndHasInvalidDistanceRateTransaction;
exports.getTransactionViolationsOfTransaction = getTransactionViolationsOfTransaction;
exports.isExpenseSplit = isExpenseSplit;
const date_fns_1 = require("date-fns");
const fast_equals_1 = require("fast-equals");
const cloneDeep_1 = require("lodash/cloneDeep");
const has_1 = require("lodash/has");
const set_1 = require("lodash/set");
const react_native_onyx_1 = require("react-native-onyx");
const Category_1 = require("@libs/actions/Policy/Category");
const Tag_1 = require("@libs/actions/Policy/Tag");
const CategoryUtils_1 = require("@libs/CategoryUtils");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const DateUtils_1 = require("@libs/DateUtils");
const DistanceRequestUtils_1 = require("@libs/DistanceRequestUtils");
const LocaleDigitUtils_1 = require("@libs/LocaleDigitUtils");
const Localize_1 = require("@libs/Localize");
const Log_1 = require("@libs/Log");
const NumberUtils_1 = require("@libs/NumberUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportActionsUtils_1 = require("@libs/ReportActionsUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const IntlStore_1 = require("@src/languages/IntlStore");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const getDistanceInMeters_1 = require("./getDistanceInMeters");
exports.getDistanceInMeters = getDistanceInMeters_1.default;
let allTransactions = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION,
    waitForCollectionCallback: true,
    callback: (value) => {
        if (!value) {
            return;
        }
        allTransactions = Object.fromEntries(Object.entries(value).filter(([, transaction]) => !!transaction));
    },
});
let allReports = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT,
    waitForCollectionCallback: true,
    callback: (value) => {
        allReports = value;
    },
});
let allTransactionViolations = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS,
    waitForCollectionCallback: true,
    callback: (value) => (allTransactionViolations = value),
});
let currentUserEmail = '';
let currentUserAccountID = -1;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.SESSION,
    callback: (val) => {
        currentUserEmail = val?.email ?? '';
        currentUserAccountID = val?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    },
});
function hasDistanceCustomUnit(transaction) {
    const type = transaction?.comment?.type;
    const customUnitName = transaction?.comment?.customUnit?.name;
    return type === CONST_1.default.TRANSACTION.TYPE.CUSTOM_UNIT && customUnitName === CONST_1.default.CUSTOM_UNITS.NAME_DISTANCE;
}
function isDistanceRequest(transaction) {
    // This is used during the expense creation flow before the transaction has been saved to the server
    if ((0, has_1.default)(transaction, 'iouRequestType')) {
        return (transaction?.iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE ||
            transaction?.iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MAP ||
            transaction?.iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MANUAL);
    }
    // This is the case for transaction objects once they have been saved to the server
    return hasDistanceCustomUnit(transaction);
}
function isMapDistanceRequest(transaction) {
    // This is used during the expense creation flow before the transaction has been saved to the server
    if ((0, has_1.default)(transaction, 'iouRequestType')) {
        return transaction?.iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MAP;
    }
    // This is the case for transaction objects once they have been saved to the server
    return hasDistanceCustomUnit(transaction);
}
function isManualDistanceRequest(transaction) {
    // This is used during the expense creation flow before the transaction has been saved to the server
    if ((0, has_1.default)(transaction, 'iouRequestType')) {
        return transaction?.iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MANUAL;
    }
    // This is the case for transaction objects once they have been saved to the server
    return hasDistanceCustomUnit(transaction) && (0, EmptyObject_1.isEmptyObject)(transaction?.comment?.waypoints);
}
function isScanRequest(transaction) {
    // This is used during the expense creation flow before the transaction has been saved to the server
    if ((0, has_1.default)(transaction, 'iouRequestType')) {
        return transaction?.iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.SCAN;
    }
    return !!transaction?.receipt?.source && transaction?.amount === 0;
}
function isPerDiemRequest(transaction) {
    // This is used during the expense creation flow before the transaction has been saved to the server
    if ((0, has_1.default)(transaction, 'iouRequestType')) {
        return transaction?.iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.PER_DIEM;
    }
    // This is the case for transaction objects once they have been saved to the server
    const type = transaction?.comment?.type;
    const customUnitName = transaction?.comment?.customUnit?.name;
    return type === CONST_1.default.TRANSACTION.TYPE.CUSTOM_UNIT && customUnitName === CONST_1.default.CUSTOM_UNITS.NAME_PER_DIEM_INTERNATIONAL;
}
function getRequestType(transaction, isManualDistanceEnabled) {
    if (isManualDistanceEnabled) {
        if (isManualDistanceRequest(transaction)) {
            return CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MANUAL;
        }
        if (isMapDistanceRequest(transaction)) {
            return CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MAP;
        }
    }
    if (isDistanceRequest(transaction)) {
        return CONST_1.default.IOU.REQUEST_TYPE.DISTANCE;
    }
    if (isScanRequest(transaction)) {
        return CONST_1.default.IOU.REQUEST_TYPE.SCAN;
    }
    if (isPerDiemRequest(transaction)) {
        return CONST_1.default.IOU.REQUEST_TYPE.PER_DIEM;
    }
    return CONST_1.default.IOU.REQUEST_TYPE.MANUAL;
}
/**
 * Determines the expense type of a given transaction.
 */
function getExpenseType(transaction) {
    if (!transaction) {
        return undefined;
    }
    if (isExpensifyCardTransaction(transaction)) {
        if (isPending(transaction)) {
            return CONST_1.default.IOU.EXPENSE_TYPE.PENDING_EXPENSIFY_CARD;
        }
        return CONST_1.default.IOU.EXPENSE_TYPE.EXPENSIFY_CARD;
    }
    return getRequestType(transaction);
}
function isManualRequest(transaction) {
    // This is used during the expense creation flow before the transaction has been saved to the server
    if ((0, has_1.default)(transaction, 'iouRequestType')) {
        return transaction.iouRequestType === CONST_1.default.IOU.REQUEST_TYPE.MANUAL;
    }
    return getRequestType(transaction) === CONST_1.default.IOU.REQUEST_TYPE.MANUAL;
}
function isPartialTransaction(transaction) {
    const merchant = getMerchant(transaction);
    if (!merchant || isPartialMerchant(merchant)) {
        return true;
    }
    if (isAmountMissing(transaction) && isScanRequest(transaction)) {
        return true;
    }
    return false;
}
function isPendingCardOrScanningTransaction(transaction) {
    return (isExpensifyCardTransaction(transaction) && isPending(transaction)) || isPartialTransaction(transaction) || (isScanRequest(transaction) && isScanning(transaction));
}
/**
 * Optimistically generate a transaction.
 *
 * @param amount – in cents
 * @param [existingTransactionID] When creating a distance expense, an empty transaction has already been created with a transactionID. In that case, the transaction here needs to have
 * it's transactionID match what was already generated.
 */
function buildOptimisticTransaction(params) {
    const { originalTransactionID = '', existingTransactionID, existingTransaction, policy, transactionParams, isDemoTransactionParam } = params;
    const { amount, currency, reportID, distance, comment = '', attendees = [], created = '', merchant = '', receipt, category = '', tag = '', taxCode = '', taxAmount = 0, billable = false, pendingFields, reimbursable = true, source = '', filename = '', customUnit, splitExpenses, participants, } = transactionParams;
    // transactionIDs are random, positive, 64-bit numeric strings.
    // Because JS can only handle 53-bit numbers, transactionIDs are strings in the front-end (just like reportActionID)
    const transactionID = existingTransactionID ?? (0, NumberUtils_1.rand64)();
    const commentJSON = { comment, attendees };
    if (isDemoTransactionParam) {
        commentJSON.isDemoTransaction = true;
    }
    if (source) {
        commentJSON.source = source;
    }
    if (originalTransactionID) {
        commentJSON.originalTransactionID = originalTransactionID;
    }
    if (splitExpenses) {
        commentJSON.splitExpenses = splitExpenses;
    }
    const isMapDistanceTransaction = !!pendingFields?.waypoints;
    const isManualDistanceTransaction = isManualDistanceRequest(existingTransaction);
    if (isMapDistanceTransaction || isManualDistanceTransaction) {
        // Set the distance unit, which comes from the policy distance unit or the P2P rate data
        (0, set_1.default)(commentJSON, 'customUnit.distanceUnit', DistanceRequestUtils_1.default.getUpdatedDistanceUnit({ transaction: existingTransaction, policy }));
        (0, set_1.default)(commentJSON, 'customUnit.quantity', distance);
    }
    const isPerDiemTransaction = !!pendingFields?.subRates;
    if (isPerDiemTransaction) {
        // Set the custom unit, which comes from the policy per diem rate data
        (0, set_1.default)(commentJSON, 'customUnit', customUnit);
    }
    return {
        ...(!(0, EmptyObject_1.isEmptyObject)(pendingFields) ? { pendingFields } : {}),
        transactionID,
        amount,
        currency,
        reportID,
        comment: commentJSON,
        merchant: merchant || CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT,
        created: created || DateUtils_1.default.getDBTime(),
        pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD,
        receipt: receipt?.source ? { source: receipt.source, state: receipt.state ?? CONST_1.default.IOU.RECEIPT_STATE.SCAN_READY, isTestDriveReceipt: receipt.isTestDriveReceipt } : {},
        filename: (receipt?.source ? (receipt?.name ?? filename) : filename).toString(),
        category,
        tag,
        taxCode,
        taxAmount,
        billable,
        reimbursable,
        inserted: DateUtils_1.default.getDBTime(),
        participants,
    };
}
/**
 * Check if the transaction has an Ereceipt
 */
function hasEReceipt(transaction) {
    return !!transaction?.hasEReceipt;
}
function hasReceipt(transaction) {
    return !!transaction?.receipt?.state || hasEReceipt(transaction);
}
/** Check if the receipt has the source file */
function hasReceiptSource(transaction) {
    return !!transaction?.receipt?.source;
}
function isDemoTransaction(transaction) {
    return transaction?.comment?.isDemoTransaction ?? false;
}
function isMerchantMissing(transaction) {
    if (transaction?.modifiedMerchant && transaction.modifiedMerchant !== '') {
        return transaction.modifiedMerchant === CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT;
    }
    const isMerchantEmpty = transaction?.merchant === CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT || transaction?.merchant === '';
    return isMerchantEmpty;
}
/**
 * Determine if we should show the attendee selector for a given expense on a give policy.
 */
function shouldShowAttendees(iouType, policy) {
    if ((iouType !== CONST_1.default.IOU.TYPE.SUBMIT && iouType !== CONST_1.default.IOU.TYPE.CREATE) || !policy?.id || policy?.type !== CONST_1.default.POLICY.TYPE.CORPORATE) {
        return false;
    }
    // For backwards compatibility with Expensify Classic, we assume that Attendee Tracking is enabled by default on
    // Control policies if the policy does not contain the attribute
    return policy?.isAttendeeTrackingEnabled ?? true;
}
/**
 * Check if the merchant is partial i.e. `(none)`
 */
function isPartialMerchant(merchant) {
    return merchant === CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT;
}
function isAmountMissing(transaction) {
    return transaction?.amount === 0 && (!transaction.modifiedAmount || transaction.modifiedAmount === 0);
}
function isPartial(transaction) {
    return isPartialMerchant(getMerchant(transaction)) && isAmountMissing(transaction);
}
function isCreatedMissing(transaction) {
    if (!transaction) {
        return true;
    }
    return transaction?.created === '' && (!transaction.created || transaction.modifiedCreated === '');
}
function areRequiredFieldsEmpty(transaction) {
    const parentReport = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${transaction?.reportID}`];
    const isFromExpenseReport = parentReport?.type === CONST_1.default.REPORT.TYPE.EXPENSE;
    const isSplitPolicyExpenseChat = !!transaction?.comment?.splits?.some((participant) => allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${participant.chatReportID}`]?.isOwnPolicyExpenseChat);
    const isMerchantRequired = isFromExpenseReport || isSplitPolicyExpenseChat;
    return (isMerchantRequired && isMerchantMissing(transaction)) || isAmountMissing(transaction) || isCreatedMissing(transaction);
}
/**
 * Given the edit made to the expense, return an updated transaction object.
 */
function getUpdatedTransaction({ transaction, transactionChanges, isFromExpenseReport, shouldUpdateReceiptState = true, policy = undefined, }) {
    const isUnReportedExpense = transaction?.reportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID;
    // Only changing the first level fields so no need for deep clone now
    const updatedTransaction = (0, cloneDeep_1.default)(transaction);
    let shouldStopSmartscan = false;
    // The comment property does not have its modifiedComment counterpart
    if (Object.hasOwn(transactionChanges, 'comment')) {
        updatedTransaction.comment = {
            ...updatedTransaction.comment,
            comment: transactionChanges.comment,
        };
    }
    if (Object.hasOwn(transactionChanges, 'created')) {
        updatedTransaction.modifiedCreated = transactionChanges.created;
        shouldStopSmartscan = true;
    }
    if (Object.hasOwn(transactionChanges, 'amount') && typeof transactionChanges.amount === 'number') {
        updatedTransaction.modifiedAmount = isFromExpenseReport || isUnReportedExpense ? -transactionChanges.amount : transactionChanges.amount;
        shouldStopSmartscan = true;
    }
    if (Object.hasOwn(transactionChanges, 'currency')) {
        updatedTransaction.modifiedCurrency = transactionChanges.currency;
        shouldStopSmartscan = true;
    }
    if (Object.hasOwn(transactionChanges, 'merchant')) {
        updatedTransaction.modifiedMerchant = transactionChanges.merchant;
        shouldStopSmartscan = true;
    }
    if (Object.hasOwn(transactionChanges, 'waypoints')) {
        updatedTransaction.modifiedWaypoints = transactionChanges.waypoints;
        updatedTransaction.isLoading = true;
        shouldStopSmartscan = true;
        if (!transactionChanges.routes?.route0?.geometry?.coordinates) {
            // The waypoints were changed, but there is no route – it is pending from the BE and we should mark the fields as pending
            updatedTransaction.amount = CONST_1.default.IOU.DEFAULT_AMOUNT;
            updatedTransaction.modifiedAmount = CONST_1.default.IOU.DEFAULT_AMOUNT;
            updatedTransaction.modifiedMerchant = (0, Localize_1.translateLocal)('iou.fieldPending');
        }
        else {
            const mileageRate = DistanceRequestUtils_1.default.getRate({ transaction: updatedTransaction, policy });
            const { unit, rate } = mileageRate;
            const distanceInMeters = (0, getDistanceInMeters_1.default)(transaction, unit);
            const amount = DistanceRequestUtils_1.default.getDistanceRequestAmount(distanceInMeters, unit, rate ?? 0);
            const updatedAmount = isFromExpenseReport || isUnReportedExpense ? -amount : amount;
            const updatedMerchant = DistanceRequestUtils_1.default.getDistanceMerchant(true, distanceInMeters, unit, rate, transaction.currency, Localize_1.translateLocal, (digit) => (0, LocaleDigitUtils_1.toLocaleDigit)(IntlStore_1.default.getCurrentLocale(), digit));
            updatedTransaction.amount = updatedAmount;
            updatedTransaction.modifiedAmount = updatedAmount;
            updatedTransaction.modifiedMerchant = updatedMerchant;
        }
    }
    if (Object.hasOwn(transactionChanges, 'customUnitRateID')) {
        (0, set_1.default)(updatedTransaction, 'comment.customUnit.customUnitRateID', transactionChanges.customUnitRateID);
        (0, set_1.default)(updatedTransaction, 'comment.customUnit.defaultP2PRate', null);
        shouldStopSmartscan = true;
        const existingDistanceUnit = transaction?.comment?.customUnit?.distanceUnit;
        // Get the new distance unit from the rate's unit
        const newDistanceUnit = DistanceRequestUtils_1.default.getUpdatedDistanceUnit({ transaction: updatedTransaction, policy });
        (0, set_1.default)(updatedTransaction, 'comment.customUnit.distanceUnit', newDistanceUnit);
        // If the distanceUnit is set and the rate is changed to one that has a different unit, convert the distance to the new unit
        if (existingDistanceUnit && newDistanceUnit !== existingDistanceUnit) {
            const conversionFactor = existingDistanceUnit === CONST_1.default.CUSTOM_UNITS.DISTANCE_UNIT_MILES ? CONST_1.default.CUSTOM_UNITS.MILES_TO_KILOMETERS : CONST_1.default.CUSTOM_UNITS.KILOMETERS_TO_MILES;
            const distance = (0, NumberUtils_1.roundToTwoDecimalPlaces)((transaction?.comment?.customUnit?.quantity ?? 0) * conversionFactor);
            (0, set_1.default)(updatedTransaction, 'comment.customUnit.quantity', distance);
        }
        if (!isFetchingWaypointsFromServer(transaction)) {
            // When the waypoints are being fetched from the server, we have no information about the distance, and cannot recalculate the updated amount.
            // Otherwise, recalculate the fields based on the new rate.
            const oldMileageRate = DistanceRequestUtils_1.default.getRate({ transaction, policy });
            const updatedMileageRate = DistanceRequestUtils_1.default.getRate({ transaction: updatedTransaction, policy, useTransactionDistanceUnit: false });
            const { unit, rate } = updatedMileageRate;
            const distanceInMeters = (0, getDistanceInMeters_1.default)(transaction, oldMileageRate?.unit);
            const amount = DistanceRequestUtils_1.default.getDistanceRequestAmount(distanceInMeters, unit, rate ?? 0);
            const updatedAmount = isFromExpenseReport || isUnReportedExpense ? -amount : amount;
            const updatedCurrency = updatedMileageRate.currency ?? CONST_1.default.CURRENCY.USD;
            const updatedMerchant = DistanceRequestUtils_1.default.getDistanceMerchant(true, distanceInMeters, unit, rate, updatedCurrency, Localize_1.translateLocal, (digit) => (0, LocaleDigitUtils_1.toLocaleDigit)(IntlStore_1.default.getCurrentLocale(), digit));
            updatedTransaction.amount = updatedAmount;
            updatedTransaction.modifiedAmount = updatedAmount;
            updatedTransaction.modifiedMerchant = updatedMerchant;
            updatedTransaction.modifiedCurrency = updatedCurrency;
        }
    }
    if (Object.hasOwn(transactionChanges, 'taxAmount') && typeof transactionChanges.taxAmount === 'number') {
        updatedTransaction.taxAmount = isFromExpenseReport ? -transactionChanges.taxAmount : transactionChanges.taxAmount;
    }
    if (Object.hasOwn(transactionChanges, 'taxCode') && typeof transactionChanges.taxCode === 'string') {
        updatedTransaction.taxCode = transactionChanges.taxCode;
    }
    if (Object.hasOwn(transactionChanges, 'reimbursable') && typeof transactionChanges.reimbursable === 'boolean') {
        updatedTransaction.reimbursable = transactionChanges.reimbursable;
    }
    if (Object.hasOwn(transactionChanges, 'billable') && typeof transactionChanges.billable === 'boolean') {
        updatedTransaction.billable = transactionChanges.billable;
    }
    if (Object.hasOwn(transactionChanges, 'category') && typeof transactionChanges.category === 'string') {
        updatedTransaction.category = transactionChanges.category;
        const { categoryTaxCode, categoryTaxAmount } = getCategoryTaxCodeAndAmount(transactionChanges.category, transaction, policy);
        if (categoryTaxCode && categoryTaxAmount !== undefined) {
            updatedTransaction.taxCode = categoryTaxCode;
            updatedTransaction.taxAmount = categoryTaxAmount;
        }
    }
    if (Object.hasOwn(transactionChanges, 'tag') && typeof transactionChanges.tag === 'string') {
        updatedTransaction.tag = transactionChanges.tag;
    }
    if (Object.hasOwn(transactionChanges, 'attendees')) {
        updatedTransaction.modifiedAttendees = transactionChanges?.attendees;
    }
    if (shouldUpdateReceiptState &&
        shouldStopSmartscan &&
        transaction?.receipt &&
        Object.keys(transaction.receipt).length > 0 &&
        transaction?.receipt?.state !== CONST_1.default.IOU.RECEIPT_STATE.OPEN &&
        updatedTransaction.receipt) {
        updatedTransaction.receipt.state = CONST_1.default.IOU.RECEIPT_STATE.OPEN;
    }
    updatedTransaction.pendingFields = {
        ...(updatedTransaction?.pendingFields ?? {}),
        ...(Object.hasOwn(transactionChanges, 'comment') && { comment: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE }),
        ...(Object.hasOwn(transactionChanges, 'created') && { created: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE }),
        ...(Object.hasOwn(transactionChanges, 'amount') && { amount: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE }),
        ...(Object.hasOwn(transactionChanges, 'currency') && { currency: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE }),
        ...(Object.hasOwn(transactionChanges, 'merchant') && { merchant: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE }),
        ...(Object.hasOwn(transactionChanges, 'waypoints') && { waypoints: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE }),
        ...(Object.hasOwn(transactionChanges, 'reimbursable') && { reimbursable: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE }),
        ...(Object.hasOwn(transactionChanges, 'billable') && { billable: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE }),
        ...(Object.hasOwn(transactionChanges, 'category') && { category: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE }),
        ...(Object.hasOwn(transactionChanges, 'tag') && { tag: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE }),
        ...(Object.hasOwn(transactionChanges, 'taxAmount') && { taxAmount: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE }),
        ...(Object.hasOwn(transactionChanges, 'taxCode') && { taxCode: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE }),
        ...(Object.hasOwn(transactionChanges, 'attendees') && { attendees: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE }),
    };
    return updatedTransaction;
}
/**
 * Return the comment field (referred to as description in the App) from the transaction.
 * The comment does not have its modifiedComment counterpart.
 */
function getDescription(transaction) {
    // Casting the description to string to avoid wrong data types (e.g. number) being returned from the API
    return transaction?.comment?.comment?.toString() ?? '';
}
/**
 * Return the amount field from the transaction, return the modifiedAmount if present.
 */
function getAmount(transaction, isFromExpenseReport = false, isFromTrackedExpense = false) {
    // IOU requests cannot have negative values, but they can be stored as negative values, let's return absolute value
    if (!isFromExpenseReport && !isFromTrackedExpense) {
        const amount = transaction?.modifiedAmount ?? 0;
        if (amount) {
            return Math.abs(amount);
        }
        return Math.abs(transaction?.amount ?? 0);
    }
    // Expense report case:
    // The amounts are stored using an opposite sign and negative values can be set,
    // we need to return an opposite sign than is saved in the transaction object
    let amount = transaction?.modifiedAmount ?? 0;
    if (amount) {
        return -amount;
    }
    // To avoid -0 being shown, lets only change the sign if the value is other than 0.
    amount = transaction?.amount ?? 0;
    return amount ? -amount : 0;
}
/**
 * Return the tax amount field from the transaction.
 */
function getTaxAmount(transaction, isFromExpenseReport) {
    // IOU requests cannot have negative values but they can be stored as negative values, let's return absolute value
    if (!isFromExpenseReport) {
        return Math.abs(transaction?.taxAmount ?? 0);
    }
    // To avoid -0 being shown, lets only change the sign if the value is other than 0.
    const amount = transaction?.taxAmount ?? 0;
    return amount ? -amount : 0;
}
/**
 * Return the tax code from the transaction.
 */
function getTaxCode(transaction) {
    return transaction?.taxCode ?? '';
}
/**
 * Return the posted date from the transaction.
 */
function getPostedDate(transaction) {
    return transaction?.posted ?? '';
}
/**
 * Return the formatted posted date from the transaction.
 */
function getFormattedPostedDate(transaction, dateFormat = CONST_1.default.DATE.FNS_FORMAT_STRING) {
    const postedDate = getPostedDate(transaction);
    const parsedDate = (0, date_fns_1.parse)(postedDate, 'yyyyMMdd', new Date());
    if ((0, date_fns_1.isValid)(parsedDate)) {
        return DateUtils_1.default.formatWithUTCTimeZone((0, date_fns_1.format)(parsedDate, 'yyyy-MM-dd'), dateFormat);
    }
    return '';
}
/**
 * Return the currency field from the transaction, return the modifiedCurrency if present.
 */
function getCurrency(transaction) {
    const currency = transaction?.modifiedCurrency ?? '';
    if (currency) {
        return currency;
    }
    return transaction?.currency ?? CONST_1.default.CURRENCY.USD;
}
/**
 * Return the original currency field from the transaction.
 */
function getOriginalCurrency(transaction) {
    return transaction?.originalCurrency ?? '';
}
/**
 * Return the absolute value of the original amount field from the transaction.
 */
function getOriginalAmount(transaction) {
    const amount = transaction?.originalAmount ?? 0;
    return Math.abs(amount);
}
/**
 * Verify if the transaction is expecting the distance to be calculated on the server
 */
function isFetchingWaypointsFromServer(transaction) {
    return !!transaction?.pendingFields?.waypoints;
}
/**
 * Verify that the transaction is in Self DM and that its distance rate is invalid.
 */
function isUnreportedAndHasInvalidDistanceRateTransaction(transaction, policyParam = undefined) {
    if (transaction && isDistanceRequest(transaction)) {
        const report = (0, ReportUtils_1.getReportOrDraftReport)(transaction.reportID);
        // eslint-disable-next-line deprecation/deprecation
        const policy = policyParam ?? (0, PolicyUtils_1.getPolicy)(report?.policyID);
        const { rate } = DistanceRequestUtils_1.default.getRate({ transaction, policy });
        const isUnreportedExpense = !transaction.reportID || transaction.reportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID;
        if (isUnreportedExpense && !rate) {
            return true;
        }
    }
    return false;
}
/**
 * Return the merchant field from the transaction, return the modifiedMerchant if present.
 */
function getMerchant(transaction, policyParam = undefined) {
    if (transaction && isDistanceRequest(transaction)) {
        const report = (0, ReportUtils_1.getReportOrDraftReport)(transaction.reportID);
        // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
        // eslint-disable-next-line deprecation/deprecation
        const policy = policyParam ?? (0, PolicyUtils_1.getPolicy)(report?.policyID);
        const mileageRate = DistanceRequestUtils_1.default.getRate({ transaction, policy });
        const { unit, rate } = mileageRate;
        const distanceInMeters = (0, getDistanceInMeters_1.default)(transaction, unit);
        if (!isUnreportedAndHasInvalidDistanceRateTransaction(transaction, policy)) {
            return DistanceRequestUtils_1.default.getDistanceMerchant(true, distanceInMeters, unit, rate, transaction.currency, Localize_1.translateLocal, (digit) => (0, LocaleDigitUtils_1.toLocaleDigit)(IntlStore_1.default.getCurrentLocale(), digit));
        }
    }
    return transaction?.modifiedMerchant ? transaction.modifiedMerchant : (transaction?.merchant ?? '');
}
function getMerchantOrDescription(transaction) {
    return !isMerchantMissing(transaction) ? getMerchant(transaction) : getDescription(transaction);
}
/**
 * Return the list of modified attendees if present otherwise list of attendees
 */
function getAttendees(transaction) {
    const attendees = transaction?.modifiedAttendees ? transaction.modifiedAttendees : (transaction?.comment?.attendees ?? []);
    if (attendees.length === 0 && transaction?.reportID) {
        // Get the creator of the transaction by looking at the owner of the report linked to the transaction
        const report = (0, ReportUtils_1.getReportOrDraftReport)(transaction.reportID);
        const creatorAccountID = report?.ownerAccountID;
        if (creatorAccountID) {
            const [creatorDetails] = (0, PersonalDetailsUtils_1.getPersonalDetailsByIDs)({ accountIDs: [creatorAccountID], currentUserAccountID });
            const creatorEmail = creatorDetails?.login ?? '';
            const creatorDisplayName = creatorDetails?.displayName ?? creatorEmail;
            if (creatorEmail) {
                attendees.push({
                    email: creatorEmail,
                    login: creatorEmail,
                    displayName: creatorDisplayName,
                    accountID: creatorAccountID,
                    text: creatorDisplayName,
                    searchText: creatorDisplayName,
                    avatarUrl: creatorDetails?.avatarThumbnail ?? '',
                    selected: true,
                });
            }
        }
    }
    return attendees;
}
/**
 * Return the list of attendees as a string and modified list of attendees as a string if present.
 */
function getFormattedAttendees(modifiedAttendees, attendees) {
    const oldAttendees = modifiedAttendees ?? [];
    const newAttendees = attendees ?? [];
    return [oldAttendees.map((item) => item.displayName ?? item.login).join(', '), newAttendees.map((item) => item.displayName ?? item.login).join(', ')];
}
/**
 * Return the reimbursable value. Defaults to true to match BE logic.
 */
function getReimbursable(transaction) {
    return transaction?.reimbursable ?? true;
}
/**
 * Return the mccGroup field from the transaction, return the modifiedMCCGroup if present.
 */
function getMCCGroup(transaction) {
    return transaction?.modifiedMCCGroup ? transaction.modifiedMCCGroup : transaction?.mccGroup;
}
/**
 * Return the waypoints field from the transaction, return the modifiedWaypoints if present.
 */
function getWaypoints(transaction) {
    return transaction?.modifiedWaypoints ?? transaction?.comment?.waypoints;
}
/**
 * Return the category from the transaction. This "category" field has no "modified" complement.
 */
function getCategory(transaction) {
    return transaction?.category ?? '';
}
/**
 * Return the cardID from the transaction.
 */
function getCardID(transaction) {
    return transaction?.cardID ?? CONST_1.default.DEFAULT_NUMBER_ID;
}
/**
 * Return the billable field from the transaction. This "billable" field has no "modified" complement.
 */
function getBillable(transaction) {
    return transaction?.billable ?? false;
}
/**
 * Return a colon-delimited tag string as an array, considering escaped colons and double backslashes.
 */
function getTagArrayFromName(tagName) {
    // WAIT!!!!!!!!!!!!!!!!!!
    // You need to keep this in sync with TransactionUtils.php
    // We need to be able to preserve double backslashes in the original string
    // and not have it interfere with splitting on a colon (:).
    // So, let's replace it with something absurd to begin with, do our split, and
    // then replace the double backslashes in the end.
    const tagWithoutDoubleSlashes = tagName.replace(/\\\\/g, '☠');
    const tagWithoutEscapedColons = tagWithoutDoubleSlashes.replace(/\\:/g, '☢');
    // Do our split
    const matches = tagWithoutEscapedColons.split(':');
    const newMatches = [];
    for (const item of matches) {
        const tagWithEscapedColons = item.replace(/☢/g, '\\:');
        const tagWithDoubleSlashes = tagWithEscapedColons.replace(/☠/g, '\\\\');
        newMatches.push(tagWithDoubleSlashes);
    }
    return newMatches;
}
/**
 * Return the tag from the transaction. When the tagIndex is passed, return the tag based on the index.
 * This "tag" field has no "modified" complement.
 */
function getTag(transaction, tagIndex) {
    if (tagIndex !== undefined) {
        const tagsArray = getTagArrayFromName(transaction?.tag ?? '');
        return tagsArray.at(tagIndex) ?? '';
    }
    return transaction?.tag ?? '';
}
function getTagForDisplay(transaction, tagIndex) {
    return (0, PolicyUtils_1.getCommaSeparatedTagNameWithSanitizedColons)(getTag(transaction, tagIndex));
}
function getCreated(transaction) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return transaction?.modifiedCreated ? transaction.modifiedCreated : transaction?.created || '';
}
/**
 * Return the created field from the transaction, return the modifiedCreated if present.
 */
function getFormattedCreated(transaction, dateFormat = CONST_1.default.DATE.FNS_FORMAT_STRING) {
    const created = getCreated(transaction);
    return DateUtils_1.default.formatWithUTCTimeZone(created, dateFormat);
}
/**
 * Determine whether a transaction is made with an Expensify card.
 */
function isExpensifyCardTransaction(transaction) {
    return transaction?.bank === CONST_1.default.EXPENSIFY_CARD.BANK;
}
/**
 * Determine whether a transaction is made with a card (Expensify or Company Card).
 */
function isCardTransaction(transaction) {
    return !!transaction?.managedCard;
}
function getCardName(transaction) {
    return transaction?.cardName ?? '';
}
/**
 * Check if the transaction status is set to Pending.
 */
function isPending(transaction) {
    if (!transaction?.status) {
        return false;
    }
    return transaction.status === CONST_1.default.TRANSACTION.STATUS.PENDING;
}
/**
 * Check if the transaction status is set to Posted.
 */
function isPosted(transaction) {
    if (!transaction.status) {
        return false;
    }
    return transaction.status === CONST_1.default.TRANSACTION.STATUS.POSTED;
}
/**
 * The transaction is considered scanning if it is a partial transaction, has a receipt, and the receipt is being scanned.
 * Note that this does not include receipts that are being scanned in the background for auditing / smart scan everything, because there should be no indication to the user that the receipt is being scanned.
 */
function isScanning(transaction) {
    return isPartialTransaction(transaction) && hasReceipt(transaction) && isReceiptBeingScanned(transaction);
}
function isReceiptBeingScanned(transaction) {
    return [CONST_1.default.IOU.RECEIPT_STATE.SCAN_READY, CONST_1.default.IOU.RECEIPT_STATE.SCANNING].some((value) => value === transaction?.receipt?.state);
}
function didReceiptScanSucceed(transaction) {
    return [CONST_1.default.IOU.RECEIPT_STATE.SCAN_COMPLETE].some((value) => value === transaction?.receipt?.state);
}
/**
 * Check if the transaction has a non-smart-scanning receipt and is missing required fields
 */
function hasMissingSmartscanFields(transaction) {
    return !!(transaction && !isDistanceRequest(transaction) && !isReceiptBeingScanned(transaction) && areRequiredFieldsEmpty(transaction));
}
/**
 * Get all transaction violations of the transaction with given transactionID.
 */
function getTransactionViolations(transaction, transactionViolations) {
    if (!transaction || !transactionViolations) {
        return undefined;
    }
    return transactionViolations?.[ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS + transaction.transactionID]?.filter((violation) => !isViolationDismissed(transaction, violation));
}
function getTransactionViolationsOfTransaction(transactionID) {
    return allTransactionViolations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`] ?? [];
}
/**
 * Check if there is pending rter violation in transactionViolations.
 */
function hasPendingRTERViolation(transactionViolations) {
    return !!transactionViolations?.some((transactionViolation) => transactionViolation.name === CONST_1.default.VIOLATIONS.RTER &&
        transactionViolation.data?.pendingPattern &&
        transactionViolation.data?.rterType !== CONST_1.default.RTER_VIOLATION_TYPES.BROKEN_CARD_CONNECTION &&
        transactionViolation.data?.rterType !== CONST_1.default.RTER_VIOLATION_TYPES.BROKEN_CARD_CONNECTION_530);
}
/**
 * Check if there is broken connection violation.
 */
function hasBrokenConnectionViolation(transaction, transactionViolations) {
    const violations = getTransactionViolations(transaction, transactionViolations);
    return !!violations?.find((violation) => isBrokenConnectionViolation(violation));
}
function isBrokenConnectionViolation(violation) {
    return (violation.name === CONST_1.default.VIOLATIONS.RTER &&
        (violation.data?.rterType === CONST_1.default.RTER_VIOLATION_TYPES.BROKEN_CARD_CONNECTION || violation.data?.rterType === CONST_1.default.RTER_VIOLATION_TYPES.BROKEN_CARD_CONNECTION_530));
}
function shouldShowBrokenConnectionViolationInternal(brokenConnectionViolations, report, policy) {
    if (brokenConnectionViolations.length === 0) {
        return false;
    }
    if (!(0, PolicyUtils_1.isPolicyAdmin)(policy) || (0, ReportUtils_1.isCurrentUserSubmitter)(report)) {
        return true;
    }
    if ((0, ReportUtils_1.isOpenExpenseReport)(report)) {
        return true;
    }
    return (0, ReportUtils_1.isProcessingReport)(report) && (0, PolicyUtils_1.isInstantSubmitEnabled)(policy);
}
/**
 * Check if user should see broken connection violation warning based on violations list.
 */
function shouldShowBrokenConnectionViolation(report, policy, transactionViolations) {
    const brokenConnectionViolations = transactionViolations.filter((violation) => isBrokenConnectionViolation(violation));
    return shouldShowBrokenConnectionViolationInternal(brokenConnectionViolations, report, policy);
}
/**
 * Check if user should see broken connection violation warning based on selected transactions.
 */
function shouldShowBrokenConnectionViolationForMultipleTransactions(transactionIDs, report, policy, transactionViolations) {
    const violations = transactionIDs.flatMap((id) => transactionViolations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${id}`] ?? []);
    const brokenConnectionViolations = violations.filter((violation) => isBrokenConnectionViolation(violation));
    return shouldShowBrokenConnectionViolationInternal(brokenConnectionViolations, report, policy);
}
/**
 * Check if the user should see the violation
 */
function shouldShowViolation(iouReport, policy, violationName, shouldShowRterForSettledReport = true) {
    const isSubmitter = (0, ReportUtils_1.isCurrentUserSubmitter)(iouReport);
    const isPolicyMember = (0, PolicyUtils_1.isPolicyMember)(policy, currentUserEmail);
    const isReportOpen = (0, ReportUtils_1.isOpenExpenseReport)(iouReport);
    if (violationName === CONST_1.default.VIOLATIONS.AUTO_REPORTED_REJECTED_EXPENSE) {
        return isSubmitter || (0, PolicyUtils_1.isPolicyAdmin)(policy);
    }
    if (violationName === CONST_1.default.VIOLATIONS.OVER_AUTO_APPROVAL_LIMIT) {
        return (0, PolicyUtils_1.isPolicyAdmin)(policy) && !isSubmitter;
    }
    if (violationName === CONST_1.default.VIOLATIONS.RTER) {
        return (isSubmitter || (0, PolicyUtils_1.isInstantSubmitEnabled)(policy)) && (shouldShowRterForSettledReport || !(0, ReportUtils_1.isSettled)(iouReport));
    }
    if (violationName === CONST_1.default.VIOLATIONS.RECEIPT_NOT_SMART_SCANNED) {
        return isPolicyMember && !isSubmitter && !isReportOpen;
    }
    return true;
}
/**
 * Check if there is pending rter violation in all transactionViolations with given transactionIDs.
 */
function allHavePendingRTERViolation(transactions, transactionViolations) {
    if (!transactions) {
        return false;
    }
    const transactionsWithRTERViolations = transactions.map((transaction) => {
        const filteredTransactionViolations = getTransactionViolations(transaction, transactionViolations);
        return hasPendingRTERViolation(filteredTransactionViolations);
    });
    return transactionsWithRTERViolations.length > 0 && transactionsWithRTERViolations.every((value) => value === true);
}
function checkIfShouldShowMarkAsCashButton(hasRTERPendingViolation, shouldDisplayBrokenConnectionViolation, report, policy) {
    if (hasRTERPendingViolation) {
        return true;
    }
    return shouldDisplayBrokenConnectionViolation && (!(0, PolicyUtils_1.isPolicyAdmin)(policy) || (0, ReportUtils_1.isCurrentUserSubmitter)(report)) && !(0, ReportUtils_1.isReportApproved)({ report }) && !(0, ReportUtils_1.isReportManuallyReimbursed)(report);
}
/**
 * Check if there is any transaction without RTER violation within the given transactionIDs.
 */
function hasAnyTransactionWithoutRTERViolation(transactions, transactionViolations) {
    return (transactions.length > 0 &&
        transactions.some((transaction) => {
            return !hasBrokenConnectionViolation(transaction, transactionViolations);
        }));
}
/**
 * Check if the transaction is pending or has a pending rter violation.
 */
function hasPendingUI(transaction, transactionViolations) {
    return isScanning(transaction) || isPending(transaction) || (!!transaction && hasPendingRTERViolation(transactionViolations));
}
/**
 * Check if the transaction has a defined route
 */
function hasRoute(transaction, isDistanceRequestType) {
    return !!transaction?.routes?.route0?.geometry?.coordinates || (!!isDistanceRequestType && !!transaction?.comment?.customUnit?.quantity);
}
function waypointHasValidAddress(waypoint) {
    return !!waypoint?.address?.trim();
}
/**
 * Converts the key of a waypoint to its index
 */
function getWaypointIndex(key) {
    return Number(key.replace('waypoint', ''));
}
/**
 * Filters the waypoints which are valid and returns those
 */
function getValidWaypoints(waypoints, reArrangeIndexes = false) {
    if (!waypoints) {
        return {};
    }
    const sortedIndexes = Object.keys(waypoints)
        .map(getWaypointIndex)
        .sort((a, b) => a - b);
    const waypointValues = sortedIndexes.map((index) => waypoints[`waypoint${index}`]);
    // Ensure the number of waypoints is between 2 and 25
    if (waypointValues.length < 2 || waypointValues.length > 25) {
        return {};
    }
    let lastWaypointIndex = -1;
    let waypointIndex = -1;
    return waypointValues.reduce((acc, currentWaypoint, index) => {
        // Array.at(-1) returns the last element of the array
        // If a user does a round trip, the last waypoint will be the same as the first waypoint
        // We want to avoid comparing them as this will result in an incorrect duplicate waypoint error.
        const previousWaypoint = lastWaypointIndex !== -1 ? waypointValues.at(lastWaypointIndex) : undefined;
        // Check if the waypoint has a valid address
        if (!waypointHasValidAddress(currentWaypoint)) {
            return acc;
        }
        // Check for adjacent waypoints with the same address
        if (previousWaypoint && currentWaypoint?.address === previousWaypoint.address) {
            return acc;
        }
        acc[`waypoint${reArrangeIndexes ? waypointIndex + 1 : index}`] = currentWaypoint;
        lastWaypointIndex = index;
        waypointIndex += 1;
        return acc;
    }, {});
}
/**
 * Returns the most recent transactions in an object
 */
function getRecentTransactions(transactions, size = 2) {
    return Object.keys(transactions)
        .sort((transactionID1, transactionID2) => (new Date(transactions[transactionID1]) < new Date(transactions[transactionID2]) ? 1 : -1))
        .slice(0, size);
}
/**
 * Check if transaction has duplicatedTransaction violation.
 * @param transactionID - the transaction to check
 * @param checkDismissed - whether to check if the violation has already been dismissed as well
 */
function isDuplicate(transaction, checkDismissed = false) {
    if (!transaction) {
        return false;
    }
    const duplicateViolation = allTransactionViolations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction.transactionID}`]?.find((violation) => violation.name === CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION);
    const hasDuplicatedViolation = !!duplicateViolation;
    if (!checkDismissed) {
        return hasDuplicatedViolation;
    }
    const didDismissedViolation = isViolationDismissed(transaction, duplicateViolation);
    return hasDuplicatedViolation && !didDismissedViolation;
}
/**
 * Check if transaction is on hold
 */
function isOnHold(transaction) {
    if (!transaction) {
        return false;
    }
    return !!transaction.comment?.hold;
}
/**
 * Check if transaction is on hold for the given transactionID
 */
function isOnHoldByTransactionID(transactionID) {
    if (!transactionID) {
        return false;
    }
    return isOnHold(allTransactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${transactionID}`]);
}
/**
 * Checks if a violation is dismissed for the given transaction
 */
function isViolationDismissed(transaction, violation) {
    if (!transaction || !violation) {
        return false;
    }
    return !!transaction?.comment?.dismissedViolations?.[violation.name]?.[currentUserEmail];
}
/**
 * Checks if violations are supported for the given transaction
 */
function doesTransactionSupportViolations(transaction) {
    if (!transaction) {
        return false;
    }
    return true;
}
/**
 * Checks if any violations for the provided transaction are of type 'violation'
 */
function hasViolation(transaction, transactionViolations, showInReview) {
    if (!doesTransactionSupportViolations(transaction)) {
        return false;
    }
    const violations = Array.isArray(transactionViolations) ? transactionViolations : transactionViolations?.[ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS + transaction.transactionID];
    return !!violations?.some((violation) => violation.type === CONST_1.default.VIOLATION_TYPES.VIOLATION &&
        (showInReview === undefined || showInReview === (violation.showInReview ?? false)) &&
        !isViolationDismissed(transaction, violation));
}
function hasDuplicateTransactions(iouReportID, allReportTransactions) {
    const transactionsByIouReportID = (0, ReportUtils_1.getReportTransactions)(iouReportID);
    const reportTransactions = allReportTransactions ?? transactionsByIouReportID;
    return reportTransactions.length > 0 && reportTransactions.some((transaction) => isDuplicate(transaction, true));
}
/**
 * Checks if any violations for the provided transaction are of type 'notice'
 */
function hasNoticeTypeViolation(transaction, transactionViolations, showInReview) {
    if (!doesTransactionSupportViolations(transaction)) {
        return false;
    }
    const violations = Array.isArray(transactionViolations) ? transactionViolations : transactionViolations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction?.transactionID}`];
    return !!violations?.some((violation) => violation.type === CONST_1.default.VIOLATION_TYPES.NOTICE &&
        (showInReview === undefined || showInReview === (violation.showInReview ?? false)) &&
        !isViolationDismissed(transaction, violation));
}
/**
 * Checks if any violations for the provided transaction are of type 'warning'
 */
function hasWarningTypeViolation(transaction, transactionViolations, showInReview) {
    if (!doesTransactionSupportViolations(transaction)) {
        return false;
    }
    const violations = Array.isArray(transactionViolations) ? transactionViolations : transactionViolations?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transaction?.transactionID}`];
    const warningTypeViolations = violations?.filter((violation) => violation.type === CONST_1.default.VIOLATION_TYPES.WARNING &&
        (showInReview === undefined || showInReview === (violation.showInReview ?? false)) &&
        !isViolationDismissed(transaction, violation)) ?? [];
    return warningTypeViolations.length > 0;
}
/**
 * Calculates tax amount from the given expense amount and tax percentage
 */
function calculateTaxAmount(percentage, amount, currency) {
    if (!percentage) {
        return 0;
    }
    const divisor = Number(percentage.slice(0, -1)) / 100 + 1;
    const taxAmount = (amount - amount / divisor) / 100;
    const decimals = (0, CurrencyUtils_1.getCurrencyDecimals)(currency);
    return parseFloat(taxAmount.toFixed(decimals));
}
/**
 * Calculates count of all tax enabled options
 */
function getEnabledTaxRateCount(options) {
    return Object.values(options).filter((option) => !option.isDisabled).length;
}
/**
 * Check if the customUnitRateID has a value default for P2P distance requests
 */
function isCustomUnitRateIDForP2P(transaction) {
    return transaction?.comment?.customUnit?.customUnitRateID === CONST_1.default.CUSTOM_UNITS.FAKE_P2P_ID;
}
function hasReservationList(transaction) {
    return !!transaction?.receipt?.reservationList && transaction?.receipt?.reservationList.length > 0;
}
/**
 * Whether an expense is going to be paid later, either at checkout for hotels or drop off for car rental
 */
function isPayAtEndExpense(transaction) {
    return !!transaction?.receipt?.reservationList?.some((reservation) => reservation.paymentType === 'PAY_AT_HOTEL' || reservation.paymentType === 'PAY_AT_VENDOR');
}
/**
 * Get custom unit rate (distance rate) ID from the transaction object
 */
function getRateID(transaction) {
    return transaction?.comment?.customUnit?.customUnitRateID ?? CONST_1.default.CUSTOM_UNITS.FAKE_P2P_ID;
}
/**
 * Gets the tax code based on the type of transaction and selected currency.
 * If it is distance request, then returns the tax code corresponding to the custom unit rate
 * Else returns policy default tax rate if transaction is in policy default currency, otherwise foreign default tax rate
 */
function getDefaultTaxCode(policy, transaction, currency) {
    if (isDistanceRequest(transaction)) {
        const customUnitRateID = getRateID(transaction) ?? '';
        const customUnitRate = (0, PolicyUtils_1.getDistanceRateCustomUnitRate)(policy, customUnitRateID);
        return customUnitRate?.attributes?.taxRateExternalID;
    }
    const defaultExternalID = policy?.taxRates?.defaultExternalID;
    const foreignTaxDefault = policy?.taxRates?.foreignTaxDefault;
    return policy?.outputCurrency === (currency ?? getCurrency(transaction)) ? defaultExternalID : foreignTaxDefault;
}
/**
 * Transforms tax rates to a new object format - to add codes and new name with concatenated name and value.
 *
 * @param  policy - The policy which the user has access to and which the report is tied to.
 * @returns The transformed tax rates object.g
 */
function transformedTaxRates(policy, transaction) {
    const taxRates = policy?.taxRates;
    const defaultExternalID = taxRates?.defaultExternalID;
    const defaultTaxCode = () => {
        if (!transaction) {
            return defaultExternalID;
        }
        return policy && getDefaultTaxCode(policy, transaction);
    };
    const getModifiedName = (data, code) => `${data.name} (${data.value})${defaultTaxCode() === code ? ` ${CONST_1.default.DOT_SEPARATOR} ${(0, Localize_1.translateLocal)('common.default')}` : ''}`;
    const taxes = Object.fromEntries(Object.entries(taxRates?.taxes ?? {}).map(([code, data]) => [code, { ...data, code, modifiedName: getModifiedName(data, code), name: data.name }]));
    return taxes;
}
/**
 * Gets the tax value of a selected tax
 */
function getTaxValue(policy, transaction, taxCode) {
    return Object.values(transformedTaxRates(policy, transaction)).find((taxRate) => taxRate.code === taxCode)?.value;
}
/**
 * Gets the tax name for Workspace Taxes Settings
 */
function getWorkspaceTaxesSettingsName(policy, taxCode) {
    return Object.values(transformedTaxRates(policy)).find((taxRate) => taxRate.code === taxCode)?.modifiedName;
}
/**
 * Gets the name corresponding to the taxCode that is displayed to the user
 */
function getTaxName(policy, transaction) {
    const defaultTaxCode = getDefaultTaxCode(policy, transaction);
    return Object.values(transformedTaxRates(policy, transaction)).find((taxRate) => taxRate.code === (transaction?.taxCode ?? defaultTaxCode))?.modifiedName;
}
/**
 * Extracts a set of valid duplicate transaction IDs associated with a given transaction,
 * excluding:
 * - the transaction itself
 * - duplicate IDs that appear more than once
 * - duplicates referencing missing or invalid transactions
 * - settled or approved transactions
 *
 * @param transactionID - The ID of the transaction being validated.
 * @param transactionCollection - A collection of all transactions and their duplicates.
 * @param currentTransactionViolations - The list of violations associated with this transaction.
 * @returns A set of valid duplicate transaction IDs.
 */
function getValidDuplicateTransactionIDs(transactionID, transactionCollection, currentTransactionViolations) {
    const result = new Set();
    const seen = new Set();
    let foundDuplicateViolation = false;
    if (!transactionCollection) {
        return result;
    }
    for (const violation of currentTransactionViolations) {
        if (violation.name !== CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION) {
            continue;
        }
        // Skip further violations
        if (foundDuplicateViolation) {
            Log_1.default.warn(`Multiple duplicate violations found for transaction. Only one expected.`, { transactionID });
            break;
        }
        foundDuplicateViolation = true;
        const duplicatesIDs = violation.data?.duplicates ?? [];
        const validTransactions = [];
        for (const duplicateID of duplicatesIDs) {
            // Skip self-reference
            if (duplicateID === transactionID || seen.has(duplicateID)) {
                continue;
            }
            seen.add(duplicateID);
            const transaction = transactionCollection?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${duplicateID}`];
            if (!transaction?.transactionID) {
                Log_1.default.warn(`Transaction does not exist or is invalid. Found in transaction.`, { duplicateID, transactionID });
                continue;
            }
            validTransactions.push(transaction);
        }
        // Filter out transactions assumed that they have be reviewed by removing settled and approved transactions
        const filtered = removeSettledAndApprovedTransactions(validTransactions);
        for (const transaction of filtered) {
            result.add(transaction.transactionID);
        }
    }
    return result;
}
/**
 * Adds onyx updates to the passed onyxData to update the DUPLICATED_TRANSACTION violation data
 * by removing the passed transactionID from any violation that referenced it.
 * @param onyxData - An object to store optimistic and failure updates.
 * @param transactionID - The ID of the transaction being deleted or updated.
 * @param transactions - A collection of all transactions and their duplicates.
 * @param transactionViolations - The collection of the transaction violations including the duplicates violations.
 *
 */
function removeTransactionFromDuplicateTransactionViolation(onyxData, transactionID, transactions, transactionViolations) {
    if (!transactionID || !transactions || !transactionViolations) {
        return;
    }
    const violations = transactionViolations[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`];
    if (!violations) {
        return;
    }
    const duplicateIDs = getValidDuplicateTransactionIDs(transactionID, transactions, violations);
    for (const duplicateID of duplicateIDs) {
        const duplicateViolations = transactionViolations[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${duplicateID}`];
        if (!duplicateViolations) {
            continue;
        }
        const duplicateTransactionViolations = duplicateViolations.filter((violation) => violation.name === CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION);
        if (duplicateTransactionViolations.length === 0) {
            continue;
        }
        if (duplicateTransactionViolations.length > 1) {
            Log_1.default.warn(`There are  duplicate transaction violations for transactionID. This should not happen.`, { duplicateTransactionViolations, duplicateID });
            continue;
        }
        const duplicateTransactionViolation = duplicateTransactionViolations.at(0);
        if (!duplicateTransactionViolation?.data?.duplicates) {
            continue;
        }
        // If the transactionID is not in the duplicates list, we don't need to update the violation
        const duplicateTransactionIDs = duplicateTransactionViolation.data.duplicates.filter((duplicateTransactionID) => duplicateTransactionID !== transactionID);
        if (duplicateTransactionIDs.length === duplicateTransactionViolation.data.duplicates.length) {
            continue;
        }
        const optimisticViolations = duplicateTransactionViolations.filter((violation) => violation.name !== CONST_1.default.VIOLATIONS.DUPLICATED_TRANSACTION);
        if (duplicateTransactionIDs.length > 0) {
            optimisticViolations.push({
                ...duplicateTransactionViolation,
                data: {
                    ...duplicateTransactionViolation.data,
                    duplicates: duplicateTransactionIDs,
                },
            });
        }
        onyxData.optimisticData?.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${duplicateID}`,
            value: optimisticViolations.length > 0 ? optimisticViolations : null,
        });
        onyxData.failureData?.push({
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${duplicateID}`,
            value: duplicateViolations,
        });
    }
}
function removeSettledAndApprovedTransactions(transactions) {
    return transactions.filter((transaction) => !!transaction && !(0, ReportUtils_1.isSettled)(transaction?.reportID) && !(0, ReportUtils_1.isReportIDApproved)(transaction?.reportID));
}
/**
 * This function compares fields of duplicate transactions and determines which fields should be kept and which should be changed.
 *
 * @returns An object with two properties: 'keep' and 'change'.
 * 'keep' is an object where each key is a field name and the value is the value of that field in the transaction that should be kept.
 * 'change' is an object where each key is a field name and the value is an array of different values of that field in the duplicate transactions.
 *
 * The function works as follows:
 * 1. It fetches the transaction violations for the given transaction ID.
 * 2. It finds the duplicate transactions.
 * 3. It creates two empty objects, 'keep' and 'change'.
 * 4. It defines the fields to compare in the transactions.
 * 5. It iterates over the fields to compare. For each field:
 *    - If the field is 'description', it checks if all comments are equal, exist, or are empty. If so, it keeps the first transaction's comment. Otherwise, it finds the different values and adds them to 'change'.
 *    - For other fields, it checks if all fields are equal. If so, it keeps the first transaction's field value. Otherwise, it finds the different values and adds them to 'change'.
 * 6. It returns the 'keep' and 'change' objects.
 */
function compareDuplicateTransactionFields(reviewingTransaction, duplicates, reportID, selectedTransactionID) {
    const reviewingTransactionID = reviewingTransaction?.transactionID;
    if (!reviewingTransactionID || !reportID) {
        return { change: {}, keep: {} };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const keep = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const change = {};
    if (!reviewingTransactionID || !reportID) {
        return { keep, change };
    }
    const transactions = removeSettledAndApprovedTransactions([reviewingTransaction, ...(duplicates ?? [])]);
    const fieldsToCompare = {
        merchant: ['modifiedMerchant', 'merchant'],
        category: ['category'],
        tag: ['tag'],
        description: ['comment'],
        taxCode: ['taxCode'],
        billable: ['billable'],
        reimbursable: ['reimbursable'],
    };
    // Helper function thats create an array of different values for a given key in the transactions
    function getDifferentValues(items, keys) {
        return [
            ...new Set(items
                .map((item) => {
                // Prioritize modifiedMerchant over merchant
                if (keys.includes('modifiedMerchant') && keys.includes('merchant')) {
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    return getMerchant(item);
                }
                return keys.map((key) => item?.[key]);
            })
                .flat()),
        ];
    }
    // Helper function to check if all comments are equal
    function areAllCommentsEqual(items, firstTransaction) {
        return items.every((item) => (0, fast_equals_1.deepEqual)(getDescription(item), getDescription(firstTransaction)));
    }
    // Helper function to check if all fields are equal for a given key
    function areAllFieldsEqual(items, keyExtractor) {
        const firstTransaction = transactions.at(0);
        return items.every((item) => keyExtractor(item) === keyExtractor(firstTransaction));
    }
    // Helper function to process changes
    function processChanges(fieldName, items, keys) {
        const differentValues = getDifferentValues(items, keys);
        if (differentValues.length > 0) {
            change[fieldName] = differentValues;
        }
    }
    // The comment object needs to be stored only when selecting a specific transaction to keep.
    // It contains details such as 'customUnit' and 'waypoints,' which remain unchanged during the review steps
    // but are essential for displaying complete information on the confirmation page.
    if (selectedTransactionID) {
        const selectedTransaction = transactions.find((t) => t?.transactionID === selectedTransactionID);
        keep.comment = selectedTransaction?.comment ?? {};
    }
    for (const fieldName in fieldsToCompare) {
        if (Object.prototype.hasOwnProperty.call(fieldsToCompare, fieldName)) {
            const keys = fieldsToCompare[fieldName];
            const firstTransaction = transactions.at(0);
            const isFirstTransactionCommentEmptyObject = typeof firstTransaction?.comment === 'object' && firstTransaction?.comment?.comment === '';
            const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`];
            // This will be fixed as part of https://github.com/Expensify/Expensify/issues/507850
            // eslint-disable-next-line deprecation/deprecation
            const policy = (0, PolicyUtils_1.getPolicy)(report?.policyID);
            const areAllFieldsEqualForKey = areAllFieldsEqual(transactions, (item) => keys.map((key) => item?.[key]).join('|'));
            if (fieldName === 'description') {
                const allCommentsAreEqual = areAllCommentsEqual(transactions, firstTransaction);
                const allCommentsAreEmpty = isFirstTransactionCommentEmptyObject && transactions.every((item) => getDescription(item) === '');
                if (allCommentsAreEqual || allCommentsAreEmpty) {
                    keep[fieldName] = firstTransaction?.comment?.comment ?? firstTransaction?.comment;
                }
                else {
                    processChanges(fieldName, transactions, keys);
                }
            }
            else if (fieldName === 'merchant') {
                if (areAllFieldsEqual(transactions, getMerchant)) {
                    keep[fieldName] = getMerchant(firstTransaction);
                }
                else {
                    processChanges(fieldName, transactions, keys);
                }
            }
            else if (fieldName === 'taxCode') {
                const differentValues = getDifferentValues(transactions, keys);
                const validTaxes = differentValues?.filter((taxID) => {
                    const tax = (0, PolicyUtils_1.getTaxByID)(policy, taxID ?? '');
                    return tax?.name && !tax.isDisabled && tax.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
                });
                if (!areAllFieldsEqualForKey && validTaxes.length > 1) {
                    change[fieldName] = validTaxes;
                }
                else if (areAllFieldsEqualForKey) {
                    keep[fieldName] = firstTransaction?.[keys[0]] ?? firstTransaction?.[keys[1]];
                }
            }
            else if (fieldName === 'category') {
                const differentValues = getDifferentValues(transactions, keys);
                const policyCategories = report?.policyID ? (0, Category_1.getPolicyCategoriesData)(report.policyID) : {};
                const availableCategories = Object.values(policyCategories)
                    .filter((category) => differentValues.includes(category.name) && category.enabled && category.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE)
                    .map((e) => e.name);
                if (!areAllFieldsEqualForKey && policy?.areCategoriesEnabled && (availableCategories.length > 1 || (availableCategories.length === 1 && differentValues.includes('')))) {
                    change[fieldName] = [...availableCategories, ...(differentValues.includes('') ? [''] : [])];
                }
                else if (areAllFieldsEqualForKey) {
                    keep[fieldName] = firstTransaction?.[keys[0]] ?? firstTransaction?.[keys[1]];
                }
            }
            else if (fieldName === 'tag') {
                const policyTags = report?.policyID ? (0, Tag_1.getPolicyTagsData)(report?.policyID) : {};
                const isMultiLevelTags = (0, PolicyUtils_1.isMultiLevelTags)(policyTags);
                if (isMultiLevelTags) {
                    if (areAllFieldsEqualForKey || !policy?.areTagsEnabled) {
                        keep[fieldName] = firstTransaction?.[keys[0]] ?? firstTransaction?.[keys[1]];
                    }
                    else {
                        processChanges(fieldName, transactions, keys);
                    }
                }
                else {
                    const differentValues = getDifferentValues(transactions, keys);
                    const policyTagsObj = Object.values(Object.values(policyTags).at(0)?.tags ?? {});
                    const availableTags = policyTagsObj
                        .filter((tag) => differentValues.includes(tag.name) && tag.enabled && tag.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE)
                        .map((e) => e.name);
                    if (!areAllFieldsEqualForKey && policy?.areTagsEnabled && (availableTags.length > 1 || (availableTags.length === 1 && differentValues.includes('')))) {
                        change[fieldName] = [...availableTags, ...(differentValues.includes('') ? [''] : [])];
                    }
                    else if (areAllFieldsEqualForKey) {
                        keep[fieldName] = firstTransaction?.[keys[0]] ?? firstTransaction?.[keys[1]];
                    }
                }
            }
            else if (areAllFieldsEqualForKey) {
                keep[fieldName] = firstTransaction?.[keys[0]] ?? firstTransaction?.[keys[1]];
            }
            else {
                processChanges(fieldName, transactions, keys);
            }
        }
    }
    return { keep, change };
}
function getTransactionID(threadReportID) {
    if (!threadReportID) {
        return;
    }
    const report = allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${threadReportID}`];
    const parentReportAction = (0, ReportUtils_1.isThread)(report) ? (0, ReportActionsUtils_1.getReportAction)(report.parentReportID, report.parentReportActionID) : undefined;
    const IOUTransactionID = (0, ReportActionsUtils_1.isMoneyRequestAction)(parentReportAction) ? (0, ReportActionsUtils_1.getOriginalMessage)(parentReportAction)?.IOUTransactionID : undefined;
    return IOUTransactionID;
}
function buildNewTransactionAfterReviewingDuplicates(reviewDuplicateTransaction) {
    const originalTransaction = allTransactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${reviewDuplicateTransaction?.transactionID}`] ?? undefined;
    const { duplicates, ...restReviewDuplicateTransaction } = reviewDuplicateTransaction ?? {};
    return {
        ...originalTransaction,
        ...restReviewDuplicateTransaction,
        modifiedMerchant: reviewDuplicateTransaction?.merchant,
        merchant: reviewDuplicateTransaction?.merchant,
        comment: { ...reviewDuplicateTransaction?.comment, comment: reviewDuplicateTransaction?.description },
    };
}
function buildMergeDuplicatesParams(reviewDuplicates, duplicatedTransactions, originalTransaction) {
    return {
        amount: -getAmount(originalTransaction, true),
        reportID: originalTransaction?.reportID,
        receiptID: originalTransaction?.receipt?.receiptID ?? CONST_1.default.DEFAULT_NUMBER_ID,
        currency: getCurrency(originalTransaction),
        created: getFormattedCreated(originalTransaction),
        transactionID: reviewDuplicates?.transactionID,
        transactionIDList: removeSettledAndApprovedTransactions(duplicatedTransactions ?? []).map((transaction) => transaction.transactionID),
        billable: reviewDuplicates?.billable ?? false,
        reimbursable: reviewDuplicates?.reimbursable ?? false,
        category: reviewDuplicates?.category ?? '',
        tag: reviewDuplicates?.tag ?? '',
        merchant: reviewDuplicates?.merchant ?? '',
        comment: reviewDuplicates?.description ?? '',
    };
}
function getCategoryTaxCodeAndAmount(category, transaction, policy) {
    const taxRules = policy?.rules?.expenseRules?.filter((rule) => rule.tax);
    if (!taxRules || taxRules?.length === 0 || isDistanceRequest(transaction)) {
        return { categoryTaxCode: undefined, categoryTaxAmount: undefined };
    }
    const defaultTaxCode = getDefaultTaxCode(policy, transaction, getCurrency(transaction));
    const categoryTaxCode = (0, CategoryUtils_1.getCategoryDefaultTaxRate)(taxRules, category, defaultTaxCode);
    const categoryTaxPercentage = getTaxValue(policy, transaction, categoryTaxCode ?? '');
    let categoryTaxAmount;
    if (categoryTaxPercentage) {
        categoryTaxAmount = (0, CurrencyUtils_1.convertToBackendAmount)(calculateTaxAmount(categoryTaxPercentage, getAmount(transaction), getCurrency(transaction)));
    }
    return { categoryTaxCode, categoryTaxAmount };
}
/**
 * Return the sorted list transactions of an iou report
 */
function getAllSortedTransactions(iouReportID) {
    return (0, ReportUtils_1.getReportTransactions)(iouReportID).sort((transA, transB) => {
        if (transA.created < transB.created) {
            return -1;
        }
        if (transA.created > transB.created) {
            return 1;
        }
        return (transA.inserted ?? '') < (transB.inserted ?? '') ? -1 : 1;
    });
}
function shouldShowRTERViolationMessage(transactions) {
    return transactions?.length === 1 && hasPendingUI(transactions?.at(0), getTransactionViolations(transactions?.at(0), allTransactionViolations));
}
function isExpenseSplit(transaction, originalTransaction) {
    const { originalTransactionID, source, splits } = transaction?.comment ?? {};
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    if ((splits && splits.length > 0) || !originalTransactionID || source !== CONST_1.default.IOU.TYPE.SPLIT) {
        return false;
    }
    return !originalTransaction?.comment?.splits;
}
const getOriginalTransactionWithSplitInfo = (transaction) => {
    const { originalTransactionID, source, splits } = transaction?.comment ?? {};
    const originalTransaction = allTransactions?.[`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${originalTransactionID}`];
    if (splits && splits.length > 0) {
        return { isBillSplit: true, isExpenseSplit: false, originalTransaction: originalTransaction ?? transaction };
    }
    if (!originalTransactionID || source !== CONST_1.default.IOU.TYPE.SPLIT) {
        return { isBillSplit: false, isExpenseSplit: false, originalTransaction: transaction };
    }
    // To determine if it’s a split bill or a split expense, we check for the presence of `comment.splits` on the original transaction.
    // Since both splits use `comment.originalTransaction`, but split expenses won’t have `comment.splits`.
    return { isBillSplit: !!originalTransaction?.comment?.splits, isExpenseSplit: isExpenseSplit(transaction, originalTransaction), originalTransaction: originalTransaction ?? transaction };
};
exports.getOriginalTransactionWithSplitInfo = getOriginalTransactionWithSplitInfo;
/**
 * Return transactions pending action.
 */
function getTransactionPendingAction(transaction) {
    if (transaction?.pendingAction) {
        return transaction.pendingAction;
    }
    const hasPendingFields = Object.keys(transaction?.pendingFields ?? {}).length > 0;
    return hasPendingFields ? CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.UPDATE : null;
}
function isTransactionPendingDelete(transaction) {
    return getTransactionPendingAction(transaction) === CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
}
/**
 * Creates sections data for unreported expenses, marking transactions with DELETE pending action as disabled
 */
function createUnreportedExpenseSections(transactions) {
    return [
        {
            shouldShow: true,
            data: transactions
                .filter((t) => t !== undefined)
                .map((transaction) => ({
                ...transaction,
                isDisabled: isTransactionPendingDelete(transaction),
                keyForList: transaction.transactionID,
                errors: transaction.errors,
            })),
        },
    ];
}
