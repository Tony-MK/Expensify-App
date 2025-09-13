"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const Illustrations_1 = require("@components/Icon/Illustrations");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Policy_1 = require("@libs/actions/Policy/Policy");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const BillingBanner_1 = require("@pages/settings/Subscription/CardSection/BillingBanner/BillingBanner");
function WorkspaceCompanyCardExpensifyCardPromotionBanner({ policy }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const policyID = policy?.id;
    const areExpensifyCardsEnabled = policy?.areExpensifyCardsEnabled;
    const handleLearnMore = (0, react_1.useCallback)(() => {
        if (!policyID) {
            return;
        }
        if (areExpensifyCardsEnabled) {
            (0, PolicyUtils_1.navigateToExpensifyCardPage)(policyID);
            return;
        }
        (0, Policy_1.enableExpensifyCard)(policyID, true, true);
    }, [policyID, areExpensifyCardsEnabled]);
    const rightComponent = (0, react_1.useMemo)(() => {
        const smallScreenStyle = shouldUseNarrowLayout ? [styles.flex0, styles.flexBasis100, styles.justifyContentCenter] : [];
        return (<react_native_1.View style={[styles.flexRow, styles.gap2, smallScreenStyle]}>
                <Button_1.default success onPress={handleLearnMore} style={shouldUseNarrowLayout && styles.flex1} text={translate('workspace.moreFeatures.companyCards.expensifyCardBannerLearnMoreButton')}/>
            </react_native_1.View>);
    }, [styles, shouldUseNarrowLayout, translate, handleLearnMore]);
    return (<react_native_1.View style={[styles.ph4, styles.mb4]}>
            <BillingBanner_1.default icon={Illustrations_1.CreditCardsNewGreen} title={translate('workspace.moreFeatures.companyCards.expensifyCardBannerTitle')} titleStyle={StyleUtils.getTextColorStyle(theme.text)} subtitle={translate('workspace.moreFeatures.companyCards.expensifyCardBannerSubtitle')} subtitleStyle={[styles.mt1, styles.textLabel]} style={[styles.borderRadiusComponentLarge]} rightComponent={rightComponent}/>
        </react_native_1.View>);
}
exports.default = WorkspaceCompanyCardExpensifyCardPromotionBanner;
