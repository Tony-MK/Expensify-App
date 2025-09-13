"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getForReportAction = getForReportAction;
exports.getMovedReportID = getMovedReportID;
exports.getMovedFromOrToReportMessage = getMovedFromOrToReportMessage;
const isEmpty_1 = require("lodash/isEmpty");
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const CurrencyUtils_1 = require("./CurrencyUtils");
const DateUtils_1 = require("./DateUtils");
const Localize_1 = require("./Localize");
const Log_1 = require("./Log");
const Parser_1 = require("./Parser");
const PolicyUtils_1 = require("./PolicyUtils");
const ReportActionsUtils_1 = require("./ReportActionsUtils");
// eslint-disable-next-line import/no-cycle
const ReportUtils_1 = require("./ReportUtils");
const TransactionUtils_1 = require("./TransactionUtils");
let allPolicyTags = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.POLICY_TAGS,
    waitForCollectionCallback: true,
    callback: (value) => {
        if (!value) {
            allPolicyTags = {};
            return;
        }
        allPolicyTags = value;
    },
});
/**
 * Builds the partial message fragment for a modified field on the expense.
 */
function buildMessageFragmentForValue(newValue, oldValue, valueName, valueInQuotes, setFragments, removalFragments, changeFragments, shouldConvertToLowercase = true) {
    const newValueToDisplay = valueInQuotes ? `"${newValue}"` : newValue;
    const oldValueToDisplay = valueInQuotes ? `"${oldValue}"` : oldValue;
    const displayValueName = shouldConvertToLowercase ? valueName.toLowerCase() : valueName;
    const isOldValuePartialMerchant = valueName === (0, Localize_1.translateLocal)('common.merchant') && oldValue === CONST_1.default.TRANSACTION.PARTIAL_TRANSACTION_MERCHANT;
    // In case of a partial merchant value, we want to avoid user seeing the "(none)" value in the message.
    if (!oldValue || isOldValuePartialMerchant) {
        const fragment = (0, Localize_1.translateLocal)('iou.setTheRequest', { valueName: displayValueName, newValueToDisplay });
        setFragments.push(fragment);
    }
    else if (!newValue) {
        const fragment = (0, Localize_1.translateLocal)('iou.removedTheRequest', { valueName: displayValueName, oldValueToDisplay });
        removalFragments.push(fragment);
    }
    else {
        const fragment = (0, Localize_1.translateLocal)('iou.updatedTheRequest', { valueName: displayValueName, newValueToDisplay, oldValueToDisplay });
        changeFragments.push(fragment);
    }
}
/**
 * Get the absolute value for a tax amount.
 */
function getTaxAmountAbsValue(taxAmount) {
    // IOU requests cannot have negative values but they can be stored as negative values, let's return absolute value
    return Math.abs(taxAmount ?? 0);
}
/**
 * Get the message line for a modified expense.
 */
