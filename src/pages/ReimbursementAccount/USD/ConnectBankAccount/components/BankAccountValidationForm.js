"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils = require("@libs/CurrencyUtils");
const getPermittedDecimalSeparator_1 = require("@libs/getPermittedDecimalSeparator");
const ValidationUtils = require("@libs/ValidationUtils");
const BankAccounts = require("@userActions/BankAccounts");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const Enable2FACard_1 = require("./Enable2FACard");
function getAmountValues(values) {
    return {
        amount1: values?.amount1 ?? '',
        amount2: values?.amount2 ?? '',
        amount3: values?.amount3 ?? '',
    };
}
const filterInput = (amount, amountRegex, permittedDecimalSeparator) => {
    let value = amount ? amount.toString().trim() : '';
    const regex = new RegExp(`^0+|([${permittedDecimalSeparator}]\\d*?)0+$`, 'g');
    value = value.replace(regex, '$1');
    if (value === '' || Number.isNaN(Number(value)) || !Math.abs(expensify_common_1.Str.fromUSDToNumber(value, false)) || (amountRegex && !amountRegex.test(value))) {
        return '';
    }
    return value;
};
function BankAccountValidationForm({ requiresTwoFactorAuth, reimbursementAccount, policy }) {
    const { translate, toLocaleDigit } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = reimbursementAccount?.achData?.policyID ?? '-1';
    const decimalSeparator = toLocaleDigit('.');
    const permittedDecimalSeparator = (0, getPermittedDecimalSeparator_1.default)(decimalSeparator);
    const validate = (values) => {
        const errors = {};
        const amountValues = getAmountValues(values);
        const outputCurrency = policy?.outputCurrency ?? CONST_1.default.CURRENCY.USD;
        const amountRegex = RegExp(String.raw `^-?\d{0,8}([${permittedDecimalSeparator}]\d{0,${CurrencyUtils.getCurrencyDecimals(outputCurrency)}})?$`, 'i');
        Object.keys(amountValues).forEach((key) => {
            const value = amountValues[key];
            const filteredValue = filterInput(value, amountRegex, permittedDecimalSeparator);
            if (ValidationUtils.isRequiredFulfilled(filteredValue.toString())) {
                return;
            }
            errors[key] = translate('common.error.invalidAmount');
        });
        return errors;
    };
    const submit = (0, react_1.useCallback)((values) => {
        const amount1 = filterInput(values.amount1 ?? '', undefined, permittedDecimalSeparator);
        const amount2 = filterInput(values.amount2 ?? '', undefined, permittedDecimalSeparator);
        const amount3 = filterInput(values.amount3 ?? '', undefined, permittedDecimalSeparator);
        const validateCode = [amount1, amount2, amount3].join(',');
        // Send valid amounts to BankAccountAPI::validateBankAccount in Web-Expensify
        const bankAccountID = Number(reimbursementAccount?.achData?.bankAccountID ?? '-1');
        if (bankAccountID) {
            BankAccounts.validateBankAccount(bankAccountID, validateCode, policyID);
        }
    }, [reimbursementAccount, policyID, permittedDecimalSeparator]);
    // On android autoCapitalize="words" is necessary when keyboardType="decimal-pad" or inputMode="decimal" to prevent input lag.
    // See https://github.com/Expensify/App/issues/51868 for more information
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} submitButtonText={translate('connectBankAccountStep.validateButtonText')} onSubmit={submit} validate={validate} style={[styles.mh5, styles.flexGrow1]}>
            <Text_1.default>{translate('connectBankAccountStep.description')}</Text_1.default>
            <Text_1.default>{translate('connectBankAccountStep.descriptionCTA')}</Text_1.default>

            <react_native_1.View style={[styles.mv5]}>
                <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={ReimbursementAccountForm_1.default.AMOUNT1} shouldSaveDraft containerStyles={[styles.mb6]} inputMode={CONST_1.default.INPUT_MODE.DECIMAL} autoCapitalize="words" label={`${translate('connectBankAccountStep.validationInputLabel')} 1`} maxLength={CONST_1.default.VALIDATION_REIMBURSEMENT_INPUT_LIMIT}/>
                <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={ReimbursementAccountForm_1.default.AMOUNT2} shouldSaveDraft containerStyles={[styles.mb6]} inputMode={CONST_1.default.INPUT_MODE.DECIMAL} autoCapitalize="words" label={`${translate('connectBankAccountStep.validationInputLabel')} 2`} maxLength={CONST_1.default.VALIDATION_REIMBURSEMENT_INPUT_LIMIT}/>
                <InputWrapper_1.default InputComponent={TextInput_1.default} shouldSaveDraft inputID={ReimbursementAccountForm_1.default.AMOUNT3} containerStyles={[styles.mb6]} inputMode={CONST_1.default.INPUT_MODE.DECIMAL} autoCapitalize="words" label={`${translate('connectBankAccountStep.validationInputLabel')} 3`} maxLength={CONST_1.default.VALIDATION_REIMBURSEMENT_INPUT_LIMIT}/>
            </react_native_1.View>
            {!requiresTwoFactorAuth && (<react_native_1.View style={[styles.mln5, styles.mrn5, styles.mt3]}>
                    <Enable2FACard_1.default policyID={policyID}/>
                </react_native_1.View>)}
        </FormProvider_1.default>);
}
BankAccountValidationForm.displayName = 'BankAccountValidationForm';
exports.default = BankAccountValidationForm;
