"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Browser_1 = require("@libs/Browser");
const CONST_1 = require("@src/CONST");
const PDFInfoMessage_1 = require("./PDFInfoMessage");
function PDFPasswordForm({ isFocused, isPasswordInvalid = false, shouldShowLoadingIndicator = false, onSubmit, onPasswordUpdated, onPasswordFieldFocused }) {
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [password, setPassword] = (0, react_1.useState)('');
    const [validationErrorText, setValidationErrorText] = (0, react_1.useState)('');
    const [shouldShowForm, setShouldShowForm] = (0, react_1.useState)(false);
    const textInputRef = (0, react_1.useRef)(null);
    const focusTimeoutRef = (0, react_1.useRef)(undefined);
    const errorText = (0, react_1.useMemo)(() => {
        if (isPasswordInvalid) {
            return translate('attachmentView.passwordIncorrect');
        }
        if (validationErrorText) {
            return translate(validationErrorText);
        }
        return '';
    }, [isPasswordInvalid, validationErrorText, translate]);
    (0, react_1.useEffect)(() => {
        if (!isFocused) {
            return;
        }
        if (!textInputRef.current) {
            return;
        }
        /**
         * We recommend using setTimeout to wait for the animation to finish and then focus on the input
         * Relevant thread: https://expensify.slack.com/archives/C01GTK53T8Q/p1694660990479979
         */
        focusTimeoutRef.current = setTimeout(() => {
            textInputRef.current?.focus();
        }, CONST_1.default.ANIMATED_TRANSITION);
        return () => {
            if (!focusTimeoutRef.current) {
                return;
            }
            clearTimeout(focusTimeoutRef.current);
        };
    }, [isFocused]);
    const updatePassword = (newPassword) => {
        onPasswordUpdated?.(newPassword);
        if (newPassword && validationErrorText) {
            setValidationErrorText('');
        }
        setPassword(newPassword);
    };
    const validate = () => {
        if (!isPasswordInvalid && password) {
            return true;
        }
        if (!password) {
            setValidationErrorText('attachmentView.passwordRequired');
        }
        return false;
    };
    const submitPassword = () => {
        if (!validate()) {
            return;
        }
        onSubmit?.(password);
    };
    return shouldShowForm ? (<ScrollView_1.default keyboardShouldPersistTaps="handled" style={styles.getPDFPasswordFormStyle(shouldUseNarrowLayout)} contentContainerStyle={styles.p5}>
            <react_native_1.View style={styles.mb4}>
                <Text_1.default>{translate('attachmentView.pdfPasswordForm.formLabel')}</Text_1.default>
            </react_native_1.View>
            <TextInput_1.default ref={textInputRef} label={translate('common.password')} accessibilityLabel={translate('common.password')} role={CONST_1.default.ROLE.PRESENTATION} 
    /**
     * This is a workaround to bypass Safari's autofill odd behaviour.
     * This tricks the browser not to fill the username somewhere else and still fill the password correctly.
     */
    autoComplete={(0, Browser_1.getBrowser)() === CONST_1.default.BROWSER.SAFARI ? 'username' : 'off'} autoCorrect={false} textContentType="password" onChangeText={updatePassword} enterKeyHint="done" onSubmitEditing={submitPassword} errorText={errorText} onFocus={() => onPasswordFieldFocused?.(true)} onBlur={() => onPasswordFieldFocused?.(false)} autoFocus secureTextEntry/>
            <Button_1.default 
    // Keep focus on the TextInput effectively keeping keyboard open
    onMouseDown={(e) => e.preventDefault()} text={translate('common.confirm')} onPress={submitPassword} style={styles.mt4} isLoading={shouldShowLoadingIndicator} pressOnEnter large/>
        </ScrollView_1.default>) : (<react_native_1.View style={[styles.flex1, styles.justifyContentCenter]}>
            <PDFInfoMessage_1.default onShowForm={() => setShouldShowForm(true)}/>
        </react_native_1.View>);
}
PDFPasswordForm.displayName = 'PDFPasswordForm';
exports.default = PDFPasswordForm;
