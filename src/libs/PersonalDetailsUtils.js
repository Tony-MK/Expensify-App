"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPhoneNumber = exports.getShortMentionIfFound = void 0;
exports.getDisplayNameOrDefault = getDisplayNameOrDefault;
exports.getPersonalDetailsByIDs = getPersonalDetailsByIDs;
exports.getPersonalDetailByEmail = getPersonalDetailByEmail;
exports.getAccountIDsByLogins = getAccountIDsByLogins;
exports.getLoginsByAccountIDs = getLoginsByAccountIDs;
exports.getPersonalDetailsOnyxDataForOptimisticUsers = getPersonalDetailsOnyxDataForOptimisticUsers;
exports.getCurrentAddress = getCurrentAddress;
exports.getFormattedAddress = getFormattedAddress;
exports.getFormattedStreet = getFormattedStreet;
exports.getStreetLines = getStreetLines;
exports.getEffectiveDisplayName = getEffectiveDisplayName;
exports.createDisplayName = createDisplayName;
exports.extractFirstAndLastNameFromAvailableDetails = extractFirstAndLastNameFromAvailableDetails;
exports.getNewAccountIDsAndLogins = getNewAccountIDsAndLogins;
exports.getUserNameByEmail = getUserNameByEmail;
exports.getLoginByAccountID = getLoginByAccountID;
const expensify_common_1 = require("expensify-common");
const react_native_onyx_1 = require("react-native-onyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const Localize_1 = require("./Localize");
const LoginUtils_1 = require("./LoginUtils");
const PhoneNumber_1 = require("./PhoneNumber");
const UserUtils_1 = require("./UserUtils");
let personalDetails = [];
let allPersonalDetails = {};
let emailToPersonalDetailsCache = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
    callback: (val) => {
        personalDetails = Object.values(val ?? {});
        allPersonalDetails = val;
        emailToPersonalDetailsCache = personalDetails.reduce((acc, detail) => {
            if (detail?.login) {
                acc[detail.login.toLowerCase()] = detail;
            }
            return acc;
        }, {});
    },
});
let hiddenTranslation = '';
let youTranslation = '';
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.ARE_TRANSLATIONS_LOADING,
    initWithStoredValues: false,
    callback: (value) => {
        if (value ?? true) {
            return;
        }
        hiddenTranslation = (0, Localize_1.translateLocal)('common.hidden');
        youTranslation = (0, Localize_1.translateLocal)('common.you').toLowerCase();
    },
});
const regexMergedAccount = new RegExp(CONST_1.default.REGEX.MERGED_ACCOUNT_PREFIX);
function getDisplayNameOrDefault(passedPersonalDetails, defaultValue = '', shouldFallbackToHidden = true, shouldAddCurrentUserPostfix = false, youAfterTranslation = youTranslation) {
    let displayName = passedPersonalDetails?.displayName ?? '';
    let login = passedPersonalDetails?.login ?? '';
    // If the displayName starts with the merged account prefix, remove it.
    if (regexMergedAccount.test(displayName)) {
        // Remove the merged account prefix from the displayName.
        displayName = displayName.replace(CONST_1.default.REGEX.MERGED_ACCOUNT_PREFIX, '');
    }
    // If the displayName is not set by the user, the backend sets the displayName same as the login so
    // we need to remove the sms domain from the displayName if it is an sms login.
    if (expensify_common_1.Str.isSMSLogin(login)) {
        if (displayName === login) {
            displayName = expensify_common_1.Str.removeSMSDomain(displayName);
        }
        login = expensify_common_1.Str.removeSMSDomain(login);
    }
    if (shouldAddCurrentUserPostfix && !!displayName) {
        displayName = `${displayName} (${youAfterTranslation})`;
    }
    if (passedPersonalDetails?.accountID === CONST_1.default.ACCOUNT_ID.CONCIERGE) {
        displayName = CONST_1.default.CONCIERGE_DISPLAY_NAME;
    }
    if (displayName) {
        return displayName;
    }
    if (defaultValue) {
        return defaultValue;
    }
    if (login) {
        return login;
    }
    return shouldFallbackToHidden ? hiddenTranslation : '';
}
/**
 * Given a list of account IDs (as number) it will return an array of personal details objects.
 * @param accountIDs  - Array of accountIDs
 * @param currentUserAccountID
 * @param shouldChangeUserDisplayName - It will replace the current user's personal detail object's displayName with 'You'.
 * @returns - Array of personal detail objects
 */
