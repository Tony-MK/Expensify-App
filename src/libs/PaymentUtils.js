"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSecondaryActionAPaymentOption = exports.selectPaymentType = void 0;
exports.hasExpensifyPaymentMethod = hasExpensifyPaymentMethod;
exports.getPaymentMethodDescription = getPaymentMethodDescription;
exports.formatPaymentMethods = formatPaymentMethods;
exports.calculateWalletTransferBalanceFee = calculateWalletTransferBalanceFee;
const BankIcons_1 = require("@components/Icon/BankIcons");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const BankAccounts_1 = require("./actions/BankAccounts");
const IOU_1 = require("./actions/IOU");
const Localize_1 = require("./Localize");
const BankAccount_1 = require("./models/BankAccount");
const Navigation_1 = require("./Navigation/Navigation");
const SubscriptionUtils_1 = require("./SubscriptionUtils");
/**
 * Check to see if user has either a debit card or personal US bank account added that can be used with a wallet.
 */
function hasExpensifyPaymentMethod(fundList, bankAccountList, shouldIncludeDebitCard = true) {
    const validBankAccount = Object.values(bankAccountList).some((bankAccountJSON) => {
        const bankAccount = new BankAccount_1.default(bankAccountJSON);
        return (bankAccount.getPendingAction() !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE &&
            bankAccount.isOpen() &&
            bankAccount.getType() === CONST_1.default.BANK_ACCOUNT.TYPE.PERSONAL &&
            bankAccount?.getCountry() === CONST_1.default.COUNTRY.US);
    });
    // Hide any billing cards that are not P2P debit cards for now because you cannot make them your default method, or delete them
    const validDebitCard = Object.values(fundList).some((card) => card?.accountData?.additionalData?.isP2PDebitCard ?? false);
    return validBankAccount || (shouldIncludeDebitCard && validDebitCard);
}
function getPaymentMethodDescription(accountType, account, bankCurrency) {
    if (account) {
        if (accountType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT && 'accountNumber' in account) {
            return `${bankCurrency ? `${bankCurrency} ${CONST_1.default.DOT_SEPARATOR} ` : ''}${(0, Localize_1.translateLocal)('paymentMethodList.accountLastFour')} ${account.accountNumber?.slice(-4)}`;
        }
        if (accountType === CONST_1.default.PAYMENT_METHODS.BUSINESS_BANK_ACCOUNT && 'accountNumber' in account) {
            return `${(0, Localize_1.translateLocal)('paymentMethodList.accountLastFour')} ${account.accountNumber?.slice(-4)}`;
        }
        if (accountType === CONST_1.default.PAYMENT_METHODS.DEBIT_CARD && 'cardNumber' in account) {
            return `${(0, Localize_1.translateLocal)('paymentMethodList.cardLastFour')} ${account.cardNumber?.slice(-4)}`;
        }
    }
    return '';
}
/**
 * Get the PaymentMethods list
 */
function formatPaymentMethods(bankAccountList, fundList, styles) {
    const combinedPaymentMethods = [];
    Object.values(bankAccountList).forEach((bankAccount) => {
        // Add all bank accounts besides the wallet
        if (bankAccount?.accountData?.type === CONST_1.default.BANK_ACCOUNT_TYPES.WALLET) {
            return;
        }
        const { icon, iconSize, iconHeight, iconWidth, iconStyles } = (0, BankIcons_1.default)({
            bankName: bankAccount?.accountData?.additionalData?.bankName,
            isCard: false,
            styles,
        });
        combinedPaymentMethods.push({
            ...bankAccount,
            description: getPaymentMethodDescription(bankAccount?.accountType, bankAccount.accountData, bankAccount.bankCurrency),
            icon,
            iconSize,
            iconHeight,
            iconWidth,
            iconStyles,
        });
    });
    Object.values(fundList).forEach((card) => {
        const { icon, iconSize, iconHeight, iconWidth, iconStyles } = (0, BankIcons_1.default)({ bankName: card?.accountData?.bank, isCard: true, styles });
        combinedPaymentMethods.push({
            ...card,
            description: getPaymentMethodDescription(card?.accountType, card.accountData),
            icon,
            iconSize,
            iconHeight,
            iconWidth,
            iconStyles,
        });
    });
    return combinedPaymentMethods;
}
function calculateWalletTransferBalanceFee(currentBalance, methodType) {
    const transferMethodTypeFeeStructure = methodType === CONST_1.default.WALLET.TRANSFER_METHOD_TYPE.INSTANT ? CONST_1.default.WALLET.TRANSFER_METHOD_TYPE_FEE.INSTANT : CONST_1.default.WALLET.TRANSFER_METHOD_TYPE_FEE.ACH;
    const calculateFee = Math.ceil(currentBalance * (transferMethodTypeFeeStructure.RATE / 100));
    return Math.max(calculateFee, transferMethodTypeFeeStructure.MINIMUM_FEE);
}
/**
 * Determines the appropriate payment action based on user validation and policy restrictions.
 * It navigates users to verification pages if necessary, triggers KYC flows for specific payment methods,
 * handles direct approvals, or proceeds with basic payment processing.
 */
const selectPaymentType = (event, iouPaymentType, triggerKYCFlow, policy, onPress, isUserValidated, confirmApproval, iouReport) => {
    if (policy && (0, SubscriptionUtils_1.shouldRestrictUserBillableActions)(policy.id)) {
        Navigation_1.default.navigate(ROUTES_1.default.RESTRICTED_ACTION.getRoute(policy.id));
        return;
    }
    if (iouPaymentType === CONST_1.default.IOU.PAYMENT_TYPE.EXPENSIFY || iouPaymentType === CONST_1.default.IOU.PAYMENT_TYPE.VBBA) {
        if (!isUserValidated) {
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_CONTACT_METHOD_VERIFY_ACCOUNT.getRoute(Navigation_1.default.getActiveRoute()));
            return;
        }
        triggerKYCFlow(event, iouPaymentType);
        (0, BankAccounts_1.setPersonalBankAccountContinueKYCOnSuccess)(ROUTES_1.default.ENABLE_PAYMENTS);
        return;
    }
    if (iouPaymentType === CONST_1.default.IOU.REPORT_ACTION_TYPE.APPROVE) {
        if (confirmApproval) {
            confirmApproval();
        }
        else {
            (0, IOU_1.approveMoneyRequest)(iouReport);
        }
        return;
    }
    onPress(iouPaymentType);
};
exports.selectPaymentType = selectPaymentType;
const isSecondaryActionAPaymentOption = (item) => {
    if (!('value' in item)) {
        return false;
    }
    const payment = item.value;
    const isPaymentInArray = Object.values(CONST_1.default.IOU.PAYMENT_TYPE).filter((type) => type === payment);
    return isPaymentInArray.length > 0;
};
exports.isSecondaryActionAPaymentOption = isSecondaryActionAPaymentOption;
