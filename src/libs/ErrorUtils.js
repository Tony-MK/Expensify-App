"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addErrorMessage = addErrorMessage;
exports.getAuthenticateErrorMessage = getAuthenticateErrorMessage;
exports.getEarliestErrorField = getEarliestErrorField;
exports.getErrorMessageWithTranslationData = getErrorMessageWithTranslationData;
exports.getErrorsWithTranslationData = getErrorsWithTranslationData;
exports.getLatestErrorField = getLatestErrorField;
exports.getLatestErrorFieldForAnyField = getLatestErrorFieldForAnyField;
exports.getLatestErrorMessage = getLatestErrorMessage;
exports.getLatestErrorMessageField = getLatestErrorMessageField;
exports.getLatestError = getLatestError;
exports.getMicroSecondOnyxErrorWithTranslationKey = getMicroSecondOnyxErrorWithTranslationKey;
exports.getMicroSecondOnyxErrorWithMessage = getMicroSecondOnyxErrorWithMessage;
exports.getMicroSecondOnyxErrorObject = getMicroSecondOnyxErrorObject;
exports.isReceiptError = isReceiptError;
exports.isTranslationKeyError = isTranslationKeyError;
exports.getMicroSecondTranslationErrorWithTranslationKey = getMicroSecondTranslationErrorWithTranslationKey;
const mapValues_1 = require("lodash/mapValues");
const CONST_1 = require("@src/CONST");
const DateUtils_1 = require("./DateUtils");
const Localize_1 = require("./Localize");
function getAuthenticateErrorMessage(response) {
    switch (response.jsonCode) {
        case CONST_1.default.JSON_CODE.UNABLE_TO_RETRY:
            return 'session.offlineMessageRetry';
        case 401:
            return 'passwordForm.error.incorrectLoginOrPassword';
        case 402:
            // If too few characters are passed as the password, the WAF will pass it to the API as an empty
            // string, which results in a 402 error from Auth.
            if (response.message === '402 Missing partnerUserSecret') {
                return 'passwordForm.error.incorrectLoginOrPassword';
            }
            return 'passwordForm.error.twoFactorAuthenticationEnabled';
        case 403:
            if (response.message === 'Invalid code') {
                return 'passwordForm.error.incorrect2fa';
            }
            return 'passwordForm.error.invalidLoginOrPassword';
        case 404:
            return 'passwordForm.error.unableToResetPassword';
        case 405:
            return 'passwordForm.error.noAccess';
        case 413:
            return 'passwordForm.error.accountLocked';
        default:
            return 'passwordForm.error.fallback';
    }
}
/**
 * Creates an error object with a timestamp (in microseconds) as the key and the translated error message as the value.
 * @param error - The translation key for the error message.
 */
function getMicroSecondOnyxErrorWithTranslationKey(error, errorKey) {
    return { [errorKey ?? DateUtils_1.default.getMicroseconds()]: (0, Localize_1.translateLocal)(error) };
}
/**
 * Creates an error object with a timestamp (in microseconds) as the key and the translation key as the value.
 * @param translationKey - The translation key for the error message.
 */
function getMicroSecondTranslationErrorWithTranslationKey(translationKey, errorKey) {
    return { [errorKey ?? DateUtils_1.default.getMicroseconds()]: { translationKey } };
}
/**
 * Creates an error object with a timestamp (in microseconds) as the key and the error message as the value.
 * @param error - The error message.
 */
function getMicroSecondOnyxErrorWithMessage(error, errorKey) {
    return { [errorKey ?? DateUtils_1.default.getMicroseconds()]: error };
}
/**
 * Method used to get an error object with microsecond as the key and an object as the value.
 * @param error - error key or message to be saved
 */
function getMicroSecondOnyxErrorObject(error, errorKey) {
    return { [errorKey ?? DateUtils_1.default.getMicroseconds()]: error };
}
// We can assume that if error is a string, it has already been translated because it is server error
function getErrorMessageWithTranslationData(error) {
    return error ?? '';
}
function getLatestErrorMessage(onyxData) {
    const errors = onyxData?.errors ?? {};
    if (Object.keys(errors).length === 0) {
        return '';
    }
    const key = Object.keys(errors).sort().reverse().at(0) ?? '';
    return getErrorMessageWithTranslationData(errors[key] ?? '');
}
function getLatestErrorMessageField(onyxData) {
    const errors = onyxData?.errors ?? {};
    if (Object.keys(errors).length === 0) {
        return {};
    }
    const key = Object.keys(errors).sort().reverse().at(0) ?? '';
    return { key: errors[key] };
}
function getLatestErrorField(onyxData, fieldName) {
    const errorsForField = onyxData?.errorFields?.[fieldName] ?? {};
    if (Object.keys(errorsForField).length === 0) {
        return {};
    }
    const key = Object.keys(errorsForField).sort().reverse().at(0) ?? '';
    return { [key]: getErrorMessageWithTranslationData(errorsForField[key]) };
}
function getEarliestErrorField(onyxData, fieldName) {
    const errorsForField = onyxData?.errorFields?.[fieldName] ?? {};
    if (Object.keys(errorsForField).length === 0) {
        return {};
    }
    const key = Object.keys(errorsForField).sort().at(0) ?? '';
    return { [key]: getErrorMessageWithTranslationData(errorsForField[key]) };
}
/**
 * Method used to get the latest error field for any field
 */
function getLatestErrorFieldForAnyField(onyxData) {
    const errorFields = onyxData?.errorFields ?? {};
    if (Object.keys(errorFields).length === 0) {
        return {};
    }
    const fieldNames = Object.keys(errorFields);
    const latestErrorFields = fieldNames.map((fieldName) => getLatestErrorField(onyxData, fieldName));
    return latestErrorFields.reduce((acc, error) => Object.assign(acc, error), {});
}
function getLatestError(errors) {
    if (!errors || Object.keys(errors).length === 0) {
        return {};
    }
    const key = Object.keys(errors).sort().reverse().at(0) ?? '';
    return { [key]: getErrorMessageWithTranslationData(errors[key]) };
}
/**
 * Method used to attach already translated message
 * @param errors - An object containing current errors in the form
 * @returns Errors in the form of {timestamp: message}
 */
function getErrorsWithTranslationData(errors) {
    if (!errors) {
        return {};
    }
    if (typeof errors === 'string') {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        return { '0': getErrorMessageWithTranslationData(errors) };
    }
    return (0, mapValues_1.default)(errors, getErrorMessageWithTranslationData);
}
/**
 * Method used to generate error message for given inputID
 * @param errors - An object containing current errors in the form
 * @param message - Message to assign to the inputID errors
 */
function addErrorMessage(errors, inputID, message) {
    if (!message || !inputID) {
        return;
    }
    const errorList = errors;
    const error = errorList[inputID];
    if (!error) {
        errorList[inputID] = message;
    }
    else if (typeof error === 'string') {
        errorList[inputID] = `${error}\n${message}`;
    }
}
/**
 * Check if the error includes a receipt.
 */
function isReceiptError(message) {
    if (typeof message === 'string') {
        return false;
    }
    if (Array.isArray(message)) {
        return false;
    }
    if (Object.keys(message).length === 0) {
        return false;
    }
    return (message?.error ?? '') === CONST_1.default.IOU.RECEIPT_ERROR;
}
/**
 * Check if the error includes a translation key.
 */
function isTranslationKeyError(message) {
    if (!message || typeof message === 'string' || Array.isArray(message)) {
        return false;
    }
    if (Object.keys(message).length !== 1) {
        return false;
    }
    return message?.translationKey !== undefined;
}
