"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var AmountWithoutCurrencyInput_1 = require("@components/AmountWithoutCurrencyInput");
var FormProvider_1 = require("@components/Form/FormProvider");
var InputWrapper_1 = require("@components/Form/InputWrapper");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Search_1 = require("@libs/actions/Search");
var CurrencyUtils_1 = require("@libs/CurrencyUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
function SearchFiltersAmountBase(_a) {
    var title = _a.title, filterKey = _a.filterKey, testID = _a.testID;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var inputCallbackRef = (0, useAutoFocusInput_1.default)().inputCallbackRef;
    var searchAdvancedFiltersForm = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: false })[0];
    var greaterThan = searchAdvancedFiltersForm === null || searchAdvancedFiltersForm === void 0 ? void 0 : searchAdvancedFiltersForm["".concat(filterKey).concat(CONST_1.default.SEARCH.AMOUNT_MODIFIERS.GREATER_THAN)];
    var greaterThanFormattedAmount = greaterThan ? (0, CurrencyUtils_1.convertToFrontendAmountAsString)(Number(greaterThan)) : undefined;
    var lessThan = searchAdvancedFiltersForm === null || searchAdvancedFiltersForm === void 0 ? void 0 : searchAdvancedFiltersForm["".concat(filterKey).concat(CONST_1.default.SEARCH.AMOUNT_MODIFIERS.LESS_THAN)];
    var lessThanFormattedAmount = lessThan ? (0, CurrencyUtils_1.convertToFrontendAmountAsString)(Number(lessThan)) : undefined;
    var updateAmountFilter = function (values) {
        var _a;
        var greater = values["".concat(filterKey).concat(CONST_1.default.SEARCH.AMOUNT_MODIFIERS.GREATER_THAN)];
        var greaterThanBackendAmount = greater ? (0, CurrencyUtils_1.convertToBackendAmount)(Number(greater)) : '';
        var less = values["".concat(filterKey).concat(CONST_1.default.SEARCH.AMOUNT_MODIFIERS.LESS_THAN)];
        var lessThanBackendAmount = less ? (0, CurrencyUtils_1.convertToBackendAmount)(Number(less)) : '';
        (0, Search_1.updateAdvancedFilters)((_a = {},
            _a["".concat(filterKey).concat(CONST_1.default.SEARCH.AMOUNT_MODIFIERS.GREATER_THAN)] = greaterThanBackendAmount === null || greaterThanBackendAmount === void 0 ? void 0 : greaterThanBackendAmount.toString(),
            _a["".concat(filterKey).concat(CONST_1.default.SEARCH.AMOUNT_MODIFIERS.LESS_THAN)] = lessThanBackendAmount === null || lessThanBackendAmount === void 0 ? void 0 : lessThanBackendAmount.toString(),
            _a));
        Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
    };
    return (<ScreenWrapper_1.default testID={testID} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} includeSafeAreaPaddingBottom shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate(title)} onBackButtonPress={function () {
            Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
        }}/>
            <FormProvider_1.default style={[styles.flex1, styles.ph5]} formID={ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM} onSubmit={updateAmountFilter} submitButtonText={translate('common.save')} enabledWhenOffline>
                <react_native_1.View style={styles.mb5}>
                    <InputWrapper_1.default InputComponent={AmountWithoutCurrencyInput_1.default} inputID={"".concat(filterKey).concat(CONST_1.default.SEARCH.AMOUNT_MODIFIERS.GREATER_THAN)} name={"".concat(filterKey).concat(CONST_1.default.SEARCH.AMOUNT_MODIFIERS.GREATER_THAN)} defaultValue={greaterThanFormattedAmount} label={translate('search.filters.amount.greaterThan')} accessibilityLabel={translate('search.filters.amount.greaterThan')} role={CONST_1.default.ROLE.PRESENTATION} ref={inputCallbackRef} inputMode={CONST_1.default.INPUT_MODE.DECIMAL} uncontrolled/>
                </react_native_1.View>
                <react_native_1.View style={styles.mb5}>
                    <InputWrapper_1.default InputComponent={AmountWithoutCurrencyInput_1.default} inputID={"".concat(filterKey).concat(CONST_1.default.SEARCH.AMOUNT_MODIFIERS.LESS_THAN)} name={"".concat(filterKey).concat(CONST_1.default.SEARCH.AMOUNT_MODIFIERS.LESS_THAN)} defaultValue={lessThanFormattedAmount} label={translate('search.filters.amount.lessThan')} accessibilityLabel={translate('search.filters.amount.lessThan')} role={CONST_1.default.ROLE.PRESENTATION} inputMode={CONST_1.default.INPUT_MODE.DECIMAL} uncontrolled/>
                </react_native_1.View>
            </FormProvider_1.default>
        </ScreenWrapper_1.default>);
}
SearchFiltersAmountBase.displayName = 'SearchFiltersAmountBase';
exports.default = SearchFiltersAmountBase;
