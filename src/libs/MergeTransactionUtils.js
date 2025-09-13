"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTargetTransactionFromMergeTransaction = exports.getSourceTransactionFromMergeTransaction = void 0;
exports.shouldNavigateToReceiptReview = shouldNavigateToReceiptReview;
exports.getMergeableDataAndConflictFields = getMergeableDataAndConflictFields;
exports.getMergeFieldValue = getMergeFieldValue;
exports.getMergeFieldTranslationKey = getMergeFieldTranslationKey;
exports.buildMergedTransactionData = buildMergedTransactionData;
exports.selectTargetAndSourceTransactionsForMerge = selectTargetAndSourceTransactionsForMerge;
exports.isEmptyMergeValue = isEmptyMergeValue;
exports.fillMissingReceiptSource = fillMissingReceiptSource;
exports.getTransactionThreadReportID = getTransactionThreadReportID;
exports.getReceiptFileName = getReceiptFileName;
exports.getDisplayValue = getDisplayValue;
exports.buildMergeFieldsData = buildMergeFieldsData;
exports.getReportIDForExpense = getReportIDForExpense;
var CONST_1 = require("@src/CONST");
var CurrencyUtils_1 = require("./CurrencyUtils");
var Parser_1 = require("./Parser");
var PolicyUtils_1 = require("./PolicyUtils");
var ReportActionsUtils_1 = require("./ReportActionsUtils");
var ReportUtils_1 = require("./ReportUtils");
var StringUtils_1 = require("./StringUtils");
var TransactionUtils_1 = require("./TransactionUtils");
var RECEIPT_SOURCE_URL = 'https://www.expensify.com/receipts/';
// Define the specific merge fields we want to handle
var MERGE_FIELDS = ['amount', 'currency', 'merchant', 'created', 'category', 'tag', 'description', 'reimbursable', 'billable', 'reportID'];
var MERGE_FIELD_TRANSLATION_KEYS = {
    amount: 'iou.amount',
    currency: 'iou.currency',
    merchant: 'common.merchant',
    category: 'common.category',
    tag: 'common.tag',
    description: 'common.description',
    reimbursable: 'common.reimbursable',
    billable: 'common.billable',
    created: 'common.date',
    reportID: 'common.report',
};
// Get the filename from the receipt
function getReceiptFileName(receipt) {
    var _a, _b;
    return (_b = (_a = receipt === null || receipt === void 0 ? void 0 : receipt.source) === null || _a === void 0 ? void 0 : _a.split('/')) === null || _b === void 0 ? void 0 : _b.pop();
}
/**
 * Fills the receipt.source for a transaction if it's missing
 * Workaround while wait BE to fix the receipt.source
 * @param transaction - The transaction to update the receipt source for
 * @returns The updated transaction with receipt.source filled if it was missing
 */
function fillMissingReceiptSource(transaction) {
    var _a;
    // If receipt.source already exists, no need to modify
    if (!transaction.receipt || !!((_a = transaction.receipt) === null || _a === void 0 ? void 0 : _a.source) || !transaction.filename) {
        return transaction;
    }
    return __assign(__assign({}, transaction), { receipt: __assign(__assign({}, transaction.receipt), { source: "".concat(RECEIPT_SOURCE_URL).concat(transaction.filename) }) });
}
var getTransactionFromMergeTransaction = function (mergeTransaction, transactionID) {
    if (!(mergeTransaction === null || mergeTransaction === void 0 ? void 0 : mergeTransaction.eligibleTransactions)) {
        return undefined;
    }
    var transaction = mergeTransaction.eligibleTransactions.find(function (eligibleTransaction) { return eligibleTransaction.transactionID === transactionID; });
    return transaction ? fillMissingReceiptSource(transaction) : transaction;
};
/**
 * Get the source transaction from a merge transaction
 * @param mergeTransaction - The merge transaction to get the source transaction from
 * @returns The source transaction or null if it doesn't exist
 */
