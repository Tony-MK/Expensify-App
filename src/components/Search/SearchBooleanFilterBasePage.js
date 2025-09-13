"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FixedFooter_1 = require("@components/FixedFooter");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const SingleSelectListItem_1 = require("@components/SelectionList/SingleSelectListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Search_1 = require("@userActions/Search");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SearchFilterPageFooterButtons_1 = require("./SearchFilterPageFooterButtons");
function SearchBooleanFilterBasePage({ booleanKey, titleKey }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const booleanValues = Object.values(CONST_1.default.SEARCH.BOOLEAN);
    const [searchAdvancedFiltersForm] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true });
    const [selectedItem, setSelectedItem] = (0, react_1.useState)(() => {
        return booleanValues.find((value) => searchAdvancedFiltersForm?.[booleanKey] === value) ?? null;
    });
    const items = (0, react_1.useMemo)(() => {
        return booleanValues.map((value) => ({
            value,
            keyForList: value,
            text: translate(`common.${value}`),
            isSelected: selectedItem === value,
        }));
    }, [selectedItem, translate, booleanValues]);
    const updateFilter = (0, react_1.useCallback)((selectedFilter) => {
        const newValue = selectedFilter.isSelected ? null : selectedFilter.value;
        setSelectedItem(newValue);
    }, []);
    const resetChanges = (0, react_1.useCallback)(() => {
        setSelectedItem(null);
    }, []);
    const applyChanges = (0, react_1.useCallback)(() => {
        (0, Search_1.updateAdvancedFilters)({ [booleanKey]: selectedItem });
        Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
    }, [booleanKey, selectedItem]);
    return (<ScreenWrapper_1.default testID={SearchBooleanFilterBasePage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} includeSafeAreaPaddingBottom shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate(titleKey)} onBackButtonPress={() => {
            Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
        }}/>
            <react_native_1.View style={[styles.flex1]}>
                <SelectionList_1.default shouldSingleExecuteRowSelect sections={[{ data: items }]} ListItem={SingleSelectListItem_1.default} onSelectRow={updateFilter}/>
            </react_native_1.View>
            <FixedFooter_1.default style={styles.mtAuto}>
                <SearchFilterPageFooterButtons_1.default applyChanges={applyChanges} resetChanges={resetChanges}/>
            </FixedFooter_1.default>
        </ScreenWrapper_1.default>);
}
SearchBooleanFilterBasePage.displayName = 'SearchBooleanFilterBasePage';
exports.default = SearchBooleanFilterBasePage;
