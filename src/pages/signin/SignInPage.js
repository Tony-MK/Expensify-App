"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInPage = void 0;
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const ColorSchemeWrapper_1 = require("@components/ColorSchemeWrapper");
const CustomStatusBarAndBackground_1 = require("@components/CustomStatusBarAndBackground");
const HTMLEngineProvider_1 = require("@components/HTMLEngineProvider");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ThemeProvider_1 = require("@components/ThemeProvider");
const ThemeStylesProvider_1 = require("@components/ThemeStylesProvider");
const useHandleBackButton_1 = require("@hooks/useHandleBackButton");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSafeAreaInsets_1 = require("@hooks/useSafeAreaInsets");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ActiveClientManager_1 = require("@libs/ActiveClientManager");
const Log_1 = require("@libs/Log");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Performance_1 = require("@libs/Performance");
const Visibility_1 = require("@libs/Visibility");
const Session_1 = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const getEmptyArray_1 = require("@src/types/utils/getEmptyArray");
const ChooseSSOOrMagicCode_1 = require("./ChooseSSOOrMagicCode");
const EmailDeliveryFailurePage_1 = require("./EmailDeliveryFailurePage");
const LoginForm_1 = require("./LoginForm");
const SignInLoginContext_1 = require("./SignInLoginContext");
const SignInPageLayout_1 = require("./SignInPageLayout");
const SignUpWelcomeForm_1 = require("./SignUpWelcomeForm");
const SMSDeliveryFailurePage_1 = require("./SMSDeliveryFailurePage");
const UnlinkLoginForm_1 = require("./UnlinkLoginForm");
const ValidateCodeForm_1 = require("./ValidateCodeForm");
/**
 * @param hasLogin
 * @param hasValidateCode
 * @param account
 * @param isPrimaryLogin
 * @param isUsingMagicCode
 * @param hasInitiatedSAMLLogin
 * @param hasEmailDeliveryFailure
 * @param hasSMSDeliveryFailure
 */