function getPersonalDetailsByIDs({ accountIDs, currentUserAccountID, shouldChangeUserDisplayName = false, personalDetailsParam = allPersonalDetails, }) {
    const result = accountIDs
        .filter((accountID) => !!personalDetailsParam?.[accountID])
        .map((accountID) => {
        const detail = (personalDetailsParam?.[accountID] ?? {});
        if (shouldChangeUserDisplayName && currentUserAccountID === detail.accountID) {
            return {
                ...detail,
                displayName: (0, Localize_1.translateLocal)('common.you'),
            };
        }
        return detail;
    });
    return result;
}
function getPersonalDetailByEmail(email) {
    return emailToPersonalDetailsCache[email.toLowerCase()];
}
/**
 * Given a list of logins, find the associated personal detail and return related accountIDs.
 *
 * @param logins Array of user logins
 * @returns Array of accountIDs according to passed logins
 */
function getAccountIDsByLogins(logins) {
    return logins.reduce((foundAccountIDs, login) => {
        const currentDetail = personalDetails.find((detail) => detail?.login === login?.toLowerCase());
        if (!currentDetail) {
            // generate an account ID because in this case the detail is probably new, so we don't have a real accountID yet
            foundAccountIDs.push((0, UserUtils_1.generateAccountID)(login));
        }
        else {
            foundAccountIDs.push(Number(currentDetail.accountID));
        }
        return foundAccountIDs;
    }, []);
}
/**
 * Given an accountID, find the associated personal detail and return related login.
 *
 * @param accountID User accountID
 * @returns Login according to passed accountID
 */
function getLoginByAccountID(accountID) {
    return allPersonalDetails?.[accountID]?.login;
}
/**
 * Given a list of accountIDs, find the associated personal detail and return related logins.
 *
 * @param accountIDs Array of user accountIDs
 * @returns Array of logins according to passed accountIDs
 */
function getLoginsByAccountIDs(accountIDs) {
    return accountIDs.reduce((foundLogins, accountID) => {
        const currentLogin = getLoginByAccountID(accountID);
        if (currentLogin) {
            foundLogins.push(currentLogin);
        }
        return foundLogins;
    }, []);
}
/**
 * Provided a set of invited logins and optimistic accountIDs. Returns the ones which are not known to the user i.e. they do not exist in the personalDetailsList.
 */
function getNewAccountIDsAndLogins(logins, accountIDs) {
    const newAccountIDs = [];
    const newLogins = [];
    logins.forEach((login, index) => {
        const accountID = accountIDs.at(index) ?? -1;
        if ((0, EmptyObject_1.isEmptyObject)(allPersonalDetails?.[accountID])) {
            newAccountIDs.push(accountID);
            newLogins.push(login);
        }
    });
    return { newAccountIDs, newLogins };
}
/**
 * Given a list of logins and accountIDs, return Onyx data for users with no existing personal details stored. These users might be brand new or unknown.
 * They will have an "optimistic" accountID that must be cleaned up later.
 */
function getPersonalDetailsOnyxDataForOptimisticUsers(newLogins, newAccountIDs, formatPhoneNumber) {
    const personalDetailsNew = {};
    const personalDetailsCleanup = {};
    newLogins.forEach((login, index) => {
        const accountID = newAccountIDs.at(index) ?? -1;
        personalDetailsNew[accountID] = {
            login,
            accountID,
            displayName: formatPhoneNumber(login),
            isOptimisticPersonalDetail: true,
        };
        /**
         * Cleanup the optimistic user to ensure it does not permanently persist.
         * This is done to prevent duplicate entries (upon success) since the BE will return other personal details with the correct account IDs.
         */
        personalDetailsCleanup[accountID] = null;
    });
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: personalDetailsNew,
        },
    ];
    const finallyData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
            value: personalDetailsCleanup,
        },
    ];
    return {
        optimisticData,
        finallyData,
    };
}
/**
 * Applies common formatting to each piece of an address
 *
 * @param piece - address piece to format
 * @returns - formatted piece
 */
function formatPiece(piece) {
    return piece ? `${piece}, ` : '';
}
/**
 *
 * @param street1 - street line 1
 * @param street2 - street line 2
 * @returns formatted street
 */
function getFormattedStreet(street1 = '', street2 = '') {
    return `${street1}\n${street2}`;
}
/**
 *
 * @param - formatted address
 * @returns [street1, street2]
 */
function getStreetLines(street = '') {
    const streets = street.split('\n');
    return [streets.at(0), streets.at(1)];
}
/**
 * Get the current address from addresses array
 *
 * @param privatePersonalDetails - details object
 * @returns - current address object
 */
