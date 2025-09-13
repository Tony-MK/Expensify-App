"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderGap_1 = require("@components/HeaderGap");
const SearchContext_1 = require("@components/Search/SearchContext");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const SearchTypeMenu_1 = require("@pages/Search/SearchTypeMenu");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
const NavigationTabBar_1 = require("./NavigationTabBar");
const NAVIGATION_TABS_1 = require("./NavigationTabBar/NAVIGATION_TABS");
const TopBar_1 = require("./TopBar");
function SearchSidebar({ state }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const route = state.routes.at(-1);
    const params = route?.params;
    const { lastSearchType, setLastSearchType } = (0, SearchContext_1.useSearchContext)();
    const queryJSON = (0, react_1.useMemo)(() => {
        if (params?.q) {
            return (0, SearchQueryUtils_1.buildSearchQueryJSON)(params.q);
        }
        return undefined;
    }, [params?.q]);
    const currentSearchResultsKey = queryJSON?.hash ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const [currentSearchResults] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${currentSearchResultsKey}`, {
        canBeMissing: true,
        selector: (snapshot) => snapshot?.search,
    });
    (0, react_1.useEffect)(() => {
        if (!currentSearchResults?.type) {
            return;
        }
        setLastSearchType(currentSearchResults.type);
    }, [lastSearchType, queryJSON, setLastSearchType, currentSearchResults]);
    const shouldShowLoadingState = route?.name === SCREENS_1.default.SEARCH.MONEY_REQUEST_REPORT ? false : !isOffline && !!currentSearchResults?.isLoading;
    if (shouldUseNarrowLayout) {
        return null;
    }
    return (<react_native_1.View style={styles.searchSidebar}>
            <react_native_1.View style={styles.flex1}>
                <HeaderGap_1.default />
                <TopBar_1.default shouldShowLoadingBar={shouldShowLoadingState} breadcrumbLabel={translate('common.reports')} shouldDisplaySearch={false} shouldDisplayHelpButton={false}/>
                <SearchTypeMenu_1.default queryJSON={queryJSON}/>
            </react_native_1.View>
            <NavigationTabBar_1.default selectedTab={NAVIGATION_TABS_1.default.SEARCH}/>
        </react_native_1.View>);
}
SearchSidebar.displayName = 'SearchSidebar';
exports.default = SearchSidebar;
