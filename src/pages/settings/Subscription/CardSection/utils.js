"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const DateUtils_1 = require("@libs/DateUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const CONST_1 = require("@src/CONST");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function getBillingStatus({ translate, stripeCustomerId, accountData, purchase }) {
    const cardEnding = (accountData?.cardNumber ?? '')?.slice(-4);
    const amountOwed = (0, SubscriptionUtils_1.getAmountOwed)();
    const subscriptionStatus = (0, SubscriptionUtils_1.getSubscriptionStatus)(stripeCustomerId);
    const endDate = (0, SubscriptionUtils_1.getOverdueGracePeriodDate)();
    const endDateFormatted = endDate ? DateUtils_1.default.formatWithUTCTimeZone((0, date_fns_1.fromUnixTime)(endDate).toUTCString(), CONST_1.default.DATE.MONTH_DAY_YEAR_FORMAT) : null;
    const isCurrentCardExpired = DateUtils_1.default.isCardExpired(accountData?.cardMonth ?? 0, accountData?.cardYear ?? 0);
    const purchaseAmount = purchase?.message.billableAmount;
    const purchaseCurrency = purchase?.currency;
    const purchaseDate = purchase?.created;
    const isBillingFailed = purchase?.message.billingType === CONST_1.default.BILLING.TYPE_FAILED_2018;
    const purchaseDateFormatted = purchaseDate ? DateUtils_1.default.formatWithUTCTimeZone(purchaseDate, CONST_1.default.DATE.MONTH_DAY_YEAR_FORMAT) : undefined;
    const purchaseAmountWithCurrency = (0, CurrencyUtils_1.convertAmountToDisplayString)(purchaseAmount, purchaseCurrency);
    switch (subscriptionStatus?.status) {
        case SubscriptionUtils_1.PAYMENT_STATUS.POLICY_OWNER_WITH_AMOUNT_OWED:
            return {
                title: translate('subscription.billingBanner.policyOwnerAmountOwed.title'),
                subtitle: translate('subscription.billingBanner.policyOwnerAmountOwed.subtitle', { date: endDateFormatted ?? '' }),
                isError: true,
                isRetryAvailable: true,
            };
        case SubscriptionUtils_1.PAYMENT_STATUS.POLICY_OWNER_WITH_AMOUNT_OWED_OVERDUE:
            return {
                title: translate('subscription.billingBanner.policyOwnerAmountOwedOverdue.title'),
                subtitle: translate('subscription.billingBanner.policyOwnerAmountOwedOverdue.subtitle', isBillingFailed
                    ? {
                        date: purchaseDateFormatted,
                        purchaseAmountOwed: purchaseAmountWithCurrency,
                    }
                    : {}),
                isError: true,
                isRetryAvailable: !(0, EmptyObject_1.isEmptyObject)(accountData) ? true : undefined,
            };
        case SubscriptionUtils_1.PAYMENT_STATUS.OWNER_OF_POLICY_UNDER_INVOICING:
            return {
                title: translate('subscription.billingBanner.policyOwnerUnderInvoicing.title'),
                subtitle: translate('subscription.billingBanner.policyOwnerUnderInvoicing.subtitle', { date: endDateFormatted ?? '' }),
                isError: true,
                isAddButtonDark: true,
            };
        case SubscriptionUtils_1.PAYMENT_STATUS.OWNER_OF_POLICY_UNDER_INVOICING_OVERDUE:
            return {
                title: translate('subscription.billingBanner.policyOwnerUnderInvoicingOverdue.title'),
                subtitle: translate('subscription.billingBanner.policyOwnerUnderInvoicingOverdue.subtitle'),
                isError: true,
                isAddButtonDark: true,
            };
        case SubscriptionUtils_1.PAYMENT_STATUS.BILLING_DISPUTE_PENDING:
            return {
                title: translate('subscription.billingBanner.billingDisputePending.title'),
                subtitle: translate('subscription.billingBanner.billingDisputePending.subtitle', { amountOwed, cardEnding }),
                isError: true,
                isRetryAvailable: false,
            };
        case SubscriptionUtils_1.PAYMENT_STATUS.CARD_AUTHENTICATION_REQUIRED:
            return {
                title: translate('subscription.billingBanner.cardAuthenticationRequired.title'),
                subtitle: translate('subscription.billingBanner.cardAuthenticationRequired.subtitle', { cardEnding }),
                isError: true,
                isAuthenticationRequired: true,
            };
        case SubscriptionUtils_1.PAYMENT_STATUS.INSUFFICIENT_FUNDS:
            return {
                title: translate('subscription.billingBanner.insufficientFunds.title'),
                subtitle: translate('subscription.billingBanner.insufficientFunds.subtitle', { amountOwed }),
                isError: true,
                isRetryAvailable: true,
            };
        case SubscriptionUtils_1.PAYMENT_STATUS.CARD_EXPIRED:
            return {
                title: translate('subscription.billingBanner.cardExpired.title'),
                subtitle: translate('subscription.billingBanner.cardExpired.subtitle', { amountOwed }),
                isError: true,
                isRetryAvailable: !isCurrentCardExpired,
            };
        case SubscriptionUtils_1.PAYMENT_STATUS.CARD_EXPIRE_SOON:
            return {
                title: translate('subscription.billingBanner.cardExpireSoon.title'),
                subtitle: translate('subscription.billingBanner.cardExpireSoon.subtitle'),
                isError: false,
                icon: Illustrations.CreditCardEyes,
            };
        case SubscriptionUtils_1.PAYMENT_STATUS.RETRY_BILLING_SUCCESS:
            return {
                title: translate('subscription.billingBanner.retryBillingSuccess.title'),
                subtitle: translate('subscription.billingBanner.retryBillingSuccess.subtitle'),
                isError: false,
                rightIcon: Expensicons.Close,
            };
        case SubscriptionUtils_1.PAYMENT_STATUS.RETRY_BILLING_ERROR:
            return {
                title: translate('subscription.billingBanner.retryBillingError.title'),
                subtitle: translate('subscription.billingBanner.retryBillingError.subtitle'),
                isError: true,
                isRetryAvailable: false,
            };
        default:
            return undefined;
    }
}
/**
 * Get the next billing date.
 *
 * @returns - The next billing date in 'yyyy-MM-dd' format.
 */
function getNextBillingDate() {
    const today = new Date();
    const nextBillingDate = (0, date_fns_1.startOfMonth)((0, date_fns_1.addMonths)(today, 1));
    return (0, date_fns_1.format)(nextBillingDate, CONST_1.default.DATE.MONTH_DAY_YEAR_FORMAT);
}
exports.default = { getBillingStatus, getNextBillingDate };
