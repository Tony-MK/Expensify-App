"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SearchFiltersChatsSelector_1 = require("@components/Search/SearchFiltersChatsSelector");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Search_1 = require("@userActions/Search");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function SearchFiltersInPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [isScreenTransitionEnd, setIsScreenTransitionEnd] = (0, react_1.useState)(false);
    const [searchAdvancedFiltersForm] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true });
    const handleScreenTransitionEnd = () => {
        setIsScreenTransitionEnd(true);
    };
    return (<ScreenWrapper_1.default testID={SearchFiltersInPage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} onEntryTransitionEnd={handleScreenTransitionEnd} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={translate('common.in')} onBackButtonPress={() => {
            Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ADVANCED_FILTERS.getRoute());
        }}/>
            <react_native_1.View style={[styles.flex1]}>
                <SearchFiltersChatsSelector_1.default isScreenTransitionEnd={isScreenTransitionEnd} onFiltersUpdate={(selectedAccountIDs) => {
            (0, Search_1.updateAdvancedFilters)({
                in: selectedAccountIDs,
            });
        }} initialReportIDs={searchAdvancedFiltersForm?.in ?? []}/>
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
SearchFiltersInPage.displayName = 'SearchFiltersInPage';
exports.default = SearchFiltersInPage;
