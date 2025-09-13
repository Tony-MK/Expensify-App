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
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const Search_1 = require("@userActions/Search");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function SearchFiltersExpenseTypePage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [searchAdvancedFiltersForm] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true });
    const initiallySelectedItems = (0, react_1.useMemo)(() => searchAdvancedFiltersForm?.expenseType
        ?.filter((expenseType) => Object.values(CONST_1.default.SEARCH.TRANSACTION_TYPE).includes(expenseType))
        .map((expenseType) => {
        const expenseTypeName = translate((0, SearchUIUtils_1.getExpenseTypeTranslationKey)(expenseType));
        return { name: expenseTypeName, value: expenseType };
    }), [searchAdvancedFiltersForm, translate]);
    const allExpenseTypes = Object.values(CONST_1.default.SEARCH.TRANSACTION_TYPE);
    const expenseTypesItems = (0, react_1.useMemo)(() => {
        return allExpenseTypes.map((expenseType) => {
            const expenseTypeName = translate((0, SearchUIUtils_1.getExpenseTypeTranslationKey)(expenseType));
            return { name: expenseTypeName, value: expenseType };
        });
    }, [allExpenseTypes, translate]);
    const updateExpenseTypeFilter = (0, react_1.useCallback)((values) => (0, Search_1.updateAdvancedFilters)({ expenseType: values }), []);
    return (<ScreenWrapper_1.default testID={SearchFiltersExpenseTypePage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} includeSafeAreaPaddingBottom={false} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('search.expenseType')} onBackButtonPress={() => {
            Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
        }}/>
            <react_native_1.View style={[styles.flex1]}>
                <SearchMultipleSelectionPicker_1.default items={expenseTypesItems} initiallySelectedItems={initiallySelectedItems} onSaveSelection={updateExpenseTypeFilter} shouldShowTextInput={false}/>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
SearchFiltersExpenseTypePage.displayName = 'SearchFiltersExpenseTypePage';
exports.default = SearchFiltersExpenseTypePage;