function getMessageLine(prefix, messageFragments) {
    if (messageFragments.length === 0) {
        return '';
    }
    return messageFragments.reduce((acc, value, index) => {
        if (index === messageFragments.length - 1) {
            if (messageFragments.length === 1) {
                return `${acc} ${value}`;
            }
            if (messageFragments.length === 2) {
                return `${acc} ${(0, Localize_1.translateLocal)('common.and')} ${value}`;
            }
            return `${acc}, ${(0, Localize_1.translateLocal)('common.and')} ${value}`;
        }
        if (index === 0) {
            return `${acc} ${value}`;
        }
        return `${acc}, ${value}`;
    }, prefix);
}
function getForDistanceRequest(newMerchant, oldMerchant, newAmount, oldAmount) {
    let changedField = 'distance';
    if (CONST_1.default.REGEX.DISTANCE_MERCHANT.test(newMerchant) && CONST_1.default.REGEX.DISTANCE_MERCHANT.test(oldMerchant)) {
        const oldValues = oldMerchant.split('@');
        const oldDistance = oldValues.at(0)?.trim() ?? '';
        const oldRate = oldValues.at(1)?.trim() ?? '';
        const newValues = newMerchant.split('@');
        const newDistance = newValues.at(0)?.trim() ?? '';
        const newRate = newValues.at(1)?.trim() ?? '';
        if (oldDistance === newDistance && oldRate !== newRate) {
            changedField = 'rate';
        }
    }
    else {
        Log_1.default.hmmm("Distance request merchant doesn't match NewDot format. Defaulting to showing as distance changed.", { newMerchant, oldMerchant });
    }
    const translatedChangedField = (0, Localize_1.translateLocal)(`common.${changedField}`).toLowerCase();
    if (!oldMerchant.length) {
        return (0, Localize_1.translateLocal)('iou.setTheDistanceMerchant', { translatedChangedField, newMerchant, newAmountToDisplay: newAmount });
    }
    return (0, Localize_1.translateLocal)('iou.updatedTheDistanceMerchant', {
        translatedChangedField,
        newMerchant,
        oldMerchant,
        newAmountToDisplay: newAmount,
        oldAmountToDisplay: oldAmount,
    });
}
function getForExpenseMovedFromSelfDM(destinationReport) {
    const rootParentReport = (0, ReportUtils_1.getRootParentReport)({ report: destinationReport });
    // In OldDot, expenses could be moved to a self-DM. Return the corresponding message for this case.
    if ((0, ReportUtils_1.isSelfDM)(rootParentReport)) {
        return (0, Localize_1.translateLocal)('iou.movedToPersonalSpace');
    }
    // In NewDot, the "Move report" flow only supports moving expenses from self-DM to:
    // - A policy expense chat
    // - A 1:1 DM
    const reportName = (0, ReportUtils_1.isPolicyExpenseChat)(rootParentReport) ? (0, ReportUtils_1.getPolicyExpenseChatName)({ report: rootParentReport }) : (0, ReportUtils_1.buildReportNameFromParticipantNames)({ report: rootParentReport });
    const policyName = (0, ReportUtils_1.getPolicyName)({ report: rootParentReport, returnEmptyIfNotFound: true });
    // If we can't determine either the report name or policy name, return the default message
    if ((0, isEmpty_1.default)(policyName) && !reportName) {
        return (0, Localize_1.translateLocal)('iou.changedTheExpense');
    }
    return (0, Localize_1.translateLocal)('iou.movedFromPersonalSpace', {
        reportName,
        workspaceName: !(0, isEmpty_1.default)(policyName) ? policyName : undefined,
    });
}
function getMovedReportID(reportAction, type) {
    if (!(0, ReportActionsUtils_1.isModifiedExpenseAction)(reportAction)) {
        return undefined;
    }
    const reportActionOriginalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(reportAction);
    return type === CONST_1.default.REPORT.MOVE_TYPE.TO ? reportActionOriginalMessage?.movedToReportID : reportActionOriginalMessage?.movedFromReport;
}
function getMovedFromOrToReportMessage(movedFromReport, movedToReport) {
    if (movedToReport) {
        return getForExpenseMovedFromSelfDM(movedToReport);
    }
    if (movedFromReport) {
        const originReportName = (0, ReportUtils_1.getReportName)(movedFromReport);
        return (0, Localize_1.translateLocal)('iou.movedFromReport', { reportName: originReportName ?? '' });
    }
}
/**
 * Get the report action message when expense has been modified.
 *
 * ModifiedExpense::getNewDotComment in Web-Expensify should match this.
 * If we change this function be sure to update the backend as well.
 */
