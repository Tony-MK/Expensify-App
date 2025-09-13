"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AddressSearch_1 = require("@components/AddressSearch");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const PushRowWithModal_1 = require("@components/PushRowWithModal");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getBankInfoStepValues_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getBankInfoStepValues");
const getInputForValueSet_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getInputForValueSet");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const { ACCOUNT_HOLDER_COUNTRY } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
const { COUNTRY, ACCOUNT_HOLDER_NAME } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA;
function getInputComponent(field) {
    if (CONST_1.default.CORPAY_FIELDS.SPECIAL_LIST_ADDRESS_KEYS.includes(field.id)) {
        return AddressSearch_1.default;
    }
    return TextInput_1.default;
}
function AccountHolderDetails({ onNext, isEditing, corpayFields }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const accountHolderDetailsFields = (0, react_1.useMemo)(() => {
        return corpayFields?.formFields?.filter((field) => field.id.includes(CONST_1.default.NON_USD_BANK_ACCOUNT.BANK_INFO_STEP_ACCOUNT_HOLDER_KEY_PREFIX));
    }, [corpayFields]);
    const fieldIds = accountHolderDetailsFields?.map((field) => field.id);
    const subStepKeys = accountHolderDetailsFields?.reduce((acc, field) => {
        acc[field.id] = field.id;
        return acc;
    }, {});
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true });
    const defaultValues = (0, react_1.useMemo)(() => (0, getBankInfoStepValues_1.getBankInfoStepValues)(subStepKeys ?? {}, reimbursementAccountDraft, reimbursementAccount), [subStepKeys, reimbursementAccount, reimbursementAccountDraft]);
    const defaultBankAccountCountry = reimbursementAccount?.achData?.[COUNTRY] ?? reimbursementAccountDraft?.[COUNTRY] ?? '';
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: fieldIds,
        onNext,
        shouldSaveDraft: true,
    });
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        accountHolderDetailsFields?.forEach((field) => {
            const fieldID = field.id;
            if (field.isRequired && !values[fieldID]) {
                errors[fieldID] = translate('common.error.fieldRequired');
            }
            field.validationRules.forEach((rule) => {
                if (!rule.regEx) {
                    return;
                }
                if (new RegExp(rule.regEx).test(values[fieldID] ? String(values[fieldID]) : '')) {
                    return;
                }
                errors[fieldID] = rule.errorMessage;
            });
        });
        return errors;
    }, [accountHolderDetailsFields, translate]);
    const inputs = (0, react_1.useMemo)(() => {
        return accountHolderDetailsFields?.map((field) => {
            if (field.valueSet !== undefined) {
                return (0, getInputForValueSet_1.default)(field, String(defaultValues[field.id]), isEditing, styles);
            }
            if (field.id === ACCOUNT_HOLDER_COUNTRY) {
                return (<react_native_1.View style={[styles.mb6, styles.mhn5]} key={field.id}>
                        <InputWrapper_1.default InputComponent={PushRowWithModal_1.default} optionsList={CONST_1.default.ALL_COUNTRIES} description={field.label} shouldSaveDraft={!isEditing} defaultValue={String(defaultValues[field.id] !== '' ? defaultValues[field.id] : defaultBankAccountCountry)} modalHeaderTitle={translate('countryStep.selectCountry')} searchInputTitle={translate('countryStep.findCountry')} inputID={field.id}/>
                    </react_native_1.View>);
            }
            return (<react_native_1.View style={styles.mb6} key={field.id}>
                    <InputWrapper_1.default InputComponent={getInputComponent(field)} inputID={field.id} label={field.label} aria-label={field.label} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={String(defaultValues[field.id]) ?? ''} shouldSaveDraft={!isEditing} limitSearchesToCountry={defaultValues.accountHolderCountry || defaultBankAccountCountry} renamedInputKeys={{
                    street: 'accountHolderAddress1',
                    city: 'accountHolderCity',
                }} hint={field.id === ACCOUNT_HOLDER_NAME ? translate('bankInfoStep.accountHolderNameDescription') : undefined}/>
                </react_native_1.View>);
        });
    }, [accountHolderDetailsFields, styles, defaultValues, isEditing, defaultBankAccountCountry, translate]);
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} validate={validate} onSubmit={handleSubmit} style={[styles.mh5, styles.flexGrow1]} shouldHideFixErrorsAlert={(accountHolderDetailsFields?.length ?? 0) <= 1}>
            <react_native_1.View>
                <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb6]}>{translate('bankInfoStep.whatAreYour')}</Text_1.default>
                {inputs}
            </react_native_1.View>
        </FormProvider_1.default>);
}
AccountHolderDetails.displayName = 'AccountHolderDetails';
exports.default = AccountHolderDetails;
