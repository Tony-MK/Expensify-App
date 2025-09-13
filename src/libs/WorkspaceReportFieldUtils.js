"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportFieldTypeTranslationKey = getReportFieldTypeTranslationKey;
exports.getReportFieldAlternativeTextTranslationKey = getReportFieldAlternativeTextTranslationKey;
exports.validateReportFieldListValueName = validateReportFieldListValueName;
exports.generateFieldID = generateFieldID;
exports.getReportFieldInitialValue = getReportFieldInitialValue;
const CONST_1 = require("@src/CONST");
const ErrorUtils_1 = require("./ErrorUtils");
const Localize_1 = require("./Localize");
const ValidationUtils_1 = require("./ValidationUtils");
/**
 * Gets the translation key for the report field type.
 */
function getReportFieldTypeTranslationKey(reportFieldType) {
    const typeTranslationKeysStrategy = {
        [CONST_1.default.REPORT_FIELD_TYPES.TEXT]: 'workspace.reportFields.textType',
        [CONST_1.default.REPORT_FIELD_TYPES.DATE]: 'workspace.reportFields.dateType',
        [CONST_1.default.REPORT_FIELD_TYPES.LIST]: 'workspace.reportFields.dropdownType',
    };
    return typeTranslationKeysStrategy[reportFieldType];
}
/**
 * Gets the translation key for the alternative text for the report field.
 */
function getReportFieldAlternativeTextTranslationKey(reportFieldType) {
    const typeTranslationKeysStrategy = {
        [CONST_1.default.REPORT_FIELD_TYPES.TEXT]: 'workspace.reportFields.textAlternateText',
        [CONST_1.default.REPORT_FIELD_TYPES.DATE]: 'workspace.reportFields.dateAlternateText',
        [CONST_1.default.REPORT_FIELD_TYPES.LIST]: 'workspace.reportFields.dropdownAlternateText',
    };
    return typeTranslationKeysStrategy[reportFieldType];
}
/**
 * Validates the list value name.
 */
function validateReportFieldListValueName(valueName, priorValueName, listValues, inputID) {
    const errors = {};
    if (!(0, ValidationUtils_1.isRequiredFulfilled)(valueName)) {
        errors[inputID] = (0, Localize_1.translateLocal)('workspace.reportFields.listValueRequiredError');
    }
    else if (priorValueName !== valueName && listValues.some((currentValueName) => currentValueName === valueName)) {
        errors[inputID] = (0, Localize_1.translateLocal)('workspace.reportFields.existingListValueError');
    }
    else if ([...valueName].length > CONST_1.default.WORKSPACE_REPORT_FIELD_POLICY_MAX_LENGTH) {
        // Uses the spread syntax to count the number of Unicode code points instead of the number of UTF-16 code units.
        (0, ErrorUtils_1.addErrorMessage)(errors, inputID, (0, Localize_1.translateLocal)('common.error.characterLimitExceedCounter', { length: [...valueName].length, limit: CONST_1.default.WORKSPACE_REPORT_FIELD_POLICY_MAX_LENGTH }));
    }
    return errors;
}
/**
 * Generates a field ID based on the field name.
 */
function generateFieldID(name) {
    return `field_id_${name.replace(CONST_1.default.REGEX.ANY_SPACE, '_').toUpperCase()}`;
}
/**
 * Gets the initial value for a report field.
 */
function getReportFieldInitialValue(reportField) {
    if (!reportField) {
        return '';
    }
    if (reportField.type === CONST_1.default.REPORT_FIELD_TYPES.LIST) {
        return reportField.defaultValue ?? '';
    }
    if (reportField.type === CONST_1.default.REPORT_FIELD_TYPES.DATE) {
        return (0, Localize_1.translateLocal)('common.currentDate');
    }
    return reportField.value ?? reportField.defaultValue;
}
