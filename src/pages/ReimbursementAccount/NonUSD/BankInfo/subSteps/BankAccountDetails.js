"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AddressSearch_1 = require("@components/AddressSearch");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getBankInfoStepValues_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getBankInfoStepValues");
const getInputForValueSet_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getInputForValueSet");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function getInputComponent(field) {
    if (CONST_1.default.CORPAY_FIELDS.SPECIAL_LIST_ADDRESS_KEYS.includes(field.id)) {
        return AddressSearch_1.default;
    }
    return TextInput_1.default;
}
function BankAccountDetails({ onNext, isEditing, corpayFields }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true });
    const bankAccountDetailsFields = (0, react_1.useMemo)(() => {
        return corpayFields?.formFields?.filter((field) => !field.id.includes(CONST_1.default.NON_USD_BANK_ACCOUNT.BANK_INFO_STEP_ACCOUNT_HOLDER_KEY_PREFIX));
    }, [corpayFields]);
    const subStepKeys = bankAccountDetailsFields?.reduce((acc, field) => {
        acc[field.id] = field.id;
        return acc;
    }, {});
    const defaultValues = (0, react_1.useMemo)(() => (0, getBankInfoStepValues_1.getBankInfoStepValues)(subStepKeys ?? {}, reimbursementAccountDraft, reimbursementAccount), [reimbursementAccount, reimbursementAccountDraft, subStepKeys]);
    const fieldIds = bankAccountDetailsFields?.map((field) => field.id);
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        corpayFields?.formFields?.forEach((field) => {
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
    }, [corpayFields, translate]);
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: fieldIds,
        onNext,
        shouldSaveDraft: isEditing,
    });
    const inputs = (0, react_1.useMemo)(() => {
        return bankAccountDetailsFields?.map((field) => {
            if (field.valueSet !== undefined) {
                return (0, getInputForValueSet_1.default)(field, String(defaultValues[field.id]), isEditing, styles);
            }
            return (<react_native_1.View style={styles.mb6} key={field.id}>
                    <InputWrapper_1.default InputComponent={getInputComponent(field)} inputID={field.id} label={field.label} aria-label={field.label} role={CONST_1.default.ROLE.PRESENTATION} shouldSaveDraft={!isEditing} defaultValue={String(defaultValues[field.id]) ?? ''} limitSearchesToCountry={reimbursementAccountDraft?.country} renamedInputKeys={{
                    street: 'bankAddressLine1',
                    city: 'bankCity',
                    country: '',
                }}/>
                </react_native_1.View>);
        });
    }, [bankAccountDetailsFields, styles, isEditing, defaultValues, reimbursementAccountDraft?.country]);
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} onSubmit={handleSubmit} validate={validate} style={[styles.mh5, styles.flexGrow1]} isSubmitDisabled={!inputs} shouldHideFixErrorsAlert={(bankAccountDetailsFields?.length ?? 0) <= 1}>
            <>
                <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb6]}>{translate('bankInfoStep.whatAreYour')}</Text_1.default>
                {corpayFields?.isLoading ? (<react_native_1.View style={[styles.flexGrow4, styles.alignItemsCenter]}>
                        <react_native_1.ActivityIndicator size={CONST_1.default.ACTIVITY_INDICATOR_SIZE.LARGE} color={theme.spinner} style={styles.flexGrow1}/>
                    </react_native_1.View>) : (inputs)}
            </>
        </FormProvider_1.default>);
}
BankAccountDetails.displayName = 'BankAccountDetails';
exports.default = BankAccountDetails;
