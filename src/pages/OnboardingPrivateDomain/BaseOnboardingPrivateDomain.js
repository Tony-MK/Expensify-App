"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const ValidateCodeForm_1 = require("@components/ValidateCodeActionModal/ValidateCodeForm");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const UserUtils_1 = require("@libs/UserUtils");
const Policy_1 = require("@userActions/Policy/Policy");
const User_1 = require("@userActions/User");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function BaseOnboardingPrivateDomain({ shouldUseNativeStyles, route }) {
    const [hasMagicCodeBeenSent, setHasMagicCodeBeenSent] = (0, react_1.useState)(false);
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [loginList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.LOGIN_LIST, { canBeMissing: false });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const [getAccessiblePoliciesAction] = (0, useOnyx_1.default)(ONYXKEYS_1.default.VALIDATE_USER_AND_GET_ACCESSIBLE_POLICIES, { canBeMissing: true });
    const [joinablePolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.JOINABLE_POLICIES, { canBeMissing: true });
    const joinablePoliciesLength = Object.keys(joinablePolicies ?? {}).length;
    const { onboardingIsMediumOrLargerScreenWidth } = (0, useResponsiveLayout_1.default)();
    const email = session?.email ?? '';
    const domain = email.split('@').at(1) ?? '';
    const isValidated = (0, UserUtils_1.isCurrentUserValidated)(loginList, session?.email);
    const [onboardingValues] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, { canBeMissing: true });
    const isVsb = onboardingValues?.signupQualifier === CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.VSB;
    const isSmb = onboardingValues?.signupQualifier === CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.SMB;
    const sendValidateCode = (0, react_1.useCallback)(() => {
        if (!email) {
            return;
        }
        (0, User_1.resendValidateCode)(email);
    }, [email]);
    (0, react_1.useEffect)(() => {
        if (isValidated) {
            return;
        }
        sendValidateCode();
    }, [sendValidateCode, isValidated]);
    (0, react_1.useEffect)(() => {
        if (!isValidated || joinablePoliciesLength === 0) {
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_WORKSPACES.getRoute(ROUTES_1.default.ONBOARDING_PERSONAL_DETAILS.getRoute()), { forceReplace: true });
    }, [isValidated, joinablePoliciesLength]);
    return (<ScreenWrapper_1.default shouldEnableMaxHeight includeSafeAreaPaddingBottom testID="BaseOnboardingPrivateDomain" style={[styles.defaultModalContainer, shouldUseNativeStyles && styles.pt8]}>
            <HeaderWithBackButton_1.default shouldShowBackButton progressBarPercentage={40} onBackButtonPress={Navigation_1.default.goBack}/>
            <ScrollView_1.default style={[styles.w100, styles.h100, styles.flex1]} contentContainerStyle={styles.flexGrow1} keyboardShouldPersistTaps="handled">
                <react_native_1.View style={[styles.mb5, onboardingIsMediumOrLargerScreenWidth && styles.mt5, onboardingIsMediumOrLargerScreenWidth ? styles.mh8 : styles.mh5, styles.flex1]}>
                    <Text_1.default style={styles.textHeadlineH1}>{translate('onboarding.peopleYouMayKnow')}</Text_1.default>
                    <Text_1.default style={[styles.textAlignLeft, styles.mv5]}>{translate('onboarding.workspaceYouMayJoin', { domain, email })}</Text_1.default>
                    <ValidateCodeForm_1.default validateCodeActionErrorField="getAccessiblePolicies" handleSubmitForm={(code) => {
            (0, Policy_1.getAccessiblePolicies)(code);
            setHasMagicCodeBeenSent(false);
        }} sendValidateCode={() => {
            sendValidateCode();
            setHasMagicCodeBeenSent(true);
        }} clearError={() => (0, Policy_1.clearGetAccessiblePoliciesErrors)()} validateError={getAccessiblePoliciesAction?.errors} hasMagicCodeBeenSent={hasMagicCodeBeenSent} shouldShowSkipButton handleSkipButtonPress={() => {
            if (isVsb) {
                Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_ACCOUNTING.getRoute(route.params?.backTo));
                return;
            }
            if (isSmb) {
                Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_EMPLOYEES.getRoute(route.params?.backTo));
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_PURPOSE.getRoute(route.params?.backTo));
        }} buttonStyles={[styles.flex2, styles.justifyContentEnd]} isLoading={getAccessiblePoliciesAction?.loading}/>
                </react_native_1.View>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
BaseOnboardingPrivateDomain.displayName = 'BaseOnboardingPrivateDomain';
exports.default = BaseOnboardingPrivateDomain;
