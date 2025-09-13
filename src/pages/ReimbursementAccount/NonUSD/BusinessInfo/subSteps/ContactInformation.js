"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const FormActions_1 = require("@userActions/FormActions");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const { BUSINESS_CONTACT_NUMBER, BUSINESS_CONFIRMATION_EMAIL } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
const STEP_FIELDS = [BUSINESS_CONTACT_NUMBER, BUSINESS_CONFIRMATION_EMAIL];
function ContactInformation({ onNext, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const primaryLogin = account?.primaryLogin ?? '';
    const phoneNumberDefaultValue = reimbursementAccount?.achData?.corpay?.[BUSINESS_CONTACT_NUMBER] ?? '';
    const confirmationEmailDefaultValue = reimbursementAccount?.achData?.corpay?.[BUSINESS_CONFIRMATION_EMAIL] ?? primaryLogin ?? '';
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, STEP_FIELDS);
        if (values[BUSINESS_CONTACT_NUMBER] && !(0, ValidationUtils_1.isValidPhoneInternational)(values[BUSINESS_CONTACT_NUMBER])) {
            errors[BUSINESS_CONTACT_NUMBER] = translate('common.error.phoneNumber');
        }
        if (values[BUSINESS_CONFIRMATION_EMAIL] && !(0, ValidationUtils_1.isValidEmail)(values[BUSINESS_CONFIRMATION_EMAIL])) {
            errors[BUSINESS_CONFIRMATION_EMAIL] = translate('common.error.email');
        }
        return errors;
    }, [translate]);
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext: (values) => {
            (0, FormActions_1.setDraftValues)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM, {
                [BUSINESS_CONFIRMATION_EMAIL]: values[BUSINESS_CONFIRMATION_EMAIL],
            });
            onNext();
        },
        shouldSaveDraft: true,
    });
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} onSubmit={handleSubmit} validate={validate} style={[styles.flexGrow1]} submitButtonStyles={[styles.mh5]}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mh5, styles.mb3]}>{translate('businessInfoStep.whatsTheBusinessContactInformation')}</Text_1.default>
            <InputWrapper_1.default InputComponent={TextInput_1.default} label={translate('common.phoneNumber')} aria-label={translate('common.phoneNumber')} role={CONST_1.default.ROLE.PRESENTATION} inputMode={CONST_1.default.INPUT_MODE.TEL} inputID={BUSINESS_CONTACT_NUMBER} containerStyles={[styles.mt5, styles.mh5]} defaultValue={phoneNumberDefaultValue} shouldSaveDraft={!isEditing}/>
            <InputWrapper_1.default InputComponent={TextInput_1.default} label={translate('common.email')} aria-label={translate('common.email')} role={CONST_1.default.ROLE.PRESENTATION} inputMode={CONST_1.default.INPUT_MODE.EMAIL} inputID={BUSINESS_CONFIRMATION_EMAIL} containerStyles={[styles.mt5, styles.mh5]} defaultValue={confirmationEmailDefaultValue} shouldSaveDraft={!isEditing}/>
        </FormProvider_1.default>);
}
ContactInformation.displayName = 'ContactInformation';
exports.default = ContactInformation;
