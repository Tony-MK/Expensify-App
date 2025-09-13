"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Expensicons_1 = require("@components/Icon/Expensicons");
const Illustrations_1 = require("@components/Icon/Illustrations");
const useDismissedUberBanners_1 = require("@hooks/useDismissedUberBanners");
const useLocalize_1 = require("@hooks/useLocalize");
const usePermissions_1 = require("@hooks/usePermissions");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Policy_1 = require("@libs/actions/Policy/Policy");
const BillingBanner_1 = require("@pages/settings/Subscription/CardSection/BillingBanner/BillingBanner");
const CONST_1 = require("@src/CONST");
function WorkspaceReceiptPartnersPromotionBanner({ policy, readOnly }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const policyID = policy?.id;
    const { setAsDismissed, isDismissed } = (0, useDismissedUberBanners_1.default)({ policyID });
    const shouldDismissBanner = !!policy?.areReceiptPartnersEnabled || !isBetaEnabled(CONST_1.default.BETAS.UBER_FOR_BUSINESS) || isDismissed || readOnly;
    const handleConnectUber = (0, react_1.useCallback)(() => {
        if (!policyID) {
            return;
        }
        (0, Policy_1.enablePolicyReceiptPartners)(policyID, true, true);
    }, [policyID]);
    const rightComponent = (0, react_1.useMemo)(() => {
        const smallScreenStyle = shouldUseNarrowLayout ? [styles.flex0, styles.flexBasis100, styles.justifyContentCenter] : [];
        return (<react_native_1.View style={[styles.flexRow, styles.gap2, smallScreenStyle]}>
                <Button_1.default success onPress={handleConnectUber} style={shouldUseNarrowLayout && styles.flex1} text={translate('workspace.receiptPartners.connect')}/>
            </react_native_1.View>);
    }, [styles, shouldUseNarrowLayout, translate, handleConnectUber]);
    if (shouldDismissBanner) {
        return null;
    }
    return (<react_native_1.View style={[styles.ph4, styles.mb4]}>
            <BillingBanner_1.default icon={Illustrations_1.PinkCar} title={translate('workspace.receiptPartners.uber.bannerTitle')} titleStyle={StyleUtils.getTextColorStyle(theme.text)} subtitle={translate('workspace.receiptPartners.uber.bannerDescription')} subtitleStyle={[styles.mt1, styles.textLabel]} style={[styles.borderRadiusComponentLarge]} rightComponent={rightComponent} rightIcon={Expensicons_1.Close} rightIconAccessibilityLabel={translate('common.close')} onRightIconPress={setAsDismissed}/>
        </react_native_1.View>);
}
exports.default = WorkspaceReceiptPartnersPromotionBanner;
