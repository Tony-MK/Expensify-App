"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Search_1 = require("@libs/actions/Search");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SearchMultipleSelectionPicker_1 = require("./SearchMultipleSelectionPicker");
const SearchSingleSelectionPicker_1 = require("./SearchSingleSelectionPicker");
function SearchFiltersCurrencyBase({ title, filterKey, multiselect = false }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [currencyList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CURRENCY_LIST, { canBeMissing: false });
    const [searchAdvancedFiltersForm] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: false });
    const selectedCurrencyData = searchAdvancedFiltersForm?.[filterKey];
    const { selectedCurrenciesItems, currencyItems } = (0, react_1.useMemo)(() => {
        const currencies = [];
        const selectedCurrencies = [];
        Object.keys(currencyList ?? {}).forEach((currencyCode) => {
            if (currencyList?.[currencyCode]?.retired) {
                return;
            }
            if (Array.isArray(selectedCurrencyData) && selectedCurrencyData?.includes(currencyCode) && !selectedCurrencies.some((currencyItem) => currencyItem.value === currencyCode)) {
                selectedCurrencies.push({ name: `${currencyCode} - ${(0, CurrencyUtils_1.getCurrencySymbol)(currencyCode)}`, value: currencyCode });
            }
            if (!Array.isArray(selectedCurrencyData) && selectedCurrencyData === currencyCode) {
                selectedCurrencies.push({ name: `${currencyCode} - ${(0, CurrencyUtils_1.getCurrencySymbol)(currencyCode)}`, value: currencyCode });
            }
            if (!currencies.some((item) => item.value === currencyCode)) {
                currencies.push({ name: `${currencyCode} - ${(0, CurrencyUtils_1.getCurrencySymbol)(currencyCode)}`, value: currencyCode });
            }
        });
        return { selectedCurrenciesItems: selectedCurrencies, currencyItems: currencies };
    }, [currencyList, selectedCurrencyData]);
    const handleOnSubmit = (values) => {
        (0, Search_1.updateAdvancedFilters)({ [filterKey]: values ?? null });
    };
    return (<ScreenWrapper_1.default testID={SearchFiltersCurrencyBase.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} includeSafeAreaPaddingBottom shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate(title)} onBackButtonPress={() => {
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
