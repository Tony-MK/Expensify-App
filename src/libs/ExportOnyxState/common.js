"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailRegex = exports.maskOnyxState = void 0;
const expensify_common_1 = require("expensify-common");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const MASKING_PATTERN = '***';
const keysToMask = [
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
const onyxKeysToRemove = [ONYXKEYS_1.default.NVP_PRIVATE_PUSH_NOTIFICATION_ID];
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
exports.emailRegex = emailRegex;
const emailMap = new Map();
const getRandomLetter = () => String.fromCharCode(97 + Math.floor(Math.random() * 26));
function getRandomString(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
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
    const match = text.match(emailRegex);
    return match ? match[0] : null; // Return the email if found, otherwise null
}
const randomizeEmail = (email) => {
    const [localPart, domain] = email.split('@');
    const [domainName, tld] = domain.split('.');
    const randomizePart = (part) => [...part].map((c) => (/[a-zA-Z0-9]/.test(c) ? getRandomLetter() : c)).join('');
    const randomLocal = randomizePart(localPart);
    const randomDomain = randomizePart(domainName);
    return `${randomLocal}@${randomDomain}.${tld}`;
};
function replaceEmailInString(text, emailReplacement) {
    return text.replace(emailRegex, emailReplacement);
}
const maskSessionDetails = (session) => {
    const allowList = ['email', 'accountID', 'loading', 'creationDate', 'errors'];
    const maskedData = {};
    Object.keys(session).forEach((key) => {
        if (allowList.includes(key)) {
            maskedData[key] = session[key];
            return;
        }
        maskedData[key] = MASKING_PATTERN;
    });
    return maskedData;
};
const maskCredentials = (credentials) => {
    const allowList = ['login', 'accountID'];
    const maskedData = {};
    Object.keys(credentials).forEach((key) => {
        if (allowList.includes(key)) {
            maskedData[key] = credentials[key];
            return;
        }
        maskedData[key] = MASKING_PATTERN;
    });
    return maskedData;
};
const maskEmail = (email) => {
    let maskedEmail = '';
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
const maskFragileData = (data, parentKey) => {
    if (data === null) {
        return data;
    }
    if (Array.isArray(data)) {
        return data.map((item) => {
            if (typeof item === 'string' && expensify_common_1.Str.isValidEmail(item)) {
                return maskEmail(item);
            }
            return typeof item === 'object' ? maskFragileData(item, parentKey) : item;
        });
    }
    const maskedData = {};
    Object.keys(data).forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(data, key)) {
            return;
        }
        // loginList is an object that contains emails as keys, the keys should be masked as well
        let propertyName = '';
        if (expensify_common_1.Str.isValidEmail(key)) {
            propertyName = maskEmail(key);
        }
        else {
            propertyName = key;
        }
        const value = data[propertyName];
        if (keysToMask.includes(key)) {
            if (Array.isArray(value)) {
                maskedData[key] = value.map(() => MASKING_PATTERN);
            }
            else {
                maskedData[key] = maskValuePreservingLength(value);
            }
        }
        else if (typeof value === 'string' && expensify_common_1.Str.isValidEmail(value)) {
            maskedData[propertyName] = maskEmail(value);
        }
        else if (typeof value === 'string' && stringContainsEmail(value)) {
            maskedData[propertyName] = replaceEmailInString(value, maskEmail(extractEmail(value) ?? ''));
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
const removePrivateOnyxKeys = (onyxState) => {
    const newState = {};
    Object.keys(onyxState).forEach((key) => {
        if (onyxKeysToRemove.includes(key)) {
            return;
        }
        newState[key] = onyxState[key];
    });
    return newState;
};
const maskOnyxState = (data, isMaskingFragileDataEnabled) => {
    let onyxState = data;
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