function getRenderOptions({ hasLogin, hasValidateCode, account, isPrimaryLogin, isUsingMagicCode, hasInitiatedSAMLLogin, shouldShowAnotherLoginPageOpenedMessage, credentials, isAccountValidated, }) {
    const hasAccount = !(0, EmptyObject_1.isEmptyObject)(account);
    const isSAMLEnabled = !!account?.isSAMLEnabled;
    const isSAMLRequired = !!account?.isSAMLRequired;
    const hasEmailDeliveryFailure = !!account?.hasEmailDeliveryFailure;
    const hasSMSDeliveryFailure = !!account?.smsDeliveryFailureStatus?.hasSMSDeliveryFailure;
    // True, if the user has SAML required, and we haven't yet initiated SAML for their account
    const shouldInitiateSAMLLogin = hasAccount && hasLogin && isSAMLRequired && !hasInitiatedSAMLLogin && !!account.isLoading;
    const shouldShowChooseSSOOrMagicCode = hasAccount && hasLogin && isSAMLEnabled && !isSAMLRequired && !isUsingMagicCode;
    // SAML required users may reload the login page after having already entered their login details, in which
    // case we want to clear their sign in data so they don't end up in an infinite loop redirecting back to their
    // SSO provider's login page
    if (hasLogin && isSAMLRequired && !shouldInitiateSAMLLogin && !hasInitiatedSAMLLogin && !account.isLoading) {
        (0, Session_1.clearSignInData)();
    }
    // Show the Welcome form if a user is signing up for a new account in a domain that is not controlled
    const shouldShouldSignUpWelcomeForm = !!credentials?.login && !isAccountValidated && !account?.accountExists && !account?.domainControlled;
    const shouldShowLoginForm = !shouldShowAnotherLoginPageOpenedMessage && !hasLogin && !hasValidateCode;
    const shouldShowEmailDeliveryFailurePage = hasLogin && hasEmailDeliveryFailure && !shouldShowChooseSSOOrMagicCode && !shouldInitiateSAMLLogin;
    const shouldShowSMSDeliveryFailurePage = !!(hasLogin && hasSMSDeliveryFailure && !shouldShowChooseSSOOrMagicCode && !shouldInitiateSAMLLogin && account?.accountExists);
    const isUnvalidatedSecondaryLogin = hasLogin && !isPrimaryLogin && !isAccountValidated && !hasEmailDeliveryFailure && !hasSMSDeliveryFailure;
    const shouldShowValidateCodeForm = !shouldShouldSignUpWelcomeForm &&
        hasAccount &&
        (hasLogin || hasValidateCode) &&
        !isUnvalidatedSecondaryLogin &&
        !hasEmailDeliveryFailure &&
        !hasSMSDeliveryFailure &&
        !shouldShowChooseSSOOrMagicCode &&
        !isSAMLRequired;
    const shouldShowWelcomeHeader = shouldShowLoginForm || shouldShowValidateCodeForm || shouldShowChooseSSOOrMagicCode || isUnvalidatedSecondaryLogin || shouldShouldSignUpWelcomeForm;
    const shouldShowWelcomeText = shouldShowLoginForm || shouldShowValidateCodeForm || shouldShowChooseSSOOrMagicCode || shouldShowAnotherLoginPageOpenedMessage || shouldShouldSignUpWelcomeForm;
    return {
        shouldShowLoginForm,
        shouldShowEmailDeliveryFailurePage,
        shouldShowSMSDeliveryFailurePage,
        shouldShowUnlinkLoginForm: !shouldShouldSignUpWelcomeForm && isUnvalidatedSecondaryLogin,
        shouldShowValidateCodeForm,
        shouldShowChooseSSOOrMagicCode,
        shouldInitiateSAMLLogin,
        shouldShowWelcomeHeader,
        shouldShowWelcomeText,
        shouldShouldSignUpWelcomeForm,
    };
}
function SignInPage({ ref }) {
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const signInPageLayoutRef = (0, react_1.useRef)(null);
    const loginFormRef = (0, react_1.useRef)(null);
    const validateCodeFormRef = (0, react_1.useRef)(null);
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const isAccountValidated = account?.validated;
    const [credentials] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CREDENTIALS, { canBeMissing: true });
    /**
      This variable is only added to make sure the component is re-rendered
      whenever the activeClients change, so that we call the
      ActiveClientManager.isClientTheLeader function
      every time the leader client changes.
      We use that function to prevent repeating code that checks which client is the leader.
    */
    const [activeClients = (0, getEmptyArray_1.default)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACTIVE_CLIENTS, { canBeMissing: true });
    /** This state is needed to keep track of if user is using recovery code instead of 2fa code,
     * and we need it here since welcome text(`welcomeText`) also depends on it */
    const [isUsingRecoveryCode, setIsUsingRecoveryCode] = (0, react_1.useState)(false);
    /** This state is needed to keep track of whether the user has opted to use magic codes
     * instead of signing in via SAML when SAML is enabled and not required */
    const [isUsingMagicCode, setIsUsingMagicCode] = (0, react_1.useState)(false);
    /** This state is needed to keep track of whether the user has been directed to their SSO provider's login page and
     *  if we need to clear their sign in details so they can enter a login */
    const [hasInitiatedSAMLLogin, setHasInitiatedSAMLLogin] = (0, react_1.useState)(false);
    const isClientTheLeader = !!activeClients && (0, ActiveClientManager_1.isClientTheLeader)();
    // We need to show "Another login page is opened" message if the page isn't active and visible
    // eslint-disable-next-line rulesdir/no-negated-variables
    const shouldShowAnotherLoginPageOpenedMessage = Visibility_1.default.isVisible() && !isClientTheLeader;
    (0, react_1.useEffect)(() => Performance_1.default.measureTTI(), []);
    (0, react_1.useEffect)(() => {
        if (credentials?.login) {
            return;
        }
        // If we don't have a login set, reset the user's SAML login preferences
        if (isUsingMagicCode) {
            setIsUsingMagicCode(false);
        }
        if (hasInitiatedSAMLLogin) {
            setHasInitiatedSAMLLogin(false);
        }
    }, [credentials?.login, isUsingMagicCode, setIsUsingMagicCode, hasInitiatedSAMLLogin, setHasInitiatedSAMLLogin]);
    const { shouldShowLoginForm, shouldShowEmailDeliveryFailurePage, shouldShowSMSDeliveryFailurePage, shouldShowUnlinkLoginForm, shouldShowValidateCodeForm, shouldShowChooseSSOOrMagicCode, shouldInitiateSAMLLogin, shouldShowWelcomeHeader, shouldShowWelcomeText, shouldShouldSignUpWelcomeForm, } = getRenderOptions({
        hasLogin: !!credentials?.login,
        hasValidateCode: !!credentials?.validateCode,
        account,
        isPrimaryLogin: !account?.primaryLogin || account.primaryLogin === credentials?.login,
        isUsingMagicCode,
        hasInitiatedSAMLLogin,
        shouldShowAnotherLoginPageOpenedMessage,
        credentials,
        isAccountValidated,
    });
    if (shouldInitiateSAMLLogin) {
        setHasInitiatedSAMLLogin(true);
        Navigation_1.default.isNavigationReady().then(() => Navigation_1.default.navigate(ROUTES_1.default.SAML_SIGN_IN));
    }
    let welcomeHeader = '';
    let welcomeText = '';
    const headerText = translate('login.hero.header');
    const userLogin = expensify_common_1.Str.removeSMSDomain(credentials?.login ?? '');
    // replacing spaces with "hard spaces" to prevent breaking the number
    const userLoginToDisplay = expensify_common_1.Str.isSMSLogin(userLogin) ? formatPhoneNumber(userLogin) : userLogin;
    if (shouldShowAnotherLoginPageOpenedMessage) {
        welcomeHeader = translate('welcomeText.anotherLoginPageIsOpen');
        welcomeText = translate('welcomeText.anotherLoginPageIsOpenExplanation');
    }
    else if (shouldShowLoginForm) {
        welcomeHeader = shouldUseNarrowLayout ? headerText : translate('welcomeText.getStarted');
        welcomeText = shouldUseNarrowLayout ? translate('welcomeText.getStarted') : '';
    }
    else if (shouldShowValidateCodeForm) {
        // Only show the authenticator prompt after the magic code has been submitted
        const isTwoFactorStage = account?.requiresTwoFactorAuth && !!credentials?.validateCode;
        if (isTwoFactorStage) {
            welcomeHeader = shouldUseNarrowLayout ? '' : translate('welcomeText.welcome');
            welcomeText = isUsingRecoveryCode ? translate('validateCodeForm.enterRecoveryCode') : translate('validateCodeForm.enterAuthenticatorCode');
        }
        else {
            welcomeHeader = shouldUseNarrowLayout ? '' : translate('welcomeText.welcome');
            welcomeText = shouldUseNarrowLayout
                ? `${translate('welcomeText.welcome')} ${translate('welcomeText.welcomeEnterMagicCode', { login: userLoginToDisplay })}`
                : translate('welcomeText.welcomeEnterMagicCode', { login: userLoginToDisplay });
        }
    }
    else if (shouldShowUnlinkLoginForm || shouldShowEmailDeliveryFailurePage || shouldShowChooseSSOOrMagicCode || shouldShowSMSDeliveryFailurePage) {
        welcomeHeader = shouldUseNarrowLayout ? headerText : translate('welcomeText.welcome');
        // Don't show any welcome text if we're showing the user the email delivery failed view
        if (shouldShowEmailDeliveryFailurePage || shouldShowChooseSSOOrMagicCode || shouldShowSMSDeliveryFailurePage) {
            welcomeText = '';
        }
    }
    else if (shouldShouldSignUpWelcomeForm) {
        welcomeHeader = shouldUseNarrowLayout ? headerText : translate('welcomeText.welcome');
        welcomeText = shouldUseNarrowLayout
            ? `${translate('welcomeText.welcomeWithoutExclamation')} ${translate('welcomeText.welcomeNewFace', { login: userLoginToDisplay })}`
            : translate('welcomeText.welcomeNewFace', { login: userLoginToDisplay });
    }
    else if (!shouldInitiateSAMLLogin && !hasInitiatedSAMLLogin) {
        Log_1.default.warn('SignInPage in unexpected state!');
    }
    const navigateFocus = () => {
        signInPageLayoutRef.current?.scrollPageToTop();
        loginFormRef.current?.clearDataAndFocus();
    };
    const navigateBack = () => {
        if (shouldShouldSignUpWelcomeForm ||
            (!shouldShowAnotherLoginPageOpenedMessage &&
                (shouldShowEmailDeliveryFailurePage || shouldShowUnlinkLoginForm || shouldShowChooseSSOOrMagicCode || shouldShowSMSDeliveryFailurePage))) {
            (0, Session_1.clearSignInData)();
            return true;
        }
        if (shouldShowValidateCodeForm) {
            validateCodeFormRef.current?.clearSignInData();
            return true;
        }
        Navigation_1.default.goBack();
        return false;
    };
    (0, react_1.useImperativeHandle)(ref, () => ({
        navigateBack,
    }));
    (0, useHandleBackButton_1.default)(navigateBack);
    return (<ColorSchemeWrapper_1.default>
            <CustomStatusBarAndBackground_1.default isNested/>
            <SignInLoginContext_1.LoginProvider>
                <SignInPageLayout_1.default welcomeHeader={welcomeHeader} welcomeText={welcomeText} shouldShowWelcomeHeader={shouldShowWelcomeHeader || !shouldUseNarrowLayout} shouldShowWelcomeText={shouldShowWelcomeText} ref={signInPageLayoutRef} navigateFocus={navigateFocus}>
                    {/* LoginForm must use the isVisible prop. This keeps it mounted, but visually hidden
            so that password managers can access the values. Conditionally rendering this component will break this feature. */}
                    <LoginForm_1.default ref={loginFormRef} isVisible={shouldShowLoginForm} blurOnSubmit={isAccountValidated === false} 
    // eslint-disable-next-line react-compiler/react-compiler
    scrollPageToTop={signInPageLayoutRef.current?.scrollPageToTop}/>
                    {shouldShouldSignUpWelcomeForm && <SignUpWelcomeForm_1.default />}
                    {shouldShowValidateCodeForm && (<ValidateCodeForm_1.default isVisible={!shouldShowAnotherLoginPageOpenedMessage} isUsingRecoveryCode={isUsingRecoveryCode} setIsUsingRecoveryCode={setIsUsingRecoveryCode} ref={validateCodeFormRef}/>)}
                    {!shouldShowAnotherLoginPageOpenedMessage && (<>
                            {shouldShowUnlinkLoginForm && <UnlinkLoginForm_1.default />}
                            {shouldShowChooseSSOOrMagicCode && <ChooseSSOOrMagicCode_1.default setIsUsingMagicCode={setIsUsingMagicCode}/>}
                            {shouldShowEmailDeliveryFailurePage && <EmailDeliveryFailurePage_1.default />}
                            {shouldShowSMSDeliveryFailurePage && <SMSDeliveryFailurePage_1.default />}
                        </>)}
                </SignInPageLayout_1.default>
            </SignInLoginContext_1.LoginProvider>
        </ColorSchemeWrapper_1.default>);
}
function SignInPageWrapper({ ref }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const safeAreaInsets = (0, useSafeAreaInsets_1.default)();
    const { isInNarrowPaneModal } = (0, useResponsiveLayout_1.default)();
    return (
    // Bottom SafeAreaView is removed so that login screen svg displays correctly on mobile.
    // The SVG should flow under the Home Indicator on iOS.
    <ScreenWrapper_1.default shouldShowOfflineIndicator={false} shouldEnableMaxHeight style={[styles.signInPage, StyleUtils.getPlatformSafeAreaPadding({ ...safeAreaInsets, bottom: 0, top: isInNarrowPaneModal ? 0 : safeAreaInsets.top }, 1)]} testID={SignInPageWrapper.displayName}>
            <SignInPage ref={ref}/>
        </ScreenWrapper_1.default>);
}
SignInPageWrapper.displayName = 'SignInPageWrapper';
// WithTheme is a HOC that provides theme-related contexts (e.g. to the SignInPageWrapper component since these contexts are required for variable declarations).
function WithTheme(Component) {
    return ({ ref }) => (<ThemeProvider_1.default theme={CONST_1.default.THEME.DARK}>
            <ThemeStylesProvider_1.default>
                <HTMLEngineProvider_1.default>
                    <Component ref={ref}/>
                </HTMLEngineProvider_1.default>
            </ThemeStylesProvider_1.default>
        </ThemeProvider_1.default>);
}
const SignInPageThemed = WithTheme(SignInPage);
exports.SignInPage = SignInPageThemed;
exports.default = WithTheme(SignInPageWrapper);
