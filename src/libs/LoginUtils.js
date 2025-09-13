"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPhoneNumberWithoutSpecialChars = getPhoneNumberWithoutSpecialChars;
exports.appendCountryCode = appendCountryCode;
exports.appendCountryCodeWithCountryCode = appendCountryCodeWithCountryCode;
exports.isEmailPublicDomain = isEmailPublicDomain;
exports.validateNumber = validateNumber;
exports.getPhoneLogin = getPhoneLogin;
exports.areEmailsFromSamePrivateDomain = areEmailsFromSamePrivateDomain;
exports.postSAMLLogin = postSAMLLogin;
exports.handleSAMLLoginError = handleSAMLLoginError;
exports.formatE164PhoneNumber = formatE164PhoneNumber;
var expensify_common_1 = require("expensify-common");
var react_native_onyx_1 = require("react-native-onyx");
var CONFIG_1 = require("@src/CONFIG");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var Session_1 = require("./actions/Session");
var Navigation_1 = require("./Navigation/Navigation");
var PhoneNumber_1 = require("./PhoneNumber");
var countryCodeByIPOnyx;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COUNTRY_CODE,
    callback: function (val) { return (countryCodeByIPOnyx = val !== null && val !== void 0 ? val : 1); },
});
/**
 * Remove the special chars from the phone number
 */
function getPhoneNumberWithoutSpecialChars(phone) {
    return phone.replace(CONST_1.default.REGEX.SPECIAL_CHARS_WITHOUT_NEWLINE, '');
}
/**
 * Append user country code to the phone number
 */
function appendCountryCode(phone) {
    if (phone.startsWith('+')) {
        return phone;
    }
    var phoneWithCountryCode = "+".concat(countryCodeByIPOnyx).concat(phone);
    if ((0, PhoneNumber_1.parsePhoneNumber)(phoneWithCountryCode).possible) {
        return phoneWithCountryCode;
    }
    return "+".concat(phone);
}
/**
 * MIGRATION STEP 1: Temporary function for transitioning away from Onyx.connect to useOnyx
 *
 * This function serves as a bridge during our migration from Onyx.connect to useOnyx hooks.
 * The main appendCountryCode() function currently uses countryCodeByIPOnyx (via Onyx.connect),
 * but UI components need to use useOnyx hooks for better React integration.
 *
 * Migration plan:
 * 1. Add this function with explicit countryCode parameter (current step)
 * 2. Update UI components to use useOnyx(ONYXKEYS.COUNTRY_CODE)
 * 3. Update UI components to call this function with explicit countryCode
 * 4. Remove Onyx.connect from main appendCountryCode function
 * 5. Remove this temporary function and update all calls to use main function
 *
 * @param phone - Phone number to append country code to
 * @param countryCode - Country code (e.g., "1" for US, "44" for UK)
 * @returns Phone number with country code appended
 *
 * TODO: Remove this function after completing Onyx.connect deprecation (issue #66329)
 */
function appendCountryCodeWithCountryCode(phone, countryCode) {
    if (phone.startsWith('+')) {
        return phone;
    }
    var phoneWithCountryCode = "+".concat(countryCode).concat(phone);
    if ((0, PhoneNumber_1.parsePhoneNumber)(phoneWithCountryCode).possible) {
        return phoneWithCountryCode;
    }
    return "+".concat(phone);
}
/**
 * Check email is public domain or not
 */
function isEmailPublicDomain(email) {
    var emailDomain = expensify_common_1.Str.extractEmailDomain(email).toLowerCase();
    return expensify_common_1.PUBLIC_DOMAINS_SET.has(emailDomain);
}
/**
 * Check if number is valid
 * @returns a valid phone number formatted
 */
function validateNumber(values) {
    var _a;
    var parsedPhoneNumber = (0, PhoneNumber_1.parsePhoneNumber)(values);
    if (parsedPhoneNumber.possible && expensify_common_1.Str.isValidE164Phone(values.slice(0))) {
        return "".concat((_a = parsedPhoneNumber.number) === null || _a === void 0 ? void 0 : _a.e164).concat(CONST_1.default.SMS.DOMAIN);
    }
    return '';
}
/**
 * Check number is valid and attach country code
 * @returns a valid phone number with country code
 */
function getPhoneLogin(partnerUserID) {
    if (partnerUserID.length === 0) {
        return '';
    }
    return appendCountryCode(getPhoneNumberWithoutSpecialChars(partnerUserID));
}
/**
 * Check whether 2 emails have the same private domain
 */
function areEmailsFromSamePrivateDomain(email1, email2) {
    if (isEmailPublicDomain(email1) || isEmailPublicDomain(email2)) {
        return false;
    }
    return expensify_common_1.Str.extractEmailDomain(email1).toLowerCase() === expensify_common_1.Str.extractEmailDomain(email2).toLowerCase();
}
function postSAMLLogin(body) {
    return fetch(CONFIG_1.default.EXPENSIFY.SAML_URL, {
        method: CONST_1.default.NETWORK.METHOD.POST,
        body: body,
        credentials: 'omit',
    }).then(function (response) {
        if (!response.ok) {
            throw new Error('An error occurred while logging in. Please try again');
        }
        return response.json();
    });
}
function handleSAMLLoginError(errorMessage, shouldClearSignInData) {
    if (shouldClearSignInData) {
        (0, Session_1.clearSignInData)();
    }
    (0, Session_1.setAccountError)(errorMessage);
    Navigation_1.default.goBack(ROUTES_1.default.HOME);
}
function formatE164PhoneNumber(phoneNumber) {
    var _a;
    var phoneNumberWithCountryCode = appendCountryCode(phoneNumber);
    var parsedPhoneNumber = (0, PhoneNumber_1.parsePhoneNumber)(phoneNumberWithCountryCode);
    return (_a = parsedPhoneNumber.number) === null || _a === void 0 ? void 0 : _a.e164;
}
