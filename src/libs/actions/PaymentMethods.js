"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kycWallRef = void 0;
exports.deletePaymentCard = deletePaymentCard;
exports.addPaymentCard = addPaymentCard;
exports.openWalletPage = openWalletPage;
exports.makeDefaultPaymentMethod = makeDefaultPaymentMethod;
exports.continueSetup = continueSetup;
exports.addSubscriptionPaymentCard = addSubscriptionPaymentCard;
exports.clearPaymentCardFormErrorAndSubmit = clearPaymentCardFormErrorAndSubmit;
exports.dismissSuccessfulTransferBalancePage = dismissSuccessfulTransferBalancePage;
exports.transferWalletBalance = transferWalletBalance;
exports.resetWalletTransferData = resetWalletTransferData;
exports.saveWalletTransferAccountTypeAndID = saveWalletTransferAccountTypeAndID;
exports.saveWalletTransferMethodType = saveWalletTransferMethodType;
exports.hasPaymentMethodError = hasPaymentMethodError;
exports.updateBillingCurrency = updateBillingCurrency;
exports.clearDeletePaymentMethodError = clearDeletePaymentMethodError;
exports.clearAddPaymentMethodError = clearAddPaymentMethodError;
exports.clearWalletError = clearWalletError;
exports.setPaymentMethodCurrency = setPaymentMethodCurrency;
exports.clearPaymentCard3dsVerification = clearPaymentCard3dsVerification;
exports.clearWalletTermsError = clearWalletTermsError;
exports.verifySetupIntent = verifySetupIntent;
exports.addPaymentCardSCA = addPaymentCardSCA;
exports.setInvoicingTransferBankAccount = setInvoicingTransferBankAccount;
const react_1 = require("react");
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const CardUtils = require("@libs/CardUtils");
const GoogleTagManager_1 = require("@libs/GoogleTagManager");
const Log_1 = require("@libs/Log");
const Navigation_1 = require("@libs/Navigation/Navigation");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const AddPaymentCardForm_1 = require("@src/types/form/AddPaymentCardForm");
/**
 * Sets up a ref to an instance of the KYC Wall component.
 */
const kycWallRef = (0, react_1.createRef)();
exports.kycWallRef = kycWallRef;
/**
 * When we successfully add a payment method or pass the KYC checks we will continue with our setup action if we have one set.
 */
function continueSetup(fallbackRoute) {
    if (!kycWallRef.current?.continueAction) {
        Navigation_1.default.goBack(fallbackRoute);
        return;
    }
    // Close the screen (Add Debit Card, Add Bank Account, or Enable Payments) on success and continue with setup
    Navigation_1.default.goBack(fallbackRoute);
    kycWallRef.current.continueAction();
}
function openWalletPage() {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.IS_LOADING_PAYMENT_METHODS,
            value: true,
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.IS_LOADING_PAYMENT_METHODS,
            value: false,
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.IS_LOADING_PAYMENT_METHODS,
            value: false,
        },
    ];
    return API.read(types_1.READ_COMMANDS.OPEN_PAYMENTS_PAGE, null, {
        optimisticData,
        successData,
        failureData,
    });
}
function getMakeDefaultPaymentOnyxData(bankAccountID, fundID, previousPaymentMethod, currentPaymentMethod, isOptimisticData = true) {
    const onyxData = [
        isOptimisticData
            ? {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.USER_WALLET,
                value: {
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    walletLinkedAccountID: bankAccountID || fundID,
                    walletLinkedAccountType: bankAccountID ? CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT : CONST_1.default.PAYMENT_METHODS.DEBIT_CARD,
                    // Only clear the error if this is optimistic data. If this is failure data, we do not want to clear the error that came from the server.
                    errors: null,
                },
            }
            : {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.USER_WALLET,
                value: {
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    walletLinkedAccountID: bankAccountID || fundID,
                    walletLinkedAccountType: bankAccountID ? CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT : CONST_1.default.PAYMENT_METHODS.DEBIT_CARD,
                },
            },
    ];
    if (previousPaymentMethod?.methodID) {
        onyxData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: previousPaymentMethod.accountType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT ? ONYXKEYS_1.default.BANK_ACCOUNT_LIST : ONYXKEYS_1.default.FUND_LIST,
            value: {
                [previousPaymentMethod.methodID]: {
                    isDefault: !isOptimisticData,
                },
            },
        });
    }
    if (currentPaymentMethod?.methodID) {
        onyxData.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: currentPaymentMethod.accountType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT ? ONYXKEYS_1.default.BANK_ACCOUNT_LIST : ONYXKEYS_1.default.FUND_LIST,
            value: {
                [currentPaymentMethod.methodID]: {
                    isDefault: isOptimisticData,
                },
            },
        });
    }
    return onyxData;
}
/**
 * Sets the default bank account or debit card for an Expensify Wallet
 *
 */
