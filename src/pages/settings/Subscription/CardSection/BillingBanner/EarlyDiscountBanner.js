"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const Pressable_1 = require("@components/Pressable");
const RenderHTML_1 = require("@components/RenderHTML");
const Tooltip_1 = require("@components/Tooltip");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const SubscriptionUtils_1 = require("@libs/SubscriptionUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const BillingBanner_1 = require("./BillingBanner");
function EarlyDiscountBanner({ isSubscriptionPage, onboardingHelpDropdownButton, onDismissedDiscountBanner, hasActiveScheduledCall }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [firstDayFreeTrial] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_FIRST_DAY_FREE_TRIAL, { canBeMissing: true });
    const [lastDayFreeTrial] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_DAY_FREE_TRIAL, { canBeMissing: true });
    const initialDiscountInfo = (0, SubscriptionUtils_1.getEarlyDiscountInfo)();
    const [discountInfo, setDiscountInfo] = (0, react_1.useState)(initialDiscountInfo);
    const [isDismissed, setIsDismissed] = (0, react_1.useState)(false);
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    (0, react_1.useEffect)(() => {
        const intervalID = setInterval(() => {
            setDiscountInfo((0, SubscriptionUtils_1.getEarlyDiscountInfo)());
        }, 1000);
        return () => clearInterval(intervalID);
    }, [firstDayFreeTrial]);
    const dismissButton = (0, react_1.useMemo)(() => discountInfo?.discountType === 25 && (<Tooltip_1.default text={translate('common.close')}>
                    <Pressable_1.PressableWithFeedback onPress={() => {
            setIsDismissed(true);
            onDismissedDiscountBanner?.();
        }} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.close')}>
                        <Icon_1.default src={Expensicons.Close} fill={theme.icon}/>
                    </Pressable_1.PressableWithFeedback>
                </Tooltip_1.default>), [theme.icon, translate, onDismissedDiscountBanner, discountInfo?.discountType]);
    const rightComponent = (0, react_1.useMemo)(() => {
        const smallScreenStyle = shouldUseNarrowLayout ? [styles.flex0, styles.flexBasis100, styles.justifyContentCenter] : [];
        return (<react_native_1.View style={[styles.flexRow, styles.gap2, smallScreenStyle, styles.alignItemsCenter]}>
                {onboardingHelpDropdownButton}
                <Button_1.default success={!hasActiveScheduledCall} style={shouldUseNarrowLayout ? [styles.earlyDiscountButton, styles.flexGrow2] : styles.mr2} text={translate('subscription.billingBanner.earlyDiscount.claimOffer')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_SUBSCRIPTION.getRoute(Navigation_1.default.getActiveRoute()))}/>
                {!shouldUseNarrowLayout && dismissButton}
            </react_native_1.View>);
    }, [
        shouldUseNarrowLayout,
        hasActiveScheduledCall,
        styles.flex0,
        styles.flexBasis100,
        styles.justifyContentCenter,
        styles.flexRow,
        styles.gap2,
        styles.alignItemsCenter,
        styles.earlyDiscountButton,
        styles.flexGrow2,
        styles.mr2,
        onboardingHelpDropdownButton,
        translate,
        dismissButton,
    ]);
    if (!firstDayFreeTrial || !lastDayFreeTrial || !discountInfo) {
        return null;
    }
    if (isDismissed && !isSubscriptionPage) {
        return null;
    }
    const title = isSubscriptionPage ? (<RenderHTML_1.default html={translate('subscription.billingBanner.earlyDiscount.subscriptionPageTitle', {
            discountType: discountInfo?.discountType,
        })}/>) : (<react_native_1.View style={[styles.justifyContentBetween, styles.flexRow]}>
            <RenderHTML_1.default html={translate('subscription.billingBanner.earlyDiscount.onboardingChatTitle', {
            discountType: discountInfo?.discountType,
        })}/>
            {shouldUseNarrowLayout && dismissButton}
        </react_native_1.View>);
    return (<BillingBanner_1.default title={title} style={!isSubscriptionPage && [styles.hoveredComponentBG, styles.borderBottom]} subtitle={translate('subscription.billingBanner.earlyDiscount.subtitle', {
            days: discountInfo?.days,
            hours: discountInfo?.hours,
            minutes: discountInfo?.minutes,
            seconds: discountInfo?.seconds,
        })} subtitleStyle={[styles.mt1, styles.mutedNormalTextLabel, isSubscriptionPage && StyleUtils.getTextColorStyle(theme.trialTimer)]} icon={Illustrations.TreasureChest} rightComponent={!isSubscriptionPage && rightComponent}/>);
}
EarlyDiscountBanner.displayName = 'EarlyDiscountBanner';
exports.default = EarlyDiscountBanner;
