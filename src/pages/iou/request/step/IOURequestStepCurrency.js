"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const CurrencySelectionList_1 = require("@components/CurrencySelectionList");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const Url_1 = require("@libs/Url");
const IOU_1 = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const StepScreenWrapper_1 = require("./StepScreenWrapper");
const withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
function IOURequestStepCurrency({ route: { params: { backTo, pageIndex, transactionID, action, currency: selectedCurrency = '' }, }, }) {
    const { translate } = (0, useLocalize_1.default)();
    const [draftTransaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT}${transactionID}`, { canBeMissing: true });
    const [recentlyUsedCurrencies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.RECENTLY_USED_CURRENCIES, { canBeMissing: true });
    const { currency: originalCurrency = '' } = (0, ReportUtils_1.getTransactionDetails)(draftTransaction) ?? {};
    const currency = (0, CurrencyUtils_1.isValidCurrencyCode)(selectedCurrency) ? selectedCurrency : originalCurrency;
    const navigateBack = (selectedCurrencyValue = '') => {
        // If the currency selection was done from the confirmation step (eg. + > submit expense > manual > confirm > amount > currency)
        // then the user needs taken back to the confirmation page instead of the initial amount page. This is because the route params
        // are only able to handle one backTo param at a time and the user needs to go back to the amount page before going back
        // to the confirmation page
        if (pageIndex === CONST_1.default.IOU.PAGE_INDEX.CONFIRM) {
            if (selectedCurrencyValue) {
                Navigation_1.default.goBack((0, Url_1.appendParam)(backTo, 'currency', selectedCurrencyValue), { compareParams: false });
            }
            else {
                Navigation_1.default.goBack(backTo);
            }
            return;
        }
        Navigation_1.default.goBack(backTo);
    };
    const confirmCurrencySelection = (option) => {
        react_native_1.Keyboard.dismiss();
        if (pageIndex !== CONST_1.default.IOU.PAGE_INDEX.CONFIRM) {
            (0, IOU_1.setMoneyRequestCurrency)(transactionID, option.currencyCode, action === CONST_1.default.IOU.ACTION.EDIT);
        }
        Navigation_1.default.setNavigationActionToMicrotaskQueue(() => navigateBack(option.currencyCode));
    };
    return (<StepScreenWrapper_1.default shouldEnableKeyboardAvoidingView={false} headerTitle={translate('common.selectCurrency')} onBackButtonPress={() => navigateBack()} shouldShowWrapper testID={IOURequestStepCurrency.displayName} includeSafeAreaPaddingBottom>
            {({ didScreenTransitionEnd }) => (<CurrencySelectionList_1.default recentlyUsedCurrencies={recentlyUsedCurrencies ?? []} searchInputLabel={translate('common.search')} onSelect={(option) => {
                if (!didScreenTransitionEnd) {
                    return;
                }
                confirmCurrencySelection(option);
            }} initiallySelectedCurrencyCode={currency.toUpperCase()}/>)}
        </StepScreenWrapper_1.default>);
}
IOURequestStepCurrency.displayName = 'IOURequestStepCurrency';
/* eslint-disable rulesdir/no-negated-variables */
const IOURequestStepCurrencyWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepCurrency);
exports.default = IOURequestStepCurrencyWithFullTransactionOrNotFound;
