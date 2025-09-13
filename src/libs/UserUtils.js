"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccountID = generateAccountID;
exports.getAvatar = getAvatar;
exports.getAvatarUrl = getAvatarUrl;
exports.getDefaultAvatarURL = getDefaultAvatarURL;
exports.getFullSizeAvatar = getFullSizeAvatar;
exports.getLoginListBrickRoadIndicator = getLoginListBrickRoadIndicator;
exports.getProfilePageBrickRoadIndicator = getProfilePageBrickRoadIndicator;
exports.getSecondaryPhoneLogin = getSecondaryPhoneLogin;
exports.getSmallSizeAvatar = getSmallSizeAvatar;
exports.hasLoginListError = hasLoginListError;
exports.hasLoginListInfo = hasLoginListInfo;
exports.hashText = hashText;
exports.isDefaultAvatar = isDefaultAvatar;
exports.getContactMethod = getContactMethod;
exports.isCurrentUserValidated = isCurrentUserValidated;
var expensify_common_1 = require("expensify-common");
var defaultAvatars = require("@components/Icon/DefaultAvatars");
var Expensicons_1 = require("@components/Icon/Expensicons");
var CONST_1 = require("@src/CONST");
var EmptyObject_1 = require("@src/types/utils/EmptyObject");
var hashCode_1 = require("./hashCode");
/**
 * Searches through given loginList for any contact method / login with an error.
 *
 * Example that should return false:
 * {{
 *      test@test.com: {
 *          errorFields: {
 *              validateCodeSent: null
 *          }
 *      }
 * }}
 *
 * Example that should return true:
 * {{
 *      test@test.com: {
 *          errorFields: {
 *              validateCodeSent: { 18092081290: 'An error' }
 *          }
 *      }
 * }}
 */
function hasLoginListError(loginList) {
    return Object.values(loginList !== null && loginList !== void 0 ? loginList : {}).some(function (loginData) { var _a; return Object.values((_a = loginData.errorFields) !== null && _a !== void 0 ? _a : {}).some(function (field) { return Object.keys(field !== null && field !== void 0 ? field : {}).length > 0; }); });
}
/**
 * Searches through given loginList for any contact method / login that requires
 * an Info brick road status indicator. Currently this only applies if the user
 * has an unvalidated contact method.
 */
function hasLoginListInfo(loginList, email) {
    return Object.values(loginList !== null && loginList !== void 0 ? loginList : {}).some(function (login) { return email !== login.partnerUserID && !login.validatedDate; });
}
/**
 * Checks if the current user has a validated the primary contact method
 */
function isCurrentUserValidated(loginList, email) {
    var _a;
    if (!loginList || !email) {
        return false;
    }
    return !!((_a = loginList === null || loginList === void 0 ? void 0 : loginList[email]) === null || _a === void 0 ? void 0 : _a.validatedDate);
}
/**
 * Gets the appropriate brick road indicator status for a given loginList.
 * Error status is higher priority, so we check for that first.
 */
function getLoginListBrickRoadIndicator(loginList, email) {
    if (hasLoginListError(loginList)) {
        return CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR;
    }
    if (hasLoginListInfo(loginList, email)) {
        return CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.INFO;
    }
    return undefined;
}
/**
 * Gets the appropriate brick road indicator status for the Profile section.
 * Error status is higher priority, so we check for that first.
 */
function getProfilePageBrickRoadIndicator(loginList, privatePersonalDetails, vacationDelegate, email) {
    var _a;
    var hasPhoneNumberError = !!((_a = privatePersonalDetails === null || privatePersonalDetails === void 0 ? void 0 : privatePersonalDetails.errorFields) === null || _a === void 0 ? void 0 : _a.phoneNumber);
    if (hasLoginListError(loginList) || hasPhoneNumberError || !(0, EmptyObject_1.isEmptyObject)(vacationDelegate === null || vacationDelegate === void 0 ? void 0 : vacationDelegate.errors)) {
        return CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR;
    }
    if (hasLoginListInfo(loginList, email)) {
        return CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.INFO;
    }
    return undefined;
}
/**
 * Hashes provided string and returns a value between [0, range)
 */
function hashText(text, range) {
    return Math.abs((0, hashCode_1.default)(text.toLowerCase())) % range;
}
/**
 * Generate a random accountID base on searchValue.
 */
function generateAccountID(searchValue) {
    return hashText(searchValue, Math.pow(2, 32));
}
function getAccountIDHashBucket(accountID, avatarURL) {
    // There are 24 possible default avatars, so we choose which one this user has based
    // on a simple modulo operation of their login number. Note that Avatar count starts at 1.
    if (accountID === void 0) { accountID = -1; }
    // When creating a chat the backend response will return the actual user ID.
    // But the avatar link still corresponds to the original ID-generated link. So we extract the SVG image number from the backend's link instead of using the user ID directly
    var accountIDHashBucket;
    if (avatarURL) {
        var match = avatarURL.match(/(default-avatar_|avatar_)(\d+)(?=\.)/);
        var lastDigit = match && parseInt(match[2], 10);
        accountIDHashBucket = lastDigit;
    }
    else if (accountID > 0) {
        accountIDHashBucket = ((accountID % CONST_1.default.DEFAULT_AVATAR_COUNT) + 1);
    }
    return accountIDHashBucket;
}
/**
 * Helper method to return the default avatar associated with the given accountID
 */
