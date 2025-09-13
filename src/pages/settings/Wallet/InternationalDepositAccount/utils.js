"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldsMap = getFieldsMap;
exports.getSubstepValues = getSubstepValues;
exports.getInitialPersonalDetailsValues = getInitialPersonalDetailsValues;
exports.getInitialSubstep = getInitialSubstep;
exports.testValidation = testValidation;
exports.getValidationErrors = getValidationErrors;
const sortBy_1 = require("lodash/sortBy");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
const CONST_1 = require("@src/CONST");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function getFieldsMap(corpayFields) {
    return (corpayFields?.formFields ?? []).reduce((acc, field) => {
        if (!field.id) {
            return acc;
        }
        if (field.id === CONST_1.default.CORPAY_FIELDS.ACCOUNT_TYPE_KEY) {
            acc[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_TYPE] = { [field.id]: field };
        }
        else if (CONST_1.default.CORPAY_FIELDS.ACCOUNT_HOLDER_FIELDS.includes(field.id)) {
            acc[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_HOLDER_INFORMATION] = acc[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_HOLDER_INFORMATION] ?? {};
            acc[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_HOLDER_INFORMATION][field.id] = field;
        }
        else if (CONST_1.default.CORPAY_FIELDS.BANK_INFORMATION_FIELDS.includes(field.id)) {
            acc[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.BANK_INFORMATION] = acc[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.BANK_INFORMATION] ?? {};
            acc[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.BANK_INFORMATION][field.id] = field;
        }
        else {
            acc[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.BANK_ACCOUNT_DETAILS] = acc[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.BANK_ACCOUNT_DETAILS] ?? {};
            acc[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.BANK_ACCOUNT_DETAILS][field.id] = field;
        }
        return acc;
    }, {});
}
function getLatestCreatedBankAccount(bankAccountList) {
    return (0, sortBy_1.default)(Object.values(bankAccountList ?? {}), 'accountData.created').pop();
}
function getSubstepValues(privatePersonalDetails, corpayFields, bankAccountList, internationalBankAccountDraft, country, fieldsMap) {
    const address = (0, PersonalDetailsUtils_1.getCurrentAddress)(privatePersonalDetails);
    const personalDetailsFieldMap = fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_HOLDER_INFORMATION];
    const { street } = address ?? {};
    const [street1, street2] = street ? street.split('\n') : [undefined, undefined];
    const firstName = privatePersonalDetails?.legalFirstName ?? '';
    const lastName = privatePersonalDetails?.legalLastName ?? '';
    const fullName = `${firstName} ${lastName}`.trim() ? `${firstName} ${lastName}`.trim() : undefined;
    const latestBankAccount = getLatestCreatedBankAccount(bankAccountList);
    return {
        ...internationalBankAccountDraft,
        bankCountry: internationalBankAccountDraft?.bankCountry ?? corpayFields?.bankCountry ?? address?.country ?? latestBankAccount?.bankCountry ?? country ?? '',
        bankCurrency: internationalBankAccountDraft?.bankCurrency ?? corpayFields?.bankCurrency,
        accountHolderName: !(0, EmptyObject_1.isEmptyObject)(personalDetailsFieldMap?.accountHolderName) ? (internationalBankAccountDraft?.accountHolderName ?? fullName) : undefined,
        accountHolderAddress1: !(0, EmptyObject_1.isEmptyObject)(personalDetailsFieldMap?.accountHolderAddress1) ? (internationalBankAccountDraft?.accountHolderAddress1 ?? street1) : undefined,
        accountHolderAddress2: !(0, EmptyObject_1.isEmptyObject)(personalDetailsFieldMap?.accountHolderAddress2) ? (internationalBankAccountDraft?.accountHolderAddress2 ?? street2) : undefined,
        accountHolderCity: !(0, EmptyObject_1.isEmptyObject)(personalDetailsFieldMap?.accountHolderCity) ? (internationalBankAccountDraft?.accountHolderCity ?? address?.city) : undefined,
        accountHolderCountry: !(0, EmptyObject_1.isEmptyObject)(personalDetailsFieldMap?.accountHolderCountry)
            ? (internationalBankAccountDraft?.accountHolderCountry ?? corpayFields?.bankCountry ?? address?.country ?? latestBankAccount?.bankCountry ?? country ?? '')
            : undefined,
        accountHolderPostal: !(0, EmptyObject_1.isEmptyObject)(personalDetailsFieldMap?.accountHolderPostal) ? (internationalBankAccountDraft?.accountHolderPostal ?? address?.zip) : undefined,
        accountHolderPhoneNumber: !(0, EmptyObject_1.isEmptyObject)(personalDetailsFieldMap?.accountHolderPhoneNumber)
            ? (internationalBankAccountDraft?.accountHolderPhoneNumber ?? privatePersonalDetails?.phoneNumber)
            : undefined,
    };
}
function getInitialPersonalDetailsValues(privatePersonalDetails) {
    const address = (0, PersonalDetailsUtils_1.getCurrentAddress)(privatePersonalDetails);
    const { street } = address ?? {};
    const [street1, street2] = street ? street.split('\n') : [undefined, undefined];
    const firstName = privatePersonalDetails?.legalFirstName ?? '';
    const lastName = privatePersonalDetails?.legalLastName ?? '';
    const fullName = `${firstName} ${lastName}`.trim();
    return {
        accountHolderName: fullName,
        accountHolderAddress1: street1 ?? '',
        accountHolderAddress2: street2 ?? '',
        accountHolderCity: address?.city ?? '',
        accountHolderCountry: address?.country ?? '',
        accountHolderPostal: address?.zip ?? '',
        accountHolderPhoneNumber: privatePersonalDetails?.phoneNumber ?? '',
    };
}
function testValidation(values, fieldsMap = {}) {
    for (const fieldName in fieldsMap) {
        if (!fieldName) {
            continue;
        }
        if (fieldsMap[fieldName].isRequired && (values[fieldName] ?? '') === '') {
            return false;
        }
        for (const rule of fieldsMap[fieldName].validationRules) {
            const regExpCheck = new RegExp(rule.regEx);
            if (!regExpCheck.test(values[fieldName] ?? '')) {
                return false;
            }
        }
    }
    return true;
}
function getInitialSubstep(values, fieldsMap) {
    if (values.bankCountry === '' || (0, EmptyObject_1.isEmptyObject)(fieldsMap)) {
        return CONST_1.default.CORPAY_FIELDS.INDEXES.MAPPING.COUNTRY_SELECTOR;
    }
    if (values.bankCurrency === '' || !testValidation(values, fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.BANK_ACCOUNT_DETAILS])) {
        return CONST_1.default.CORPAY_FIELDS.INDEXES.MAPPING.BANK_ACCOUNT_DETAILS;
    }
    if (!testValidation(values, fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_TYPE])) {
        return CONST_1.default.CORPAY_FIELDS.INDEXES.MAPPING.ACCOUNT_TYPE;
    }
    if (!testValidation(values, fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.BANK_INFORMATION])) {
        return CONST_1.default.CORPAY_FIELDS.INDEXES.MAPPING.BANK_INFORMATION;
    }
    if (!testValidation(values, fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_HOLDER_INFORMATION])) {
        return CONST_1.default.CORPAY_FIELDS.INDEXES.MAPPING.ACCOUNT_HOLDER_INFORMATION;
    }
    return CONST_1.default.CORPAY_FIELDS.INDEXES.MAPPING.CONFIRMATION;
}
function getValidationErrors(values, fieldsMap, translate) {
    const errors = {};
    Object.entries(fieldsMap).forEach(([fieldName, field]) => {
        if (field.isRequired && values[fieldName] === '') {
            (0, ErrorUtils_1.addErrorMessage)(errors, fieldName, translate('common.error.fieldRequired'));
            return;
        }
        field.validationRules.forEach((rule) => {
            const regExpCheck = new RegExp(rule.regEx);
            if (!regExpCheck.test(values[fieldName])) {
                (0, ErrorUtils_1.addErrorMessage)(errors, fieldName, rule.errorMessage);
            }
        });
    });
    return errors;
}