var getSourceTransactionFromMergeTransaction = function (mergeTransaction) {
    if (!(mergeTransaction === null || mergeTransaction === void 0 ? void 0 : mergeTransaction.sourceTransactionID)) {
        return undefined;
    }
    return getTransactionFromMergeTransaction(mergeTransaction, mergeTransaction.sourceTransactionID);
};
exports.getSourceTransactionFromMergeTransaction = getSourceTransactionFromMergeTransaction;
/**
 * Get the target transaction from a merge transaction
 * @param mergeTransaction - The merge transaction to get the target transaction from
 * @returns The target transaction or null if it doesn't exist
 */
var getTargetTransactionFromMergeTransaction = function (mergeTransaction) {
    if (!(mergeTransaction === null || mergeTransaction === void 0 ? void 0 : mergeTransaction.targetTransactionID)) {
        return undefined;
    }
    return getTransactionFromMergeTransaction(mergeTransaction, mergeTransaction.targetTransactionID);
};
exports.getTargetTransactionFromMergeTransaction = getTargetTransactionFromMergeTransaction;
/**
 * Check if the user should navigate to the receipt review page
 * @param transactions - array of target and source transactions
 * @returns True if both transactions have a receipt
 */
function shouldNavigateToReceiptReview(transactions) {
    return transactions.every(function (transaction) { var _a; return (_a = transaction === null || transaction === void 0 ? void 0 : transaction.receipt) === null || _a === void 0 ? void 0 : _a.receiptID; });
}
// Check if whether merge value is truly "empty" (null, undefined, or empty string)
// For boolean fields, false is a valid value, not an empty value
function isEmptyMergeValue(value) {
    return value === null || value === undefined || value === '';
}
/**
 * Get the value of a specific merge field from a transaction
 * @param transactionDetails - The transaction details to extract the field value from
 * @param transaction - The transaction to extract the field value from
 * @param field - The merge field key to get the value for
 * @returns The value of the specified field from the transaction
 */
function getMergeFieldValue(transactionDetails, transaction, field) {
    var _a;
    if (!transactionDetails || !transaction) {
        return '';
    }
    if (field === 'description') {
        return transactionDetails.comment;
    }
    if (field === 'reimbursable') {
        return (0, TransactionUtils_1.getReimbursable)(transaction);
    }
    if (field === 'reportID') {
        return transaction.reportID;
    }
    if (field === 'merchant' && (0, TransactionUtils_1.isMerchantMissing)(transaction)) {
        return '';
    }
    return (_a = transactionDetails[field]) !== null && _a !== void 0 ? _a : '';
}
/**
 * Get the translation key for a specific merge field
 * @param field - The merge field key to get the translation key for
 * @returns The translation key string for the specified field
 */
function getMergeFieldTranslationKey(field) {
    return MERGE_FIELD_TRANSLATION_KEYS[field];
}
/**
 * Get mergeableData data if one is missing, and conflict fields that need to be resolved by the user
 * @param targetTransaction - The target transaction
 * @param sourceTransaction - The source transaction
 * @returns mergeableData and conflictFields
 */
