"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const react_1 = require("react");
const DatePicker_1 = require("@components/DatePicker");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
function DateOfBirthStep({ formID, formTitle, customValidate, onSubmit, stepFields, dobInputID, dobDefaultValue, isEditing, footerComponent, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const minDate = (0, date_fns_1.subYears)(new Date(), CONST_1.default.DATE_BIRTH.MAX_AGE);
    const maxDate = (0, date_fns_1.subYears)(new Date(), CONST_1.default.DATE_BIRTH.MIN_AGE_FOR_PAYMENT);
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, stepFields);
        const valuesToValidate = values[dobInputID];
        if (valuesToValidate) {
            if (!(0, ValidationUtils_1.isValidPastDate)(valuesToValidate) || !(0, ValidationUtils_1.meetsMaximumAgeRequirement)(valuesToValidate)) {
                // @ts-expect-error type mismatch to be fixed
                errors[dobInputID] = translate('bankAccount.error.dob');
            }
            else if (!(0, ValidationUtils_1.meetsMinimumAgeRequirement)(valuesToValidate)) {
                // @ts-expect-error type mismatch to be fixed
                errors[dobInputID] = translate('bankAccount.error.age');
            }
        }
        return errors;
    }, [dobInputID, stepFields, translate]);
    return (<FormProvider_1.default formID={formID} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} validate={customValidate ?? validate} onSubmit={onSubmit} style={[styles.mh5, styles.flexGrow2, styles.justifyContentBetween]} submitButtonStyles={[styles.mb0]} enabledWhenOffline shouldHideFixErrorsAlert>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb5]}>{formTitle}</Text_1.default>
            <InputWrapper_1.default InputComponent={DatePicker_1.default} inputID={dobInputID} label={translate('common.dob')} placeholder={translate('common.dateFormat')} defaultValue={dobDefaultValue} minDate={minDate} maxDate={maxDate} shouldSaveDraft={!isEditing} autoFocus/>
            {footerComponent}
        </FormProvider_1.default>);
}
DateOfBirthStep.displayName = 'DateOfBirthStep';
exports.default = DateOfBirthStep;
