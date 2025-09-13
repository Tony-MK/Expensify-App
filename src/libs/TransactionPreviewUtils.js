"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewNavigationRoute = void 0;
exports.getIOUPayerAndReceiver = getIOUPayerAndReceiver;
exports.getTransactionPreviewTextAndTranslationPaths = getTransactionPreviewTextAndTranslationPaths;
exports.createTransactionPreviewConditionals = createTransactionPreviewConditionals;
exports.getViolationTranslatePath = getViolationTranslatePath;
exports.getUniqueActionErrorsForTransaction = getUniqueActionErrorsForTransaction;
const truncate_1 = require("lodash/truncate");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const Report_1 = require("./actions/Report");
const Transaction_1 = require("./actions/Transaction");
const CategoryUtils_1 = require("./CategoryUtils");
const CurrencyUtils_1 = require("./CurrencyUtils");
const DateUtils_1 = require("./DateUtils");
const ReportActionsUtils_1 = require("./ReportActionsUtils");
const ReportUtils_1 = require("./ReportUtils");
const StringUtils_1 = require("./StringUtils");
const TransactionUtils_1 = require("./TransactionUtils");
const emptyPersonalDetails = {
    accountID: CONST_1.default.REPORT.OWNER_ACCOUNT_ID_FAKE,
    avatar: '',
    displayName: undefined,
    login: undefined,
};
/**
 * Returns the data for displaying payer and receiver (`from` and `to`) values for given ids and amount.
 * In IOU transactions we can deduce who is the payer and receiver based on sign (positive/negative) of the amount.
 */
function getIOUPayerAndReceiver(managerID, ownerAccountID, personalDetails, amount) {
    let fromID = ownerAccountID;
    let toID = managerID;
    if (amount < 0) {
        fromID = managerID;
        toID = ownerAccountID;
    }
    return {
        from: personalDetails ? personalDetails[fromID] : emptyPersonalDetails,
        to: personalDetails ? personalDetails[toID] : emptyPersonalDetails,
    };
}
const getReviewNavigationRoute = (route, transaction, duplicates) => {
    const backTo = route.params.backTo;
    // Clear the draft before selecting a different expense to prevent merging fields from the previous expense
    // (e.g., category, tag, tax) that may be not enabled/available in the new expense's policy.
    (0, Transaction_1.abandonReviewDuplicateTransactions)();
    const comparisonResult = (0, TransactionUtils_1.compareDuplicateTransactionFields)(transaction, duplicates, transaction?.reportID, transaction?.transactionID);
    (0, Transaction_1.setReviewDuplicatesKey)({
        ...comparisonResult.keep,
        duplicates: duplicates.map((duplicate) => duplicate?.transactionID).filter(Boolean),
        transactionID: transaction?.transactionID,
        reportID: transaction?.reportID,
    });
    if (comparisonResult.change.merchant) {
        return ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_MERCHANT_PAGE.getRoute(route.params?.threadReportID, backTo);
    }
    if (comparisonResult.change.category) {
        return ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_CATEGORY_PAGE.getRoute(route.params?.threadReportID, backTo);
    }
    if (comparisonResult.change.tag) {
        return ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_TAG_PAGE.getRoute(route.params?.threadReportID, backTo);
    }
    if (comparisonResult.change.description) {
        return ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_DESCRIPTION_PAGE.getRoute(route.params?.threadReportID, backTo);
    }
    if (comparisonResult.change.taxCode) {
        return ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_TAX_CODE_PAGE.getRoute(route.params?.threadReportID, backTo);
    }
    if (comparisonResult.change.billable) {
        return ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_BILLABLE_PAGE.getRoute(route.params?.threadReportID, backTo);
    }
    if (comparisonResult.change.reimbursable) {
        return ROUTES_1.default.TRANSACTION_DUPLICATE_REVIEW_REIMBURSABLE_PAGE.getRoute(route.params?.threadReportID, backTo);
    }
    return ROUTES_1.default.TRANSACTION_DUPLICATE_CONFIRMATION_PAGE.getRoute(route.params?.threadReportID, backTo);
};
exports.getReviewNavigationRoute = getReviewNavigationRoute;
const dotSeparator = { text: ` ${CONST_1.default.DOT_SEPARATOR} ` };
function getMultiLevelTagViolationsCount(violations) {
    return violations?.reduce((acc, violation) => {
        if (violation.type === CONST_1.default.VIOLATION_TYPES.VIOLATION && violation.name === CONST_1.default.VIOLATIONS.SOME_TAG_LEVELS_REQUIRED) {
            const violationCount = violation?.data?.errorIndexes?.length ?? 0;
            return acc + violationCount;
        }
        return acc;
    }, 0);
}
function getViolationTranslatePath(violations, hasFieldErrors, violationMessage, isTransactionOnHold) {
    const violationsCount = violations?.filter((v) => v.type === CONST_1.default.VIOLATION_TYPES.VIOLATION).length ?? 0;
    const tagViolationsCount = getMultiLevelTagViolationsCount(violations) ?? 0;
    const hasViolationsAndHold = violationsCount > 0 && isTransactionOnHold;
    const isTooLong = violationsCount > 1 || tagViolationsCount > 1 || violationMessage.length > CONST_1.default.REPORT_VIOLATIONS.RBR_MESSAGE_MAX_CHARACTERS_FOR_PREVIEW;
    const hasViolationsAndFieldErrors = violationsCount > 0 && hasFieldErrors;
    return isTooLong || hasViolationsAndHold || hasViolationsAndFieldErrors ? { translationPath: 'violations.reviewRequired' } : { text: violationMessage };
}
/**
 * Extracts unique error messages from report actions. If no report or actions are found,
 * it returns an empty array. It identifies the latest error in each action and filters out duplicates to
 * ensure only unique error messages are returned.
 */
