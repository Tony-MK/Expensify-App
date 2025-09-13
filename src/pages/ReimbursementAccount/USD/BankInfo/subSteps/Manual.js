"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const ExampleCheck_1 = require("@pages/ReimbursementAccount/USD/BankInfo/ExampleCheck");
const getSubStepValues_1 = require("@pages/ReimbursementAccount/utils/getSubStepValues");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const BANK_INFO_STEP_KEYS = ReimbursementAccountForm_1.default.BANK_INFO_STEP;
const STEP_FIELDS = [BANK_INFO_STEP_KEYS.ROUTING_NUMBER, BANK_INFO_STEP_KEYS.ACCOUNT_NUMBER];
function Manual({ onNext }) {
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true });
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const defaultValues = (0, react_1.useMemo)(() => (0, getSubStepValues_1.default)(BANK_INFO_STEP_KEYS, reimbursementAccountDraft, reimbursementAccount), [reimbursementAccount, reimbursementAccountDraft]);
    const hasBankAccountData = !!reimbursementAccount?.achData?.bankAccountID;
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, STEP_FIELDS);
        const routingNumber = values.routingNumber?.trim();
        if (values.accountNumber &&
            !CONST_1.default.BANK_ACCOUNT.REGEX.US_ACCOUNT_NUMBER.test(values.accountNumber.trim()) &&
            !CONST_1.default.BANK_ACCOUNT.REGEX.MASKED_US_ACCOUNT_NUMBER.test(values.accountNumber.trim())) {
            errors.accountNumber = translate('bankAccount.error.accountNumber');
        }
        else if (values.accountNumber && values.accountNumber === routingNumber) {
            errors.accountNumber = translate('bankAccount.error.routingAndAccountNumberCannotBeSame');
        }
        if (routingNumber && (!CONST_1.default.BANK_ACCOUNT.REGEX.SWIFT_BIC.test(routingNumber) || !(0, ValidationUtils_1.isValidRoutingNumber)(routingNumber))) {
            errors.routingNumber = translate('bankAccount.error.routingNumber');
        }
        return errors;
    }, [translate]);
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: true,
    });
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} onSubmit={handleSubmit} validate={validate} submitButtonText={translate('common.next')} style={[styles.mh5, styles.flexGrow1]}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb3]}>{translate('bankAccount.manuallyAdd')}</Text_1.default>
            <Text_1.default style={[styles.mb5, styles.textSupporting]}>{translate('bankAccount.checkHelpLine')}</Text_1.default>
            <ExampleCheck_1.default />
            <InputWrapper_1.default InputComponent={TextInput_1.default} ref={inputCallbackRef} inputID={BANK_INFO_STEP_KEYS.ROUTING_NUMBER} label={translate('bankAccount.routingNumber')} aria-label={translate('bankAccount.routingNumber')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={defaultValues[BANK_INFO_STEP_KEYS.ROUTING_NUMBER]} inputMode={CONST_1.default.INPUT_MODE.NUMERIC} shouldSaveDraft shouldUseDefaultValue={hasBankAccountData} disabled={hasBankAccountData}/>
            <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={BANK_INFO_STEP_KEYS.ACCOUNT_NUMBER} containerStyles={[styles.mt6]} label={translate('bankAccount.accountNumber')} aria-label={translate('bankAccount.accountNumber')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={defaultValues[BANK_INFO_STEP_KEYS.ACCOUNT_NUMBER]} inputMode={CONST_1.default.INPUT_MODE.NUMERIC} shouldSaveDraft shouldUseDefaultValue={hasBankAccountData} disabled={hasBankAccountData}/>
        </FormProvider_1.default>);
}
Manual.displayName = 'Manual';
exports.default = Manual;
