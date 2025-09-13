"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SearchMultipleSelectionPicker_1 = require("@components/Search/SearchMultipleSelectionPicker");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Search_1 = require("@userActions/Search");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function SearchFiltersTaxRatePage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [searchAdvancedFiltersForm] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true });
    const allTaxRates = (0, PolicyUtils_1.getAllTaxRates)();
    const selectedTaxesItems = [];
    Object.entries(allTaxRates).forEach(([taxRateName, taxRateKeys]) => {
        searchAdvancedFiltersForm?.taxRate?.forEach((taxRateKey) => {
            if (!taxRateKeys.includes(taxRateKey) || selectedTaxesItems.some((item) => item.name === taxRateName)) {
                return;
            }
            selectedTaxesItems.push({ name: taxRateName, value: taxRateKeys });
        });
    });
    const policyIDs = searchAdvancedFiltersForm?.policyID ?? [];
    const [policies] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}`, {
        selector: (allPolicies) => (allPolicies ? Object.values(allPolicies).filter((policy) => policy && policyIDs.includes(policy.id)) : undefined),
        canBeMissing: true,
    });
    const selectedPoliciesTaxRates = policies?.map((policy) => policy?.taxRates?.taxes).filter((taxRates) => !!taxRates);
    const taxItems = (0, react_1.useMemo)(() => {
        if (!selectedPoliciesTaxRates || selectedPoliciesTaxRates?.length === 0) {
            return Object.entries(allTaxRates).map(([taxRateName, taxRateKeys]) => ({ name: taxRateName, value: taxRateKeys }));
        }
        const selectedPoliciesTaxRatesItems = selectedPoliciesTaxRates.reduce((acc, taxRates) => {
            if (!taxRates) {
                return acc;
            }
            Object.entries(taxRates).forEach(([taxRateKey, taxRate]) => {
                if (!acc[taxRate.name]) {
                    acc[taxRate.name] = [];
                }
                if (acc[taxRate.name].includes(taxRateKey)) {
                    return;
                }
                acc[taxRate.name].push(taxRateKey);
            });
            return acc;
        }, {});
        return Object.entries(selectedPoliciesTaxRatesItems).map(([taxRateName, taxRateKeys]) => ({ name: taxRateName, value: taxRateKeys }));
    }, [allTaxRates, selectedPoliciesTaxRates]);
    const updateTaxRateFilters = (0, react_1.useCallback)((values) => (0, Search_1.updateAdvancedFilters)({ taxRate: values }), []);
    return (<ScreenWrapper_1.default testID={SearchFiltersTaxRatePage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('workspace.taxes.taxRate')} onBackButtonPress={() => {
            Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
        }}/>
            <react_native_1.View style={[styles.flex1]}>
                <SearchMultipleSelectionPicker_1.default items={taxItems} initiallySelectedItems={selectedTaxesItems} onSaveSelection={updateTaxRateFilters}/>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
SearchFiltersTaxRatePage.displayName = 'SearchFiltersTaxRatePage';
exports.default = SearchFiltersTaxRatePage;
