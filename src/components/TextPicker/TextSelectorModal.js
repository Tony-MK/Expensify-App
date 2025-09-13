"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Modal_1 = require("@components/Modal");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function TextSelectorModal({ value, description = '', subtitle, onValueSelected, isVisible, onClose, shouldClearOnClose, maxLength = CONST_1.default.CATEGORY_NAME_LIMIT, required = false, ...rest }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [currentValue, setValue] = (0, react_1.useState)(value);
    const inputRef = (0, react_1.useRef)(null);
    const inputValueRef = (0, react_1.useRef)(value);
    const focusTimeoutRef = (0, react_1.useRef)(null);
    const inputCallbackRef = (ref) => {
        inputRef.current = ref;
    };
    const hide = (0, react_1.useCallback)(() => {
        onClose();
        if (shouldClearOnClose) {
            setValue('');
        }
    }, [onClose, shouldClearOnClose]);
    const validate = (0, react_1.useCallback)((values) => {
        let errors = {};
        const formValue = values[rest.inputID];
        if (required) {
            errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [rest.inputID]);
        }
        if (formValue.length > maxLength) {
            errors[rest.inputID] = translate('common.error.characterLimitExceedCounter', { length: formValue.length, limit: maxLength });
        }
        return errors;
    }, [maxLength, rest.inputID, required, translate]);
    // In TextPicker, when the modal is hidden, it is not completely unmounted, so when it is shown again, the currentValue is not updated with the value prop.
    // Therefore, we need to update the currentValue with the value prop when the modal is shown. This is done once when the modal is shown again.
    (0, react_1.useEffect)(() => {
        if (!isVisible) {
            return;
        }
        setValue(value);
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [isVisible]);
    (0, react_1.useEffect)(() => {
        inputValueRef.current = currentValue;
    }, [currentValue]);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        focusTimeoutRef.current = setTimeout(() => {
            if (inputRef.current && isVisible) {
                inputRef.current.focus();
                inputRef.current.setSelection?.(inputValueRef.current?.length ?? 0, inputValueRef.current?.length ?? 0);
            }
            return () => {
                if (!focusTimeoutRef.current || !isVisible) {
                    return;
                }
                clearTimeout(focusTimeoutRef.current);
            };
        }, CONST_1.default.ANIMATED_TRANSITION);
    }, [isVisible]));
    const handleSubmit = (0, react_1.useCallback)((data) => {
        const submittedValue = data[rest.inputID] ?? '';
        if (required && !submittedValue.trim()) {
            return;
        }
        react_native_1.Keyboard.dismiss();
        onValueSelected?.(submittedValue);
    }, [onValueSelected, rest.inputID, required]);
    return (<Modal_1.default type={CONST_1.default.MODAL.MODAL_TYPE.RIGHT_DOCKED} isVisible={isVisible} onClose={hide} onModalHide={hide} shouldUseModalPaddingStyle={false} enableEdgeToEdgeBottomSafeAreaPadding>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding includePaddingTop testID={TextSelectorModal.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={description} onBackButtonPress={hide}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.TEXT_PICKER_MODAL_FORM} validate={validate} onSubmit={handleSubmit} submitButtonText={translate('common.save')} style={[styles.mh5, styles.flex1]} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding enterKeyEventListenerPriority={0}>
                    <react_native_1.View style={styles.pb4}>{!!subtitle && <Text_1.default style={[styles.sidebarLinkText, styles.optionAlternateText]}>{subtitle}</Text_1.default>}</react_native_1.View>
                    <InputWrapper_1.default ref={inputCallbackRef} InputComponent={TextInput_1.default} value={currentValue} onValueChange={(changedValue) => setValue(changedValue.toString())} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest} inputID={rest.inputID}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </Modal_1.default>);
}
TextSelectorModal.displayName = 'TextSelectorModal';
exports.default = TextSelectorModal;
