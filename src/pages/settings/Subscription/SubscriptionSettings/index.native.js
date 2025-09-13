"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const Illustrations = require("@components/Icon/Illustrations");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OptionItem_1 = require("@components/OptionsPicker/OptionItem");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const usePreferredCurrency_1 = require("@hooks/usePreferredCurrency");
const usePrivateSubscription_1 = require("@hooks/usePrivateSubscription");
const useSubscriptionPlan_1 = require("@hooks/useSubscriptionPlan");
const useThemeIllustrations_1 = require("@hooks/useThemeIllustrations");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const Navigation_1 = require("@navigation/Navigation");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function SubscriptionSettings() {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const privateSubscription = (0, usePrivateSubscription_1.default)();
    const [activePolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID, { canBeMissing: true });
    const activePolicy = (0, usePolicy_1.default)(activePolicyID);
    const isActivePolicyAdmin = (0, PolicyUtils_1.isPolicyAdmin)(activePolicy);
    const subscriptionPlan = (0, useSubscriptionPlan_1.default)();
    const preferredCurrency = (0, usePreferredCurrency_1.default)();
    const illustrations = (0, useThemeIllustrations_1.default)();
    const isAnnual = privateSubscription?.type === CONST_1.default.SUBSCRIPTION.TYPE.ANNUAL;
    const subscriptionPrice = (0, SubscriptionUtils_1.getSubscriptionPrice)(subscriptionPlan, preferredCurrency, privateSubscription?.type);
    const priceDetails = translate(`subscription.yourPlan.${subscriptionPlan === CONST_1.default.POLICY.TYPE.CORPORATE ? 'control' : 'collect'}.${isAnnual ? 'priceAnnual' : 'pricePayPerUse'}`, {
        lower: (0, CurrencyUtils_1.convertToShortDisplayString)(subscriptionPrice, preferredCurrency),
        upper: (0, CurrencyUtils_1.convertToShortDisplayString)(subscriptionPrice * CONST_1.default.SUBSCRIPTION_PRICE_FACTOR, preferredCurrency),
    });
    const adminsChatReportID = isActivePolicyAdmin && activePolicy?.chatReportIDAdmins ? activePolicy.chatReportIDAdmins.toString() : undefined;
    const openAdminsRoom = () => {
        Navigation_1.default.navigate(ROUTES_1.default.REPORT_WITH_ID.getRoute(adminsChatReportID));
    };
    const subscriptionSizeSection = privateSubscription?.type === CONST_1.default.SUBSCRIPTION.TYPE.ANNUAL && privateSubscription?.userCount ? (<MenuItemWithTopDescription_1.default description={translate('subscription.details.subscriptionSize')} title={`${privateSubscription?.userCount}`} wrapperStyle={styles.sectionMenuItemTopDescription} style={styles.mt5}/>) : null;
    return (<ScreenWrapper_1.default testID={SubscriptionSettings.displayName} shouldShowOfflineIndicatorInWideScreen>
            <HeaderWithBackButton_1.default title={translate('subscription.subscriptionSettings.title')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
            <ScrollView_1.default contentContainerStyle={[styles.flexGrow1, styles.ph5]}>
                <Text_1.default style={[styles.textSupporting, styles.mb5]}>{translate('subscription.mobileReducedFunctionalityMessage')}</Text_1.default>
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
                    </react_native_1.View>) : (<>
                        {privateSubscription?.type === CONST_1.default.SUBSCRIPTION.TYPE.PAY_PER_USE ? (<OptionItem_1.default title="subscription.details.payPerUse" icon={Illustrations.SubscriptionPPU} style={[styles.mt5, styles.flex0]} isDisabled/>) : (<OptionItem_1.default title="subscription.details.annual" icon={Illustrations.SubscriptionAnnual} style={[styles.mt5, styles.flex0]} isDisabled/>)}
                        {subscriptionSizeSection}
                    </>)}
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
SubscriptionSettings.displayName = 'SubscriptionSettings';
exports.default = SubscriptionSettings;