function getDefaultAvatar(accountID, avatarURL) {
    if (accountID === void 0) { accountID = -1; }
    if (accountID === CONST_1.default.ACCOUNT_ID.CONCIERGE) {
        return Expensicons_1.ConciergeAvatar;
    }
    if (accountID === CONST_1.default.ACCOUNT_ID.NOTIFICATIONS) {
        return Expensicons_1.NotificationsAvatar;
    }
    var accountIDHashBucket = getAccountIDHashBucket(accountID, avatarURL);
    if (!accountIDHashBucket) {
        return;
    }
    return defaultAvatars["Avatar".concat(accountIDHashBucket)];
}
/**
 * Helper method to return default avatar URL associated with the accountID
 */
function getDefaultAvatarURL(accountID, avatarURL) {
    if (accountID === void 0) { accountID = ''; }
    if (Number(accountID) === CONST_1.default.ACCOUNT_ID.CONCIERGE) {
        return CONST_1.default.CONCIERGE_ICON_URL;
    }
    var accountIDHashBucket = getAccountIDHashBucket(Number(accountID) || -1, avatarURL);
    var avatarPrefix = "default-avatar";
    return "".concat(CONST_1.default.CLOUDFRONT_URL, "/images/avatars/").concat(avatarPrefix, "_").concat(accountIDHashBucket, ".png");
}
/**
 * * Given a user's avatar path, returns true if URL points to a default avatar, false otherwise
 * @param avatarSource - the avatar source from user's personalDetails
 */
function isDefaultAvatar(avatarSource) {
    if (typeof avatarSource === 'string') {
        if (avatarSource.includes('images/avatars/avatar_') || avatarSource.includes('images/avatars/default-avatar_') || avatarSource.includes('images/avatars/user/default')) {
            return true;
        }
        // We use a hardcoded "default" Concierge avatar
        if (avatarSource === CONST_1.default.CONCIERGE_ICON_URL_2021 || avatarSource === CONST_1.default.CONCIERGE_ICON_URL) {
            return true;
        }
    }
    return false;
}
/**
 * Provided an avatar source, if source is a default avatar, return the associated SVG.
 * Otherwise, return the URL or SVG pointing to the user-uploaded avatar.
 *
 * @param avatarSource - the avatar source from user's personalDetails
 * @param accountID - the accountID of the user
 */
function getAvatar(avatarSource, accountID) {
    return isDefaultAvatar(avatarSource) ? getDefaultAvatar(accountID, avatarSource) : avatarSource;
}
/**
 * Provided an avatar URL, if avatar is a default avatar, return NewDot default avatar URL.
 * Otherwise, return the URL pointing to a user-uploaded avatar.
 *
 * @param avatarSource - the avatar source from user's personalDetails
 * @param accountID - the accountID of the user
 */
function getAvatarUrl(avatarSource, accountID) {
    return isDefaultAvatar(avatarSource) ? getDefaultAvatarURL(accountID, avatarSource) : avatarSource;
}
/**
 * Avatars uploaded by users will have a _128 appended so that the asset server returns a small version.
 * This removes that part of the URL so the full version of the image can load.
 */
function getFullSizeAvatar(avatarSource, accountID) {
    var source = getAvatar(avatarSource, accountID);
    if (typeof source !== 'string') {
        return source;
    }
    return source.replace('_128', '');
}
/**
 * Small sized avatars end with _128.<file-type>. This adds the _128 at the end of the
 * source URL (before the file type) if it doesn't exist there already.
 */
function getSmallSizeAvatar(avatarSource, accountID) {
    var source = getAvatar(avatarSource, accountID);
    if (typeof source !== 'string') {
        return source;
    }
    // Because other urls than CloudFront do not support dynamic image sizing (_SIZE suffix), the current source is already what we want to use here.
    if (!CONST_1.default.CLOUDFRONT_DOMAIN_REGEX.test(source)) {
        return source;
    }
    // If image source already has _128 at the end, the given avatar URL is already what we want to use here.
    var lastPeriodIndex = source.lastIndexOf('.');
    if (source.substring(lastPeriodIndex - 4, lastPeriodIndex) === '_128') {
        return source;
    }
    return "".concat(source.substring(0, lastPeriodIndex), "_128").concat(source.substring(lastPeriodIndex));
}
/**
 * Gets the secondary phone login number
 */
function getSecondaryPhoneLogin(loginList) {
    var parsedLoginList = Object.keys(loginList !== null && loginList !== void 0 ? loginList : {}).map(function (login) { return expensify_common_1.Str.removeSMSDomain(login); });
    return parsedLoginList.find(function (login) { return expensify_common_1.Str.isValidE164Phone(login); });
}
/**
 * Gets the contact method
 */
function getContactMethod(primaryLogin, email) {
    var _a;
    return (_a = primaryLogin !== null && primaryLogin !== void 0 ? primaryLogin : email) !== null && _a !== void 0 ? _a : '';
}
