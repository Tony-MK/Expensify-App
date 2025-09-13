"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CheckboxWithLabel_1 = require("@components/CheckboxWithLabel");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const COMPLETE_VERIFICATION_KEYS = ReimbursementAccountForm_1.default.COMPLETE_VERIFICATION;
const STEP_FIELDS = [
    ReimbursementAccountForm_1.default.COMPLETE_VERIFICATION.IS_AUTHORIZED_TO_USE_BANK_ACCOUNT,
    ReimbursementAccountForm_1.default.COMPLETE_VERIFICATION.ACCEPT_TERMS_AND_CONDITIONS,
    ReimbursementAccountForm_1.default.COMPLETE_VERIFICATION.CERTIFY_TRUE_INFORMATION,
];
function IsAuthorizedToUseBankAccountLabel() {
    const { translate } = (0, useLocalize_1.default)();
    return <Text_1.default>{translate('completeVerificationStep.isAuthorizedToUseBankAccount')}</Text_1.default>;
}
function CertifyTrueAndAccurateLabel() {
    const { translate } = (0, useLocalize_1.default)();
    return <Text_1.default>{translate('completeVerificationStep.certifyTrueAndAccurate')}</Text_1.default>;
}
function TermsAndConditionsLabel() {
    const { translate } = (0, useLocalize_1.default)();
    return (<Text_1.default>
            {translate('common.iAcceptThe')}
            <TextLink_1.default href={CONST_1.default.OLD_DOT_PUBLIC_URLS.ACH_TERMS_URL}>{`${translate('completeVerificationStep.termsAndConditions')}`}</TextLink_1.default>
        </Text_1.default>);
}
function ConfirmAgreements({ onNext }) {
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT);
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const defaultValues = {
        isAuthorizedToUseBankAccount: reimbursementAccount?.achData?.isAuthorizedToUseBankAccount ?? false,
        certifyTrueInformation: reimbursementAccount?.achData?.certifyTrueInformation ?? false,
        acceptTermsAndConditions: reimbursementAccount?.achData?.acceptTermsAndConditions ?? false,
    };
    const validate = (0, react_1.useCallback)((values) => {
        const errors = ValidationUtils.getFieldRequiredErrors(values, STEP_FIELDS);
        if (!ValidationUtils.isRequiredFulfilled(values.acceptTermsAndConditions)) {
            errors.acceptTermsAndConditions = translate('common.error.acceptTerms');
        }
        if (!ValidationUtils.isRequiredFulfilled(values.certifyTrueInformation)) {
            errors.certifyTrueInformation = translate('completeVerificationStep.certifyTrueAndAccurateError');
        }
        if (!ValidationUtils.isRequiredFulfilled(values.isAuthorizedToUseBankAccount)) {
            errors.isAuthorizedToUseBankAccount = translate('completeVerificationStep.isAuthorizedToUseBankAccountError');
        }
        return errors;
    }, [translate]);
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} validate={validate} onSubmit={onNext} submitButtonText={translate('common.saveAndContinue')} style={[styles.mh5, styles.flexGrow1]} enabledWhenOffline={false}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL]}>{translate('completeVerificationStep.confirmAgreements')}</Text_1.default>
            <InputWrapper_1.default InputComponent={CheckboxWithLabel_1.default} accessibilityLabel={translate('completeVerificationStep.isAuthorizedToUseBankAccount')} inputID={COMPLETE_VERIFICATION_KEYS.IS_AUTHORIZED_TO_USE_BANK_ACCOUNT} style={styles.mt6} LabelComponent={IsAuthorizedToUseBankAccountLabel} defaultValue={defaultValues.isAuthorizedToUseBankAccount} shouldSaveDraft/>
            <InputWrapper_1.default InputComponent={CheckboxWithLabel_1.default} accessibilityLabel={translate('completeVerificationStep.certifyTrueAndAccurate')} inputID={COMPLETE_VERIFICATION_KEYS.CERTIFY_TRUE_INFORMATION} style={styles.mt6} LabelComponent={CertifyTrueAndAccurateLabel} defaultValue={defaultValues.certifyTrueInformation} shouldSaveDraft/>
            <InputWrapper_1.default InputComponent={CheckboxWithLabel_1.default} accessibilityLabel={`${translate('common.iAcceptThe')} ${translate('completeVerificationStep.termsAndConditions')}`} inputID={COMPLETE_VERIFICATION_KEYS.ACCEPT_TERMS_AND_CONDITIONS} style={styles.mt6} LabelComponent={TermsAndConditionsLabel} defaultValue={defaultValues.acceptTermsAndConditions} shouldSaveDraft/>
        </FormProvider_1.default>);
}
ConfirmAgreements.displayName = 'ConfirmAgreements';
exports.default = ConfirmAgreements;
