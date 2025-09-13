"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const CurrencyPicker_1 = require("@components/CurrencyPicker");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const TextInput_1 = require("@components/TextInput");
const TextLink_1 = require("@components/TextLink");
const ValuePicker_1 = require("@components/ValuePicker");
const useInternationalBankAccountFormSubmit_1 = require("@hooks/useInternationalBankAccountFormSubmit");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const utils_1 = require("@pages/settings/Wallet/InternationalDepositAccount/utils");
const BankAccounts_1 = require("@userActions/BankAccounts");
const Text_1 = require("@src/components/Text");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function BankAccountDetails({ isEditing, onNext, resetScreenIndex, formValues, fieldsMap }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const handleSubmit = (0, useInternationalBankAccountFormSubmit_1.default)({
        fieldIds: Object.keys(fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.BANK_ACCOUNT_DETAILS] ?? {}),
        onNext,
        shouldSaveDraft: isEditing,
    });
    const onCurrencySelected = (0, react_1.useCallback)((value) => {
        if (formValues.bankCurrency === value) {
            return;
        }
        (0, BankAccounts_1.fetchCorpayFields)(formValues.bankCountry, value);
        resetScreenIndex?.(CONST_1.default.CORPAY_FIELDS.INDEXES.MAPPING.BANK_ACCOUNT_DETAILS);
    }, [formValues.bankCountry, formValues.bankCurrency, resetScreenIndex]);
    const validate = (0, react_1.useCallback)((values) => {
        return (0, utils_1.getValidationErrors)(values, fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.BANK_ACCOUNT_DETAILS], translate);
    }, [fieldsMap, translate]);
    const currencyHeaderContent = (<react_native_1.View style={styles.ph5}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb3]}>{translate('addPersonalBankAccount.currencyHeader')}</Text_1.default>
        </react_native_1.View>);
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.INTERNATIONAL_BANK_ACCOUNT_FORM} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} onSubmit={handleSubmit} validate={validate} style={[styles.flexGrow1, styles.mt3]} submitButtonStyles={[styles.ph5, styles.mb0]} enabledWhenOffline>
            <react_native_1.View style={styles.ph5}>
                <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb6]}>{translate('addPersonalBankAccount.accountDetailsStepHeader')}</Text_1.default>
                <react_native_1.View style={[styles.mhn5]}>
                    <CurrencyPicker_1.default label={translate('common.currency')} value={formValues.bankCurrency} onInputChange={onCurrencySelected} headerContent={currencyHeaderContent} excludeCurrencies={CONST_1.default.CORPAY_FIELDS.EXCLUDED_CURRENCIES} disabled={isOffline} shouldShowFullPageOfflineView/>
                </react_native_1.View>
                {Object.values(fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.BANK_ACCOUNT_DETAILS] ?? {}).map((field) => (<react_native_1.View style={(field.valueSet ?? []).length > 0 ? [styles.mhn5, styles.pv1] : [styles.pv2]} key={field.id}>
                        <InputWrapper_1.default InputComponent={(field.valueSet ?? []).length > 0 ? ValuePicker_1.default : TextInput_1.default} inputID={field.id} defaultValue={formValues[field.id]} label={field.label + (field.isRequired ? '' : ` (${translate('common.optional')})`)} items={(field.valueSet ?? []).map(({ id, text }) => ({ value: id, label: text }))} shouldSaveDraft={!isEditing}/>
                    </react_native_1.View>))}
                <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mt4]}>
                    <Icon_1.default src={Expensicons.QuestionMark} width={12} height={12} fill={theme.icon}/>
                    <react_native_1.View style={[styles.ml2, styles.dFlex, styles.flexRow]}>
                        <TextLink_1.default style={[styles.textMicro]} href={CONST_1.default.ENCRYPTION_AND_SECURITY_HELP_URL}>
                            {translate('addPersonalBankAccount.howDoWeProtectYourData')}
                        </TextLink_1.default>
                    </react_native_1.View>
                </react_native_1.View>
            </react_native_1.View>
        </FormProvider_1.default>);
}
BankAccountDetails.displayName = 'BankAccountDetails';
exports.default = BankAccountDetails;