function getMergeableDataAndConflictFields(targetTransaction, sourceTransaction) {
    var conflictFields = [];
    var mergeableData = {};
    var targetTransactionDetails = (0, ReportUtils_1.getTransactionDetails)(targetTransaction);
    var sourceTransactionDetails = (0, ReportUtils_1.getTransactionDetails)(sourceTransaction);
    MERGE_FIELDS.forEach(function (field) {
        // Currency field is handled by the amount field
        if (field === 'currency') {
            return;
        }
        var targetValue = getMergeFieldValue(targetTransactionDetails, targetTransaction, field);
        var sourceValue = getMergeFieldValue(sourceTransactionDetails, sourceTransaction, field);
        var isTargetValueEmpty = isEmptyMergeValue(targetValue);
        var isSourceValueEmpty = isEmptyMergeValue(sourceValue);
        if (field === 'amount') {
            // If target transaction is a card transaction, always preserve the target transaction's amount and currency
            // See https://github.com/Expensify/App/issues/68189#issuecomment-3167156907
            if ((0, TransactionUtils_1.isCardTransaction)(targetTransaction)) {
                mergeableData[field] = targetValue;
                mergeableData.currency = (0, TransactionUtils_1.getCurrency)(targetTransaction);
                return;
            }
            // When one of the selected expenses has a $0 amount, we should automatically select the non-zero amount.
            if (targetValue === 0 || sourceValue === 0) {
                mergeableData[field] = sourceValue === 0 ? targetValue : sourceValue;
                mergeableData.currency = sourceValue === 0 ? (0, TransactionUtils_1.getCurrency)(targetTransaction) : (0, TransactionUtils_1.getCurrency)(sourceTransaction);
                return;
            }
            // Check for currency differences when values equal
            if (targetValue === sourceValue && (0, TransactionUtils_1.getCurrency)(targetTransaction) !== (0, TransactionUtils_1.getCurrency)(sourceTransaction)) {
                conflictFields.push(field);
                return;
            }
            // When the values are the same and the currencies are the same, we should merge the values
            if (targetValue === sourceValue && (0, TransactionUtils_1.getCurrency)(targetTransaction) === (0, TransactionUtils_1.getCurrency)(sourceTransaction)) {
                mergeableData[field] = targetValue;
                mergeableData.currency = (0, TransactionUtils_1.getCurrency)(targetTransaction);
                return;
            }
        }
        // We allow user to select unreported report
        if (field === 'reportID') {
            if (targetValue === sourceValue) {
                mergeableData[field] = targetValue;
            }
            else {
                conflictFields.push(field);
            }
            return;
        }
        // Use the reimbursable flag coming from card transactions automatically
        // See https://github.com/Expensify/App/issues/69598
        if (field === 'reimbursable' && (0, TransactionUtils_1.isCardTransaction)(targetTransaction)) {
            mergeableData[field] = targetValue;
            return;
        }
        if (isTargetValueEmpty || isSourceValueEmpty || targetValue === sourceValue) {
            mergeableData[field] = isTargetValueEmpty ? sourceValue : targetValue;
        }
        else {
            conflictFields.push(field);
        }
    });
    return { mergeableData: mergeableData, conflictFields: conflictFields };
}
/**
 * Get the report ID for an expense, if it's unreported, we'll return the self DM report ID
 */
function getReportIDForExpense(transaction) {
    if (!transaction) {
        return undefined;
    }
    var isUnreportedExpense = !transaction.reportID || transaction.reportID === CONST_1.default.REPORT.UNREPORTED_REPORT_ID;
    if (isUnreportedExpense) {
        return (0, ReportUtils_1.findSelfDMReportID)();
    }
    return transaction.reportID;
}
/**
 * Get the report ID for the transaction thread of a transaction
 * @param transaction - The transaction to get the report ID for
 * @returns The report ID for the transaction thread
 */
function getTransactionThreadReportID(transaction) {
    var iouActionOfTargetTransaction = (0, ReportActionsUtils_1.getIOUActionForReportID)(getReportIDForExpense(transaction), transaction === null || transaction === void 0 ? void 0 : transaction.transactionID);
    return iouActionOfTargetTransaction === null || iouActionOfTargetTransaction === void 0 ? void 0 : iouActionOfTargetTransaction.childReportID;
}
/**
 * Build the merged transaction data for display by combining target transaction with merge transaction updates
 * @param targetTransaction - The target transaction to merge into
 * @param mergeTransaction - The merge transaction containing the updates
 * @returns The merged transaction data or null if required data is missing
 */
