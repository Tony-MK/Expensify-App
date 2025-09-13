"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const PaymentCardChangeCurrencyForm_1 = require("@components/AddPaymentCard/PaymentCardChangeCurrencyForm");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@navigation/Navigation");
const PaymentMethods = require("@userActions/PaymentMethods");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function ChangeCurrency() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [debitCardForm] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ADD_PAYMENT_CARD_FORM);
    const changeCurrency = (0, react_1.useCallback)((currency) => {
        if (currency) {
            PaymentMethods.setPaymentMethodCurrency(currency);
        }
        Navigation_1.default.goBack();
    }, []);
    return (<ScreenWrapper_1.default testID={ChangeCurrency.displayName}>
            <HeaderWithBackButton_1.default title={translate('billingCurrency.changePaymentCurrency')}/>
            <react_native_1.View style={styles.containerWithSpaceBetween}>
                <PaymentCardChangeCurrencyForm_1.default changeBillingCurrency={changeCurrency} initialCurrency={debitCardForm?.currency}/>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
ChangeCurrency.displayName = 'ChangeCurrency';
exports.default = ChangeCurrency;
