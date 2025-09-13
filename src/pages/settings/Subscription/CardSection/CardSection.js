"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const RenderHTML_1 = require("@components/RenderHTML");
const Section_1 = require("@components/Section");
const Text_1 = require("@components/Text");
const useHasTeam2025Pricing_1 = require("@hooks/useHasTeam2025Pricing");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrivateSubscription_1 = require("@hooks/usePrivateSubscription");
const useSubscriptionPlan_1 = require("@hooks/useSubscriptionPlan");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const User_1 = require("@libs/actions/User");
const DateUtils_1 = require("@libs/DateUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PaymentUtils_1 = require("@libs/PaymentUtils");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const PaymentMethods_1 = require("@userActions/PaymentMethods");
const Subscription_1 = require("@userActions/Subscription");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const EarlyDiscountBanner_1 = require("./BillingBanner/EarlyDiscountBanner");
const PreTrialBillingBanner_1 = require("./BillingBanner/PreTrialBillingBanner");
const SubscriptionBillingBanner_1 = require("./BillingBanner/SubscriptionBillingBanner");
const TrialEndedBillingBanner_1 = require("./BillingBanner/TrialEndedBillingBanner");
const TrialStartedBillingBanner_1 = require("./BillingBanner/TrialStartedBillingBanner");
const CardSectionActions_1 = require("./CardSectionActions");
const CardSectionButton_1 = require("./CardSectionButton");
const CardSectionDataEmpty_1 = require("./CardSectionDataEmpty");
const RequestEarlyCancellationMenuItem_1 = require("./RequestEarlyCancellationMenuItem");
const utils_1 = require("./utils");
function CardSection() {
    const [isRequestRefundModalVisible, setIsRequestRefundModalVisible] = (0, react_1.useState)(false);
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const privateSubscription = (0, usePrivateSubscription_1.default)();
    const [privateStripeCustomerID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_STRIPE_CUSTOMER_ID, { canBeMissing: true });
    const [authenticationLink] = (0, useOnyx_1.default)(ONYXKEYS_1.default.VERIFY_3DS_SUBSCRIPTION, { canBeMissing: true });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    const [fundList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FUND_LIST, { canBeMissing: true });
    const [purchaseList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PURCHASE_LIST, { canBeMissing: true });
    const hasTeam2025Pricing = (0, useHasTeam2025Pricing_1.default)();
    const subscriptionPlan = (0, useSubscriptionPlan_1.default)();
    const [subscriptionRetryBillingStatusPending] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SUBSCRIPTION_RETRY_BILLING_STATUS_PENDING, { canBeMissing: true });
    const [subscriptionRetryBillingStatusSuccessful] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SUBSCRIPTION_RETRY_BILLING_STATUS_SUCCESSFUL, { canBeMissing: true });
    const [subscriptionRetryBillingStatusFailed] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SUBSCRIPTION_RETRY_BILLING_STATUS_FAILED, { canBeMissing: true });
    const { isOffline } = (0, useNetwork_1.default)();
    const defaultCard = (0, react_1.useMemo)(() => Object.values(fundList ?? {}).find((card) => card.accountData?.additionalData?.isBillingCard), [fundList]);
    const cardMonth = (0, react_1.useMemo)(() => DateUtils_1.default.getMonthNames()[(defaultCard?.accountData?.cardMonth ?? 1) - 1], [defaultCard?.accountData?.cardMonth]);
    const hasFailedLastBilling = (0, react_1.useMemo)(() => purchaseList?.[0]?.message.billingType === CONST_1.default.BILLING.TYPE_STRIPE_FAILED_AUTHENTICATION || purchaseList?.[0]?.message.billingType === CONST_1.default.BILLING.TYPE_FAILED_2018, [purchaseList]);
    const requestRefund = (0, react_1.useCallback)(() => {
        (0, User_1.requestRefund)();
        setIsRequestRefundModalVisible(false);
        Navigation_1.default.goBackToHome();
    }, []);
    const viewPurchases = (0, react_1.useCallback)(() => {
        const query = (0, SearchQueryUtils_1.buildQueryStringFromFilterFormValues)({ merchant: CONST_1.default.EXPENSIFY_MERCHANT });
        Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({ query }));
    }, []);
    const [billingStatus, setBillingStatus] = (0, react_1.useState)(() => utils_1.default.getBillingStatus({ translate, stripeCustomerId: privateStripeCustomerID, accountData: defaultCard?.accountData ?? {}, purchase: purchaseList?.[0] }));
    const nextPaymentDate = !(0, EmptyObject_1.isEmptyObject)(privateSubscription) ? utils_1.default.getNextBillingDate() : undefined;
    const sectionSubtitle = defaultCard && !!nextPaymentDate ? translate('subscription.cardSection.cardNextPayment', { nextPaymentDate }) : translate('subscription.cardSection.subtitle');
    (0, react_1.useEffect)(() => {
        setBillingStatus(utils_1.default.getBillingStatus({
            translate,
            stripeCustomerId: privateStripeCustomerID,
            accountData: defaultCard?.accountData ?? {},
            purchase: purchaseList?.[0],
        }));
    }, [
        subscriptionRetryBillingStatusPending,
        subscriptionRetryBillingStatusSuccessful,
        subscriptionRetryBillingStatusFailed,
        translate,
        defaultCard?.accountData,
        privateStripeCustomerID,
        purchaseList,
    ]);
    const handleRetryPayment = () => {
        (0, Subscription_1.clearOutstandingBalance)();
    };
    (0, react_1.useEffect)(() => {
        if (!authenticationLink || (privateStripeCustomerID?.status !== CONST_1.default.STRIPE_SCA_AUTH_STATUSES.CARD_AUTHENTICATION_REQUIRED && !hasFailedLastBilling)) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SUBSCRIPTION_ADD_PAYMENT_CARD);
    }, [authenticationLink, privateStripeCustomerID?.status, hasFailedLastBilling]);
    const handleAuthenticatePayment = () => {
        (0, PaymentMethods_1.verifySetupIntent)(session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, false);
    };
    const handleBillingBannerClose = () => {
        setBillingStatus(undefined);
    };
    let BillingBanner;
    if ((0, SubscriptionUtils_1.shouldShowDiscountBanner)(hasTeam2025Pricing, subscriptionPlan)) {
        BillingBanner = <EarlyDiscountBanner_1.default isSubscriptionPage/>;
    }
    else if ((0, SubscriptionUtils_1.shouldShowPreTrialBillingBanner)()) {
        BillingBanner = <PreTrialBillingBanner_1.default />;
    }
    else if ((0, SubscriptionUtils_1.isUserOnFreeTrial)()) {
        BillingBanner = <TrialStartedBillingBanner_1.default />;
    }
    else if ((0, SubscriptionUtils_1.hasUserFreeTrialEnded)()) {
        BillingBanner = <TrialEndedBillingBanner_1.default />;
    }
    if (billingStatus) {
        BillingBanner = (<SubscriptionBillingBanner_1.default title={billingStatus.title} subtitle={billingStatus.subtitle} isError={billingStatus.isError} icon={billingStatus.icon} rightIcon={billingStatus.rightIcon} onRightIconPress={handleBillingBannerClose} rightIconAccessibilityLabel={translate('common.close')}/>);
    }
    return (<>
            <Section_1.default title={translate('subscription.cardSection.title')} subtitle={sectionSubtitle} isCentralPane titleStyles={styles.textStrong} subtitleMuted banner={BillingBanner}>
                <react_native_1.View style={[styles.mt8, styles.mb3, styles.flexRow]}>
                    {!(0, EmptyObject_1.isEmptyObject)(defaultCard?.accountData) && (<react_native_1.View style={[styles.flexRow, styles.flex1, styles.gap3]}>
                            <Icon_1.default src={Expensicons.CreditCard} additionalStyles={styles.subscriptionAddedCardIcon} fill={theme.icon} medium/>
                            <react_native_1.View style={styles.flex1}>
                                <Text_1.default style={styles.textStrong}>{(0, PaymentUtils_1.getPaymentMethodDescription)(defaultCard?.accountType, defaultCard?.accountData)}</Text_1.default>
                                <Text_1.default style={styles.mutedNormalTextLabel}>
                                    {translate('subscription.cardSection.cardInfo', {
                name: defaultCard?.accountData?.addressName ?? '',
                expiration: `${cardMonth} ${defaultCard?.accountData?.cardYear}`,
                currency: defaultCard?.accountData?.currency ?? '',
            })}
                                </Text_1.default>
                            </react_native_1.View>
                            <CardSectionActions_1.default />
                        </react_native_1.View>)}
                </react_native_1.View>

                <react_native_1.View style={styles.mb3}>{(0, EmptyObject_1.isEmptyObject)(defaultCard?.accountData) && <CardSectionDataEmpty_1.default />}</react_native_1.View>
                {billingStatus?.isRetryAvailable !== undefined && (<CardSectionButton_1.default text={translate('subscription.cardSection.retryPaymentButton')} isDisabled={isOffline || !billingStatus?.isRetryAvailable} isLoading={subscriptionRetryBillingStatusPending} onPress={handleRetryPayment} style={[styles.w100, styles.mb3]} large/>)}
                {(0, SubscriptionUtils_1.hasCardAuthenticatedError)(privateStripeCustomerID) && (<CardSectionButton_1.default text={translate('subscription.cardSection.authenticatePayment')} isDisabled={isOffline || !billingStatus?.isAuthenticationRequired} isLoading={subscriptionRetryBillingStatusPending} onPress={handleAuthenticatePayment} style={[styles.w100, styles.mt5]} large/>)}

                {!!account?.hasPurchases && (<MenuItem_1.default shouldShowRightIcon icon={Expensicons.History} wrapperStyle={styles.sectionMenuItemTopDescription} title={translate('subscription.cardSection.viewPaymentHistory')} titleStyle={styles.textStrong} onPress={viewPurchases}/>)}

                {!!(subscriptionPlan && account?.isEligibleForRefund) && (<MenuItem_1.default shouldShowRightIcon icon={Expensicons.Bill} wrapperStyle={styles.sectionMenuItemTopDescription} title={translate('subscription.cardSection.requestRefund')} titleStyle={styles.textStrong} disabled={isOffline} onPress={() => setIsRequestRefundModalVisible(true)}/>)}

                {!!(privateSubscription?.type === CONST_1.default.SUBSCRIPTION.TYPE.ANNUAL && account?.hasPurchases) && <RequestEarlyCancellationMenuItem_1.default />}
            </Section_1.default>

            {!!account?.isEligibleForRefund && (<ConfirmModal_1.default title={translate('subscription.cardSection.requestRefund')} isVisible={isRequestRefundModalVisible} onConfirm={requestRefund} onCancel={() => setIsRequestRefundModalVisible(false)} prompt={<RenderHTML_1.default html={translate('subscription.cardSection.requestRefundModal.full')}/>} confirmText={translate('subscription.cardSection.requestRefundModal.confirm')} cancelText={translate('common.cancel')} danger/>)}
        </>);
}
CardSection.displayName = 'CardSection';
exports.default = CardSection;