function makeDefaultPaymentMethod(bankAccountID, fundID, previousPaymentMethod, currentPaymentMethod) {
    const parameters = {
        bankAccountID,
        fundID,
    };
    API.write(types_1.WRITE_COMMANDS.MAKE_DEFAULT_PAYMENT_METHOD, parameters, {
        optimisticData: getMakeDefaultPaymentOnyxData(bankAccountID, fundID, previousPaymentMethod, currentPaymentMethod, true),
        failureData: getMakeDefaultPaymentOnyxData(bankAccountID, fundID, previousPaymentMethod, currentPaymentMethod, false),
    });
}
/**
 * Calls the API to add a new card.
 *
 */
function addPaymentCard(accountID, params) {
    const cardMonth = CardUtils.getMonthFromExpirationDateString(params.expirationDate);
    const cardYear = CardUtils.getYearFromExpirationDateString(params.expirationDate);
    const parameters = {
        cardNumber: CardUtils.getMCardNumberString(params.cardNumber),
        cardYear,
        cardMonth,
        cardCVV: params.securityCode,
        addressName: params.nameOnCard,
        addressZip: params.addressZipCode,
        currency: CONST_1.default.PAYMENT_CARD_CURRENCY.USD,
        isP2PDebitCard: true,
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.ADD_PAYMENT_CARD_FORM,
            value: { isLoading: true },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.ADD_PAYMENT_CARD_FORM,
            value: { isLoading: false },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.ADD_PAYMENT_CARD_FORM,
            value: { isLoading: false },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.ADD_PAYMENT_CARD, parameters, {
        optimisticData,
        successData,
        failureData,
    });
    GoogleTagManager_1.default.publishEvent(CONST_1.default.ANALYTICS.EVENT.PAID_ADOPTION, accountID);
}
/**
 * Calls the API to add a new card.
 *
 */
function addSubscriptionPaymentCard(accountID, cardData) {
    const { cardNumber, cardYear, cardMonth, cardCVV, addressName, addressZip, currency } = cardData;
    const parameters = {
        cardNumber,
        cardYear,
        cardMonth,
        cardCVV,
        addressName,
        addressZip,
        currency,
        isP2PDebitCard: false,
        shouldClaimEarlyDiscountOffer: true,
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.ADD_PAYMENT_CARD_FORM,
            value: { isLoading: true },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.ADD_PAYMENT_CARD_FORM,
            value: { isLoading: false },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.ADD_PAYMENT_CARD_FORM,
            value: { isLoading: false },
        },
    ];
    if (CONST_1.default.SCA_CURRENCIES.has(currency)) {
        addPaymentCardSCA(parameters, { optimisticData, successData, failureData });
    }
    else {
        // eslint-disable-next-line rulesdir/no-multiple-api-calls
        API.write(types_1.WRITE_COMMANDS.ADD_PAYMENT_CARD, parameters, {
            optimisticData,
            successData,
            failureData,
        });
    }
    if ((0, SubscriptionUtils_1.getCardForSubscriptionBilling)()) {
        Log_1.default.info(`[GTM] Not logging ${CONST_1.default.ANALYTICS.EVENT.PAID_ADOPTION} because a card was already added`);
    }
    else {
        GoogleTagManager_1.default.publishEvent(CONST_1.default.ANALYTICS.EVENT.PAID_ADOPTION, accountID);
    }
}
/**
 * Calls the API to add a new SCA (GBP or EUR) card.
 * Updates verify3dsSubscription Onyx key with a new authentication link for 3DS.
 */
function addPaymentCardSCA(params, onyxData = {}) {
    API.write(types_1.WRITE_COMMANDS.ADD_PAYMENT_CARD_SCA, params, onyxData);
}
/**
 * Resets the values for the add payment card form back to their initial states
 */
function clearPaymentCardFormErrorAndSubmit() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.FORMS.ADD_PAYMENT_CARD_FORM, {
        isLoading: false,
        errors: undefined,
        [AddPaymentCardForm_1.default.SETUP_COMPLETE]: false,
        [AddPaymentCardForm_1.default.NAME_ON_CARD]: '',
        [AddPaymentCardForm_1.default.CARD_NUMBER]: '',
        [AddPaymentCardForm_1.default.EXPIRATION_DATE]: '',
        [AddPaymentCardForm_1.default.SECURITY_CODE]: '',
        [AddPaymentCardForm_1.default.ADDRESS_STREET]: '',
        [AddPaymentCardForm_1.default.ADDRESS_ZIP_CODE]: '',
        [AddPaymentCardForm_1.default.ADDRESS_STATE]: '',
        [AddPaymentCardForm_1.default.ACCEPT_TERMS]: '',
        [AddPaymentCardForm_1.default.CURRENCY]: CONST_1.default.PAYMENT_CARD_CURRENCY.USD,
    });
}
/**
 * Clear 3ds flow - when verification will be finished
 *
 */
function clearPaymentCard3dsVerification() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.VERIFY_3DS_SUBSCRIPTION, '');
}
/**
 * Properly updates the nvp_privateStripeCustomerID onyx data for 3DS payment
 *
 */
function verifySetupIntent(accountID, isVerifying = true) {
    API.write(types_1.WRITE_COMMANDS.VERIFY_SETUP_INTENT, { accountID, isVerifying });
}
/**
 * Set currency for payments
 *
 */
