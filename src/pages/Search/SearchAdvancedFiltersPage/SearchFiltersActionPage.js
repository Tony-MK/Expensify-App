"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const FixedFooter_1 = require("@components/FixedFooter");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const SingleSelectListItem_1 = require("@components/SelectionList/SingleSelectListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Search_1 = require("@libs/actions/Search");
const Navigation_1 = require("@libs/Navigation/Navigation");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function SearchFiltersActionPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [searchAdvancedFiltersForm] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true });
    const [selectedItem, setSelectedItem] = (0, react_1.useState)(searchAdvancedFiltersForm?.action);
    const listData = (0, react_1.useMemo)(() => {
        return (0, SearchUIUtils_1.getActionOptions)(translate).map((action) => ({
            text: action.text,
            keyForList: action.value,
            isSelected: selectedItem === action.value,
        }));
    }, [translate, selectedItem]);
    const updateSelectedItem = (0, react_1.useCallback)((type) => {
        setSelectedItem(type?.keyForList ?? undefined);
    }, []);
    const resetChanges = (0, react_1.useCallback)(() => {
        setSelectedItem(undefined);
    }, []);
    const applyChanges = (0, react_1.useCallback)(() => {
        (0, Search_1.updateAdvancedFilters)({ action: selectedItem ?? null });
        Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
    }, [selectedItem]);
    return (<ScreenWrapper_1.default testID={SearchFiltersActionPage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('common.action')} onBackButtonPress={() => {
            Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
        }}/>
            <react_native_1.View style={[styles.flex1]}>
                <SelectionList_1.default shouldSingleExecuteRowSelect sections={[{ data: listData }]} ListItem={SingleSelectListItem_1.default} onSelectRow={updateSelectedItem}/>
            </react_native_1.View>
            <FixedFooter_1.default style={styles.mtAuto}>
                <Button_1.default large style={[styles.mt4]} text={translate('common.reset')} onPress={resetChanges}/>
                <Button_1.default large success pressOnEnter style={[styles.mt4]} text={translate('common.save')} onPress={applyChanges}/>
            </FixedFooter_1.default>
        </ScreenWrapper_1.default>);
}
SearchFiltersActionPage.displayName = 'SearchFiltersActionPage';
exports.default = SearchFiltersActionPage;
