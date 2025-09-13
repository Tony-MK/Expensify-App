"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const PaymentCardForm_1 = require("@components/AddPaymentCard/PaymentCardForm");
const DelegateNoAccessWrapper_1 = require("@components/DelegateNoAccessWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Illustrations = require("@components/Icon/Illustrations");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Section_1 = require("@components/Section");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useHasTeam2025Pricing_1 = require("@hooks/useHasTeam2025Pricing");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePreferredCurrency_1 = require("@hooks/usePreferredCurrency");
const usePrevious_1 = require("@hooks/usePrevious");
const usePrivateSubscription_1 = require("@hooks/usePrivateSubscription");
const useSubscriptionPlan_1 = require("@hooks/useSubscriptionPlan");
const useSubscriptionPrice_1 = require("@hooks/useSubscriptionPrice");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CardUtils_1 = require("@libs/CardUtils");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CardAuthenticationModal_1 = require("@pages/settings/Subscription/CardAuthenticationModal");
const PaymentMethods_1 = require("@userActions/PaymentMethods");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function AddPaymentCard() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const privateSubscription = (0, usePrivateSubscription_1.default)();
    const [accountID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { selector: (session) => session?.accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, canBeMissing: false });
    const subscriptionPlan = (0, useSubscriptionPlan_1.default)();
    const subscriptionPrice = (0, useSubscriptionPrice_1.default)();
    const preferredCurrency = (0, usePreferredCurrency_1.default)();
    const hasTeam2025Pricing = (0, useHasTeam2025Pricing_1.default)();
    const isCollect = subscriptionPlan === CONST_1.default.POLICY.TYPE.TEAM;
    const isAnnual = privateSubscription?.type === CONST_1.default.SUBSCRIPTION.TYPE.ANNUAL;
    const subscriptionPricingInfo = hasTeam2025Pricing && isCollect
        ? translate('subscription.yourPlan.pricePerMemberPerMonth', { price: (0, CurrencyUtils_1.convertToShortDisplayString)(subscriptionPrice, preferredCurrency) })
        : translate(`subscription.yourPlan.${isCollect ? 'collect' : 'control'}.${isAnnual ? 'priceAnnual' : 'pricePayPerUse'}`, {
            lower: (0, CurrencyUtils_1.convertToShortDisplayString)(subscriptionPrice, preferredCurrency),
            upper: (0, CurrencyUtils_1.convertToShortDisplayString)(subscriptionPrice * CONST_1.default.SUBSCRIPTION_PRICE_FACTOR, preferredCurrency),
        });
    (0, react_1.useEffect)(() => {
        (0, PaymentMethods_1.clearPaymentCardFormErrorAndSubmit)();
        return () => {
            (0, PaymentMethods_1.clearPaymentCardFormErrorAndSubmit)();
        };
    }, []);
    const addPaymentCard = (0, react_1.useCallback)((values) => {
        const cardData = {
            cardNumber: (0, CardUtils_1.getMCardNumberString)(values.cardNumber),
            cardMonth: (0, CardUtils_1.getMonthFromExpirationDateString)(values.expirationDate),
            cardYear: (0, CardUtils_1.getYearFromExpirationDateString)(values.expirationDate),
            cardCVV: values.securityCode,
            addressName: values.nameOnCard,
            addressZip: values.addressZipCode,
            currency: values.currency ?? CONST_1.default.PAYMENT_CARD_CURRENCY.USD,
        };
        (0, PaymentMethods_1.addSubscriptionPaymentCard)(accountID ?? CONST_1.default.DEFAULT_NUMBER_ID, cardData);
    }, [accountID]);
    const [formData] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ADD_PAYMENT_CARD_FORM, { canBeMissing: true });
    const prevFormDataSetupComplete = (0, usePrevious_1.default)(!!formData?.setupComplete);
    (0, react_1.useEffect)(() => {
        if (prevFormDataSetupComplete || !formData?.setupComplete) {
            return;
        }
        Navigation_1.default.goBack();
    }, [prevFormDataSetupComplete, formData?.setupComplete]);
    return (<ScreenWrapper_1.default testID={AddPaymentCard.displayName}>
            <DelegateNoAccessWrapper_1.default accessDeniedVariants={[CONST_1.default.DELEGATE.DENIED_ACCESS_VARIANTS.DELEGATE]}>
                <HeaderWithBackButton_1.default title={translate('subscription.paymentCard.addPaymentCard')}/>
                <react_native_1.View style={styles.containerWithSpaceBetween}>
                    <PaymentCardForm_1.default shouldShowPaymentCardForm addPaymentCard={addPaymentCard} showAcceptTerms showCurrencyField currencySelectorRoute={ROUTES_1.default.SETTINGS_SUBSCRIPTION_CHANGE_PAYMENT_CURRENCY} submitButtonText={translate('subscription.paymentCard.addPaymentCard')} headerContent={<Text_1.default style={[styles.textHeadline, styles.mt3, styles.mb2, styles.ph5]}>{translate('subscription.paymentCard.enterPaymentCardDetails')}</Text_1.default>} footerContent={<>
                                <Section_1.default icon={Illustrations.ShieldYellow} cardLayout={Section_1.CARD_LAYOUT.ICON_ON_LEFT} iconContainerStyles={styles.mr4} containerStyles={[styles.mh0, styles.mt5]} renderTitle={() => (<Text_1.default style={[styles.mutedTextLabel]}>
                                            {translate('subscription.paymentCard.security')}{' '}
                                            <TextLink_1.default style={[styles.mutedTextLabel, styles.link]} href={CONST_1.default.OLD_DOT_PUBLIC_URLS.TERMS_URL}>
                                                {translate('subscription.paymentCard.learnMoreAboutSecurity')}
                                            </TextLink_1.default>
                                        </Text_1.default>)}/>
                                <Text_1.default style={[styles.textMicroSupporting, styles.mt3, styles.textAlignCenter, styles.mr5, styles.ml5]}>{subscriptionPricingInfo}</Text_1.default>
                            </>}/>
                </react_native_1.View>
                <CardAuthenticationModal_1.default headerTitle={translate('subscription.authenticatePaymentCard')}/>
            </DelegateNoAccessWrapper_1.default>
        </ScreenWrapper_1.default>);
}
AddPaymentCard.displayName = 'AddPaymentCard';
exports.default = AddPaymentCard;
