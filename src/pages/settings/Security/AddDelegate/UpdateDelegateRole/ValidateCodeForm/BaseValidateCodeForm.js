"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
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
const ErrorUtils = require("@libs/ErrorUtils");
const ValidationUtils = require("@libs/ValidationUtils");
const Delegate = require("@userActions/Delegate");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function BaseValidateCodeForm({ autoComplete = 'one-time-code', innerRef = () => { }, delegate, role, wrapperStyle }) {
    const { translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const [formError, setFormError] = (0, react_1.useState)({});
    const [validateCode, setValidateCode] = (0, react_1.useState)('');
    const inputValidateCodeRef = (0, react_1.useRef)(null);
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT);
    const login = account?.primaryLogin;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- nullish coalescing doesn't achieve the same result in this case
    const focusTimeoutRef = (0, react_1.useRef)(null);
    const currentDelegate = account?.delegatedAccess?.delegates?.find((d) => d.email === delegate);
    const errorFields = account?.delegatedAccess?.errorFields ?? {};
    const validateLoginError = ErrorUtils.getLatestError(errorFields.updateDelegateRole?.[currentDelegate?.email ?? '']);
    const shouldDisableResendValidateCode = !!isOffline || currentDelegate?.isLoading;
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
        focusTimeoutRef.current = setTimeout(() => {
            inputValidateCodeRef.current?.focusLastSelected();
        }, CONST_1.default.ANIMATED_TRANSITION);
        return () => {
            if (!focusTimeoutRef.current) {
                return;
            }
            clearTimeout(focusTimeoutRef.current);
        };
    }, []));
    /**
     * Request a validate code / magic code be sent to verify this contact method
     */
    const resendValidateCode = () => {
        if (!login) {
            return;
        }
        Delegate.requestValidationCode();
        inputValidateCodeRef.current?.clear();
    };
    /**
     * Handle text input and clear formError upon text change
     */
    const onTextInput = (0, react_1.useCallback)((text) => {
        setValidateCode(text);
        setFormError({});
        if (validateLoginError) {
            Delegate.clearDelegateErrorsByField(currentDelegate?.email ?? '', 'updateDelegateRole');
        }
    }, [currentDelegate?.email, validateLoginError]);
    /**
     * Check that all the form fields are valid, then trigger the submit callback
     */
    const validateAndSubmitForm = (0, react_1.useCallback)(() => {
        if (!validateCode.trim()) {
            setFormError({ validateCode: 'validateCodeForm.error.pleaseFillMagicCode' });
            return;
        }
        if (!ValidationUtils.isValidValidateCode(validateCode)) {
            setFormError({ validateCode: 'validateCodeForm.error.incorrectMagicCode' });
            return;
        }
        setFormError({});
        Delegate.updateDelegateRole(delegate, role, validateCode);
    }, [delegate, role, validateCode]);
    return (<react_native_1.View style={[styles.flex1, styles.justifyContentBetween, wrapperStyle]}>
            <react_native_1.View style={[styles.ph5, styles.mt3]}>
                <MagicCodeInput_1.default autoComplete={autoComplete} ref={inputValidateCodeRef} name="validateCode" value={validateCode} onChangeText={onTextInput} errorText={formError?.validateCode ? translate(formError?.validateCode) : (Object.values(validateLoginError ?? {}).at(0) ?? '')} hasError={!(0, EmptyObject_1.isEmptyObject)(validateLoginError)} onFulfill={validateAndSubmitForm} autoFocus={false}/>
                <OfflineWithFeedback_1.default errorRowStyles={[styles.mt2]}>
                    <react_native_1.View style={[styles.mt2, styles.dFlex, styles.flexColumn, styles.alignItemsStart]}>
                        <PressableWithFeedback_1.default disabled={shouldDisableResendValidateCode} style={[styles.mr1]} onPress={resendValidateCode} underlayColor={theme.componentBG} hoverDimmingValue={1} pressDimmingValue={0.2} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('validateCodeForm.magicCodeNotReceived')}>
                            <Text_1.default style={[StyleUtils.getDisabledLinkStyles(shouldDisableResendValidateCode)]}>{translate('validateCodeForm.magicCodeNotReceived')}</Text_1.default>
                        </PressableWithFeedback_1.default>
                    </react_native_1.View>
                </OfflineWithFeedback_1.default>
            </react_native_1.View>
            <FixedFooter_1.default>
                <OfflineWithFeedback_1.default>
                    <Button_1.default isDisabled={isOffline} text={translate('common.verify')} onPress={validateAndSubmitForm} style={[styles.mt4]} success pressOnEnter large isLoading={currentDelegate?.isLoading}/>
                </OfflineWithFeedback_1.default>
            </FixedFooter_1.default>
        </react_native_1.View>);
}
BaseValidateCodeForm.displayName = 'BaseValidateCodeForm';
exports.default = BaseValidateCodeForm;
