"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const connections_1 = require("@libs/actions/connections");
const QuickbooksOnline_1 = require("@libs/actions/connections/QuickbooksOnline");
const PaymentMethods_1 = require("@libs/actions/PaymentMethods");
const CardUtils_1 = require("@libs/CardUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const UserUtils_1 = require("@libs/UserUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
const useTheme_1 = require("./useTheme");
function useIndicatorStatus() {
    const theme = (0, useTheme_1.default)();
    const [allConnectionSyncProgresses] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS, { canBeMissing: true });
    const [policies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const [bankAccountList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true });
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: true });
    const [fundList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FUND_LIST, { canBeMissing: true });
    const [userWallet] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { canBeMissing: true });
    const [walletTerms] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_TERMS, { canBeMissing: true });
    const [loginList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LOGIN_LIST, { canBeMissing: true });
    const [privatePersonalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS, { canBeMissing: true });
    const [allCards] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.CARD_LIST}`, { canBeMissing: true });
    const [stripeCustomerId] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_STRIPE_CUSTOMER_ID, { canBeMissing: true });
    const hasBrokenFeedConnection = (0, CardUtils_1.checkIfFeedConnectionIsBroken)(allCards, CONST_1.default.EXPENSIFY_CARD.BANK);
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    // If a policy was just deleted from Onyx, then Onyx will pass a null value to the props, and
    // those should be cleaned out before doing any error checking
    const cleanPolicies = (0, react_1.useMemo)(() => Object.fromEntries(Object.entries(policies ?? {}).filter(([, policy]) => policy?.id)), [policies]);
    const policyErrors = {
        [CONST_1.default.INDICATOR_STATUS.HAS_POLICY_ERRORS]: Object.values(cleanPolicies).find(PolicyUtils_1.shouldShowPolicyError),
        [CONST_1.default.INDICATOR_STATUS.HAS_CUSTOM_UNITS_ERROR]: Object.values(cleanPolicies).find(PolicyUtils_1.shouldShowCustomUnitsError),
        [CONST_1.default.INDICATOR_STATUS.HAS_EMPLOYEE_LIST_ERROR]: Object.values(cleanPolicies).find(PolicyUtils_1.shouldShowEmployeeListError),
        [CONST_1.default.INDICATOR_STATUS.HAS_SYNC_ERRORS]: Object.values(cleanPolicies).find((cleanPolicy) => (0, PolicyUtils_1.shouldShowSyncError)(cleanPolicy, (0, connections_1.isConnectionInProgress)(allConnectionSyncProgresses?.[`${ONYXKEYS_1.default.COLLECTION.POLICY_CONNECTION_SYNC_PROGRESS}${cleanPolicy?.id}`], cleanPolicy))),
        [CONST_1.default.INDICATOR_STATUS.HAS_QBO_EXPORT_ERROR]: Object.values(cleanPolicies).find(QuickbooksOnline_1.shouldShowQBOReimbursableExportDestinationAccountError),
    };
    // All of the error & info-checking methods are put into an array. This is so that using _.some() will return
    // early as soon as the first error / info condition is returned. This makes the checks very efficient since
    // we only care if a single error / info condition exists anywhere.
    const errorChecking = {
        [CONST_1.default.INDICATOR_STATUS.HAS_USER_WALLET_ERRORS]: Object.keys(userWallet?.errors ?? {}).length > 0,
        [CONST_1.default.INDICATOR_STATUS.HAS_PAYMENT_METHOD_ERROR]: (0, PaymentMethods_1.hasPaymentMethodError)(bankAccountList, fundList),
        ...Object.fromEntries(Object.entries(policyErrors).map(([error, policy]) => [error, !!policy])),
        [CONST_1.default.INDICATOR_STATUS.HAS_SUBSCRIPTION_ERRORS]: (0, SubscriptionUtils_1.hasSubscriptionRedDotError)(stripeCustomerId),
        [CONST_1.default.INDICATOR_STATUS.HAS_REIMBURSEMENT_ACCOUNT_ERRORS]: Object.keys(reimbursementAccount?.errors ?? {}).length > 0,
        [CONST_1.default.INDICATOR_STATUS.HAS_LOGIN_LIST_ERROR]: !!loginList && (0, UserUtils_1.hasLoginListError)(loginList),
        // Wallet term errors that are not caused by an IOU (we show the red brick indicator for those in the LHN instead)
        [CONST_1.default.INDICATOR_STATUS.HAS_WALLET_TERMS_ERRORS]: Object.keys(walletTerms?.errors ?? {}).length > 0 && !walletTerms?.chatReportID,
        [CONST_1.default.INDICATOR_STATUS.HAS_CARD_CONNECTION_ERROR]: hasBrokenFeedConnection,
        [CONST_1.default.INDICATOR_STATUS.HAS_PHONE_NUMBER_ERROR]: !!privatePersonalDetails?.errorFields?.phoneNumber,
    };
    const infoChecking = {
        [CONST_1.default.INDICATOR_STATUS.HAS_LOGIN_LIST_INFO]: !!loginList && (0, UserUtils_1.hasLoginListInfo)(loginList, session?.email),
        [CONST_1.default.INDICATOR_STATUS.HAS_SUBSCRIPTION_INFO]: (0, SubscriptionUtils_1.hasSubscriptionGreenDotInfo)(stripeCustomerId),
    };
    const [error] = Object.entries(errorChecking).find(([, value]) => value) ?? [];
    const [info] = Object.entries(infoChecking).find(([, value]) => value) ?? [];
    const status = (error ?? info);
    const policyIDWithErrors = Object.values(policyErrors).find(Boolean)?.id;
    const indicatorColor = error ? theme.danger : theme.success;
    return { indicatorColor, status, policyIDWithErrors };
}
exports.default = useIndicatorStatus;