function getUniqueActionErrorsForTransaction(reportActions, transaction) {
    const reportErrors = Object.values(reportActions).map((reportAction) => {
        const errors = reportAction.errors ?? {};
        const key = Object.keys(errors).sort().reverse().at(0) ?? '';
        const error = errors[key];
        if ((0, ReportActionsUtils_1.isMoneyRequestAction)(reportAction) && (0, ReportActionsUtils_1.getOriginalMessage)(reportAction)?.IOUTransactionID) {
            if ((0, ReportActionsUtils_1.getOriginalMessage)(reportAction)?.IOUTransactionID === transaction?.transactionID) {
                return typeof error === 'string' ? error : '';
            }
            return '';
        }
        return typeof error === 'string' ? error : '';
    });
    return [...new Set(reportErrors)].filter((err) => err.length);
}
function getTransactionPreviewTextAndTranslationPaths({ iouReport, transaction, action, violations, transactionDetails, isBillSplit, shouldShowRBR, violationMessage, reportActions, }) {
    const isFetchingWaypoints = (0, TransactionUtils_1.isFetchingWaypointsFromServer)(transaction);
    const isTransactionOnHold = (0, TransactionUtils_1.isOnHold)(transaction);
    const isTransactionMadeWithCard = (0, TransactionUtils_1.isCardTransaction)(transaction);
    const isMoneyRequestSettled = (0, ReportUtils_1.isSettled)(iouReport?.reportID);
    const isSettlementOrApprovalPartial = !!iouReport?.pendingFields?.partial;
    const isPartialHold = isSettlementOrApprovalPartial && isTransactionOnHold;
    // We don't use isOnHold because it's true for duplicated transaction too and we only want to show hold message if the transaction is truly on hold
    const shouldShowHoldMessage = !(isMoneyRequestSettled && !isSettlementOrApprovalPartial) && !!transaction?.comment?.hold;
    const showCashOrCard = { translationPath: isTransactionMadeWithCard ? 'iou.card' : 'iou.cash' };
    const isTransactionScanning = (0, TransactionUtils_1.isScanning)(transaction);
    const hasFieldErrors = (0, TransactionUtils_1.hasMissingSmartscanFields)(transaction);
    const hasViolationsOfTypeNotice = (0, TransactionUtils_1.hasNoticeTypeViolation)(transaction, violations, true) && (0, ReportUtils_1.isPaidGroupPolicy)(iouReport);
    const hasActionWithErrors = (0, ReportUtils_1.hasActionWithErrorsForTransaction)(iouReport?.reportID, transaction);
    const { amount: requestAmount, currency: requestCurrency } = transactionDetails;
    let RBRMessage;
    if (!shouldShowRBR || !transaction) {
        RBRMessage = { text: '' };
    }
    if (shouldShowHoldMessage && RBRMessage === undefined) {
        RBRMessage = { translationPath: 'iou.expenseWasPutOnHold' };
    }
    const path = getViolationTranslatePath(violations, hasFieldErrors, violationMessage ?? '', isTransactionOnHold);
    if (path.translationPath === 'violations.reviewRequired' || (RBRMessage === undefined && violationMessage)) {
        RBRMessage = path;
    }
    if ((0, ReportUtils_1.hasReceiptError)(transaction) && RBRMessage === undefined) {
        RBRMessage = { translationPath: 'iou.error.receiptFailureMessageShort' };
    }
    if (hasFieldErrors && RBRMessage === undefined) {
        const merchantMissing = (0, TransactionUtils_1.isMerchantMissing)(transaction);
        const amountMissing = (0, TransactionUtils_1.isAmountMissing)(transaction);
        if (amountMissing && merchantMissing) {
            RBRMessage = { translationPath: 'violations.reviewRequired' };
        }
        else if (amountMissing) {
            RBRMessage = { translationPath: 'iou.missingAmount' };
        }
        else if (merchantMissing) {
            RBRMessage = { translationPath: 'iou.missingMerchant' };
        }
    }
    if (RBRMessage === undefined && hasActionWithErrors && !!reportActions) {
        const actionsWithErrors = getUniqueActionErrorsForTransaction(reportActions, transaction);
        RBRMessage = actionsWithErrors.length > 1 ? { translationPath: 'violations.reviewRequired' } : { text: actionsWithErrors.at(0) };
    }
    let previewHeaderText = [showCashOrCard];
    if ((0, TransactionUtils_1.isDistanceRequest)(transaction)) {
        previewHeaderText = [{ translationPath: 'common.distance' }];
        if (RBRMessage === undefined && (0, TransactionUtils_1.isUnreportedAndHasInvalidDistanceRateTransaction)(transaction)) {
            RBRMessage = { translationPath: 'violations.customUnitOutOfPolicy' };
        }
    }
    else if ((0, TransactionUtils_1.isPerDiemRequest)(transaction)) {
        previewHeaderText = [{ translationPath: 'common.perDiem' }];
    }
    else if (isTransactionScanning) {
        previewHeaderText = [{ translationPath: 'common.receipt' }];
    }
    else if (isBillSplit) {
        previewHeaderText = [{ translationPath: 'iou.split' }];
    }
    RBRMessage ?? (RBRMessage = { text: '' });
    if (!(0, TransactionUtils_1.isCreatedMissing)(transaction)) {
        const created = (0, TransactionUtils_1.getFormattedCreated)(transaction);
        const date = DateUtils_1.default.formatWithUTCTimeZone(created, DateUtils_1.default.doesDateBelongToAPastYear(created) ? CONST_1.default.DATE.MONTH_DAY_YEAR_ABBR_FORMAT : CONST_1.default.DATE.MONTH_DAY_ABBR_FORMAT);
        previewHeaderText.unshift({ text: date }, dotSeparator);
    }
    if ((0, TransactionUtils_1.isPending)(transaction)) {
        previewHeaderText.push(dotSeparator, { translationPath: 'iou.pending' });
    }
    if ((0, TransactionUtils_1.hasPendingRTERViolation)(violations)) {
        previewHeaderText.push(dotSeparator, { translationPath: 'iou.pendingMatch' });
    }
    let isPreviewHeaderTextComplete = false;
    if (isMoneyRequestSettled && !iouReport?.isCancelledIOU && !isPartialHold) {
        previewHeaderText.push(dotSeparator, { translationPath: isTransactionMadeWithCard ? 'common.done' : 'iou.settledExpensify' });
        isPreviewHeaderTextComplete = true;
    }
    if (!isPreviewHeaderTextComplete) {
        if (hasViolationsOfTypeNotice && transaction && !(0, ReportUtils_1.isReportApproved)({ report: iouReport }) && !(0, ReportUtils_1.isSettled)(iouReport?.reportID)) {
            previewHeaderText.push(dotSeparator, { translationPath: 'violations.reviewRequired' });
        }
        else if ((0, ReportUtils_1.isPaidGroupPolicyExpenseReport)(iouReport) && (0, ReportUtils_1.isReportApproved)({ report: iouReport }) && !(0, ReportUtils_1.isSettled)(iouReport?.reportID) && !isPartialHold) {
            previewHeaderText.push(dotSeparator, { translationPath: 'iou.approved' });
        }
        else if (iouReport?.isCancelledIOU) {
            previewHeaderText.push(dotSeparator, { translationPath: 'iou.canceled' });
        }
        else if (shouldShowHoldMessage) {
            previewHeaderText.push(dotSeparator, { translationPath: 'violations.hold' });
        }
    }
    const amount = isBillSplit ? (0, TransactionUtils_1.getAmount)((0, TransactionUtils_1.getOriginalTransactionWithSplitInfo)(transaction).originalTransaction) : requestAmount;
    let displayAmountText = isTransactionScanning ? { translationPath: 'iou.receiptStatusTitle' } : { text: (0, CurrencyUtils_1.convertToDisplayString)(amount, requestCurrency) };
    if (isFetchingWaypoints && !requestAmount) {
        displayAmountText = { translationPath: 'iou.fieldPending' };
    }
    const iouOriginalMessage = (0, ReportActionsUtils_1.isMoneyRequestAction)(action) ? ((0, ReportActionsUtils_1.getOriginalMessage)(action) ?? undefined) : undefined;
    const displayDeleteAmountText = { text: (0, CurrencyUtils_1.convertToDisplayString)(iouOriginalMessage?.amount, iouOriginalMessage?.currency) };
    return {
        RBRMessage,
        displayAmountText,
        displayDeleteAmountText,
        previewHeaderText,
    };
}
function createTransactionPreviewConditionals({ iouReport, transaction, action, violations, transactionDetails, isBillSplit, isReportAPolicyExpenseChat, areThereDuplicates, }) {
    const { amount: requestAmount, comment: requestComment, merchant, tag, category } = transactionDetails;
    const requestMerchant = (0, truncate_1.default)(merchant, { length: CONST_1.default.REQUEST_PREVIEW.MAX_LENGTH });
    const description = (0, truncate_1.default)(StringUtils_1.default.lineBreaksToSpaces(requestComment), { length: CONST_1.default.REQUEST_PREVIEW.MAX_LENGTH });
    const isMoneyRequestSettled = (0, ReportUtils_1.isSettled)(iouReport?.reportID);
    const isApproved = (0, ReportUtils_1.isReportApproved)({ report: iouReport });
    const isSettlementOrApprovalPartial = !!iouReport?.pendingFields?.partial;
    const hasViolationsOfTypeNotice = (0, TransactionUtils_1.hasNoticeTypeViolation)(transaction, violations, true) && iouReport && (0, ReportUtils_1.isPaidGroupPolicy)(iouReport);
    const hasFieldErrors = (0, TransactionUtils_1.hasMissingSmartscanFields)(transaction);
    const isFetchingWaypoints = (0, TransactionUtils_1.isFetchingWaypointsFromServer)(transaction);
    const isTransactionOnHold = (0, TransactionUtils_1.isOnHold)(transaction);
    const isFullySettled = isMoneyRequestSettled && !isSettlementOrApprovalPartial;
    const isFullyApproved = isApproved && !isSettlementOrApprovalPartial;
    const shouldShowSkeleton = (0, EmptyObject_1.isEmptyObject)(transaction) && !(0, ReportActionsUtils_1.isMessageDeleted)(action) && action?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE;
    const shouldShowTag = !!tag && isReportAPolicyExpenseChat;
    const categoryForDisplay = (0, CategoryUtils_1.isCategoryMissing)(category) ? '' : category;
    const shouldShowCategory = !!categoryForDisplay && isReportAPolicyExpenseChat;
    const hasAnyViolations = (0, TransactionUtils_1.isUnreportedAndHasInvalidDistanceRateTransaction)(transaction) ||
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        hasViolationsOfTypeNotice ||
        (0, TransactionUtils_1.hasWarningTypeViolation)(transaction, violations, true) ||
        (0, TransactionUtils_1.hasViolation)(transaction, violations, true);
    const hasErrorOrOnHold = hasFieldErrors || (!isFullySettled && !isFullyApproved && isTransactionOnHold);
    const hasReportViolationsOrActionErrors = ((0, ReportUtils_1.isReportOwner)(iouReport) && (0, ReportUtils_1.hasReportViolations)(iouReport?.reportID)) || (0, ReportUtils_1.hasActionWithErrorsForTransaction)(iouReport?.reportID, transaction);
    const shouldShowRBR = hasAnyViolations || hasErrorOrOnHold || hasReportViolationsOrActionErrors || (0, ReportUtils_1.hasReceiptError)(transaction);
    // When there are no settled transactions in duplicates, show the "Keep this one" button
    const shouldShowKeepButton = areThereDuplicates;
    const participantAccountIDs = (0, ReportActionsUtils_1.isMoneyRequestAction)(action) && isBillSplit ? ((0, ReportActionsUtils_1.getOriginalMessage)(action)?.participantAccountIDs ?? []) : [];
    const shouldShowSplitShare = isBillSplit && !!requestAmount && requestAmount > 0 && participantAccountIDs.includes((0, Report_1.getCurrentUserAccountID)());
    /*
 Show the merchant for IOUs and expenses only if:
 - the merchant is not empty, is custom, or is not related to scanning smartscan;
 - the expense is not a distance expense with a pending route and amount = 0 - in this case,
   the merchant says: "Route pending...", which is already shown in the amount field;
*/
    const shouldShowMerchant = !!requestMerchant &&
        requestMerchant !== CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT &&
        requestMerchant !== CONST_1.default.TRANSACTION.DEFAULT_MERCHANT &&
        !(isFetchingWaypoints && !requestAmount);
    const shouldShowDescription = !!description && !shouldShowMerchant && !(0, TransactionUtils_1.isScanning)(transaction);
    return {
        shouldShowSkeleton,
        shouldShowTag,
        shouldShowRBR,
        shouldShowCategory,
        shouldShowKeepButton,
        shouldShowSplitShare,
        shouldShowMerchant,
        shouldShowDescription,
    };
}
