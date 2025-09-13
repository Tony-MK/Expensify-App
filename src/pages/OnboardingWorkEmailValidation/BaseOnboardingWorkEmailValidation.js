"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const OnboardingMergingAccountBlockedView_1 = require("@components/OnboardingMergingAccountBlockedView");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const ValidateCodeForm_1 = require("@components/ValidateCodeActionModal/ValidateCodeForm");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const AccountUtils_1 = require("@libs/AccountUtils");
const Link_1 = require("@libs/actions/Link");
const Welcome_1 = require("@libs/actions/Welcome");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Session_1 = require("@userActions/Session");
const User_1 = require("@userActions/User");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function BaseOnboardingWorkEmailValidation({ shouldUseNativeStyles }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    const [credentials] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CREDENTIALS, { canBeMissing: true });
    const [onboardingEmail] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ONBOARDING_WORK_EMAIL_FORM, { canBeMissing: true });
    const workEmail = onboardingEmail?.onboardingWorkEmail;
    const { onboardingIsMediumOrLargerScreenWidth } = (0, useResponsiveLayout_1.default)();
    const [onboardingValues] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, { canBeMissing: true });
    const isVsb = onboardingValues && 'signupQualifier' in onboardingValues && onboardingValues.signupQualifier === CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.VSB;
    const isSmb = onboardingValues?.signupQualifier === CONST_1.default.ONBOARDING_SIGNUP_QUALIFIERS.SMB;
    const [onboardingErrorMessage] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_ERROR_MESSAGE, { canBeMissing: true });
    const isValidateCodeFormSubmitting = AccountUtils_1.default.isValidateCodeFormSubmitting(account);
    const isFocused = (0, native_1.useIsFocused)();
    (0, react_1.useEffect)(() => {
        if (onboardingValues?.isMergeAccountStepCompleted === undefined) {
            return;
        }
        (0, Welcome_1.setOnboardingErrorMessage)('');
        if (onboardingValues?.shouldRedirectToClassicAfterMerge) {
            (0, Link_1.openOldDotLink)(CONST_1.default.OLDDOT_URLS.INBOX, true);
            return;
        }
        // Once we verify that shouldValidate is false, we need to force replace the screen
        // so that we don't navigate back on back button press
        if (isVsb) {
            Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_ACCOUNTING.getRoute(), { forceReplace: true });
            return;
        }
        if (isSmb) {
            Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_EMPLOYEES.getRoute(), { forceReplace: true });
            return;
        }
        if (!onboardingValues?.isMergeAccountStepSkipped) {
            Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_WORKSPACES.getRoute(), { forceReplace: true });
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.ONBOARDING_PURPOSE.getRoute(), { forceReplace: true });
    }, [onboardingValues, isVsb, isSmb, isFocused]);
    const sendValidateCode = (0, react_1.useCallback)(() => {
        if (!credentials?.login) {
            return;
        }
        (0, User_1.resendValidateCode)(credentials.login);
    }, [credentials?.login]);
    const validateAccountAndMerge = (0, react_1.useCallback)((validateCode) => {
        (0, Welcome_1.setOnboardingErrorMessage)('');
        (0, Session_1.MergeIntoAccountAndLogin)(workEmail, validateCode, session?.accountID);
    }, [workEmail, session?.accountID]);
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom testID="BaseOnboardingWorkEmailValidation" style={[styles.defaultModalContainer, shouldUseNativeStyles && styles.pt8]}>
            <HeaderWithBackButton_1.default shouldShowBackButton={!onboardingValues?.isMergingAccountBlocked} progressBarPercentage={15} onBackButtonPress={() => {
            (0, Welcome_1.updateOnboardingValuesAndNavigation)(onboardingValues);
        }}/>
            {onboardingValues?.isMergingAccountBlocked ? (<react_native_1.View style={[styles.flex1, onboardingIsMediumOrLargerScreenWidth && styles.mt5, onboardingIsMediumOrLargerScreenWidth ? styles.mh8 : styles.mh5]}>
                    <OnboardingMergingAccountBlockedView_1.default workEmail={workEmail} isVsb={isVsb}/>
                </react_native_1.View>) : (<react_native_1.View style={[styles.flex1, onboardingIsMediumOrLargerScreenWidth && styles.mt5, onboardingIsMediumOrLargerScreenWidth ? styles.mh8 : styles.mh5]}>
                    <Text_1.default style={styles.textHeadlineH1}>{translate('onboarding.workEmailValidation.title')}</Text_1.default>
                    <Text_1.default style={[styles.textNormal, styles.colorMuted, styles.textAlignLeft, styles.mt5]}>{translate('onboarding.workEmailValidation.magicCodeSent', { workEmail })}</Text_1.default>
                    <ValidateCodeForm_1.default handleSubmitForm={validateAccountAndMerge} sendValidateCode={sendValidateCode} validateCodeActionErrorField="mergeIntoAccountAndLogIn" clearError={() => (0, Welcome_1.setOnboardingErrorMessage)('')} buttonStyles={[styles.flex2, styles.justifyContentEnd, styles.mb5]} shouldShowSkipButton handleSkipButtonPress={() => {
                (0, Welcome_1.setOnboardingErrorMessage)('');
                (0, Welcome_1.setOnboardingMergeAccountStepValue)(true, true);
            }} isLoading={isValidateCodeFormSubmitting} validateError={onboardingErrorMessage ? { invalidCodeError: onboardingErrorMessage } : undefined}/>
                </react_native_1.View>)}
        </ScreenWrapper_1.default>);
}
BaseOnboardingWorkEmailValidation.displayName = 'BaseOnboardingWorkEmailValidation';
exports.default = BaseOnboardingWorkEmailValidation;
