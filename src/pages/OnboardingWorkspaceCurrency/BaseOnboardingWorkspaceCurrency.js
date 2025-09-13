"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const CurrencySelectionList_1 = require("@components/CurrencySelectionList");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Onboarding_1 = require("@libs/actions/Onboarding");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function BaseOnboardingWorkspaceCurrency({ route, shouldUseNativeStyles }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { onboardingIsMediumOrLargerScreenWidth } = (0, useResponsiveLayout_1.default)();
    const currentUserPersonalDetails = (0, useCurrentUserPersonalDetails_1.default)();
    const [draftValues] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ONBOARDING_WORKSPACE_DETAILS_FORM_DRAFT, { canBeMissing: true });
    const value = draftValues?.currency ?? currentUserPersonalDetails?.localCurrencyCode ?? CONST_1.default.CURRENCY.USD;
    const goBack = (0, react_1.useCallback)(() => {
        const backTo = route?.params?.backTo;
        if (backTo) {
            Navigation_1.default.goBack(backTo);
            return;
        }
        Navigation_1.default.goBack();
    }, [route?.params?.backTo]);
    const updateInput = (0, react_1.useCallback)((item) => {
        (0, Onboarding_1.setWorkspaceCurrency)(item.currencyCode);
        goBack();
    }, [goBack]);
    return (<ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={BaseOnboardingWorkspaceCurrency.displayName} style={[styles.defaultModalContainer, shouldUseNativeStyles && styles.pt8]} shouldShowOfflineIndicator={!onboardingIsMediumOrLargerScreenWidth}>
            <HeaderWithBackButton_1.default progressBarPercentage={100} onBackButtonPress={goBack}/>
            <react_native_1.View style={[onboardingIsMediumOrLargerScreenWidth ? styles.mh8 : styles.mh5, onboardingIsMediumOrLargerScreenWidth ? styles.flexRow : styles.flexColumn, styles.mb5]}>
                <Text_1.default style={styles.textHeadlineH1}>{translate('common.currency')}</Text_1.default>
            </react_native_1.View>
            <CurrencySelectionList_1.default listItemWrapperStyle={onboardingIsMediumOrLargerScreenWidth ? [styles.pl8, styles.pr8] : []} textInputStyle={onboardingIsMediumOrLargerScreenWidth ? styles.ph8 : styles.ph5} initiallySelectedCurrencyCode={value} onSelect={updateInput} searchInputLabel={translate('common.search')} addBottomSafeAreaPadding/>
        </ScreenWrapper_1.default>);
}
BaseOnboardingWorkspaceCurrency.displayName = 'BaseOnboardingWorkspaceCurrency';
exports.default = BaseOnboardingWorkspaceCurrency;
