"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailRegex = exports.maskOnyxState = void 0;
var expensify_common_1 = require("expensify-common");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var MASKING_PATTERN = '***';
var keysToMask = [
    'addressCity',
    'addressName',
    'addressStreet',
    'addressZipCode',
    'avatar',
    'avatarURL',
    'bank',
    'cardName',
    'cardNumber',
    'city',
    'comment',
    'description',
    'displayName',
    'edits',
    'firstName',
    'lastMessageHtml',
    'lastMessageText',
    'lastName',
    'legalFirstName',
    'legalLastName',
    'merchant',
    'modifiedMerchant',
    'name',
    'oldPolicyName',
    'owner',
    'phoneNumber',
    'plaidAccessToken',
    'plaidAccountID',
    'plaidLinkToken',
    'policyAvatar',
    'policyName',
    'primaryLogin',
    'reportName',
    'routingNumber',
    'source',
    'state',
    'street',
    'validateCode',
    'zip',
    'zipCode',
];
var onyxKeysToRemove = [ONYXKEYS_1.default.NVP_PRIVATE_PUSH_NOTIFICATION_ID];
var emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
exports.emailRegex = emailRegex;
var emailMap = new Map();
var getRandomLetter = function () { return String.fromCharCode(97 + Math.floor(Math.random() * 26)); };
function getRandomString(length) {
    var result = '';
    for (var i = 0; i < length; i++) {
        result += getRandomLetter();
    }
    return result;
}
function maskValuePreservingLength(value) {
    if (typeof value !== 'string') {
        return MASKING_PATTERN;
    }
    return getRandomString(value.length);
}
function stringContainsEmail(text) {
    return emailRegex.test(text);
}
function extractEmail(text) {
    var match = text.match(emailRegex);
    return match ? match[0] : null; // Return the email if found, otherwise null
}
var randomizeEmail = function (email) {
    var _a = email.split('@'), localPart = _a[0], domain = _a[1];
    var _b = domain.split('.'), domainName = _b[0], tld = _b[1];
    var randomizePart = function (part) { return __spreadArray([], part, true).map(function (c) { return (/[a-zA-Z0-9]/.test(c) ? getRandomLetter() : c); }).join(''); };
    var randomLocal = randomizePart(localPart);
    var randomDomain = randomizePart(domainName);
    return "".concat(randomLocal, "@").concat(randomDomain, ".").concat(tld);
};
function replaceEmailInString(text, emailReplacement) {
    return text.replace(emailRegex, emailReplacement);
}
var maskSessionDetails = function (session) {
    var allowList = ['email', 'accountID', 'loading', 'creationDate', 'errors'];
    var maskedData = {};
    Object.keys(session).forEach(function (key) {
        if (allowList.includes(key)) {
            maskedData[key] = session[key];
            return;
        }
        maskedData[key] = MASKING_PATTERN;
    });
    return maskedData;
};
var maskCredentials = function (credentials) {
    var allowList = ['login', 'accountID'];
    var maskedData = {};
    Object.keys(credentials).forEach(function (key) {
        if (allowList.includes(key)) {
            maskedData[key] = credentials[key];
            return;
        }
        maskedData[key] = MASKING_PATTERN;
    });
    return maskedData;
};
var maskEmail = function (email) {
    var maskedEmail = '';
    if (!emailMap.has(email)) {
        maskedEmail = randomizeEmail(email);
        emailMap.set(email, maskedEmail);
    }
    else {
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        maskedEmail = emailMap.get(email);
    }
    return maskedEmail;
};
var maskFragileData = function (data, parentKey) {
    if (data === null) {
        return data;
    }
    if (Array.isArray(data)) {
        return data.map(function (item) {
            if (typeof item === 'string' && expensify_common_1.Str.isValidEmail(item)) {
                return maskEmail(item);
            }
            return typeof item === 'object' ? maskFragileData(item, parentKey) : item;
        });
    }
    var maskedData = {};
    Object.keys(data).forEach(function (key) {
        var _a;
        if (!Object.prototype.hasOwnProperty.call(data, key)) {
            return;
        }
        // loginList is an object that contains emails as keys, the keys should be masked as well
        var propertyName = '';
        if (expensify_common_1.Str.isValidEmail(key)) {
            propertyName = maskEmail(key);
        }
        else {
            propertyName = key;
        }
        var value = data[propertyName];
        if (keysToMask.includes(key)) {
            if (Array.isArray(value)) {
                maskedData[key] = value.map(function () { return MASKING_PATTERN; });
            }
            else {
                maskedData[key] = maskValuePreservingLength(value);
            }
        }
        else if (typeof value === 'string' && expensify_common_1.Str.isValidEmail(value)) {
            maskedData[propertyName] = maskEmail(value);
        }
        else if (typeof value === 'string' && stringContainsEmail(value)) {
            maskedData[propertyName] = replaceEmailInString(value, maskEmail((_a = extractEmail(value)) !== null && _a !== void 0 ? _a : ''));
        }
        else if (parentKey && parentKey.includes(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS) && (propertyName === 'text' || propertyName === 'html')) {
            maskedData[key] = MASKING_PATTERN;
        }
        else if (typeof value === 'object') {
            maskedData[propertyName] = maskFragileData(value, propertyName.includes(ONYXKEYS_1.default.COLLECTION.REPORT_ACTIONS) ? propertyName : parentKey);
        }
        else {
            maskedData[propertyName] = value;
        }
    });
    return maskedData;
};
var removePrivateOnyxKeys = function (onyxState) {
    var newState = {};
    Object.keys(onyxState).forEach(function (key) {
        if (onyxKeysToRemove.includes(key)) {
            return;
        }
        newState[key] = onyxState[key];
    });
    return newState;
};
var maskOnyxState = function (data, isMaskingFragileDataEnabled) {
    var onyxState = data;
    // Mask session details by default
    if (onyxState.session) {
        onyxState.session = maskSessionDetails(onyxState.session);
    }
    if (onyxState.stashedSession) {
        onyxState.stashedSession = maskSessionDetails(onyxState.stashedSession);
    }
    // Remove private/sensitive Onyx keys
    onyxState = removePrivateOnyxKeys(onyxState);
    // Mask credentials
    if (onyxState.credentials) {
        onyxState.credentials = maskCredentials(onyxState.credentials);
    }
    if (onyxState.stashedCredentials) {
        onyxState.stashedCredentials = maskCredentials(onyxState.stashedCredentials);
    }
    // Mask fragile data other than session details if the user has enabled the option
    if (isMaskingFragileDataEnabled) {
        onyxState = maskFragileData(onyxState);
    }
    emailMap.clear();
    return onyxState;
};
exports.maskOnyxState = maskOnyxState;
