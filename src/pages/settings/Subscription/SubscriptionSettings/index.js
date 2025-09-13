"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const DelegateNoAccessModalProvider_1 = require("@components/DelegateNoAccessModalProvider");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const OptionsPicker_1 = require("@components/OptionsPicker");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useHasTeam2025Pricing_1 = require("@hooks/useHasTeam2025Pricing");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const usePreferredCurrency_1 = require("@hooks/usePreferredCurrency");
const usePrivateSubscription_1 = require("@hooks/usePrivateSubscription");
const useSubscriptionPlan_1 = require("@hooks/useSubscriptionPlan");
const useSubscriptionPossibleCostSavings_1 = require("@hooks/useSubscriptionPossibleCostSavings");
const useTheme_1 = require("@hooks/useTheme");
const useThemeIllustrations_1 = require("@hooks/useThemeIllustrations");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const Navigation_1 = require("@navigation/Navigation");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const utils_1 = require("@pages/settings/Subscription/utils");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const variables_1 = require("@styles/variables");
const Report_1 = require("@userActions/Report");
const Subscription_1 = require("@userActions/Subscription");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const options = [
    {
        key: CONST_1.default.SUBSCRIPTION.TYPE.ANNUAL,
        title: 'subscription.details.annual',
        icon: Illustrations.SubscriptionAnnual,
    },
    {
        key: CONST_1.default.SUBSCRIPTION.TYPE.PAY_PER_USE,
        title: 'subscription.details.payPerUse',
        icon: Illustrations.SubscriptionPPU,
    },
];
function SubscriptionSettings() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const privateSubscription = (0, usePrivateSubscription_1.default)();
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true });
    const activePolicy = (0, usePolicy_1.default)(activePolicyID);
    const isActivePolicyAdmin = (0, PolicyUtils_1.isPolicyAdmin)(activePolicy);
    const subscriptionPlan = (0, useSubscriptionPlan_1.default)();
    const hasTeam2025Pricing = (0, useHasTeam2025Pricing_1.default)();
    const preferredCurrency = (0, usePreferredCurrency_1.default)();
    const illustrations = (0, useThemeIllustrations_1.default)();
    const possibleCostSavings = (0, useSubscriptionPossibleCostSavings_1.default)();
    const { isActingAsDelegate, showDelegateNoAccessModal } = (0, react_1.useContext)(DelegateNoAccessModalProvider_1.DelegateNoAccessContext);
    const isAnnual = privateSubscription?.type === CONST_1.default.SUBSCRIPTION.TYPE.ANNUAL;
    const [privateTaxExempt] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIVATE_TAX_EXEMPT, { canBeMissing: true });
    const subscriptionPrice = (0, SubscriptionUtils_1.getSubscriptionPrice)(subscriptionPlan, preferredCurrency, privateSubscription?.type);
    const priceDetails = translate(`subscription.yourPlan.${subscriptionPlan === CONST_1.default.POLICY.TYPE.CORPORATE ? 'control' : 'collect'}.${isAnnual ? 'priceAnnual' : 'pricePayPerUse'}`, {
        lower: (0, CurrencyUtils_1.convertToShortDisplayString)(subscriptionPrice, preferredCurrency),
        upper: (0, CurrencyUtils_1.convertToShortDisplayString)(subscriptionPrice * CONST_1.default.SUBSCRIPTION_PRICE_FACTOR, preferredCurrency),
    });
    const adminsChatReportID = isActivePolicyAdmin && activePolicy?.chatReportIDAdmins ? activePolicy.chatReportIDAdmins.toString() : undefined;
    const onOptionSelected = (option) => {
        if (privateSubscription?.type !== option && isActingAsDelegate) {
            showDelegateNoAccessModal();
            return;
        }
        if (privateSubscription?.type === CONST_1.default.SUBSCRIPTION.TYPE.ANNUAL && option === CONST_1.default.SUBSCRIPTION.TYPE.PAY_PER_USE && !account?.canDowngrade) {
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SUBSCRIPTION_SIZE.getRoute(0));
            return;
        }
        (0, Subscription_1.updateSubscriptionType)(option);
    };
    const onSubscriptionSizePress = () => {
        if (isActingAsDelegate) {
            showDelegateNoAccessModal();
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SUBSCRIPTION_SIZE.getRoute(1));
    };
    // This section is only shown when the subscription is annual
    const subscriptionSizeSection = privateSubscription?.type === CONST_1.default.SUBSCRIPTION.TYPE.ANNUAL ? (<>
                <OfflineWithFeedback_1.default pendingAction={privateSubscription?.pendingFields?.userCount} errors={privateSubscription?.errorFields?.userCount} onClose={() => {
            (0, Subscription_1.clearUpdateSubscriptionSizeError)();
        }}>
                    <MenuItemWithTopDescription_1.default description={translate('subscription.details.subscriptionSize')} shouldShowRightIcon onPress={onSubscriptionSizePress} wrapperStyle={styles.sectionMenuItemTopDescription} style={styles.mt5} title={`${privateSubscription?.userCount ?? ''}`}/>
                </OfflineWithFeedback_1.default>
                {!privateSubscription?.userCount && <Text_1.default style={[styles.mt2, styles.textLabelSupporting, styles.textLineHeightNormal]}>{translate('subscription.details.headsUp')}</Text_1.default>}
            </>) : null;
    const autoRenewalDate = (0, utils_1.formatSubscriptionEndDate)(privateSubscription?.endDate);
    const handleAutoRenewToggle = () => {
        if (isActingAsDelegate) {
            showDelegateNoAccessModal();
            return;
        }
        if (!privateSubscription?.autoRenew) {
            (0, Subscription_1.updateSubscriptionAutoRenew)(true);
            return;
        }
        if (account?.hasPurchases) {
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SUBSCRIPTION_DISABLE_AUTO_RENEW_SURVEY);
        }
        else {
            (0, Subscription_1.updateSubscriptionAutoRenew)(false);
        }
    };
    const handleAutoIncreaseToggle = () => {
        if (isActingAsDelegate) {
            showDelegateNoAccessModal();
            return;
        }
        (0, Subscription_1.updateSubscriptionAddNewUsersAutomatically)(!privateSubscription?.addNewUsersAutomatically);
    };
    const customTitleSecondSentenceStyles = [styles.textNormal, { color: theme.success }];
    const customTitle = (<Text_1.default>
            <Text_1.default style={[styles.mr1, styles.textNormalThemeText]}>{translate('subscription.subscriptionSettings.autoIncrease')}</Text_1.default>
            <Text_1.default style={customTitleSecondSentenceStyles}>
                {translate('subscription.subscriptionSettings.saveUpTo', {
            amountWithCurrency: (0, CurrencyUtils_1.convertToShortDisplayString)(possibleCostSavings, preferredCurrency),
        })}
            </Text_1.default>
        </Text_1.default>);
    const openAdminsRoom = () => {
        Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(adminsChatReportID));
    };
    if (!subscriptionPlan || (hasTeam2025Pricing && subscriptionPlan === CONST_1.default.POLICY.TYPE.TEAM)) {
        return <NotFoundPage_1.default />;
    }
    return (<ScreenWrapper_1.default testID={SubscriptionSettings.displayName} shouldShowOfflineIndicatorInWideScreen>
            <HeaderWithBackButton_1.default title={translate('subscription.subscriptionSettings.title')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
            <ScrollView_1.default contentContainerStyle={[styles.flexGrow1, styles.ph5]}>
                <Text_1.default style={[styles.textSupporting, styles.mb5]}>{translate('subscription.subscriptionSettings.pricingConfiguration')}</Text_1.default>
                <Text_1.default style={[styles.textSupporting, styles.mb5]}>
                    {translate('subscription.subscriptionSettings.learnMore.part1')}
                    <TextLink_1.default href={CONST_1.default.PRICING}>{translate('subscription.subscriptionSettings.learnMore.pricingPage')}</TextLink_1.default>
                    {translate('subscription.subscriptionSettings.learnMore.part2')}
                    {adminsChatReportID ? (<TextLink_1.default onPress={openAdminsRoom}>{translate('subscription.subscriptionSettings.learnMore.adminsRoom')}</TextLink_1.default>) : (translate('subscription.subscriptionSettings.learnMore.adminsRoom'))}
                </Text_1.default>
                <Text_1.default style={styles.mutedNormalTextLabel}>{translate('subscription.subscriptionSettings.estimatedPrice')}</Text_1.default>
                <Text_1.default style={styles.mv1}>{priceDetails}</Text_1.default>
                <Text_1.default style={styles.mutedNormalTextLabel}>{translate('subscription.subscriptionSettings.changesBasedOn')}</Text_1.default>
                {!!account?.isApprovedAccountant || !!account?.isApprovedAccountantClient ? (<react_native_1.View style={[styles.borderedContentCard, styles.p5, styles.mt5]}>
                        <Icon_1.default src={illustrations.ExpensifyApprovedLogo} width={variables_1.default.modalTopIconWidth} height={variables_1.default.menuIconSize}/>
                        <Text_1.default style={[styles.textLabelSupporting, styles.mt2]}>{translate('subscription.details.zeroCommitment')}</Text_1.default>
                    </react_native_1.View>) : (<OfflineWithFeedback_1.default pendingAction={privateSubscription?.pendingFields?.type}>
                        <OptionsPicker_1.default options={options} selectedOption={privateSubscription?.type ?? CONST_1.default.SUBSCRIPTION.TYPE.ANNUAL} onOptionSelected={onOptionSelected} style={styles.mt5}/>
                        {subscriptionSizeSection}
                    </OfflineWithFeedback_1.default>)}
                {isAnnual ? (<>
                        <OfflineWithFeedback_1.default pendingAction={privateSubscription?.pendingFields?.autoRenew}>
                            <react_native_1.View style={styles.mt5}>
                                <ToggleSettingsOptionRow_1.default title={translate('subscription.subscriptionSettings.autoRenew')} switchAccessibilityLabel={translate('subscription.subscriptionSettings.autoRenew')} onToggle={handleAutoRenewToggle} isActive={privateSubscription?.autoRenew}/>
                                {!!autoRenewalDate && (<Text_1.default style={[styles.mutedTextLabel, styles.mt2]}>{translate('subscription.subscriptionSettings.renewsOn', { date: autoRenewalDate })}</Text_1.default>)}
                            </react_native_1.View>
                        </OfflineWithFeedback_1.default>
                        <OfflineWithFeedback_1.default pendingAction={privateSubscription?.pendingFields?.addNewUsersAutomatically}>
                            <react_native_1.View style={styles.mt3}>
                                <ToggleSettingsOptionRow_1.default customTitle={customTitle} switchAccessibilityLabel={translate('subscription.subscriptionSettings.autoRenew')} onToggle={handleAutoIncreaseToggle} isActive={privateSubscription?.addNewUsersAutomatically ?? false}/>
                                <Text_1.default style={[styles.mutedTextLabel, styles.mt2]}>{translate('subscription.subscriptionSettings.automaticallyIncrease')}</Text_1.default>
                            </react_native_1.View>
                        </OfflineWithFeedback_1.default>
                    </>) : null}
                <MenuItemWithTopDescription_1.default description={privateTaxExempt ? translate('subscription.details.taxExemptStatus') : undefined} shouldShowRightIcon onPress={() => {
            (0, Subscription_1.requestTaxExempt)();
            (0, Report_1.navigateToConciergeChat)();
        }} icon={Expensicons.Coins} wrapperStyle={styles.sectionMenuItemTopDescription} style={styles.mv5} titleStyle={privateTaxExempt ? undefined : styles.textBold} title={privateTaxExempt ? translate('subscription.details.taxExemptEnabled') : translate('subscription.details.taxExempt')}/>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
SubscriptionSettings.displayName = 'SubscriptionSettings';
exports.default = SubscriptionSettings;