function setPaymentMethodCurrency(currency) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.FORMS.ADD_PAYMENT_CARD_FORM, {
        [AddPaymentCardForm_1.default.CURRENCY]: currency,
    });
}
/**
 * Call the API to transfer wallet balance.
 *
 */
function transferWalletBalance(paymentMethod) {
    const paymentMethodIDKey = paymentMethod.accountType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT ? CONST_1.default.PAYMENT_METHOD_ID_KEYS.BANK_ACCOUNT : CONST_1.default.PAYMENT_METHOD_ID_KEYS.DEBIT_CARD;
    const parameters = {
        [paymentMethodIDKey]: paymentMethod.methodID,
    };
    const optimisticData = [
        {
            onyxMethod: 'merge',
            key: ONYXKEYS_1.default.WALLET_TRANSFER,
            value: {
                loading: true,
                errors: null,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: 'merge',
            key: ONYXKEYS_1.default.WALLET_TRANSFER,
            value: {
                loading: false,
                shouldShowSuccess: true,
                paymentMethodType: paymentMethod.accountType,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: 'merge',
            key: ONYXKEYS_1.default.WALLET_TRANSFER,
            value: {
                loading: false,
                shouldShowSuccess: false,
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.TRANSFER_WALLET_BALANCE, parameters, {
        optimisticData,
        successData,
        failureData,
    });
}
function resetWalletTransferData() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.WALLET_TRANSFER, {
        selectedAccountType: '',
        selectedAccountID: null,
        filterPaymentMethodType: null,
        loading: false,
        shouldShowSuccess: false,
    });
}
function saveWalletTransferAccountTypeAndID(selectedAccountType, selectedAccountID) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.WALLET_TRANSFER, { selectedAccountType, selectedAccountID });
}
/**
 * Toggles the user's selected type of payment method (bank account or debit card) on the wallet transfer balance screen.
 *
 */
function saveWalletTransferMethodType(filterPaymentMethodType) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.WALLET_TRANSFER, { filterPaymentMethodType });
}
function dismissSuccessfulTransferBalancePage() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.WALLET_TRANSFER, { shouldShowSuccess: false });
    Navigation_1.default.goBack();
}
/**
 * Looks through each payment method to see if there is an existing error
 *
 */
function hasPaymentMethodError(bankList, fundList) {
    const combinedPaymentMethods = { ...bankList, ...fundList };
    return Object.values(combinedPaymentMethods).some((item) => Object.keys(item.errors ?? {}).length);
}
/**
 * Clears the error for the specified payment item
 * @param paymentListKey The onyx key for the provided payment method
 * @param paymentMethodID
 */
function clearDeletePaymentMethodError(paymentListKey, paymentMethodID) {
    react_native_onyx_1.default.merge(paymentListKey, {
        [paymentMethodID]: {
            pendingAction: null,
            errors: null,
        },
    });
}
/**
 * If there was a failure adding a payment method, clearing it removes the payment method from the list entirely
 * @param paymentListKey The onyx key for the provided payment method
 * @param paymentMethodID
 */
function clearAddPaymentMethodError(paymentListKey, paymentMethodID) {
    react_native_onyx_1.default.merge(paymentListKey, {
        [paymentMethodID]: null,
    });
}
/**
 * Clear any error(s) related to the user's wallet
 */
function clearWalletError() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.USER_WALLET, { errors: null });
}
/**
 * Clear any error(s) related to the user's wallet terms
 */
function clearWalletTermsError() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.WALLET_TERMS, { errors: null });
}
function deletePaymentCard(fundID) {
    const parameters = {
        fundID,
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.FUND_LIST}`,
            value: { [fundID]: { pendingAction: CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE } },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.DELETE_PAYMENT_CARD, parameters, {
        optimisticData,
    });
}
/**
 * Call the API to change billing currency.
 *
 */
function updateBillingCurrency(currency, cardCVV) {
    const parameters = {
        cardCVV,
        currency,
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.CHANGE_BILLING_CURRENCY_FORM,
            value: {
                isLoading: true,
                errors: null,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.CHANGE_BILLING_CURRENCY_FORM,
            value: {
                isLoading: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.CHANGE_BILLING_CURRENCY_FORM,
            value: {
                isLoading: false,
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.UPDATE_BILLING_CARD_CURRENCY, parameters, {
        optimisticData,
        successData,
        failureData,
    });
}
/**
 *  Sets the default bank account to use for receiving payouts from
 *
 */
function setInvoicingTransferBankAccount(bankAccountID, policyID, previousBankAccountID) {
    const parameters = {
        bankAccountID,
        policyID,
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                invoice: {
                    bankAccount: {
                        transferBankAccountID: bankAccountID,
                    },
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`,
            value: {
                invoice: {
                    bankAccount: {
                        transferBankAccountID: previousBankAccountID,
                    },
                },
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.SET_INVOICING_TRANSFER_BANK_ACCOUNT, parameters, {
        optimisticData,
        failureData,
    });
}