function getCurrentAddress(privatePersonalDetails) {
    const { addresses } = privatePersonalDetails ?? {};
    const currentAddress = addresses?.find((address) => address.current);
    return currentAddress ?? addresses?.[addresses.length - 1];
}
/**
 * Formats an address object into an easily readable string
 *
 * @param privatePersonalDetails - details object
 * @returns - formatted address
 */
function getFormattedAddress(privatePersonalDetails) {
    const address = getCurrentAddress(privatePersonalDetails);
    const [street1, street2] = getStreetLines(address?.street);
    const formattedAddress = formatPiece(street1) + formatPiece(street2) + formatPiece(address?.city) + formatPiece(address?.state) + formatPiece(address?.zip) + formatPiece(address?.country);
    // Remove the last comma of the address
    return formattedAddress.trim().replace(/,$/, '');
}
/**
 * @param personalDetail - details object
 * @returns - The effective display name
 */
function getEffectiveDisplayName(formatPhoneNumber, personalDetail) {
    if (personalDetail) {
        return formatPhoneNumber(personalDetail?.login ?? '') || personalDetail.displayName;
    }
    return undefined;
}
/**
 * Creates a new displayName for a user based on passed personal details or login.
 */
function createDisplayName(login, passedPersonalDetails, formatPhoneNumber) {
    // If we have a number like +15857527441@expensify.sms then let's remove @expensify.sms and format it
    // so that the option looks cleaner in our UI.
    const userLogin = formatPhoneNumber(login);
    if (!passedPersonalDetails) {
        return userLogin;
    }
    const firstName = passedPersonalDetails.firstName ?? '';
    const lastName = passedPersonalDetails.lastName ?? '';
    const fullName = `${firstName} ${lastName}`.trim();
    // It's possible for fullName to be empty string, so we must use "||" to fallback to userLogin.
    return fullName || userLogin;
}
/**
 * Gets the first and last name from the user's personal details.
 * If the login is the same as the displayName, then they don't exist,
 * so we return empty strings instead.
 */
function extractFirstAndLastNameFromAvailableDetails({ login, displayName, firstName, lastName }) {
    // It's possible for firstName to be empty string, so we must use "||" to consider lastName instead.
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    if (firstName || lastName) {
        return { firstName: firstName ?? '', lastName: lastName ?? '' };
    }
    if (login && expensify_common_1.Str.removeSMSDomain(login) === displayName) {
        return { firstName: '', lastName: '' };
    }
    if (displayName) {
        const firstSpaceIndex = displayName.indexOf(' ');
        const lastSpaceIndex = displayName.lastIndexOf(' ');
        if (firstSpaceIndex === -1) {
            return { firstName: displayName, lastName: '' };
        }
        return {
            firstName: displayName.substring(0, firstSpaceIndex).trim(),
            lastName: displayName.substring(lastSpaceIndex).trim(),
        };
    }
    return { firstName: '', lastName: '' };
}
function getUserNameByEmail(email, nameToDisplay) {
    const userDetails = getPersonalDetailByEmail(email);
    if (userDetails) {
        return userDetails[nameToDisplay] ? userDetails[nameToDisplay] : userDetails.login;
    }
    return email;
}
const getShortMentionIfFound = (displayText, userAccountID, currentUserPersonalDetails, userLogin = '') => {
    // If the userAccountID does not exist, this is an email-based mention so the displayText must be an email.
    // If the userAccountID exists but userLogin is different from displayText, this means the displayText is either user display name, Hidden, or phone number, in which case we should return it as is.
    if (userAccountID && userLogin !== displayText) {
        return displayText;
    }
    // If the emails are not in the same private domain, we also return the displayText
    if (!(0, LoginUtils_1.areEmailsFromSamePrivateDomain)(displayText, currentUserPersonalDetails?.login ?? '')) {
        return displayText;
    }
    // Otherwise, the emails must be of the same private domain, so we should remove the domain part
    return displayText.split('@').at(0);
};
exports.getShortMentionIfFound = getShortMentionIfFound;
/**
 * Gets the phone number to display for SMS logins
 */
const getPhoneNumber = (details) => {
    const { login = '', displayName = '' } = details ?? {};
    // If the user hasn't set a displayName, it is set to their phone number
    const parsedPhoneNumber = (0, PhoneNumber_1.parsePhoneNumber)(displayName);
    if (parsedPhoneNumber.possible) {
        return parsedPhoneNumber?.number?.e164;
    }
    // If the user has set a displayName, get the phone number from the SMS login
    return login ? expensify_common_1.Str.removeSMSDomain(login) : '';
};
exports.getPhoneNumber = getPhoneNumber;
