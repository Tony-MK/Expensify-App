"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const DotIndicatorMessage_1 = require("@components/DotIndicatorMessage");
const MagicCodeInput_1 = require("@components/MagicCodeInput");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Browser_1 = require("@libs/Browser");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const User_1 = require("@userActions/User");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function BaseValidateCodeForm({ autoComplete = 'one-time-code', innerRef = () => { }, hasMagicCodeBeenSent, validateCodeActionErrorField, validatePendingAction, validateError, handleSubmitForm, clearError, sendValidateCode, buttonStyles, hideSubmitButton, submitButtonText, isLoading, shouldShowSkipButton = false, handleSkipButtonPress, }) {
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const [formError, setFormError] = (0, react_1.useState)({});
    const [validateCode, setValidateCode] = (0, react_1.useState)('');
    const inputValidateCodeRef = (0, react_1.useRef)(null);
    const [account = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, {
        canBeMissing: true,
    });
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- nullish coalescing doesn't achieve the same result in this case
    const shouldDisableResendValidateCode = !!isOffline || account?.isLoading;
    const focusTimeoutRef = (0, react_1.useRef)(null);
    const [timeRemaining, setTimeRemaining] = (0, react_1.useState)(CONST_1.default.REQUEST_CODE_DELAY);
    const [canShowError, setCanShowError] = (0, react_1.useState)(false);
    const [validateCodeAction] = (0, useOnyx_1.default)(ONYXKEYS_1.default.VALIDATE_ACTION_CODE, { canBeMissing: true });
    const validateCodeSent = (0, react_1.useMemo)(() => hasMagicCodeBeenSent ?? validateCodeAction?.validateCodeSent, [hasMagicCodeBeenSent, validateCodeAction?.validateCodeSent]);
    const latestValidateCodeError = (0, ErrorUtils_1.getLatestErrorField)(validateCodeAction, validateCodeActionErrorField);
    const timerRef = (0, react_1.useRef)(undefined);
    (0, react_1.useImperativeHandle)(innerRef, () => ({
        focus() {
            inputValidateCodeRef.current?.focus();
        },
        focusLastSelected() {
            if (!inputValidateCodeRef.current) {
                return;
            }
            if (focusTimeoutRef.current) {
                clearTimeout(focusTimeoutRef.current);
            }
            focusTimeoutRef.current = setTimeout(() => {
                inputValidateCodeRef.current?.focusLastSelected();
            }, CONST_1.default.ANIMATED_TRANSITION);
        },
    }));
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        if (!inputValidateCodeRef.current) {
            return;
        }
        if (focusTimeoutRef.current) {
            clearTimeout(focusTimeoutRef.current);
        }
        // Keyboard won't show if we focus the input with a delay, so we need to focus immediately.
        if (!(0, Browser_1.isMobileSafari)()) {
            focusTimeoutRef.current = setTimeout(() => {
                inputValidateCodeRef.current?.focusLastSelected();
            }, CONST_1.default.ANIMATED_TRANSITION);
        }
        else {
            inputValidateCodeRef.current?.focusLastSelected();
        }
        return () => {
            if (!focusTimeoutRef.current) {
                return;
            }
            clearTimeout(focusTimeoutRef.current);
        };
    }, []));
    (0, react_1.useEffect)(() => {
        if (!validateCodeSent) {
            return;
        }
        inputValidateCodeRef.current?.clear();
    }, [validateCodeSent]);
    (0, react_1.useEffect)(() => {
        if (timeRemaining > 0) {
            timerRef.current = setTimeout(() => {
                setTimeRemaining(timeRemaining - 1);
            }, 1000);
        }
        return () => {
            clearTimeout(timerRef.current);
        };
    }, [timeRemaining]);
    /**
     * Request a validate code / magic code be sent to verify this contact method
     */
    const resendValidateCode = () => {
        sendValidateCode();
        inputValidateCodeRef.current?.clear();
        setTimeRemaining(CONST_1.default.REQUEST_CODE_DELAY);
    };
    /**
     * Handle text input and clear formError upon text change
     */
    const onTextInput = (0, react_1.useCallback)((text) => {
        setValidateCode(text);
        setFormError({});
        if (!(0, EmptyObject_1.isEmptyObject)(validateError) || !(0, EmptyObject_1.isEmptyObject)(latestValidateCodeError)) {
            // Clear flow specific error
            clearError();
            // Clear "incorrect magic code" error
            (0, User_1.clearValidateCodeActionError)(validateCodeActionErrorField);
        }
    }, [validateError, clearError, latestValidateCodeError, validateCodeActionErrorField]);
    /**
     * Check that all the form fields are valid, then trigger the submit callback
     */
    const validateAndSubmitForm = (0, react_1.useCallback)(() => {
        // Clear flow specific error
        clearError();
        // Clear "incorrect magic" code error
        (0, User_1.clearValidateCodeActionError)(validateCodeActionErrorField);
        setCanShowError(true);
        if (!validateCode.trim()) {
            setFormError({ validateCode: 'validateCodeForm.error.pleaseFillMagicCode' });
            return;
        }
        if (!(0, ValidationUtils_1.isValidValidateCode)(validateCode)) {
            setFormError({ validateCode: 'validateCodeForm.error.incorrectMagicCode' });
            return;
        }
        setFormError({});
        handleSubmitForm(validateCode);
    }, [validateCode, handleSubmitForm, validateCodeActionErrorField, clearError]);
    const errorText = (0, react_1.useMemo)(() => {
        if (!canShowError) {
            return '';
        }
        if (formError?.validateCode) {
            return translate(formError?.validateCode);
        }
        return (0, ErrorUtils_1.getLatestErrorMessage)(account ?? {});
    }, [canShowError, formError, account, translate]);
    const shouldShowTimer = timeRemaining > 0 && !isOffline;
    // latestValidateCodeError only holds an error related to bad magic code
    // while validateError holds flow-specific errors
    const finalValidateError = !(0, EmptyObject_1.isEmptyObject)(latestValidateCodeError) ? latestValidateCodeError : validateError;
    return (<>
            <MagicCodeInput_1.default autoComplete={autoComplete} ref={inputValidateCodeRef} name="validateCode" value={validateCode} onChangeText={onTextInput} errorText={errorText} hasError={canShowError && !(0, EmptyObject_1.isEmptyObject)(finalValidateError)} onFulfill={validateAndSubmitForm} autoFocus={false}/>
            {shouldShowTimer && (<Text_1.default style={[styles.mt5]}>
                    {translate('validateCodeForm.requestNewCode')}
                    <Text_1.default style={[styles.textBlue]}>00:{String(timeRemaining).padStart(2, '0')}</Text_1.default>
                </Text_1.default>)}
            <OfflineWithFeedback_1.default pendingAction={validateCodeAction?.pendingFields?.validateCodeSent} errorRowStyles={[styles.mt2]} onClose={() => (0, User_1.clearValidateCodeActionError)(validateCodeActionErrorField)}>
                {!shouldShowTimer && (<react_native_1.View style={[styles.mt5, styles.dFlex, styles.flexColumn, styles.alignItemsStart]}>
                        <PressableWithFeedback_1.default disabled={shouldDisableResendValidateCode} style={[styles.mr1]} onPress={resendValidateCode} underlayColor={theme.componentBG} hoverDimmingValue={1} pressDimmingValue={0.2} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('validateCodeForm.magicCodeNotReceived')}>
                            <Text_1.default style={[StyleUtils.getDisabledLinkStyles(shouldDisableResendValidateCode)]}>{translate('validateCodeForm.magicCodeNotReceived')}</Text_1.default>
                        </PressableWithFeedback_1.default>
                    </react_native_1.View>)}
            </OfflineWithFeedback_1.default>
            {!!validateCodeSent && (<DotIndicatorMessage_1.default type="success" style={[styles.mt6, styles.flex0]} 
        // eslint-disable-next-line @typescript-eslint/naming-convention
        messages={{ 0: translate('validateCodeModal.successfulNewCodeRequest') }}/>)}

            <OfflineWithFeedback_1.default shouldDisplayErrorAbove pendingAction={validatePendingAction} errors={canShowError ? finalValidateError : undefined} errorRowStyles={[styles.mt2, styles.textWrap]} onClose={() => {
            clearError();
            if (!(0, EmptyObject_1.isEmptyObject)(validateCodeAction?.errorFields) && validateCodeActionErrorField) {
                (0, User_1.clearValidateCodeActionError)(validateCodeActionErrorField);
            }
        }} style={buttonStyles}>
                {shouldShowSkipButton && (<Button_1.default text={translate('common.skip')} onPress={handleSkipButtonPress} style={[styles.mt4]} success={false} large/>)}
                {!hideSubmitButton && (<Button_1.default isDisabled={isOffline} text={submitButtonText ?? translate('common.verify')} onPress={validateAndSubmitForm} style={[shouldShowSkipButton ? styles.mt3 : styles.mt4]} success large 
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        isLoading={account?.isLoading || isLoading}/>)}
            </OfflineWithFeedback_1.default>
        </>);
}
BaseValidateCodeForm.displayName = 'BaseValidateCodeForm';
exports.default = BaseValidateCodeForm;
