"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CurrencySelectionList_1 = require("@components/CurrencySelectionList");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Policy_1 = require("@libs/actions/Policy/Policy");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
function PaymentCurrencyPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const personalPolicyID = (0, PolicyUtils_1.getPersonalPolicy)()?.id;
    const personalPolicy = (0, usePolicy_1.default)(personalPolicyID);
    const paymentCurrency = personalPolicy?.outputCurrency ?? CONST_1.default.CURRENCY.USD;
    return (<ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} testID={PaymentCurrencyPage.displayName}>
            {({ didScreenTransitionEnd }) => (<>
                    <HeaderWithBackButton_1.default title={translate('billingCurrency.paymentCurrency')} shouldShowBackButton onBackButtonPress={() => Navigation_1.default.goBack()}/>

                    <Text_1.default style={[styles.mh5, styles.mv4]}>{translate('billingCurrency.paymentCurrencyDescription')}</Text_1.default>

                    <CurrencySelectionList_1.default recentlyUsedCurrencies={[]} searchInputLabel={translate('common.search')} onSelect={(option) => {
                if (option.currencyCode !== paymentCurrency) {
                    (0, Policy_1.updateGeneralSettings)(personalPolicyID, personalPolicy?.name ?? '', option.currencyCode);
                }
                Navigation_1.default.goBack();
            }} initiallySelectedCurrencyCode={paymentCurrency} didScreenTransitionEnd={didScreenTransitionEnd}/>
                </>)}
        </ScreenWrapper_1.default>);
}
PaymentCurrencyPage.displayName = 'PaymentCurrencyPage';
exports.default = PaymentCurrencyPage;
