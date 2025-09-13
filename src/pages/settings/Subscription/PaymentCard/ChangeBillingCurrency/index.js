"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const PaymentCardChangeCurrencyForm_1 = require("@components/AddPaymentCard/PaymentCardChangeCurrencyForm");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@navigation/Navigation");
const PaymentMethods = require("@userActions/PaymentMethods");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function ChangeBillingCurrency() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [fundList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FUND_LIST);
    const defaultCard = (0, react_1.useMemo)(() => Object.values(fundList ?? {}).find((card) => card.accountData?.additionalData?.isBillingCard), [fundList]);
    const [formData] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.CHANGE_BILLING_CURRENCY_FORM);
    const formDataComplete = formData?.isLoading === false && !formData.errors;
    const prevIsLoading = (0, usePrevious_1.default)(formData?.isLoading);
    const prevFormDataComplete = (0, usePrevious_1.default)(formDataComplete);
    (0, react_1.useEffect)(() => {
        if (!formDataComplete || prevFormDataComplete || !prevIsLoading) {
            return;
        }
        Navigation_1.default.goBack();
    }, [formDataComplete, prevFormDataComplete, prevIsLoading]);
    const changeBillingCurrency = (0, react_1.useCallback)((currency, values) => {
        if (!values?.securityCode) {
            Navigation_1.default.goBack();
            return;
        }
        PaymentMethods.updateBillingCurrency(currency ?? CONST_1.default.PAYMENT_CARD_CURRENCY.USD, values.securityCode);
    }, []);
    return (<ScreenWrapper_1.default testID={ChangeBillingCurrency.displayName}>
            <HeaderWithBackButton_1.default title={translate('billingCurrency.changeBillingCurrency')}/>
            <react_native_1.View style={styles.containerWithSpaceBetween}>
                <PaymentCardChangeCurrencyForm_1.default isSecurityCodeRequired changeBillingCurrency={changeBillingCurrency} initialCurrency={defaultCard?.accountData?.currency}/>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
ChangeBillingCurrency.displayName = 'ChangeBillingCurrency';
exports.default = ChangeBillingCurrency;
