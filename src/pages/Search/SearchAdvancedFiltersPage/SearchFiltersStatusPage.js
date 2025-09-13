"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FixedFooter_1 = require("@components/FixedFooter");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SearchFilterPageFooterButtons_1 = require("@components/Search/SearchFilterPageFooterButtons");
const SelectionList_1 = require("@components/SelectionList");
const MultiSelectListItem_1 = require("@components/SelectionList/MultiSelectListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Search_1 = require("@libs/actions/Search");
const Navigation_1 = require("@libs/Navigation/Navigation");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function SearchFiltersStatusPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [searchAdvancedFiltersForm, searchAdvancedFiltersFormResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true });
    const currentType = searchAdvancedFiltersForm?.type ?? CONST_1.default.SEARCH.DATA_TYPES.EXPENSE;
    const currentGroupBy = searchAdvancedFiltersForm?.groupBy;
    const [selectedItems, setSelectedItems] = (0, react_1.useState)(() => {
        if (!searchAdvancedFiltersForm?.status || searchAdvancedFiltersForm.status === CONST_1.default.SEARCH.STATUS.EXPENSE.ALL) {
            return [];
        }
        if (typeof searchAdvancedFiltersForm.status === 'string') {
            return searchAdvancedFiltersForm.status.split(',');
        }
        return searchAdvancedFiltersForm.status;
    });
    const items = (0, react_1.useMemo)(() => (0, SearchUIUtils_1.getStatusOptions)(currentType, currentGroupBy), [currentGroupBy, currentType]);
    const listData = (0, react_1.useMemo)(() => {
        return items.map((statusOption) => ({
            text: statusOption.text,
            keyForList: statusOption.value,
            isSelected: selectedItems.includes(statusOption.value),
        }));
    }, [items, selectedItems]);
    const updateSelectedItems = (0, react_1.useCallback)((listItem) => {
        if (listItem.isSelected) {
            setSelectedItems(selectedItems.filter((i) => i !== listItem.keyForList));
            return;
        }
        const newItem = items.find((i) => i.value === listItem.keyForList)?.value;
        if (newItem) {
            setSelectedItems([...selectedItems, newItem]);
        }
    }, [items, selectedItems]);
    const resetChanges = (0, react_1.useCallback)(() => {
        setSelectedItems([]);
    }, []);
    const applyChanges = (0, react_1.useCallback)(() => {
        const newStatus = selectedItems.length ? selectedItems : CONST_1.default.SEARCH.STATUS.EXPENSE.ALL;
        (0, Search_1.updateAdvancedFilters)({
            status: newStatus,
        });
        Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
    }, [selectedItems]);
    if (searchAdvancedFiltersFormResult.status === 'loading') {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<ScreenWrapper_1.default testID={SearchFiltersStatusPage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('common.status')} onBackButtonPress={() => {
            Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
        }}/>
            <react_native_1.View style={[styles.flex1]}>
                <SelectionList_1.default shouldSingleExecuteRowSelect sections={[{ data: listData }]} ListItem={MultiSelectListItem_1.default} onSelectRow={updateSelectedItems}/>
            </react_native_1.View>
            <FixedFooter_1.default style={styles.mtAuto}>
                <SearchFilterPageFooterButtons_1.default resetChanges={resetChanges} applyChanges={applyChanges}/>
            </FixedFooter_1.default>
        </ScreenWrapper_1.default>);
}
SearchFiltersStatusPage.displayName = 'SearchFiltersStatusPage';
exports.default = SearchFiltersStatusPage;
