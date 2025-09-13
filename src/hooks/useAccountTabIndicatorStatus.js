"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PaymentMethods_1 = require("@libs/actions/PaymentMethods");
const CardUtils_1 = require("@libs/CardUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const UserUtils_1 = require("@libs/UserUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
const useTheme_1 = require("./useTheme");
function useAccountTabIndicatorStatus() {
    const theme = (0, useTheme_1.default)();
    const [bankAccountList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true });
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: true });
    const [fundList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FUND_LIST, { canBeMissing: true });
    const [userWallet] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { canBeMissing: true });
    const [walletTerms] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_TERMS, { canBeMissing: true });
    const [loginList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LOGIN_LIST, { canBeMissing: true });
    const [privatePersonalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS, { canBeMissing: true });
    const [allCards] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.CARD_LIST}`, { canBeMissing: true });
    const hasBrokenFeedConnection = (0, CardUtils_1.checkIfFeedConnectionIsBroken)(allCards, CONST_1.default.EXPENSIFY_CARD.BANK);
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    const [stripeCustomerId] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_STRIPE_CUSTOMER_ID, { canBeMissing: true });
    // All of the error & info-checking methods are put into an array. This is so that using _.some() will return
    // early as soon as the first error / info condition is returned. This makes the checks very efficient since
    // we only care if a single error / info condition exists anywhere.
    const errorChecking = {
        [CONST_1.default.INDICATOR_STATUS.HAS_USER_WALLET_ERRORS]: Object.keys(userWallet?.errors ?? {}).length > 0,
        [CONST_1.default.INDICATOR_STATUS.HAS_PAYMENT_METHOD_ERROR]: (0, PaymentMethods_1.hasPaymentMethodError)(bankAccountList, fundList),
        [CONST_1.default.INDICATOR_STATUS.HAS_REIMBURSEMENT_ACCOUNT_ERRORS]: Object.keys(reimbursementAccount?.errors ?? {}).length > 0,
        [CONST_1.default.INDICATOR_STATUS.HAS_LOGIN_LIST_ERROR]: !!loginList && (0, UserUtils_1.hasLoginListError)(loginList),
        // Wallet term errors that are not caused by an IOU (we show the red brick indicator for those in the LHN instead)
        [CONST_1.default.INDICATOR_STATUS.HAS_WALLET_TERMS_ERRORS]: Object.keys(walletTerms?.errors ?? {}).length > 0 && !walletTerms?.chatReportID,
        [CONST_1.default.INDICATOR_STATUS.HAS_CARD_CONNECTION_ERROR]: hasBrokenFeedConnection,
        [CONST_1.default.INDICATOR_STATUS.HAS_PHONE_NUMBER_ERROR]: !!privatePersonalDetails?.errorFields?.phoneNumber,
        [CONST_1.default.INDICATOR_STATUS.HAS_SUBSCRIPTION_ERRORS]: (0, SubscriptionUtils_1.hasSubscriptionRedDotError)(stripeCustomerId),
    };
    const infoChecking = {
        [CONST_1.default.INDICATOR_STATUS.HAS_LOGIN_LIST_INFO]: !!loginList && (0, UserUtils_1.hasLoginListInfo)(loginList, session?.email),
        [CONST_1.default.INDICATOR_STATUS.HAS_SUBSCRIPTION_INFO]: (0, SubscriptionUtils_1.hasSubscriptionGreenDotInfo)(stripeCustomerId),
    };
    const [error] = Object.entries(errorChecking).find(([, value]) => value) ?? [];
    const [info] = Object.entries(infoChecking).find(([, value]) => value) ?? [];
    const status = (error ?? info);
    const indicatorColor = error ? theme.danger : theme.success;
    return { indicatorColor, status };
}
exports.default = useAccountTabIndicatorStatus;
