"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAmount = calculateAmount;
exports.insertTagIntoTransactionTagsString = insertTagIntoTransactionTagsString;
exports.isIOUReportPendingCurrencyConversion = isIOUReportPendingCurrencyConversion;
exports.isMovingTransactionFromTrackExpense = isMovingTransactionFromTrackExpense;
exports.shouldUseTransactionDraft = shouldUseTransactionDraft;
exports.isValidMoneyRequestType = isValidMoneyRequestType;
exports.navigateToStartMoneyRequestStep = navigateToStartMoneyRequestStep;
exports.updateIOUOwnerAndTotal = updateIOUOwnerAndTotal;
exports.formatCurrentUserToAttendee = formatCurrentUserToAttendee;
exports.navigateToParticipantPage = navigateToParticipantPage;
exports.shouldShowReceiptEmptyState = shouldShowReceiptEmptyState;
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const CurrencyUtils_1 = require("./CurrencyUtils");
const Navigation_1 = require("./Navigation/Navigation");
const Performance_1 = require("./Performance");
const PolicyUtils_1 = require("./PolicyUtils");
const ReportUtils_1 = require("./ReportUtils");
const TransactionUtils_1 = require("./TransactionUtils");
function navigateToStartMoneyRequestStep(requestType, iouType, transactionID, reportID, iouAction) {
    if (iouAction === CONST_1.default.IOU.ACTION.CATEGORIZE || iouAction === CONST_1.default.IOU.ACTION.SUBMIT || iouAction === CONST_1.default.IOU.ACTION.SHARE) {
        Navigation_1.default.goBack();
        return;
    }
    // If the participants were automatically added to the transaction, then the user needs taken back to the starting step
    switch (requestType) {
        case CONST_1.default.IOU.REQUEST_TYPE.DISTANCE:
            Navigation_1.default.goBack(ROUTES_1.default.MONEY_REQUEST_CREATE_TAB_DISTANCE.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, transactionID, reportID), { compareParams: false });
            break;
        case CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MAP:
            Navigation_1.default.goBack(ROUTES_1.default.DISTANCE_REQUEST_CREATE_TAB_MAP.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, transactionID, reportID), { compareParams: false });
            break;
        case CONST_1.default.IOU.REQUEST_TYPE.DISTANCE_MANUAL:
            Navigation_1.default.goBack(ROUTES_1.default.DISTANCE_REQUEST_CREATE_TAB_MANUAL.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, transactionID, reportID), { compareParams: false });
            break;
        case CONST_1.default.IOU.REQUEST_TYPE.SCAN:
            Navigation_1.default.goBack(ROUTES_1.default.MONEY_REQUEST_CREATE_TAB_SCAN.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, transactionID, reportID), { compareParams: false });
            break;
        default:
            Navigation_1.default.goBack(ROUTES_1.default.MONEY_REQUEST_CREATE_TAB_MANUAL.getRoute(CONST_1.default.IOU.ACTION.CREATE, iouType, transactionID, reportID), { compareParams: false });
            break;
    }
}
function navigateToParticipantPage(iouType, transactionID, reportID) {
    Performance_1.default.markStart(CONST_1.default.TIMING.OPEN_CREATE_EXPENSE_CONTACT);
    switch (iouType) {
        case CONST_1.default.IOU.TYPE.REQUEST:
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_PARTICIPANTS.getRoute(CONST_1.default.IOU.TYPE.SUBMIT, transactionID, reportID));
            break;
        case CONST_1.default.IOU.TYPE.SEND:
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_PARTICIPANTS.getRoute(CONST_1.default.IOU.TYPE.PAY, transactionID, reportID));
            break;
        default:
            Navigation_1.default.navigate(ROUTES_1.default.MONEY_REQUEST_STEP_PARTICIPANTS.getRoute(iouType, transactionID, reportID));
    }
}
/**
 * Calculates the amount per user given a list of participants
 *
 * @param numberOfParticipants - Number of participants in the chat. It should not include the current user.
 * @param total - IOU total amount in backend format (cents, no matter the currency)
 * @param currency - This is used to know how many decimal places are valid to use when splitting the total
 * @param isDefaultUser - Whether we are calculating the amount for the current user
 */
function calculateAmount(numberOfParticipants, total, currency, isDefaultUser = false) {
    // Since the backend can maximum store 2 decimal places, any currency with more than 2 decimals
    // has to be capped to 2 decimal places
    const currencyUnit = Math.min(100, (0, CurrencyUtils_1.getCurrencyUnit)(currency));
    const totalInCurrencySubunit = (total / 100) * currencyUnit;
    const totalParticipants = numberOfParticipants + 1;
    const amountPerPerson = Math.round(totalInCurrencySubunit / totalParticipants);
    let finalAmount = amountPerPerson;
    if (isDefaultUser) {
        const sumAmount = amountPerPerson * totalParticipants;
        const difference = totalInCurrencySubunit - sumAmount;
        finalAmount = totalInCurrencySubunit !== sumAmount ? amountPerPerson + difference : amountPerPerson;
    }
    return Math.round((finalAmount * 100) / currencyUnit);
}
/**
 * The owner of the IOU report is the account who is owed money and the manager is the one who owes money!
 * In case the owner/manager swap, we need to update the owner of the IOU report and the report total, since it is always positive.
 * For example: if user1 owes user2 $10, then we have: {ownerAccountID: user2, managerID: user1, total: $10 (a positive amount, owed to user2)}
 * If user1 requests $17 from user2, then we have: {ownerAccountID: user1, managerID: user2, total: $7 (still a positive amount, but now owed to user1)}
 *
 * @param isDeleting - whether the user is deleting the expense
 * @param isUpdating - whether the user is updating the expense
 */
