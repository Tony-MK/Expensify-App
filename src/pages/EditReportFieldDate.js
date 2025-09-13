"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const DatePicker_1 = require("@components/DatePicker");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function EditReportFieldDatePage({ fieldName, isRequired, onSubmit, fieldValue, fieldKey }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const inputRef = (0, react_1.useRef)(null);
    const validate = (0, react_1.useCallback)((value) => {
        const errors = {};
        if (isRequired && value[fieldKey].trim() === '') {
            errors[fieldKey] = translate('common.error.fieldRequired');
        }
        return errors;
    }, [fieldKey, isRequired, translate]);
    return (<FormProvider_1.default style={[styles.flexGrow1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.REPORT_FIELDS_EDIT_FORM} onSubmit={onSubmit} validate={validate} submitButtonText={translate('common.save')} enabledWhenOffline shouldHideFixErrorsAlert>
            <react_native_1.View style={styles.mb4}>
                <InputWrapper_1.default InputComponent={DatePicker_1.default} inputID={fieldKey} name={fieldKey} defaultValue={fieldValue} label={fieldName} accessibilityLabel={fieldName} role={CONST_1.default.ROLE.PRESENTATION} maxDate={CONST_1.default.CALENDAR_PICKER.MAX_DATE} minDate={CONST_1.default.CALENDAR_PICKER.MIN_DATE} ref={inputRef} autoFocus/>
            </react_native_1.View>
        </FormProvider_1.default>);
}
EditReportFieldDatePage.displayName = 'EditReportFieldDatePage';
exports.default = EditReportFieldDatePage;
