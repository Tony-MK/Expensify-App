"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Search_1 = require("@libs/actions/Search");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const AdvancedSearchFilters_1 = require("./AdvancedSearchFilters");
function SearchAdvancedFiltersPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [searchAdvancedFilters = (0, EmptyObject_1.getEmptyObject)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.SEARCH_ADVANCED_FILTERS_FORM, { canBeMissing: true });
    const shouldShowResetFilters = Object.entries(searchAdvancedFilters)
        .filter(([key, value]) => {
        if (key === CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.GROUP_BY) {
            return false;
        }
        if (key === CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.TYPE) {
            return value !== CONST_1.default.SEARCH.DATA_TYPES.EXPENSE;
        }
        if (key === CONST_1.default.SEARCH.SYNTAX_ROOT_KEYS.STATUS) {
            return value !== CONST_1.default.SEARCH.STATUS.EXPENSE.ALL;
        }
        return true;
    })
        .some(([, value]) => (Array.isArray(value) ? value.length !== 0 : !!value));
    return (<ScreenWrapper_1.default testID={SearchAdvancedFiltersPage.displayName} shouldShowOfflineIndicatorInWideScreen offlineIndicatorStyle={styles.mtAuto} includeSafeAreaPaddingBottom>
            <HeaderWithBackButton_1.default title={translate('search.filtersHeader')}>
                {shouldShowResetFilters && <TextLink_1.default onPress={Search_1.clearAdvancedFilters}>{translate('search.resetFilters')}</TextLink_1.default>}
            </HeaderWithBackButton_1.default>
            <AdvancedSearchFilters_1.default />
        </ScreenWrapper_1.default>);
}
SearchAdvancedFiltersPage.displayName = 'SearchAdvancedFiltersPage';
exports.default = SearchAdvancedFiltersPage;