function updateIOUOwnerAndTotal(iouReport, actorAccountID, amount, currency, isDeleting = false, isUpdating = false, isOnHold = false) {
    // For the update case, we have calculated the diff amount in the calculateDiffAmount function so there is no need to compare currencies here
    if ((currency !== iouReport?.currency && !isUpdating) || !iouReport) {
        return iouReport;
    }
    // Make a copy so we don't mutate the original object
    const iouReportUpdate = { ...iouReport };
    // Let us ensure a valid value before updating the total amount.
    iouReportUpdate.total = iouReportUpdate.total ?? 0;
    iouReportUpdate.unheldTotal = iouReportUpdate.unheldTotal ?? 0;
    if (actorAccountID === iouReport.ownerAccountID) {
        iouReportUpdate.total += isDeleting ? -amount : amount;
        if (!isOnHold) {
            iouReportUpdate.unheldTotal += isDeleting ? -amount : amount;
        }
    }
    else {
        iouReportUpdate.total += isDeleting ? amount : -amount;
        if (!isOnHold) {
            iouReportUpdate.unheldTotal += isDeleting ? amount : -amount;
        }
    }
    if (iouReportUpdate.total < 0) {
        // The total sign has changed and hence we need to flip the manager and owner of the report.
        iouReportUpdate.ownerAccountID = iouReport.managerID;
        iouReportUpdate.managerID = iouReport.ownerAccountID;
        iouReportUpdate.total = -iouReportUpdate.total;
        iouReportUpdate.unheldTotal = -iouReportUpdate.unheldTotal;
    }
    return iouReportUpdate;
}
/**
 * Returns whether or not an IOU report contains expenses in a different currency
 * that are either created or cancelled offline, and thus haven't been converted to the report's currency yet
 */
function isIOUReportPendingCurrencyConversion(iouReport) {
    const reportTransactions = (0, ReportUtils_1.getReportTransactions)(iouReport.reportID);
    const pendingRequestsInDifferentCurrency = reportTransactions.filter((transaction) => transaction.pendingAction && (0, TransactionUtils_1.getCurrency)(transaction) !== iouReport.currency);
    return pendingRequestsInDifferentCurrency.length > 0;
}
/**
 * Checks if the iou type is one of request, send, invoice or split.
 */
function isValidMoneyRequestType(iouType) {
    const moneyRequestType = [
        CONST_1.default.IOU.TYPE.REQUEST,
        CONST_1.default.IOU.TYPE.SUBMIT,
        CONST_1.default.IOU.TYPE.SPLIT,
        CONST_1.default.IOU.TYPE.SPLIT_EXPENSE,
        CONST_1.default.IOU.TYPE.SEND,
        CONST_1.default.IOU.TYPE.PAY,
        CONST_1.default.IOU.TYPE.TRACK,
        CONST_1.default.IOU.TYPE.INVOICE,
        CONST_1.default.IOU.TYPE.CREATE,
    ];
    return moneyRequestType.includes(iouType);
}
/**
 * Inserts a newly selected tag into the already existing tags like a string
 *
 * @param transactionTags - currently selected tags for a report
 * @param tag - a newly selected tag, that should be added to the transactionTags
 * @param tagIndex - the index of a tag list
 * @param hasMultipleTagLists - whether the policy has multiple levels tag
 * @returns
 */
function insertTagIntoTransactionTagsString(transactionTags, tag, tagIndex, hasMultipleTagLists) {
    if (!hasMultipleTagLists) {
        return tag;
    }
    const tagArray = (0, TransactionUtils_1.getTagArrayFromName)(transactionTags);
    tagArray[tagIndex] = tag;
    while (tagArray.length > 0 && !tagArray.at(-1)) {
        tagArray.pop();
    }
    return tagArray.map((tagItem) => tagItem.trim()).join(CONST_1.default.COLON);
}
function isMovingTransactionFromTrackExpense(action) {
    if (action === CONST_1.default.IOU.ACTION.SUBMIT || action === CONST_1.default.IOU.ACTION.SHARE || action === CONST_1.default.IOU.ACTION.CATEGORIZE) {
        return true;
    }
    return false;
}
function shouldShowReceiptEmptyState(iouType, action, policy, isPerDiemRequest, isManualDistanceRequest) {
    // Determine when to show the receipt empty state:
    // - Show for submit or track expense types
    // - Hide for per diem requests
    // - Hide when submitting a track expense to a non-paid group policy (personal users)
    // - Hide for manual distance requests because attaching a receipt before creating the expense will trigger Smartscan but distance request amount depends on the distance traveled and mileage rate
    return ((iouType === CONST_1.default.IOU.TYPE.SUBMIT || iouType === CONST_1.default.IOU.TYPE.TRACK) &&
        !isPerDiemRequest &&
        (!isMovingTransactionFromTrackExpense(action) || (0, PolicyUtils_1.isPaidGroupPolicy)(policy)) &&
        !isManualDistanceRequest);
}
function shouldUseTransactionDraft(action, type) {
    return action === CONST_1.default.IOU.ACTION.CREATE || type === CONST_1.default.IOU.TYPE.SPLIT_EXPENSE || isMovingTransactionFromTrackExpense(action);
}
function formatCurrentUserToAttendee(currentUser, reportID) {
    if (!currentUser) {
        return;
    }
    const initialAttendee = {
        email: currentUser?.login ?? '',
        login: currentUser?.login ?? '',
        displayName: currentUser.displayName ?? '',
        avatarUrl: currentUser.avatar?.toString() ?? '',
        accountID: currentUser.accountID,
        text: currentUser.login,
        selected: true,
        reportID,
    };
    return [initialAttendee];
}
