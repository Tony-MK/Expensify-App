"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var Search_1 = require("@libs/actions/Search");
var CurrencyUtils_1 = require("@libs/CurrencyUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var SearchMultipleSelectionPicker_1 = require("./SearchMultipleSelectionPicker");
var SearchSingleSelectionPicker_1 = require("./SearchSingleSelectionPicker");
function SearchFiltersCurrencyBase(_a) {
    var title = _a.title, filterKey = _a.filterKey, _b = _a.multiselect, multiselect = _b === void 0 ? false : _b;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var currencyList = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENCY_LIST, { canBeMissing: false })[0];
    var searchAdvancedFiltersForm = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: false })[0];
    var selectedCurrencyData = searchAdvancedFiltersForm === null || searchAdvancedFiltersForm === void 0 ? void 0 : searchAdvancedFiltersForm[filterKey];
    var _c = (0, react_1.useMemo)(function () {
        var currencies = [];
        var selectedCurrencies = [];
        Object.keys(currencyList !== null && currencyList !== void 0 ? currencyList : {}).forEach(function (currencyCode) {
            var _a;
            if ((_a = currencyList === null || currencyList === void 0 ? void 0 : currencyList[currencyCode]) === null || _a === void 0 ? void 0 : _a.retired) {
                return;
            }
            if (Array.isArray(selectedCurrencyData) && (selectedCurrencyData === null || selectedCurrencyData === void 0 ? void 0 : selectedCurrencyData.includes(currencyCode)) && !selectedCurrencies.some(function (currencyItem) { return currencyItem.value === currencyCode; })) {
                selectedCurrencies.push({ name: "".concat(currencyCode, " - ").concat((0, CurrencyUtils_1.getCurrencySymbol)(currencyCode)), value: currencyCode });
            }
            if (!Array.isArray(selectedCurrencyData) && selectedCurrencyData === currencyCode) {
                selectedCurrencies.push({ name: "".concat(currencyCode, " - ").concat((0, CurrencyUtils_1.getCurrencySymbol)(currencyCode)), value: currencyCode });
            }
            if (!currencies.some(function (item) { return item.value === currencyCode; })) {
                currencies.push({ name: "".concat(currencyCode, " - ").concat((0, CurrencyUtils_1.getCurrencySymbol)(currencyCode)), value: currencyCode });
            }
        });
        return { selectedCurrenciesItems: selectedCurrencies, currencyItems: currencies };
    }, [currencyList, selectedCurrencyData]), selectedCurrenciesItems = _c.selectedCurrenciesItems, currencyItems = _c.currencyItems;
    var handleOnSubmit = function (values) {
        var _a;
        (0, Search_1.updateAdvancedFilters)((_a = {}, _a[filterKey] = values !== null && values !== void 0 ? values : null, _a));
    };
    return (<ScreenWrapper_1.default testID={SearchFiltersCurrencyBase.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} includeSafeAreaPaddingBottom shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate(title)} onBackButtonPress={function () {
            Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
        }}/>
            <react_native_1.View style={[styles.flex1]}>
                {multiselect && (<SearchMultipleSelectionPicker_1.default items={currencyItems} initiallySelectedItems={selectedCurrenciesItems} onSaveSelection={handleOnSubmit}/>)}
                {!multiselect && (<SearchSingleSelectionPicker_1.default items={currencyItems} initiallySelectedItem={selectedCurrenciesItems.at(0)} onSaveSelection={handleOnSubmit}/>)}
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
SearchFiltersCurrencyBase.displayName = 'SearchFiltersCurrencyBase';
exports.default = SearchFiltersCurrencyBase;
