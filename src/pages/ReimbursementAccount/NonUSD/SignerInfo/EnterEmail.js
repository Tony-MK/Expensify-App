"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const { COMPANY_NAME, SIGNER_EMAIL, SECOND_SIGNER_EMAIL } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
function EnterEmail({ onSubmit, isUserDirector, isLoading }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const policyID = reimbursementAccount?.achData?.policyID;
    const policy = (0, usePolicy_1.default)(policyID);
    const currency = policy?.outputCurrency ?? '';
    const shouldGatherBothEmails = currency === CONST_1.default.CURRENCY.AUD && !isUserDirector;
    const companyName = reimbursementAccount?.achData?.corpay?.[COMPANY_NAME] ?? '';
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, shouldGatherBothEmails ? [SIGNER_EMAIL, SECOND_SIGNER_EMAIL] : [SIGNER_EMAIL]);
        if (values[SIGNER_EMAIL] && !expensify_common_1.Str.isValidEmail(values[SIGNER_EMAIL])) {
            errors[SIGNER_EMAIL] = translate('bankAccount.error.email');
        }
        if (shouldGatherBothEmails && values[SECOND_SIGNER_EMAIL] && !expensify_common_1.Str.isValidEmail(String(values[SECOND_SIGNER_EMAIL]))) {
            errors[SECOND_SIGNER_EMAIL] = translate('bankAccount.error.email');
        }
        return errors;
    }, [shouldGatherBothEmails, translate]);
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} submitButtonText={translate('common.next')} onSubmit={onSubmit} isLoading={isLoading} validate={validate} style={[styles.mh5, styles.flexGrow1]} shouldHideFixErrorsAlert={!shouldGatherBothEmails}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL]}>{translate(shouldGatherBothEmails ? 'signerInfoStep.enterTwoEmails' : 'signerInfoStep.enterOneEmail', { companyName })}</Text_1.default>
            {!shouldGatherBothEmails && <Text_1.default style={[styles.pv3, styles.textSupporting]}>{translate('signerInfoStep.regulationRequiresOneMoreDirector')}</Text_1.default>}
            <InputWrapper_1.default InputComponent={TextInput_1.default} label={shouldGatherBothEmails ? `${translate('common.email')} 1` : translate('common.email')} aria-label={shouldGatherBothEmails ? `${translate('common.email')} 1` : translate('common.email')} role={CONST_1.default.ROLE.PRESENTATION} inputID={SIGNER_EMAIL} inputMode={CONST_1.default.INPUT_MODE.EMAIL} containerStyles={[styles.mt6]}/>
            {shouldGatherBothEmails && (<InputWrapper_1.default InputComponent={TextInput_1.default} label={`${translate('common.email')} 2`} aria-label={`${translate('common.email')} 2`} role={CONST_1.default.ROLE.PRESENTATION} inputID={SECOND_SIGNER_EMAIL} inputMode={CONST_1.default.INPUT_MODE.EMAIL} containerStyles={[styles.mt6]}/>)}
        </FormProvider_1.default>);
}
EnterEmail.displayName = 'EnterEmail';
exports.default = EnterEmail;