function getForReportAction({ reportAction, policyID, movedFromReport, movedToReport, }) {
    if (!(0, ReportActionsUtils_1.isModifiedExpenseAction)(reportAction)) {
        return '';
    }
    const movedFromOrToReportMessage = getMovedFromOrToReportMessage(movedFromReport, movedToReport);
    if (movedFromOrToReportMessage) {
        return movedFromOrToReportMessage;
    }
    const reportActionOriginalMessage = (0, ReportActionsUtils_1.getOriginalMessage)(reportAction);
    const removalFragments = [];
    const setFragments = [];
    const changeFragments = [];
    const isReportActionOriginalMessageAnObject = reportActionOriginalMessage && typeof reportActionOriginalMessage === 'object';
    const hasModifiedAmount = isReportActionOriginalMessageAnObject &&
        'oldAmount' in reportActionOriginalMessage &&
        'oldCurrency' in reportActionOriginalMessage &&
        'amount' in reportActionOriginalMessage &&
        'currency' in reportActionOriginalMessage;
    const hasModifiedMerchant = isReportActionOriginalMessageAnObject && 'oldMerchant' in reportActionOriginalMessage && 'merchant' in reportActionOriginalMessage;
    if (hasModifiedAmount) {
        const oldCurrency = reportActionOriginalMessage?.oldCurrency;
        const oldAmountValue = reportActionOriginalMessage?.oldAmount ?? 0;
        const oldAmount = oldAmountValue > 0 ? (0, CurrencyUtils_1.convertToDisplayString)(reportActionOriginalMessage?.oldAmount ?? 0, oldCurrency) : '';
        const currency = reportActionOriginalMessage?.currency;
        const amount = (0, CurrencyUtils_1.convertToDisplayString)(reportActionOriginalMessage?.amount ?? 0, currency);
        // Only Distance edits should modify amount and merchant (which stores distance) in a single transaction.
        // We check the merchant is in distance format (includes @) as a sanity check
        if (hasModifiedMerchant && (reportActionOriginalMessage?.merchant ?? '').includes('@')) {
            return getForDistanceRequest(reportActionOriginalMessage?.merchant ?? '', reportActionOriginalMessage?.oldMerchant ?? '', amount, oldAmount);
        }
        buildMessageFragmentForValue(amount, oldAmount, (0, Localize_1.translateLocal)('iou.amount'), false, setFragments, removalFragments, changeFragments);
    }
    const hasModifiedComment = isReportActionOriginalMessageAnObject && 'oldComment' in reportActionOriginalMessage && 'newComment' in reportActionOriginalMessage;
    if (hasModifiedComment) {
        buildMessageFragmentForValue(Parser_1.default.htmlToMarkdown(reportActionOriginalMessage?.newComment ?? ''), Parser_1.default.htmlToMarkdown(reportActionOriginalMessage?.oldComment ?? ''), (0, Localize_1.translateLocal)('common.description'), true, setFragments, removalFragments, changeFragments);
    }
    if (reportActionOriginalMessage?.oldCreated && reportActionOriginalMessage?.created) {
        const formattedOldCreated = DateUtils_1.default.formatWithUTCTimeZone(reportActionOriginalMessage.oldCreated, CONST_1.default.DATE.FNS_FORMAT_STRING);
        buildMessageFragmentForValue(reportActionOriginalMessage.created, formattedOldCreated, (0, Localize_1.translateLocal)('common.date'), false, setFragments, removalFragments, changeFragments);
    }
    if (hasModifiedMerchant) {
        buildMessageFragmentForValue(reportActionOriginalMessage?.merchant ?? '', reportActionOriginalMessage?.oldMerchant ?? '', (0, Localize_1.translateLocal)('common.merchant'), true, setFragments, removalFragments, changeFragments);
    }
    const hasModifiedCategory = isReportActionOriginalMessageAnObject && 'oldCategory' in reportActionOriginalMessage && 'category' in reportActionOriginalMessage;
    if (hasModifiedCategory) {
        buildMessageFragmentForValue(reportActionOriginalMessage?.category ?? '', reportActionOriginalMessage?.oldCategory ?? '', (0, Localize_1.translateLocal)('common.category'), true, setFragments, removalFragments, changeFragments);
    }
    const hasModifiedTag = isReportActionOriginalMessageAnObject && 'oldTag' in reportActionOriginalMessage && 'tag' in reportActionOriginalMessage;
    if (hasModifiedTag) {
        const policyTags = allPolicyTags?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_TAGS}${policyID}`] ?? {};
        const transactionTag = reportActionOriginalMessage?.tag ?? '';
        const oldTransactionTag = reportActionOriginalMessage?.oldTag ?? '';
        const splittedTag = (0, TransactionUtils_1.getTagArrayFromName)(transactionTag);
        const splittedOldTag = (0, TransactionUtils_1.getTagArrayFromName)(oldTransactionTag);
        const localizedTagListName = (0, Localize_1.translateLocal)('common.tag');
        const sortedTagKeys = (0, PolicyUtils_1.getSortedTagKeys)(policyTags);
        sortedTagKeys.forEach((policyTagKey, index) => {
            const policyTagListName = policyTags[policyTagKey].name || localizedTagListName;
            const newTag = splittedTag.at(index) ?? '';
            const oldTag = splittedOldTag.at(index) ?? '';
            if (newTag !== oldTag) {
                buildMessageFragmentForValue((0, PolicyUtils_1.getCleanedTagName)(newTag), (0, PolicyUtils_1.getCleanedTagName)(oldTag), policyTagListName, true, setFragments, removalFragments, changeFragments, policyTagListName === localizedTagListName);
            }
        });
    }
    const hasModifiedTaxAmount = isReportActionOriginalMessageAnObject && 'oldTaxAmount' in reportActionOriginalMessage && 'taxAmount' in reportActionOriginalMessage;
    if (hasModifiedTaxAmount) {
        const currency = reportActionOriginalMessage?.currency;
        const taxAmount = (0, CurrencyUtils_1.convertToDisplayString)(getTaxAmountAbsValue(reportActionOriginalMessage?.taxAmount ?? 0), currency);
        const oldTaxAmountValue = getTaxAmountAbsValue(reportActionOriginalMessage?.oldTaxAmount ?? 0);
        const oldTaxAmount = oldTaxAmountValue > 0 ? (0, CurrencyUtils_1.convertToDisplayString)(oldTaxAmountValue, currency) : '';
        buildMessageFragmentForValue(taxAmount, oldTaxAmount, (0, Localize_1.translateLocal)('iou.taxAmount'), false, setFragments, removalFragments, changeFragments);
    }
    const hasModifiedTaxRate = isReportActionOriginalMessageAnObject && 'oldTaxRate' in reportActionOriginalMessage && 'taxRate' in reportActionOriginalMessage;
    if (hasModifiedTaxRate) {
        buildMessageFragmentForValue(reportActionOriginalMessage?.taxRate ?? '', reportActionOriginalMessage?.oldTaxRate ?? '', (0, Localize_1.translateLocal)('iou.taxRate'), false, setFragments, removalFragments, changeFragments);
    }
    const hasModifiedBillable = isReportActionOriginalMessageAnObject && 'oldBillable' in reportActionOriginalMessage && 'billable' in reportActionOriginalMessage;
    if (hasModifiedBillable) {
        buildMessageFragmentForValue(reportActionOriginalMessage?.billable ?? '', reportActionOriginalMessage?.oldBillable ?? '', (0, Localize_1.translateLocal)('iou.expense'), true, setFragments, removalFragments, changeFragments);
    }
    const hasModifiedReimbursable = isReportActionOriginalMessageAnObject && 'oldReimbursable' in reportActionOriginalMessage && 'reimbursable' in reportActionOriginalMessage;
    if (hasModifiedReimbursable) {
        buildMessageFragmentForValue(reportActionOriginalMessage?.reimbursable ?? '', reportActionOriginalMessage?.oldReimbursable ?? '', (0, Localize_1.translateLocal)('iou.expense'), true, setFragments, removalFragments, changeFragments);
    }
    const hasModifiedAttendees = isReportActionOriginalMessageAnObject && 'oldAttendees' in reportActionOriginalMessage && 'newAttendees' in reportActionOriginalMessage;
    if (hasModifiedAttendees) {
        const [oldAttendees, attendees] = (0, TransactionUtils_1.getFormattedAttendees)(reportActionOriginalMessage.newAttendees, reportActionOriginalMessage.oldAttendees);
        buildMessageFragmentForValue(oldAttendees, attendees, (0, Localize_1.translateLocal)('iou.attendees'), false, setFragments, removalFragments, changeFragments);
    }
    const message = getMessageLine(`\n${(0, Localize_1.translateLocal)('iou.changed')}`, changeFragments) +
        getMessageLine(`\n${(0, Localize_1.translateLocal)('iou.set')}`, setFragments) +
        getMessageLine(`\n${(0, Localize_1.translateLocal)('iou.removed')}`, removalFragments);
    if (message === '') {
        return (0, Localize_1.translateLocal)('iou.changedTheExpense');
    }
    return `${message.substring(1, message.length)}`;
}
