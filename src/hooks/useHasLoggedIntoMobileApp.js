"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
/**
 * Returns whether the user has ever logged into one of the Expensify mobile apps (iOS or Android),
 * along with a flag indicating if the login data has finished loading.
 */
const useHasLoggedIntoMobileApp = () => {
    const [lastECashIOSLogin, lastECashIOSLoginResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_ECASH_IOS_LOGIN, { canBeMissing: true });
    const [lastECashAndroidLogin, lastECashAndroidLoginResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_ECASH_ANDROID_LOGIN, { canBeMissing: true });
    const [lastiPhoneLogin, lastiPhoneLoginResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_IPHONE_LOGIN, { canBeMissing: true });
    const [lastAndroidLogin, lastAndroidLoginResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_ANDROID_LOGIN, { canBeMissing: true });
    const hasLoggedIntoMobileApp = !!lastECashIOSLogin || !!lastECashAndroidLogin || !!lastiPhoneLogin || !!lastAndroidLogin;
    const isLastMobileAppLoginLoaded = lastECashIOSLoginResult.status !== 'loading' &&
        lastECashAndroidLoginResult.status !== 'loading' &&
        lastiPhoneLoginResult.status !== 'loading' &&
        lastAndroidLoginResult.status !== 'loading';
    return { hasLoggedIntoMobileApp, isLastMobileAppLoginLoaded };
};
exports.default = useHasLoggedIntoMobileApp;
