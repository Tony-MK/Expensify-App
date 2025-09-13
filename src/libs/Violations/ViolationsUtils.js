"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEmpty_1 = require("lodash/isEmpty");
const keyBy_1 = require("lodash/keyBy");
const reject_1 = require("lodash/reject");
const react_native_onyx_1 = require("react-native-onyx");
const CurrencyUtils = require("@libs/CurrencyUtils");
const DateUtils_1 = require("@libs/DateUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Parser_1 = require("@libs/Parser");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const TransactionUtils = require("@libs/TransactionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
/**
 * Calculates tag out of policy and missing tag violations for the given transaction
 */
function getTagViolationsForSingleLevelTags(updatedTransaction, transactionViolations, policyRequiresTags, policyTagList) {
    const policyTagKeys = Object.keys(policyTagList);
    const policyTagListName = policyTagKeys.at(0) ?? '';
    const policyTags = policyTagList[policyTagListName]?.tags;
    const hasTagOutOfPolicyViolation = transactionViolations.some((violation) => violation.name === CONST_1.default.VIOLATIONS.TAG_OUT_OF_POLICY);
    const hasMissingTagViolation = transactionViolations.some((violation) => violation.name === CONST_1.default.VIOLATIONS.MISSING_TAG);
    const isTagInPolicy = policyTags ? !!policyTags[updatedTransaction.tag ?? '']?.enabled : false;
    let newTransactionViolations = [...transactionViolations];
    // Add 'tagOutOfPolicy' violation if tag is not in policy
    if (!hasTagOutOfPolicyViolation && updatedTransaction.tag && !isTagInPolicy) {
        newTransactionViolations.push({ name: CONST_1.default.VIOLATIONS.TAG_OUT_OF_POLICY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION });
    }
    // Remove 'tagOutOfPolicy' violation if tag is in policy
    if (hasTagOutOfPolicyViolation && updatedTransaction.tag && isTagInPolicy) {
        newTransactionViolations = (0, reject_1.default)(newTransactionViolations, { name: CONST_1.default.VIOLATIONS.TAG_OUT_OF_POLICY });
    }
    // Remove 'missingTag' violation if tag is valid according to policy
    if (hasMissingTagViolation && isTagInPolicy) {
        newTransactionViolations = (0, reject_1.default)(newTransactionViolations, { name: CONST_1.default.VIOLATIONS.MISSING_TAG });
    }
    // Add 'missingTag violation' if tag is required and not set
    if (!hasMissingTagViolation && !updatedTransaction.tag && policyRequiresTags) {
        newTransactionViolations.push({ name: CONST_1.default.VIOLATIONS.MISSING_TAG, type: CONST_1.default.VIOLATION_TYPES.VIOLATION });
    }
    return newTransactionViolations;
}
/**
 * Calculates missing tag violations for policies with dependent tags
 */
function getTagViolationsForDependentTags(policyTagList, transactionViolations, tagName) {
    const tagViolations = [...transactionViolations];
    if (!tagName) {
        Object.values(policyTagList).forEach((tagList) => tagViolations.push({
            name: CONST_1.default.VIOLATIONS.MISSING_TAG,
            type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
            data: { tagName: tagList.name },
        }));
    }
    else {
        const tags = TransactionUtils.getTagArrayFromName(tagName);
        if (Object.keys(policyTagList).length !== tags.length || tags.includes('')) {
            tagViolations.push({
                name: CONST_1.default.VIOLATIONS.ALL_TAG_LEVELS_REQUIRED,
                type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
                data: {},
            });
        }
    }
    return tagViolations;
}
/**
 * Calculates missing tag violations for policies with independent tags
 */
function getTagViolationForIndependentTags(policyTagList, transactionViolations, transaction) {
    const policyTagKeys = (0, PolicyUtils_1.getSortedTagKeys)(policyTagList);
    const selectedTags = TransactionUtils.getTagArrayFromName(transaction?.tag ?? '');
    let newTransactionViolations = [...transactionViolations];
    newTransactionViolations = newTransactionViolations.filter((violation) => violation.name !== CONST_1.default.VIOLATIONS.SOME_TAG_LEVELS_REQUIRED && violation.name !== CONST_1.default.VIOLATIONS.TAG_OUT_OF_POLICY);
    // We first get the errorIndexes for someTagLevelsRequired. If it's not empty, we push SOME_TAG_LEVELS_REQUIRED in Onyx.
    // Otherwise, we put TAG_OUT_OF_POLICY in Onyx (when applicable)
    const errorIndexes = [];
    for (let i = 0; i < policyTagKeys.length; i++) {
        const isTagRequired = policyTagList[policyTagKeys[i]].required ?? true;
        const isTagSelected = !!selectedTags.at(i);
        if (isTagRequired && (!isTagSelected || (selectedTags.length === 1 && selectedTags.at(0) === ''))) {
            errorIndexes.push(i);
        }
    }
    if (errorIndexes.length !== 0) {
        newTransactionViolations.push({
            name: CONST_1.default.VIOLATIONS.SOME_TAG_LEVELS_REQUIRED,
            type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
            data: {
                errorIndexes,
            },
        });
    }
    else {
        let hasInvalidTag = false;
        for (let i = 0; i < policyTagKeys.length; i++) {
            const selectedTag = selectedTags.at(i);
            const tags = policyTagList[policyTagKeys[i]].tags;
            const isTagInPolicy = Object.values(tags).some((tag) => tag.name === selectedTag && !!tag.enabled);
            if (!isTagInPolicy && selectedTag) {
                newTransactionViolations.push({
                    name: CONST_1.default.VIOLATIONS.TAG_OUT_OF_POLICY,
                    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
                    data: {
                        tagName: policyTagKeys.at(i),
                    },
                });
                hasInvalidTag = true;
                break;
            }
        }
        if (!hasInvalidTag) {
            newTransactionViolations = (0, reject_1.default)(newTransactionViolations, {
                name: CONST_1.default.VIOLATIONS.TAG_OUT_OF_POLICY,
            });
        }
    }
    return newTransactionViolations;
}
/**
 * Calculates tag violations for a transaction on a policy with multi level tags
 */
function getTagViolationsForMultiLevelTags(updatedTransaction, transactionViolations, policyTagList, hasDependentTags) {
    const tagViolations = [
        CONST_1.default.VIOLATIONS.SOME_TAG_LEVELS_REQUIRED,
        CONST_1.default.VIOLATIONS.TAG_OUT_OF_POLICY,
        CONST_1.default.VIOLATIONS.MISSING_TAG,
        CONST_1.default.VIOLATIONS.ALL_TAG_LEVELS_REQUIRED,
    ];
    const filteredTransactionViolations = transactionViolations.filter((violation) => !tagViolations.includes(violation.name));
    if (hasDependentTags) {
        return getTagViolationsForDependentTags(policyTagList, filteredTransactionViolations, updatedTransaction.tag ?? '');
    }
    return getTagViolationForIndependentTags(policyTagList, filteredTransactionViolations, updatedTransaction);
}
/**
 * Returns a period-separated string of violation messages for missing tag levels in a multi-level tag, based on error indexes.
 */
function getTagViolationMessagesForMultiLevelTags(tagName, errorIndexes, tags, translate) {
    if ((0, isEmpty_1.default)(errorIndexes) || (0, isEmpty_1.default)(tags)) {
        return translate('violations.someTagLevelsRequired', { tagName });
    }
    const tagsWithIndexes = (0, keyBy_1.default)(Object.values(tags), 'orderWeight');
    return errorIndexes.map((i) => translate('violations.someTagLevelsRequired', { tagName: tagsWithIndexes[i]?.name })).join('. ');
}
/**
 * Extracts unique error messages from errors and actions
 */
function extractErrorMessages(errors, errorActions, translate) {
    const uniqueMessages = new Set();
    // Combine transaction and action errors
    let allErrors = { ...errors };
    errorActions.forEach((action) => {
        if (!action.errors) {
            return;
        }
        allErrors = { ...allErrors, ...action.errors };
    });
    // Extract error messages
    Object.values(allErrors).forEach((errorValue) => {
        if (!errorValue) {
            return;
        }
        if (typeof errorValue === 'string') {
            uniqueMessages.add(errorValue);
        }
        else if ((0, ErrorUtils_1.isReceiptError)(errorValue)) {
            uniqueMessages.add(translate('iou.error.receiptFailureMessageShort'));
        }
        else {
            Object.values(errorValue).forEach((nestedErrorValue) => {
                if (!nestedErrorValue) {
                    return;
                }
                uniqueMessages.add(nestedErrorValue);
            });
        }
    });
    return Array.from(uniqueMessages);
}
const ViolationsUtils = {
    /**
     * Checks a transaction for policy violations and returns an object with Onyx method, key and updated transaction
     * violations.
     */
    getViolationsOnyxData(updatedTransaction, transactionViolations, policy, policyTagList, policyCategories, hasDependentTags, isInvoiceTransaction) {
        const isScanning = TransactionUtils.isScanning(updatedTransaction);
        const isScanRequest = TransactionUtils.isScanRequest(updatedTransaction);
        const isPartialTransaction = TransactionUtils.isPartial(updatedTransaction);
        if (isPartialTransaction && isScanning) {
            return {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${updatedTransaction.transactionID}`,
                value: transactionViolations,
            };
        }
        let newTransactionViolations = [...transactionViolations];
        const shouldShowSmartScanFailedError = isScanRequest && updatedTransaction.receipt?.state === CONST_1.default.IOU.RECEIPT_STATE.SCAN_FAILED;
        const hasSmartScanFailedError = transactionViolations.some((violation) => violation.name === CONST_1.default.VIOLATIONS.SMARTSCAN_FAILED);
        if (shouldShowSmartScanFailedError && !hasSmartScanFailedError) {
            return {
                onyxMethod: react_native_onyx_1.default.METHOD.SET,
                key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${updatedTransaction.transactionID}`,
                value: [{ name: CONST_1.default.VIOLATIONS.SMARTSCAN_FAILED, type: CONST_1.default.VIOLATION_TYPES.WARNING, showInReview: true }],
            };
        }
        if (!shouldShowSmartScanFailedError && hasSmartScanFailedError) {
            newTransactionViolations = (0, reject_1.default)(newTransactionViolations, { name: CONST_1.default.VIOLATIONS.SMARTSCAN_FAILED });
        }
        // Calculate client-side category violations
        const policyRequiresCategories = !!policy.requiresCategory;
        if (policyRequiresCategories) {
            const hasCategoryOutOfPolicyViolation = transactionViolations.some((violation) => violation.name === 'categoryOutOfPolicy');
            const hasMissingCategoryViolation = transactionViolations.some((violation) => violation.name === 'missingCategory');
            const categoryKey = updatedTransaction.category;
            const isCategoryInPolicy = categoryKey ? policyCategories?.[categoryKey]?.enabled : false;
            // Add 'categoryOutOfPolicy' violation if category is not in policy
            if (!hasCategoryOutOfPolicyViolation && categoryKey && !isCategoryInPolicy) {
                newTransactionViolations.push({ name: 'categoryOutOfPolicy', type: CONST_1.default.VIOLATION_TYPES.VIOLATION });
            }
            // Remove 'categoryOutOfPolicy' violation if category is in policy
            if (hasCategoryOutOfPolicyViolation && updatedTransaction.category && isCategoryInPolicy) {
                newTransactionViolations = (0, reject_1.default)(newTransactionViolations, { name: 'categoryOutOfPolicy' });
            }
            // Remove 'missingCategory' violation if category is valid according to policy
            if (hasMissingCategoryViolation && isCategoryInPolicy) {
                newTransactionViolations = (0, reject_1.default)(newTransactionViolations, { name: 'missingCategory' });
            }
            // Add 'missingCategory' violation if category is required and not set
            if (!hasMissingCategoryViolation && policyRequiresCategories && !categoryKey) {
                newTransactionViolations.push({ name: 'missingCategory', type: CONST_1.default.VIOLATION_TYPES.VIOLATION, showInReview: true });
            }
        }
        // Calculate client-side tag violations
        const policyRequiresTags = !!policy.requiresTag;
        if (policyRequiresTags) {
            newTransactionViolations =
                Object.keys(policyTagList).length === 1
                    ? getTagViolationsForSingleLevelTags(updatedTransaction, newTransactionViolations, policyRequiresTags, policyTagList)
                    : getTagViolationsForMultiLevelTags(updatedTransaction, newTransactionViolations, policyTagList, hasDependentTags);
        }
        const customUnitRateID = updatedTransaction?.comment?.customUnit?.customUnitRateID;
        if (customUnitRateID && customUnitRateID.length > 0) {
            const distanceRateCustomRate = (0, PolicyUtils_1.getDistanceRateCustomUnitRate)(policy, customUnitRateID);
            if (distanceRateCustomRate) {
                newTransactionViolations = (0, reject_1.default)(newTransactionViolations, { name: CONST_1.default.VIOLATIONS.CUSTOM_UNIT_OUT_OF_POLICY });
            }
            else {
                newTransactionViolations.push({
                    name: CONST_1.default.VIOLATIONS.CUSTOM_UNIT_OUT_OF_POLICY,
                    type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
                    showInReview: true,
                });
            }
        }
        const isControlPolicy = policy.type === CONST_1.default.POLICY.TYPE.CORPORATE;
        const inputDate = new Date(updatedTransaction.modifiedCreated ?? updatedTransaction.created);
        const shouldDisplayFutureDateViolation = !isInvoiceTransaction && DateUtils_1.default.isFutureDay(inputDate) && isControlPolicy;
        const hasReceiptRequiredViolation = transactionViolations.some((violation) => violation.name === CONST_1.default.VIOLATIONS.RECEIPT_REQUIRED && violation.data);
        const hasCategoryReceiptRequiredViolation = transactionViolations.some((violation) => violation.name === CONST_1.default.VIOLATIONS.RECEIPT_REQUIRED && !violation.data);
        const hasOverLimitViolation = transactionViolations.some((violation) => violation.name === CONST_1.default.VIOLATIONS.OVER_LIMIT);
        // TODO: Uncomment when the OVER_TRIP_LIMIT violation is implemented
        // const hasOverTripLimitViolation = transactionViolations.some((violation) => violation.name === CONST.VIOLATIONS.OVER_TRIP_LIMIT);
        const hasCategoryOverLimitViolation = transactionViolations.some((violation) => violation.name === CONST_1.default.VIOLATIONS.OVER_CATEGORY_LIMIT);
        const hasMissingCommentViolation = transactionViolations.some((violation) => violation.name === CONST_1.default.VIOLATIONS.MISSING_COMMENT);
        const hasTaxOutOfPolicyViolation = transactionViolations.some((violation) => violation.name === CONST_1.default.VIOLATIONS.TAX_OUT_OF_POLICY);
        const isPolicyTrackTaxEnabled = !!policy?.tax?.trackingEnabled;
        const isTaxInPolicy = Object.keys(policy.taxRates?.taxes ?? {}).some((key) => key === updatedTransaction.taxCode);
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const amount = updatedTransaction.modifiedAmount || updatedTransaction.amount;
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const currency = updatedTransaction.modifiedCurrency || updatedTransaction.currency;
        const canCalculateAmountViolations = policy.outputCurrency === currency;
        const categoryName = updatedTransaction.category;
        const categoryMaxAmountNoReceipt = policyCategories[categoryName ?? '']?.maxAmountNoReceipt;
        const maxAmountNoReceipt = policy.maxExpenseAmountNoReceipt;
        // The category maxExpenseAmountNoReceipt and maxExpenseAmount settings override the respective policy settings.
        const shouldShowReceiptRequiredViolation = canCalculateAmountViolations &&
            !isInvoiceTransaction &&
            typeof categoryMaxAmountNoReceipt !== 'number' &&
            typeof maxAmountNoReceipt === 'number' &&
            Math.abs(amount) > maxAmountNoReceipt &&
            !TransactionUtils.hasReceipt(updatedTransaction) &&
            isControlPolicy;
        const shouldShowCategoryReceiptRequiredViolation = canCalculateAmountViolations &&
            !isInvoiceTransaction &&
            typeof categoryMaxAmountNoReceipt === 'number' &&
            Math.abs(amount) > categoryMaxAmountNoReceipt &&
            !TransactionUtils.hasReceipt(updatedTransaction) &&
            isControlPolicy;
        const overLimitAmount = policy.maxExpenseAmount;
        const categoryOverLimit = policyCategories[categoryName ?? '']?.maxExpenseAmount;
        const shouldShowOverLimitViolation = canCalculateAmountViolations &&
            !isInvoiceTransaction &&
            typeof categoryOverLimit !== 'number' &&
            typeof overLimitAmount === 'number' &&
            Math.abs(amount) > overLimitAmount &&
            isControlPolicy;
        const shouldCategoryShowOverLimitViolation = canCalculateAmountViolations && !isInvoiceTransaction && typeof categoryOverLimit === 'number' && Math.abs(amount) > categoryOverLimit && isControlPolicy;
        const shouldShowMissingComment = !isInvoiceTransaction && policyCategories?.[categoryName ?? '']?.areCommentsRequired && !updatedTransaction.comment?.comment && isControlPolicy;
        const hasFutureDateViolation = transactionViolations.some((violation) => violation.name === 'futureDate');
        // Add 'futureDate' violation if transaction date is in the future and policy type is corporate
        if (!hasFutureDateViolation && shouldDisplayFutureDateViolation) {
            newTransactionViolations.push({ name: CONST_1.default.VIOLATIONS.FUTURE_DATE, type: CONST_1.default.VIOLATION_TYPES.VIOLATION, showInReview: true });
        }
        // Remove 'futureDate' violation if transaction date is not in the future
        if (hasFutureDateViolation && !shouldDisplayFutureDateViolation) {
            newTransactionViolations = (0, reject_1.default)(newTransactionViolations, { name: CONST_1.default.VIOLATIONS.FUTURE_DATE });
        }
        if (canCalculateAmountViolations &&
            ((hasReceiptRequiredViolation && !shouldShowReceiptRequiredViolation) || (hasCategoryReceiptRequiredViolation && !shouldShowCategoryReceiptRequiredViolation))) {
            newTransactionViolations = (0, reject_1.default)(newTransactionViolations, { name: CONST_1.default.VIOLATIONS.RECEIPT_REQUIRED });
        }
        if (canCalculateAmountViolations &&
            ((!hasReceiptRequiredViolation && !!shouldShowReceiptRequiredViolation) || (!hasCategoryReceiptRequiredViolation && shouldShowCategoryReceiptRequiredViolation))) {
            newTransactionViolations.push({
                name: CONST_1.default.VIOLATIONS.RECEIPT_REQUIRED,
                data: shouldShowCategoryReceiptRequiredViolation || !policy.maxExpenseAmountNoReceipt
                    ? undefined
                    : {
                        formattedLimit: CurrencyUtils.convertToDisplayString(policy.maxExpenseAmountNoReceipt, policy.outputCurrency),
                    },
                type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
                showInReview: true,
            });
        }
        if (canCalculateAmountViolations && hasOverLimitViolation && !shouldShowOverLimitViolation) {
            newTransactionViolations = (0, reject_1.default)(newTransactionViolations, { name: CONST_1.default.VIOLATIONS.OVER_LIMIT });
        }
        if (canCalculateAmountViolations && hasCategoryOverLimitViolation && !shouldCategoryShowOverLimitViolation) {
            newTransactionViolations = (0, reject_1.default)(newTransactionViolations, { name: CONST_1.default.VIOLATIONS.OVER_CATEGORY_LIMIT });
        }
        if (canCalculateAmountViolations && ((!hasOverLimitViolation && !!shouldShowOverLimitViolation) || (!hasCategoryOverLimitViolation && shouldCategoryShowOverLimitViolation))) {
            newTransactionViolations.push({
                name: shouldCategoryShowOverLimitViolation ? CONST_1.default.VIOLATIONS.OVER_CATEGORY_LIMIT : CONST_1.default.VIOLATIONS.OVER_LIMIT,
                data: {
                    formattedLimit: CurrencyUtils.convertAmountToDisplayString(shouldCategoryShowOverLimitViolation ? categoryOverLimit : policy.maxExpenseAmount, policy.outputCurrency),
                },
                type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
                showInReview: true,
            });
        }
        // TODO: Uncomment when the OVER_TRIP_LIMIT violation is implemented
        // if (canCalculateAmountViolations && !hasOverTripLimitViolation && Math.abs(updatedTransaction.amount) < Math.abs(amount) && TransactionUtils.hasReservationList(updatedTransaction)) {
        //     newTransactionViolations.push({
        //         name: CONST.VIOLATIONS.OVER_TRIP_LIMIT,
        //         data: {
        //             formattedLimit: CurrencyUtils.convertAmountToDisplayString(updatedTransaction.amount, updatedTransaction.currency),
        //         },
        //         type: CONST.VIOLATION_TYPES.VIOLATION,
        //         showInReview: true,
        //     });
        // }
        // if (canCalculateAmountViolations && hasOverTripLimitViolation && Math.abs(updatedTransaction.amount) >= Math.abs(amount) && TransactionUtils.hasReservationList(updatedTransaction)) {
        //     newTransactionViolations = reject(newTransactionViolations, {name: CONST.VIOLATIONS.OVER_TRIP_LIMIT});
        // }
        if (!hasMissingCommentViolation && shouldShowMissingComment) {
            newTransactionViolations.push({
                name: CONST_1.default.VIOLATIONS.MISSING_COMMENT,
                type: CONST_1.default.VIOLATION_TYPES.VIOLATION,
                showInReview: true,
            });
        }
        if (hasMissingCommentViolation && !shouldShowMissingComment) {
            newTransactionViolations = (0, reject_1.default)(newTransactionViolations, { name: CONST_1.default.VIOLATIONS.MISSING_COMMENT });
        }
        if (isPolicyTrackTaxEnabled && !hasTaxOutOfPolicyViolation && !isTaxInPolicy) {
            newTransactionViolations.push({ name: CONST_1.default.VIOLATIONS.TAX_OUT_OF_POLICY, type: CONST_1.default.VIOLATION_TYPES.VIOLATION });
        }
        if (isPolicyTrackTaxEnabled && hasTaxOutOfPolicyViolation && isTaxInPolicy) {
            newTransactionViolations = (0, reject_1.default)(newTransactionViolations, { name: CONST_1.default.VIOLATIONS.TAX_OUT_OF_POLICY });
        }
        return {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: `${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${updatedTransaction.transactionID}`,
            value: newTransactionViolations,
        };
    },
    /**
     * Gets the translated message for each violation type.
     *
     * Necessary because `translate` throws a type error if you attempt to pass it a template strings, when the
     * possible values could be either translation keys that resolve to  strings or translation keys that resolve to
     * functions.
     */
    getViolationTranslation(violation, translate, canEdit = true, tags) {
        const { brokenBankConnection = false, isAdmin = false, email, isTransactionOlderThan7Days = false, member, category, formattedLimit = '', surcharge = 0, invoiceMarkup = 0, maxAge = 0, tagName, taxName, type, rterType, message = '', errorIndexes = [], } = violation.data ?? {};
        switch (violation.name) {
            case 'allTagLevelsRequired':
                return translate('violations.allTagLevelsRequired');
            case 'autoReportedRejectedExpense':
                return translate('violations.autoReportedRejectedExpense');
            case 'billableExpense':
                return translate('violations.billableExpense');
            case 'cashExpenseWithNoReceipt':
                return translate('violations.cashExpenseWithNoReceipt', { formattedLimit });
            case 'categoryOutOfPolicy':
                return translate('violations.categoryOutOfPolicy');
            case 'conversionSurcharge':
                return translate('violations.conversionSurcharge', { surcharge });
            case 'customUnitOutOfPolicy':
                return translate('violations.customUnitOutOfPolicy');
            case 'duplicatedTransaction':
                return translate('violations.duplicatedTransaction');
            case 'fieldRequired':
                return translate('violations.fieldRequired');
            case 'futureDate':
                return translate('violations.futureDate');
            case 'invoiceMarkup':
                return translate('violations.invoiceMarkup', { invoiceMarkup });
            case 'maxAge':
                return translate('violations.maxAge', { maxAge });
            case 'missingCategory':
                return translate('violations.missingCategory');
            case 'missingComment':
                return translate('violations.missingComment');
            case 'missingTag':
                return translate('violations.missingTag', { tagName });
            case 'modifiedAmount':
                return translate('violations.modifiedAmount', { type, displayPercentVariance: violation.data?.displayPercentVariance });
            case 'modifiedDate':
                return translate('violations.modifiedDate');
            case 'nonExpensiworksExpense':
                return translate('violations.nonExpensiworksExpense');
            case 'overAutoApprovalLimit':
                return translate('violations.overAutoApprovalLimit', { formattedLimit });
            case 'overCategoryLimit':
                return translate('violations.overCategoryLimit', { formattedLimit });
            case 'overLimit':
                return translate('violations.overLimit', { formattedLimit });
            case 'overTripLimit':
                return translate('violations.overTripLimit', { formattedLimit });
            case 'overLimitAttendee':
                return translate('violations.overLimitAttendee', { formattedLimit });
            case 'perDayLimit':
                return translate('violations.perDayLimit', { formattedLimit });
            case 'receiptNotSmartScanned':
                return translate('violations.receiptNotSmartScanned');
            case 'receiptRequired':
                return translate('violations.receiptRequired', { formattedLimit, category });
            case 'customRules':
                return translate('violations.customRules', { message });
            case 'rter':
                return translate('violations.rter', {
                    brokenBankConnection,
                    isAdmin,
                    email,
                    isTransactionOlderThan7Days,
                    member,
                    rterType,
                });
            case 'smartscanFailed':
                return translate('violations.smartscanFailed', { canEdit });
            case 'someTagLevelsRequired':
                return getTagViolationMessagesForMultiLevelTags(tagName, errorIndexes, tags ?? {}, translate);
            case 'tagOutOfPolicy':
                return translate('violations.tagOutOfPolicy', { tagName });
            case 'taxAmountChanged':
                return translate('violations.taxAmountChanged');
            case 'taxOutOfPolicy':
                return translate('violations.taxOutOfPolicy', { taxName });
            case 'taxRateChanged':
                return translate('violations.taxRateChanged');
            case 'taxRequired':
                return translate('violations.taxRequired');
            case 'hold':
                return translate('violations.hold');
            case CONST_1.default.VIOLATIONS.PROHIBITED_EXPENSE:
                return translate('violations.prohibitedExpense', {
                    prohibitedExpenseType: violation.data?.prohibitedExpenseRule ?? '',
                });
            case CONST_1.default.VIOLATIONS.RECEIPT_GENERATED_WITH_AI:
                return translate('violations.receiptGeneratedWithAI');
            default:
                // The interpreter should never get here because the switch cases should be exhaustive.
                // If typescript is showing an error on the assertion below it means the switch statement is out of
                // sync with the `ViolationNames` type, and one or the other needs to be updated.
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                return violation.name;
        }
    },
    // We have to use regex, because Violation limit is given in a inconvenient form: "$2,000.00"
    getViolationAmountLimit(violation) {
        return Number(violation.data?.formattedLimit?.replace(CONST_1.default.VIOLATION_LIMIT_REGEX, ''));
    },
    getRBRMessages(transaction, transactionViolations, translate, missingFieldError, transactionThreadActions, tags) {
        const errorMessages = extractErrorMessages(transaction?.errors ?? {}, transactionThreadActions?.filter((e) => !!e.errors) ?? [], translate);
        return [
            ...errorMessages,
            ...(missingFieldError ? [`${missingFieldError}.`] : []),
            // Some violations end with a period already so lets make sure the connected messages have only single period between them
            // and end with a single dot.
            ...transactionViolations.map((violation) => {
                const message = ViolationsUtils.getViolationTranslation(violation, translate, true, tags);
                if (!message) {
                    return;
                }
                const textMessage = Parser_1.default.htmlToText(message);
                return textMessage.endsWith('.') ? message : `${message}.`;
            }),
        ]
            .filter(Boolean)
            .join(' ');
    },
};
exports.default = ViolationsUtils;
