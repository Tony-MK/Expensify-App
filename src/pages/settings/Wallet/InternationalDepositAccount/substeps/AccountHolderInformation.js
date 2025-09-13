"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AddressSearch_1 = require("@components/AddressSearch");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const PushRowWithModal_1 = require("@components/PushRowWithModal");
const TextInput_1 = require("@components/TextInput");
const ValuePicker_1 = require("@components/ValuePicker");
const useInternationalBankAccountFormSubmit_1 = require("@hooks/useInternationalBankAccountFormSubmit");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const utils_1 = require("@pages/settings/Wallet/InternationalDepositAccount/utils");
const Text_1 = require("@src/components/Text");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function getInputComponent(field) {
    if ((field.valueSet ?? []).length > 0) {
        return ValuePicker_1.default;
    }
    if (CONST_1.default.CORPAY_FIELDS.SPECIAL_LIST_REGION_KEYS.includes(field.id)) {
        return ValuePicker_1.default;
    }
    if (CONST_1.default.CORPAY_FIELDS.SPECIAL_LIST_ADDRESS_KEYS.includes(field.id)) {
        return AddressSearch_1.default;
    }
    if (field.id === CONST_1.default.CORPAY_FIELDS.ACCOUNT_HOLDER_COUNTRY_KEY) {
        return PushRowWithModal_1.default;
    }
    return TextInput_1.default;
}
function getItems(field) {
    if ((field.valueSet ?? []).length > 0) {
        return (field.valueSet ?? []).map(({ id, text }) => ({ value: id, label: text }));
    }
    return (field.links?.[0]?.content.regions ?? []).map(({ name, code }) => ({ value: code, label: name }));
}
function AccountHolderInformation({ isEditing, onNext, formValues, fieldsMap }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const handleSubmit = (0, useInternationalBankAccountFormSubmit_1.default)({
        fieldIds: Object.keys(fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_HOLDER_INFORMATION]),
        onNext,
        shouldSaveDraft: isEditing,
    });
    const validate = (0, react_1.useCallback)((values) => {
        return (0, utils_1.getValidationErrors)(values, fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_HOLDER_INFORMATION], translate);
    }, [fieldsMap, translate]);
    const getStyle = (0, react_1.useCallback)((field, index) => {
        if ((field.valueSet ?? []).length > 0) {
            return [styles.mhn5, index === 0 ? styles.pb1 : styles.pv1];
        }
        if (CONST_1.default.CORPAY_FIELDS.SPECIAL_LIST_REGION_KEYS.includes(field.id)) {
            return [styles.mhn5, index === 0 ? styles.pb1 : styles.pv1];
        }
        if (CONST_1.default.CORPAY_FIELDS.SPECIAL_LIST_ADDRESS_KEYS.includes(field.id)) {
            return [index === 0 ? styles.pb2 : styles.pv2];
        }
        if (field.id === CONST_1.default.CORPAY_FIELDS.ACCOUNT_HOLDER_COUNTRY_KEY) {
            return [styles.mhn5, index === 0 ? styles.pb1 : styles.pv1];
        }
        return [index === 0 ? styles.pb2 : styles.pv2];
    }, [styles.mhn5, styles.pb1, styles.pb2, styles.pv1, styles.pv2]);
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.INTERNATIONAL_BANK_ACCOUNT_FORM} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} onSubmit={handleSubmit} validate={validate} style={[styles.flexGrow1, styles.mt3]} submitButtonStyles={[styles.ph5, styles.mb0]} enabledWhenOffline>
            <react_native_1.View style={styles.ph5}>
                <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb6]}>{translate('addPersonalBankAccount.accountHolderInformationStepHeader')}</Text_1.default>
                {Object.values(fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_HOLDER_INFORMATION])
            .sort((a, b) => CONST_1.default.CORPAY_FIELDS.ACCOUNT_HOLDER_FIELDS.indexOf(a.id) - CONST_1.default.CORPAY_FIELDS.ACCOUNT_HOLDER_FIELDS.indexOf(b.id))
            .map((field, index) => (<react_native_1.View style={getStyle(field, index)} key={field.id}>
                            <InputWrapper_1.default InputComponent={getInputComponent(field)} inputID={field.id} defaultValue={formValues[field.id]} label={field.label + (field.isRequired ? '' : ` (${translate('common.optional')})`)} description={field.id === CONST_1.default.CORPAY_FIELDS.ACCOUNT_HOLDER_COUNTRY_KEY ? field.label : undefined} items={getItems(field)} shouldAllowChange={field.id === CONST_1.default.CORPAY_FIELDS.ACCOUNT_HOLDER_COUNTRY_KEY ? false : undefined} optionsList={field.id === CONST_1.default.CORPAY_FIELDS.ACCOUNT_HOLDER_COUNTRY_KEY ? CONST_1.default.ALL_COUNTRIES : undefined} value={field.id === CONST_1.default.CORPAY_FIELDS.ACCOUNT_HOLDER_COUNTRY_KEY ? formValues.bankCountry : undefined} shouldSaveDraft={!isEditing} renamedInputKeys={{
                street: (0, EmptyObject_1.isEmptyObject)(fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_HOLDER_INFORMATION]?.accountHolderAddress1) ? '' : 'accountHolderAddress1',
                street2: (0, EmptyObject_1.isEmptyObject)(fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_HOLDER_INFORMATION]?.accountHolderAddress2) ? '' : 'accountHolderAddress2',
                city: (0, EmptyObject_1.isEmptyObject)(fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_HOLDER_INFORMATION]?.accountHolderCity) ? '' : 'accountHolderCity',
                state: '',
                zipCode: (0, EmptyObject_1.isEmptyObject)(fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_HOLDER_INFORMATION]?.accountHolderPostal) ? '' : 'accountHolderPostal',
                country: '',
                lat: '',
                lng: '',
            }}/>
                        </react_native_1.View>))}
            </react_native_1.View>
        </FormProvider_1.default>);
}
AccountHolderInformation.displayName = 'AccountHolderInformation';
exports.default = AccountHolderInformation;