function buildMergedTransactionData(targetTransaction, mergeTransaction) {
    if (!targetTransaction || !mergeTransaction) {
        return null;
    }
    return __assign(__assign({}, targetTransaction), { amount: mergeTransaction.amount, modifiedAmount: mergeTransaction.amount, modifiedCurrency: mergeTransaction.currency, merchant: mergeTransaction.merchant, modifiedMerchant: mergeTransaction.merchant, category: mergeTransaction.category, tag: mergeTransaction.tag, comment: __assign(__assign({}, targetTransaction.comment), { comment: mergeTransaction.description }), reimbursable: mergeTransaction.reimbursable, billable: mergeTransaction.billable, filename: getReceiptFileName(mergeTransaction.receipt), receipt: mergeTransaction.receipt, created: mergeTransaction.created, modifiedCreated: mergeTransaction.created, reportID: mergeTransaction.reportID });
}
/**
 * Determines the correct target and source transaction IDs for merging based on transaction types.
 *
 * Rules:
 * - If one transaction is a card transaction, it becomes the target (card transactions take priority)
 * - If both are cash transactions, the first parameter becomes the target
 * - Users can only merge two cash expenses or one cash/one card expense
 * - Users cannot merge two card expenses
 *
 * @param targetTransaction - The first transaction in the merge operation
 * @param sourceTransaction - The second transaction in the merge operation
 * @returns An object containing the determined targetTransactionID and sourceTransactionID
 */
function selectTargetAndSourceTransactionsForMerge(originalTargetTransaction, originalSourceTransaction) {
    if ((0, TransactionUtils_1.isCardTransaction)(originalSourceTransaction)) {
        return { targetTransaction: originalSourceTransaction, sourceTransaction: originalTargetTransaction };
    }
    return { targetTransaction: originalTargetTransaction, sourceTransaction: originalSourceTransaction };
}
/**
 * Get display value for merge transaction field
 * @param field - The merge field key to get display value for
 * @param transaction - The transaction to get the field value from
 * @param translate - The translation function
 * @returns The formatted display string for the field value
 */
function getDisplayValue(field, transaction, translate) {
    var fieldValue = getMergeFieldValue((0, ReportUtils_1.getTransactionDetails)(transaction), transaction, field);
    if (isEmptyMergeValue(fieldValue)) {
        return '';
    }
    if (typeof fieldValue === 'boolean') {
        return fieldValue ? translate('common.yes') : translate('common.no');
    }
    if (field === 'amount') {
        return (0, CurrencyUtils_1.convertToDisplayString)(Number(fieldValue), (0, TransactionUtils_1.getCurrency)(transaction));
    }
    if (field === 'description') {
        return StringUtils_1.default.lineBreaksToSpaces(Parser_1.default.htmlToText(fieldValue.toString()));
    }
    if (field === 'tag') {
        return (0, PolicyUtils_1.getCommaSeparatedTagNameWithSanitizedColons)(fieldValue.toString());
    }
    if (field === 'reportID') {
        return fieldValue === CONST_1.default.REPORT.UNREPORTED_REPORT_ID ? translate('common.none') : (0, ReportUtils_1.getReportName)((0, ReportUtils_1.getReportOrDraftReport)(fieldValue.toString()));
    }
    return String(fieldValue);
}
/**
 * Build merge fields data array from conflict fields for UI display
 * @param conflictFields - Array of field keys that have conflicts
 * @param targetTransaction - The target transaction
 * @param sourceTransaction - The source transaction
 * @param mergeTransaction - The current merge transaction state
 * @param translate - The translation function
 * @returns Array of merge field data for UI rendering
 */
function buildMergeFieldsData(conflictFields, targetTransaction, sourceTransaction, mergeTransaction, translate) {
    if (!targetTransaction || !sourceTransaction) {
        return [];
    }
    return conflictFields.map(function (field) {
        var _a;
        var label = translate(getMergeFieldTranslationKey(field));
        var selectedTransactionId = (_a = mergeTransaction === null || mergeTransaction === void 0 ? void 0 : mergeTransaction.selectedTransactionByField) === null || _a === void 0 ? void 0 : _a[field];
        // Create options for this field
        var options = [
            {
                transaction: targetTransaction,
                displayValue: getDisplayValue(field, targetTransaction, translate),
                isSelected: selectedTransactionId === targetTransaction.transactionID,
            },
            {
                transaction: sourceTransaction,
                displayValue: getDisplayValue(field, sourceTransaction, translate),
                isSelected: selectedTransactionId === sourceTransaction.transactionID,
            },
        ];
        return {
            field: field,
            label: label,
            options: options,
        };
    });
}
