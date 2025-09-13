"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Button_1 = require("@components/Button");
var Expensicons_1 = require("@components/Icon/Expensicons");
var Illustrations_1 = require("@components/Icon/Illustrations");
var useDismissedUberBanners_1 = require("@hooks/useDismissedUberBanners");
var useLocalize_1 = require("@hooks/useLocalize");
var usePermissions_1 = require("@hooks/usePermissions");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Policy_1 = require("@libs/actions/Policy/Policy");
var BillingBanner_1 = require("@pages/settings/Subscription/CardSection/BillingBanner/BillingBanner");
var CONST_1 = require("@src/CONST");
function WorkspaceReceiptPartnersPromotionBanner(_a) {
    var policy = _a.policy, readOnly = _a.readOnly;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var StyleUtils = (0, useStyleUtils_1.default)();
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var isBetaEnabled = (0, usePermissions_1.default)().isBetaEnabled;
    var policyID = policy === null || policy === void 0 ? void 0 : policy.id;
    var _b = (0, useDismissedUberBanners_1.default)({ policyID: policyID }), setAsDismissed = _b.setAsDismissed, isDismissed = _b.isDismissed;
    var shouldDismissBanner = !!(policy === null || policy === void 0 ? void 0 : policy.areReceiptPartnersEnabled) || !isBetaEnabled(CONST_1.default.BETAS.UBER_FOR_BUSINESS) || isDismissed || readOnly;
    var handleConnectUber = (0, react_1.useCallback)(function () {
        if (!policyID) {
            return;
        }
        (0, Policy_1.enablePolicyReceiptPartners)(policyID, true, true);
    }, [policyID]);
    var rightComponent = (0, react_1.useMemo)(function () {
        var smallScreenStyle = shouldUseNarrowLayout ? [styles.flex0, styles.flexBasis100, styles.justifyContentCenter] : [];
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
