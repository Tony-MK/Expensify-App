"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Avatar_1 = require("@components/Avatar");
const Badge_1 = require("@components/Badge");
const Button_1 = require("@components/Button");
const Icon_1 = require("@components/Icon");
const Expensicon = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const RenderHTML_1 = require("@components/RenderHTML");
const Text_1 = require("@components/Text");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useHasTeam2025Pricing_1 = require("@hooks/useHasTeam2025Pricing");
const useLocalize_1 = require("@hooks/useLocalize");
const usePreferredCurrency_1 = require("@hooks/usePreferredCurrency");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSubscriptionPlan_1 = require("@hooks/useSubscriptionPlan");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const GenericFeaturesView_1 = require("./GenericFeaturesView");
function UpgradeIntro({ feature, onUpgrade, buttonDisabled, loading, isCategorizing, policyID, backTo }) {
    const styles = (0, useThemeStyles_1.default)();
    const { isExtraSmallScreenWidth } = (0, useResponsiveLayout_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const subscriptionPlan = (0, useSubscriptionPlan_1.default)();
    const preferredCurrency = (0, usePreferredCurrency_1.default)();
    const hasTeam2025Pricing = (0, useHasTeam2025Pricing_1.default)();
    const formattedPrice = (0, react_1.useMemo)(() => {
        const upgradeCurrency = Object.hasOwn(CONST_1.default.SUBSCRIPTION_PRICES, preferredCurrency) ? preferredCurrency : CONST_1.default.PAYMENT_CARD_CURRENCY.USD;
        return `${(0, CurrencyUtils_1.convertToShortDisplayString)(CONST_1.default.SUBSCRIPTION_PRICES[upgradeCurrency][isCategorizing ? CONST_1.default.POLICY.TYPE.TEAM : CONST_1.default.POLICY.TYPE.CORPORATE][CONST_1.default.SUBSCRIPTION.TYPE.ANNUAL], upgradeCurrency)} `;
    }, [preferredCurrency, isCategorizing]);
    const subscriptionLink = (0, react_1.useMemo)(() => {
        if (!subscriptionPlan) {
            return CONST_1.default.PLAN_TYPES_AND_PRICING_HELP_URL;
        }
        const currentRoute = Navigation_1.default.getActiveRoute();
        return `${environmentURL}/${ROUTES_1.default.SETTINGS_SUBSCRIPTION.getRoute(currentRoute)}`;
    }, [environmentURL, subscriptionPlan]);
    /**
     * If the feature is null or there is no policyID, it indicates the user is not associated with any specific workspace.
     * In this case, the generic upgrade view should be shown.
     * However, the policyID check is only necessary when the user is not coming from the "Categorize" option.
     * The "isCategorizing" flag is set to true when the user accesses the "Categorize" option in the Self-DM whisper.
     * In such scenarios, a separate Categories upgrade UI is displayed.
     */
    if (!feature || (!isCategorizing && !policyID)) {
        return (<GenericFeaturesView_1.default onUpgrade={onUpgrade} buttonDisabled={buttonDisabled} formattedPrice={formattedPrice} loading={loading} policyID={policyID} backTo={backTo}/>);
    }
    const isIllustration = feature.icon in Illustrations;
    const iconSrc = isIllustration ? Illustrations[feature.icon] : Expensicon[feature.icon];
    const iconAdditionalStyles = feature.id === CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.approvals.id ? styles.br0 : undefined;
    return (<react_native_1.View style={styles.p5}>
            <react_native_1.View style={styles.workspaceUpgradeIntroBox({ isExtraSmallScreenWidth })}>
                <react_native_1.View style={[styles.mb3, styles.flexRow, styles.justifyContentBetween]}>
                    {!isIllustration ? (<Avatar_1.default source={iconSrc} type={CONST_1.default.ICON_TYPE_AVATAR}/>) : (<Icon_1.default src={iconSrc} width={48} height={48} additionalStyles={iconAdditionalStyles}/>)}
                    <Badge_1.default icon={Expensicon.Unlock} text={translate('workspace.upgrade.upgradeToUnlock')} success/>
                </react_native_1.View>
                <react_native_1.View style={styles.mb5}>
                    <Text_1.default style={[styles.textHeadlineH1, styles.mb4]}>{translate(feature.title)}</Text_1.default>
                    <Text_1.default style={[styles.textNormal, styles.textSupporting, styles.mb4]}>{translate(feature.description)}</Text_1.default>
                    <Text_1.default style={[styles.textNormal, styles.textSupporting]}>
                        {translate(`workspace.upgrade.${feature.id}.onlyAvailableOnPlan`)}
                        <Text_1.default style={[styles.textSupporting, styles.textBold]}>{formattedPrice}</Text_1.default>
                        {hasTeam2025Pricing ? translate('workspace.upgrade.pricing.perMember') : translate('workspace.upgrade.pricing.perActiveMember')}
                    </Text_1.default>
                </react_native_1.View>
                <Button_1.default isLoading={loading} text={translate('common.upgrade')} testID="upgrade-button" success onPress={onUpgrade} isDisabled={buttonDisabled} large/>
            </react_native_1.View>
            <react_native_1.View style={[styles.mt6, styles.renderHTML]}>
                <RenderHTML_1.default html={translate('workspace.upgrade.note', { subscriptionLink })}/>
            </react_native_1.View>
        </react_native_1.View>);
}
exports.default = UpgradeIntro;
