"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CheckboxWithLabel_1 = require("@components/CheckboxWithLabel");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const FormHelpMessage_1 = require("@components/FormHelpMessage");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const BankAccounts_1 = require("@userActions/BankAccounts");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const STEP_INDEXES = CONST_1.default.CORPAY_FIELDS.INDEXES.MAPPING;
function TermsAndConditionsLabel() {
    const { translate } = (0, useLocalize_1.default)();
    return (<Text_1.default>
            {translate('common.iAcceptThe')}
            <TextLink_1.default href={CONST_1.default.OLD_DOT_PUBLIC_URLS.TERMS_URL}>{`${translate('common.addCardTermsOfService')}`}</TextLink_1.default>
        </Text_1.default>);
}
function Confirmation({ onNext, onMove, formValues, fieldsMap }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [corpayFields] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CORPAY_FIELDS, { canBeMissing: false });
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const { isOffline } = (0, useNetwork_1.default)();
    const getTitle = (field, fieldName) => {
        if ((field.valueSet ?? []).length > 0) {
            return field.valueSet?.find((type) => type.id === formValues[fieldName])?.text ?? formValues[fieldName];
        }
        if ((field?.links?.[0]?.content?.regions ?? []).length > 0) {
            return (field?.links?.[0]?.content?.regions ?? [])?.find(({ code }) => code === formValues[fieldName])?.name ?? formValues[fieldName];
        }
        return formValues[fieldName];
    };
    const getDataAndGoToNextStep = (values) => {
        (0, BankAccounts_1.createCorpayBankAccountForWalletFlow)({ ...formValues, ...values }, corpayFields?.classification ?? '', corpayFields?.destinationCountry ?? '', corpayFields?.preferredMethod ?? '');
    };
    (0, react_1.useEffect)(() => {
        if (reimbursementAccount?.isLoading === true || !!reimbursementAccount?.errors) {
            return;
        }
        if (reimbursementAccount?.isSuccess === true) {
            onNext();
            (0, BankAccounts_1.clearReimbursementAccountBankCreation)();
        }
    }, [reimbursementAccount?.isLoading, reimbursementAccount?.isSuccess, reimbursementAccount?.errors, onNext]);
    // We want to clear errors every time we leave this page.
    // Therefore, we use useEffect, which clears errors when unmounted.
    // This is necessary so that when we close the BA flow or move on to another step, the error is cleared.
    // Additionally, we add error clearing to useEffect itself so that errors are cleared if this page opens after reloading.
    (0, react_1.useEffect)(() => {
        (0, BankAccounts_1.hideBankAccountErrors)();
        return () => {
            (0, BankAccounts_1.hideBankAccountErrors)();
        };
    }, []);
    const summaryItems = [
        {
            description: translate('common.country'),
            title: translate(`allCountries.${formValues.bankCountry}`),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(STEP_INDEXES.COUNTRY_SELECTOR);
            },
            disabled: isOffline,
        },
        {
            description: translate('common.currency'),
            title: `${formValues.bankCurrency} - ${(0, CurrencyUtils_1.getCurrencySymbol)(formValues.bankCurrency)}`,
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(STEP_INDEXES.BANK_ACCOUNT_DETAILS);
            },
            disabled: isOffline,
        },
    ];
    Object.entries(fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.BANK_ACCOUNT_DETAILS] ?? {}).forEach(([fieldName, field]) => {
        summaryItems.push({
            description: field.label + (field.isRequired ? '' : ` (${translate('common.optional')})`),
            title: getTitle(field, fieldName),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(STEP_INDEXES.BANK_ACCOUNT_DETAILS);
            },
        });
    });
    Object.entries(fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_TYPE] ?? {}).forEach(([fieldName, field]) => {
        summaryItems.push({
            description: field.label + (field.isRequired ? '' : ` (${translate('common.optional')})`),
            title: getTitle(field, fieldName),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(STEP_INDEXES.ACCOUNT_TYPE);
            },
        });
    });
    Object.entries(fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.BANK_INFORMATION] ?? {})
        .sort(([field1], [field2]) => CONST_1.default.CORPAY_FIELDS.BANK_INFORMATION_FIELDS.indexOf(field1) - CONST_1.default.CORPAY_FIELDS.BANK_INFORMATION_FIELDS.indexOf(field2))
        .forEach(([fieldName, field]) => {
        summaryItems.push({
            description: field.label + (field.isRequired ? '' : ` (${translate('common.optional')})`),
            title: getTitle(field, fieldName),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(STEP_INDEXES.BANK_INFORMATION);
            },
        });
    });
    Object.entries(fieldsMap[CONST_1.default.CORPAY_FIELDS.STEPS_NAME.ACCOUNT_HOLDER_INFORMATION] ?? {})
        .sort(([field1], [field2]) => CONST_1.default.CORPAY_FIELDS.ACCOUNT_HOLDER_FIELDS.indexOf(field1) - CONST_1.default.CORPAY_FIELDS.ACCOUNT_HOLDER_FIELDS.indexOf(field2))
        .forEach(([fieldName, field]) => {
        summaryItems.push({
            description: field.label + (field.isRequired ? '' : ` (${translate('common.optional')})`),
            title: fieldName === CONST_1.default.CORPAY_FIELDS.ACCOUNT_HOLDER_COUNTRY_KEY ? translate(`allCountries.${formValues.bankCountry}`) : getTitle(field, fieldName),
            shouldShowRightIcon: fieldName !== CONST_1.default.CORPAY_FIELDS.ACCOUNT_HOLDER_COUNTRY_KEY,
            onPress: () => {
                onMove(STEP_INDEXES.ACCOUNT_HOLDER_INFORMATION);
            },
            interactive: fieldName !== CONST_1.default.CORPAY_FIELDS.ACCOUNT_HOLDER_COUNTRY_KEY,
        });
    });
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        if (!values.acceptTerms) {
            errors.acceptTerms = translate('common.error.acceptTerms');
        }
        return errors;
    }, [translate]);
    const errorMessage = (0, ErrorUtils_1.getLatestErrorMessage)(reimbursementAccount);
    return (<ScrollView_1.default contentContainerStyle={styles.flexGrow1}>
            <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mb3]}>{translate('addPersonalBankAccount.confirmationStepHeader')}</Text_1.default>
            <Text_1.default style={[styles.mb6, styles.ph5, styles.textSupporting]}>{translate('addPersonalBankAccount.confirmationStepSubHeader')}</Text_1.default>
            {summaryItems.map(({ description, title, shouldShowRightIcon, interactive, disabled, onPress }) => (<MenuItemWithTopDescription_1.default key={`${title}_${description}`} description={description} title={title} shouldShowRightIcon={shouldShowRightIcon} onPress={onPress} interactive={interactive} disabled={disabled}/>))}
            <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.INTERNATIONAL_BANK_ACCOUNT_FORM} validate={validate} onSubmit={getDataAndGoToNextStep} scrollContextEnabled submitButtonText={translate('common.confirm')} style={[styles.mh5, styles.flexGrow1]} enabledWhenOffline={false} isLoading={reimbursementAccount?.isLoading} shouldHideFixErrorsAlert>
                <InputWrapper_1.default InputComponent={CheckboxWithLabel_1.default} aria-label={`${translate('common.iAcceptThe')} ${translate('common.addCardTermsOfService')}`} inputID="acceptTerms" LabelComponent={TermsAndConditionsLabel} style={[styles.mt3]} shouldSaveDraft/>
                {!!errorMessage && (<FormHelpMessage_1.default style={[styles.mt3, styles.mbn1]} isError message={errorMessage}/>)}
            </FormProvider_1.default>
        </ScrollView_1.default>);
}
Confirmation.displayName = 'Confirmation';
exports.default = Confirmation;
