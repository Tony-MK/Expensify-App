"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var CurrencySelectionList_1 = require("@components/CurrencySelectionList");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var CurrencyUtils_1 = require("@libs/CurrencyUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ReportUtils_1 = require("@libs/ReportUtils");
var Url_1 = require("@libs/Url");
var IOU_1 = require("@userActions/IOU");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var StepScreenWrapper_1 = require("./StepScreenWrapper");
var withFullTransactionOrNotFound_1 = require("./withFullTransactionOrNotFound");
function IOURequestStepCurrency(_a) {
    var _b;
    var _c = _a.route.params, backTo = _c.backTo, pageIndex = _c.pageIndex, transactionID = _c.transactionID, action = _c.action, _d = _c.currency, selectedCurrency = _d === void 0 ? '' : _d;
    var translate = (0, useLocalize_1.default)().translate;
    var draftTransaction = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_DRAFT).concat(transactionID), { canBeMissing: true })[0];
    var recentlyUsedCurrencies = (0, useOnyx_1.default)(ONYXKEYS_1.default.RECENTLY_USED_CURRENCIES, { canBeMissing: true })[0];
    var _e = ((_b = (0, ReportUtils_1.getTransactionDetails)(draftTransaction)) !== null && _b !== void 0 ? _b : {}).currency, originalCurrency = _e === void 0 ? '' : _e;
    var currency = (0, CurrencyUtils_1.isValidCurrencyCode)(selectedCurrency) ? selectedCurrency : originalCurrency;
    var navigateBack = function (selectedCurrencyValue) {
        if (selectedCurrencyValue === void 0) { selectedCurrencyValue = ''; }
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
    var confirmCurrencySelection = function (option) {
        react_native_1.Keyboard.dismiss();
        if (pageIndex !== CONST_1.default.IOU.PAGE_INDEX.CONFIRM) {
            (0, IOU_1.setMoneyRequestCurrency)(transactionID, option.currencyCode, action === CONST_1.default.IOU.ACTION.EDIT);
        }
        Navigation_1.default.setNavigationActionToMicrotaskQueue(function () { return navigateBack(option.currencyCode); });
    };
    return (<StepScreenWrapper_1.default shouldEnableKeyboardAvoidingView={false} headerTitle={translate('common.selectCurrency')} onBackButtonPress={function () { return navigateBack(); }} shouldShowWrapper testID={IOURequestStepCurrency.displayName} includeSafeAreaPaddingBottom>
            {function (_a) {
            var didScreenTransitionEnd = _a.didScreenTransitionEnd;
            return (<CurrencySelectionList_1.default recentlyUsedCurrencies={recentlyUsedCurrencies !== null && recentlyUsedCurrencies !== void 0 ? recentlyUsedCurrencies : []} searchInputLabel={translate('common.search')} onSelect={function (option) {
                    if (!didScreenTransitionEnd) {
                        return;
                    }
                    confirmCurrencySelection(option);
                }} initiallySelectedCurrencyCode={currency.toUpperCase()}/>);
        }}
        </StepScreenWrapper_1.default>);
}
IOURequestStepCurrency.displayName = 'IOURequestStepCurrency';
/* eslint-disable rulesdir/no-negated-variables */
var IOURequestStepCurrencyWithFullTransactionOrNotFound = (0, withFullTransactionOrNotFound_1.default)(IOURequestStepCurrency);
exports.default = IOURequestStepCurrencyWithFullTransactionOrNotFound;
