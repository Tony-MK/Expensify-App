"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Illustrations = require("@components/Icon/Illustrations");
const MenuItemList_1 = require("@components/MenuItemList");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnboardingMessages_1 = require("@hooks/useOnboardingMessages");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const OnboardingRefManager_1 = require("@libs/OnboardingRefManager");
const variables_1 = require("@styles/variables");
const Report_1 = require("@userActions/Report");
const Welcome_1 = require("@userActions/Welcome");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const getEmptyArray_1 = require("@src/types/utils/getEmptyArray");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const selectableOnboardingChoices = Object.values(CONST_1.default.SELECTABLE_ONBOARDING_CHOICES);
function getOnboardingChoices(customChoices) {
    if (customChoices.length === 0) {
        return selectableOnboardingChoices;
    }
    return selectableOnboardingChoices.filter((choice) => customChoices.includes(choice));
}
const menuIcons = {
    [CONST_1.default.ONBOARDING_CHOICES.EMPLOYER]: Illustrations.ReceiptUpload,
    [CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM]: Illustrations.Abacus,
    [CONST_1.default.ONBOARDING_CHOICES.PERSONAL_SPEND]: Illustrations.PiggyBank,
    [CONST_1.default.ONBOARDING_CHOICES.CHAT_SPLIT]: Illustrations.SplitBill,
    [CONST_1.default.ONBOARDING_CHOICES.LOOKING_AROUND]: Illustrations.Binoculars,
};
function BaseOnboardingPurpose({ shouldUseNativeStyles, shouldEnableMaxHeight, route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { onboardingIsMediumOrLargerScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const { onboardingMessages } = (0, useOnboardingMessages_1.default)();
    const isPrivateDomainAndHasAccessiblePolicies = !account?.isFromPublicDomain && !!account?.hasAccessibleDomainPolicies;
    const theme = (0, useTheme_1.default)();
    const [onboardingErrorMessage, onboardingErrorMessageResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_ERROR_MESSAGE, { canBeMissing: true });
    const [onboardingPolicyID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_POLICY_ID, { canBeMissing: true });
    const [onboardingAdminsChatReportID] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_ADMINS_CHAT_REPORT_ID, { canBeMissing: true });
    const [personalDetailsForm] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ONBOARDING_PERSONAL_DETAILS_FORM, { canBeMissing: true });
    const paddingHorizontal = onboardingIsMediumOrLargerScreenWidth ? styles.ph8 : styles.ph5;
    const [customChoices = (0, getEmptyArray_1.default)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_CUSTOM_CHOICES, { canBeMissing: true });
    const onboardingChoices = getOnboardingChoices(customChoices);
    const menuItems = onboardingChoices.map((choice) => {
        const translationKey = `onboarding.purpose.${choice}`;
        return {
            key: translationKey,
            title: translate(translationKey),
            icon: menuIcons[choice],
            displayInDefaultIconColor: true,
            iconWidth: variables_1.default.menuIconSize,
            iconHeight: variables_1.default.menuIconSize,
            iconStyles: [styles.mh3],
            wrapperStyle: [styles.purposeMenuItem],
            numberOfLinesTitle: 0,
            onPress: () => {
                (0, Welcome_1.setOnboardingPurposeSelected)(choice);
                (0, Welcome_1.setOnboardingErrorMessage)('');
                if (choice === CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM) {
                    Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_EMPLOYEES.getRoute(route.params?.backTo));
                    return;
                }
                if (isPrivateDomainAndHasAccessiblePolicies && personalDetailsForm?.firstName) {
                    (0, Report_1.completeOnboarding)({
                        engagementChoice: choice,
                        onboardingMessage: onboardingMessages[choice],
                        firstName: personalDetailsForm.firstName,
                        lastName: personalDetailsForm.lastName,
                        adminsChatReportID: onboardingAdminsChatReportID ?? undefined,
                        onboardingPolicyID,
                    });
                    react_native_1.InteractionManager.runAfterInteractions(() => {
                        Navigation_1.default.navigate(ROUTES_1.default.TEST_DRIVE_MODAL_ROOT.route);
                    });
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_PERSONAL_DETAILS.getRoute(route.params?.backTo));
            },
        };
    });
    const isFocused = (0, native_1.useIsFocused)();
    const handleOuterClick = (0, react_1.useCallback)(() => {
        (0, Welcome_1.setOnboardingErrorMessage)(translate('onboarding.errorSelection'));
    }, [translate]);
    const onboardingLocalRef = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(isFocused ? OnboardingRefManager_1.default.ref : onboardingLocalRef, () => ({ handleOuterClick }), [handleOuterClick]);
    if ((0, isLoadingOnyxValue_1.default)(onboardingErrorMessageResult)) {
        return null;
    }
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom testID="BaseOnboardingPurpose" style={[styles.defaultModalContainer, shouldUseNativeStyles && styles.pt8]} shouldEnableMaxHeight={shouldEnableMaxHeight}>
            <react_native_1.View style={onboardingIsMediumOrLargerScreenWidth && styles.mh3}>
                <HeaderWithBackButton_1.default shouldShowBackButton={false} iconFill={theme.iconColorfulBackground} progressBarPercentage={isPrivateDomainAndHasAccessiblePolicies ? 60 : 20}/>
            </react_native_1.View>
            <react_native_gesture_handler_1.ScrollView style={[styles.flex1, styles.flexGrow1, onboardingIsMediumOrLargerScreenWidth && styles.mt5, paddingHorizontal]}>
                <react_native_1.View style={styles.flex1}>
                    <react_native_1.View style={[onboardingIsMediumOrLargerScreenWidth ? styles.flexRow : styles.flexColumn, styles.mb5]}>
                        <Text_1.default style={styles.textHeadlineH1}>{translate('onboarding.purpose.title')} </Text_1.default>
                    </react_native_1.View>
                    <MenuItemList_1.default menuItems={menuItems} shouldUseSingleExecution/>
                </react_native_1.View>
            </react_native_gesture_handler_1.ScrollView>
            <react_native_1.View style={[styles.w100, styles.mb5, styles.mh0, paddingHorizontal]}>
                <FormHelpMessage_1.default message={onboardingErrorMessage}/>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
BaseOnboardingPurpose.displayName = 'BaseOnboardingPurpose';
exports.default = BaseOnboardingPurpose;
