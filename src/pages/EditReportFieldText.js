"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function EditReportFieldTextPage({ fieldName, onSubmit, fieldValue, isRequired, fieldKey }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        if (isRequired && values[fieldKey].trim() === '') {
            errors[fieldKey] = translate('common.error.fieldRequired');
        }
        return errors;
    }, [fieldKey, isRequired, translate]);
    return (<FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.REPORT_FIELDS_EDIT_FORM} onSubmit={onSubmit} validate={validate} submitButtonText={translate('common.save')} enabledWhenOffline shouldHideFixErrorsAlert>
            <react_native_1.View style={styles.mb4}>
                <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={fieldKey} name={fieldKey} defaultValue={fieldValue} label={fieldName} accessibilityLabel={fieldName} role={CONST_1.default.ROLE.PRESENTATION} ref={inputCallbackRef}/>
            </react_native_1.View>
        </FormProvider_1.default>);
}
EditReportFieldTextPage.displayName = 'EditReportFieldTextPage';
exports.default = EditReportFieldTextPage;
