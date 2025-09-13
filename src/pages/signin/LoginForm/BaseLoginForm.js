"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const DotIndicatorMessage_1 = require("@components/DotIndicatorMessage");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const AppleSignIn_1 = require("@components/SignInButtons/AppleSignIn");
const GoogleSignIn_1 = require("@components/SignInButtons/GoogleSignIn");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const isTextInputFocused_1 = require("@components/TextInput/BaseTextInput/isTextInputFocused");
const withToggleVisibilityView_1 = require("@components/withToggleVisibilityView");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Browser_1 = require("@libs/Browser");
const canFocusInputOnScreenFocus_1 = require("@libs/canFocusInputOnScreenFocus");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const isInputAutoFilled_1 = require("@libs/isInputAutoFilled");
const LoginUtils_1 = require("@libs/LoginUtils");
const PhoneNumber_1 = require("@libs/PhoneNumber");
const StringUtils_1 = require("@libs/StringUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const Visibility_1 = require("@libs/Visibility");
const SignInLoginContext_1 = require("@pages/signin/SignInLoginContext");
const CloseAccount_1 = require("@userActions/CloseAccount");
const Session_1 = require("@userActions/Session");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const htmlDivElementRef_1 = require("@src/types/utils/htmlDivElementRef");
const viewRef_1 = require("@src/types/utils/viewRef");
function BaseLoginForm({ blurOnSubmit = false, isVisible, ref }) {
    const { login, setLogin } = (0, SignInLoginContext_1.useLogin)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [closeAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.CLOSE_ACCOUNT_FORM, { canBeMissing: true });
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const input = (0, react_1.useRef)(null);
    const [formError, setFormError] = (0, react_1.useState)();
    const prevIsVisible = (0, usePrevious_1.default)(isVisible);
    const firstBlurred = (0, react_1.useRef)(false);
    const isFocused = (0, native_1.useIsFocused)();
    const isLoading = (0, react_1.useRef)(false);
    const { shouldUseNarrowLayout, isInNarrowPaneModal } = (0, useResponsiveLayout_1.default)();
    const accountMessage = account?.message === 'unlinkLoginForm.successfullyUnlinkedLogin' ? translate(account.message) : (account?.message ?? '');
    /**
     * Validate the input value and set the error for formError
     */
    const validate = (0, react_1.useCallback)((value) => {
        const loginTrim = StringUtils_1.default.removeInvisibleCharacters(value.trim());
        if (!loginTrim) {
            setFormError('common.pleaseEnterEmailOrPhoneNumber');
            return false;
        }
        const phoneLogin = (0, LoginUtils_1.appendCountryCode)((0, LoginUtils_1.getPhoneNumberWithoutSpecialChars)(loginTrim));
        const parsedPhoneNumber = (0, PhoneNumber_1.parsePhoneNumber)(phoneLogin);
        if (!expensify_common_1.Str.isValidEmail(loginTrim) && !parsedPhoneNumber.possible) {
            if ((0, ValidationUtils_1.isNumericWithSpecialChars)(loginTrim)) {
                setFormError('common.error.phoneNumber');
            }
            else {
                setFormError('loginForm.error.invalidFormatEmailLogin');
            }
            return false;
        }
        setFormError(undefined);
        return true;
    }, [setFormError]);
    /**
     * Handle text input and validate the text input if it is blurred
     */
    const onTextInput = (0, react_1.useCallback)((text) => {
        setLogin(text);
        if (firstBlurred.current) {
            validate(text);
        }
        if (!!account?.errors || !!account?.message) {
            (0, Session_1.clearAccountMessages)();
        }
        // Clear the "Account successfully closed" message when the user starts typing
        if (closeAccount?.success && !(0, isInputAutoFilled_1.default)(input.current)) {
            (0, CloseAccount_1.setDefaultData)();
        }
    }, [account, closeAccount, input, setLogin, validate]);
    function getSignInWithStyles() {
        return shouldUseNarrowLayout ? [styles.mt1] : [styles.mt5, styles.mb5];
    }
    /**
     * Check that all the form fields are valid, then trigger the submit callback
     */
    const validateAndSubmitForm = (0, react_1.useCallback)(() => {
        if (!!isOffline || !!account?.isLoading || isLoading.current) {
            return;
        }
        isLoading.current = true;
        // If account was closed and have success message in Onyx, we clear it here
        if (closeAccount?.success) {
            (0, CloseAccount_1.setDefaultData)();
        }
        // For native, the single input doesn't lost focus when we click outside.
        // So we need to change firstBlurred here to make the validate function is called whenever the text input is changed after the first validation.
        if (!firstBlurred.current) {
            firstBlurred.current = true;
        }
        if (!validate(login)) {
            isLoading.current = false;
            return;
        }
        const loginTrim = StringUtils_1.default.removeInvisibleCharacters(login.trim());
        const phoneLogin = (0, LoginUtils_1.appendCountryCode)((0, LoginUtils_1.getPhoneNumberWithoutSpecialChars)(loginTrim));
        const parsedPhoneNumber = (0, PhoneNumber_1.parsePhoneNumber)(phoneLogin);
        // Check if this login has an account associated with it or not
        (0, Session_1.beginSignIn)(parsedPhoneNumber.possible && parsedPhoneNumber.number?.e164 ? parsedPhoneNumber.number.e164 : loginTrim);
    }, [login, account, closeAccount, isOffline, validate]);
    (0, react_1.useEffect)(() => {
        // Call clearAccountMessages on the login page (home route).
        // When the user is in the transition route and not yet authenticated, this component will also be mounted,
        // resetting account.isLoading will cause the app to briefly display the session expiration page.
        if (isFocused && isVisible) {
            (0, Session_1.clearAccountMessages)();
        }
        if (!(0, canFocusInputOnScreenFocus_1.default)() || !input.current || !isVisible || !isFocused) {
            return;
        }
        let focusTimeout;
        if (isInNarrowPaneModal) {
            focusTimeout = setTimeout(() => input.current?.focus(), CONST_1.default.ANIMATED_TRANSITION);
        }
        else {
            input.current.focus();
        }
        return () => clearTimeout(focusTimeout);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- we just want to call this function when component is mounted
    }, []);
    (0, react_1.useEffect)(() => {
        if (account?.isLoading !== false) {
            return;
        }
        isLoading.current = false;
    }, [account?.isLoading]);
    (0, react_1.useEffect)(() => {
        if (blurOnSubmit) {
            input.current?.blur();
        }
        // Only focus the input if the form becomes visible again, to prevent the keyboard from automatically opening on touchscreen devices after signing out
        if (!input.current || prevIsVisible || !isVisible) {
            return;
        }
        input.current?.focus();
    }, [blurOnSubmit, isVisible, prevIsVisible]);
    (0, react_1.useImperativeHandle)(ref, () => ({
        isInputFocused() {
            if (!input.current) {
                return false;
            }
            return !!(0, isTextInputFocused_1.default)(input);
        },
        clearDataAndFocus(clearLogin = true) {
            if (!input.current) {
                return;
            }
            if (clearLogin) {
                (0, Session_1.clearSignInData)();
            }
            input.current.focus();
        },
    }));
    const serverErrorText = (0, react_1.useMemo)(() => (account ? (0, ErrorUtils_1.getLatestErrorMessage)(account) : ''), [account]);
    const shouldShowServerError = !!serverErrorText && !formError;
    const isSigningWithAppleOrGoogle = (0, react_1.useRef)(false);
    const setIsSigningWithAppleOrGoogle = (0, react_1.useCallback)((isPressed) => (isSigningWithAppleOrGoogle.current = isPressed), []);
    const submitContainerRef = (0, react_1.useRef)(null);
    const handleFocus = (0, react_1.useCallback)(() => {
        if (!(0, Browser_1.isMobileWebKit)()) {
            return;
        }
        // On mobile WebKit browsers, when an input field gains focus, the keyboard appears and the virtual viewport is resized and scrolled to make the input field visible.
        // This occurs even when there is enough space to display both the input field and the submit button in the current view.
        // so this change to correct the scroll position when the input field gains focus.
        react_native_1.InteractionManager.runAfterInteractions(() => {
            (0, htmlDivElementRef_1.default)(submitContainerRef).current?.scrollIntoView?.({ behavior: 'smooth', block: 'end' });
        });
    }, []);
    const handleSignIn = () => setIsSigningWithAppleOrGoogle(true);
    return (<>
            <react_native_1.View accessibilityLabel={translate('loginForm.loginForm')} style={[styles.mt3]}>
                <TextInput_1.default ref={input} label={translate('loginForm.phoneOrEmail')} accessibilityLabel={translate('loginForm.phoneOrEmail')} value={login} returnKeyType="go" autoCompleteType="username" textContentType="username" id="username" name="username" testID="username" onBlur={
        // As we have only two signin buttons (Apple/Google) other than the text input,
        // for natives onBlur is called only when the buttons are pressed and we don't need
        // to validate in those case as the user has opted for other signin flow.
        () => setTimeout(() => {
            if (isSigningWithAppleOrGoogle.current || firstBlurred.current || !Visibility_1.default.isVisible() || !Visibility_1.default.hasFocus()) {
                setIsSigningWithAppleOrGoogle(false);
                return;
            }
            firstBlurred.current = true;
            validate(login);
        }, 500)} onFocus={handleFocus} onChangeText={onTextInput} onSubmitEditing={validateAndSubmitForm} autoCapitalize="none" autoCorrect={false} inputMode={CONST_1.default.INPUT_MODE.EMAIL} errorText={formError ? translate(formError) : undefined} hasError={shouldShowServerError} maxLength={CONST_1.default.LOGIN_CHARACTER_LIMIT}/>
            </react_native_1.View>
            {!!account?.success && <Text_1.default style={[styles.formSuccess]}>{account.success}</Text_1.default>}
            {(!!closeAccount?.success || !!account?.message) && (<DotIndicatorMessage_1.default style={[styles.mv2]} type="success" 
        // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/prefer-nullish-coalescing
        messages={{ 0: closeAccount?.success ? closeAccount.success : accountMessage }}/>)}
            {
        // We need to unmount the submit button when the component is not visible so that the Enter button
        // key handler gets unsubscribed
        isVisible && (<react_native_1.View style={[shouldShowServerError ? {} : styles.mt5]} ref={(0, viewRef_1.default)(submitContainerRef)}>
                        <FormAlertWithSubmitButton_1.default buttonText={translate('common.continue')} isLoading={account?.isLoading && account?.loadingForm === CONST_1.default.FORMS.LOGIN_FORM} onSubmit={validateAndSubmitForm} message={serverErrorText} isAlertVisible={shouldShowServerError} buttonStyles={[shouldShowServerError ? styles.mt3 : {}]} containerStyles={[styles.mh0]}/>
                        {
            // This feature has a few behavioral differences in development mode. To prevent confusion
            // for developers about possible regressions, we won't render buttons in development mode.
            // For more information about these differences and how to test in development mode,
            // see`Expensify/App/contributingGuides/APPLE_GOOGLE_SIGNIN.md`
            CONFIG_1.default.ENVIRONMENT !== CONST_1.default.ENVIRONMENT.DEV && (<react_native_1.View style={[getSignInWithStyles()]}>
                                    <Text_1.default accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.textLabelSupporting, styles.textAlignCenter, styles.mb3, styles.mt2]}>
                                        {translate('common.signInWith')}
                                    </Text_1.default>

                                    <react_native_1.View style={shouldUseNarrowLayout ? styles.loginButtonRowSmallScreen : styles.loginButtonRow}>
                                        <react_native_1.View>
                                            <AppleSignIn_1.default onPress={handleSignIn} onPointerDown={handleSignIn}/>
                                        </react_native_1.View>
                                        <react_native_1.View>
                                            <GoogleSignIn_1.default onPress={handleSignIn} onPointerDown={handleSignIn}/>
                                        </react_native_1.View>
                                    </react_native_1.View>
                                </react_native_1.View>)}
                    </react_native_1.View>)}
        </>);
}
BaseLoginForm.displayName = 'BaseLoginForm';
exports.default = (0, withToggleVisibilityView_1.default)(BaseLoginForm);
