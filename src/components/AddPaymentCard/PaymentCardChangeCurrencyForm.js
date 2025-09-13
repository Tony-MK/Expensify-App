"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const usePermissions_1 = require("@hooks/usePermissions");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ChangeBillingCurrencyForm_1 = require("@src/types/form/ChangeBillingCurrencyForm");
const PaymentCardCurrencyHeader_1 = require("./PaymentCardCurrencyHeader");
const PaymentCardCurrencyModal_1 = require("./PaymentCardCurrencyModal");
const REQUIRED_FIELDS = [ChangeBillingCurrencyForm_1.default.SECURITY_CODE];
function PaymentCardChangeCurrencyForm({ changeBillingCurrency, isSecurityCodeRequired, initialCurrency }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const [isCurrencyModalVisible, setIsCurrencyModalVisible] = (0, react_1.useState)(false);
    const [currency, setCurrency] = (0, react_1.useState)(initialCurrency ?? CONST_1.default.PAYMENT_CARD_CURRENCY.USD);
    const validate = (values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, REQUIRED_FIELDS);
        if (values.securityCode && !(0, ValidationUtils_1.isValidSecurityCode)(values.securityCode)) {
            errors.securityCode = translate('addPaymentCardPage.error.securityCode');
        }
        return errors;
    };
    const availableCurrencies = (0, react_1.useMemo)(() => {
        const canUseEurBilling = isBetaEnabled(CONST_1.default.BETAS.EUR_BILLING);
        const allCurrencies = Object.keys(CONST_1.default.PAYMENT_CARD_CURRENCY);
        // Filter out EUR if user doesn't have EUR billing beta
        return allCurrencies.filter((currencyItem) => {
            if (currencyItem === CONST_1.default.PAYMENT_CARD_CURRENCY.EUR && !canUseEurBilling) {
                return false;
            }
            return true;
        });
    }, [isBetaEnabled]);
    const { sections } = (0, react_1.useMemo)(() => ({
        sections: [
            {
                data: availableCurrencies.map((currencyItem) => ({
                    text: currencyItem,
                    value: currencyItem,
                    keyForList: currencyItem,
                    isSelected: currencyItem === currency,
                })),
            },
        ],
    }), [availableCurrencies, currency]);
    const showCurrenciesModal = (0, react_1.useCallback)(() => {
        setIsCurrencyModalVisible(true);
    }, []);
    const changeCurrency = (0, react_1.useCallback)((selectedCurrency) => {
        setCurrency(selectedCurrency);
        setIsCurrencyModalVisible(false);
    }, []);
    const selectCurrency = (0, react_1.useCallback)((selectedCurrency) => {
        setCurrency(selectedCurrency);
        changeBillingCurrency(selectedCurrency);
    }, [changeBillingCurrency]);
    if (isSecurityCodeRequired) {
        return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.CHANGE_BILLING_CURRENCY_FORM} validate={validate} onSubmit={(values) => changeBillingCurrency(currency, values)} submitButtonText={translate('common.save')} scrollContextEnabled style={[styles.mh5, styles.flexGrow1]} shouldHideFixErrorsAlert>
                <PaymentCardCurrencyHeader_1.default />
                <>
                    <react_native_1.View style={[styles.mt5, styles.mhn5]}>
                        <MenuItemWithTopDescription_1.default shouldShowRightIcon title={currency} descriptionTextStyle={styles.textNormal} description={translate('common.currency')} onPress={showCurrenciesModal}/>
                    </react_native_1.View>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={ChangeBillingCurrencyForm_1.default.SECURITY_CODE} label={translate('addDebitCardPage.cvv')} aria-label={translate('addDebitCardPage.cvv')} role={CONST_1.default.ROLE.PRESENTATION} containerStyles={[styles.mt5]} inputMode={CONST_1.default.INPUT_MODE.NUMERIC}/>
                </>
                <PaymentCardCurrencyModal_1.default isVisible={isCurrencyModalVisible} currencies={availableCurrencies} currentCurrency={currency} onCurrencyChange={changeCurrency} onClose={() => setIsCurrencyModalVisible(false)}/>
            </FormProvider_1.default>);
    }
    return (<react_native_1.View style={[styles.mh5, styles.flexGrow1]}>
            <SelectionList_1.default headerContent={<PaymentCardCurrencyHeader_1.default isSectionList/>} initiallyFocusedOptionKey={currency} containerStyle={[styles.mhn5]} sections={sections} onSelectRow={(option) => {
            selectCurrency(option.value);
        }} showScrollIndicator shouldStopPropagation shouldUseDynamicMaxToRenderPerBatch ListItem={RadioListItem_1.default}/>
        </react_native_1.View>);
}
PaymentCardChangeCurrencyForm.displayName = 'PaymentCardChangeCurrencyForm';
exports.default = PaymentCardChangeCurrencyForm;
