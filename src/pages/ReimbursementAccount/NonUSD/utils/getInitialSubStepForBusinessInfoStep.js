"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const BUSINESS_INFO_STEP_KEYS = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
function isMissingValidCompanyName(companyName) {
    return companyName === '' || !(0, ValidationUtils_1.isValidCompanyName)(companyName);
}
function isMissingValidWebsite(website) {
    return website === '' || !(0, ValidationUtils_1.isValidWebsite)(expensify_common_1.Str.sanitizeURL(website, CONST_1.default.COMPANY_WEBSITE_DEFAULT_SCHEME));
}
function isMissingValidAddress(street, city, postalCode, state, country) {
    return (street === '' ||
        city === '' ||
        postalCode === '' ||
        country === '' ||
        ((country === CONST_1.default.COUNTRY.US || country === CONST_1.default.COUNTRY.CA) && state === '') ||
        (country === '' && state === '') ||
        !(0, ValidationUtils_1.isValidAddress)(street) ||
        (country === CONST_1.default.COUNTRY.US && !(0, ValidationUtils_1.isValidZipCodeInternational)(postalCode)));
}
function isMissingValidBusinessContactInformation(contactNumber, contactEmail) {
    return contactNumber === '' || contactEmail === '' || !(0, ValidationUtils_1.isValidPhoneInternational)(contactNumber) || !(0, ValidationUtils_1.isValidEmail)(contactEmail);
}
function isMissingValidRegistrationNumber(registrationNumber, country) {
    return registrationNumber === '' || !(0, ValidationUtils_1.isValidRegistrationNumber)(registrationNumber, country);
}
function isMissingValidTaxIDEINNumber(taxIDEINNumber, country) {
    return taxIDEINNumber === '' || !(0, ValidationUtils_1.isValidTaxIDEINNumber)(taxIDEINNumber, country);
}
/**
 * Returns the initial subStep for the Business info step based on already existing data
 */
function getInitialSubStepForBusinessInfoStep(data) {
    if (isMissingValidCompanyName(data[BUSINESS_INFO_STEP_KEYS.COMPANY_NAME])) {
        return 0;
    }
    if (isMissingValidWebsite(data[BUSINESS_INFO_STEP_KEYS.COMPANY_WEBSITE])) {
        return 1;
    }
    if (isMissingValidAddress(data[BUSINESS_INFO_STEP_KEYS.COMPANY_STREET], data[BUSINESS_INFO_STEP_KEYS.COMPANY_CITY], data[BUSINESS_INFO_STEP_KEYS.COMPANY_POSTAL_CODE], data[BUSINESS_INFO_STEP_KEYS.COMPANY_STATE], data[BUSINESS_INFO_STEP_KEYS.COMPANY_COUNTRY_CODE])) {
        return 2;
    }
    if (isMissingValidBusinessContactInformation(data[BUSINESS_INFO_STEP_KEYS.BUSINESS_CONTACT_NUMBER], data[BUSINESS_INFO_STEP_KEYS.BUSINESS_CONFIRMATION_EMAIL])) {
        return 3;
    }
    if (isMissingValidRegistrationNumber(data[BUSINESS_INFO_STEP_KEYS.BUSINESS_REGISTRATION_INCORPORATION_NUMBER], data[BUSINESS_INFO_STEP_KEYS.COMPANY_COUNTRY_CODE])) {
        return 4;
    }
    if (isMissingValidTaxIDEINNumber(data[BUSINESS_INFO_STEP_KEYS.TAX_ID_EIN_NUMBER], data[BUSINESS_INFO_STEP_KEYS.COMPANY_COUNTRY_CODE])) {
        return 5;
    }
    if (data[BUSINESS_INFO_STEP_KEYS.FORMATION_INCORPORATION_COUNTRY_CODE] === '' ||
        ((data[BUSINESS_INFO_STEP_KEYS.FORMATION_INCORPORATION_COUNTRY_CODE] === CONST_1.default.COUNTRY.US ||
            data[BUSINESS_INFO_STEP_KEYS.FORMATION_INCORPORATION_COUNTRY_CODE] === CONST_1.default.COUNTRY.CA) &&
            data[BUSINESS_INFO_STEP_KEYS.FORMATION_INCORPORATION_STATE] === '')) {
        return 6;
    }
    if (data[BUSINESS_INFO_STEP_KEYS.BUSINESS_CATEGORY] === '' || data[BUSINESS_INFO_STEP_KEYS.APPLICANT_TYPE_ID] === '') {
        return 7;
    }
    if (data[BUSINESS_INFO_STEP_KEYS.ANNUAL_VOLUME] === '') {
        return 8;
    }
    if (data[BUSINESS_INFO_STEP_KEYS.TRADE_VOLUME] === '') {
        return 9;
    }
    return 10;
}
exports.default = getInitialSubStepForBusinessInfoStep;
