"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FixedFooter_1 = require("@components/FixedFooter");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SearchFilterPageFooterButtons_1 = require("@components/Search/SearchFilterPageFooterButtons");
const SelectionList_1 = require("@components/SelectionList");
const SingleSelectListItem_1 = require("@components/SelectionList/SingleSelectListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Search_1 = require("@libs/actions/Search");
const Navigation_1 = require("@libs/Navigation/Navigation");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function SearchFiltersTypePage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    const [allPolicies] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, { canBeMissing: true });
    const [searchAdvancedFiltersForm] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true });
    const [selectedItem, setSelectedItem] = (0, react_1.useState)(searchAdvancedFiltersForm?.type ?? CONST_1.default.SEARCH.DATA_TYPES.EXPENSE);
    const listData = (0, react_1.useMemo)(() => {
        return (0, SearchUIUtils_1.getTypeOptions)(allPolicies, session?.email).map((typeOption) => ({
            text: typeOption.text,
            keyForList: typeOption.value,
            isSelected: selectedItem === typeOption.value,
        }));
    }, [allPolicies, selectedItem, session?.email]);
    const updateSelectedItem = (0, react_1.useCallback)((type) => {
        setSelectedItem(type?.keyForList ?? CONST_1.default.SEARCH.DATA_TYPES.EXPENSE);
    }, []);
    const resetChanges = (0, react_1.useCallback)(() => {
        setSelectedItem(CONST_1.default.SEARCH.DATA_TYPES.EXPENSE);
    }, []);
    const applyChanges = (0, react_1.useCallback)(() => {
        const hasTypeChanged = selectedItem !== searchAdvancedFiltersForm?.type;
        const updatedFilters = {
            type: selectedItem,
            ...(hasTypeChanged && {
                groupBy: null,
                status: CONST_1.default.SEARCH.STATUS.EXPENSE.ALL,
            }),
        };
        (0, Search_1.updateAdvancedFilters)(updatedFilters);
        Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
    }, [searchAdvancedFiltersForm?.type, selectedItem]);
    return (<ScreenWrapper_1.default testID={SearchFiltersTypePage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('common.type')} onBackButtonPress={() => {
            Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
        }}/>
            <react_native_1.View style={[styles.flex1]}>
                <SelectionList_1.default shouldSingleExecuteRowSelect sections={[{ data: listData }]} ListItem={SingleSelectListItem_1.default} onSelectRow={updateSelectedItem}/>
            </react_native_1.View>
            <FixedFooter_1.default style={styles.mtAuto}>
                <SearchFilterPageFooterButtons_1.default resetChanges={resetChanges} applyChanges={applyChanges}/>
            </FixedFooter_1.default>
        </ScreenWrapper_1.default>);
}
SearchFiltersTypePage.displayName = 'SearchFiltersTypePage';
exports.default = SearchFiltersTypePage;
