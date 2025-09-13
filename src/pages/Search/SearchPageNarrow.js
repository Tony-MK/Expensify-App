"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = require("react-native-reanimated");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const NavigationTabBar_1 = require("@components/Navigation/NavigationTabBar");
const NAVIGATION_TABS_1 = require("@components/Navigation/NavigationTabBar/NAVIGATION_TABS");
const TopBar_1 = require("@components/Navigation/TopBar");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollOffsetContextProvider_1 = require("@components/ScrollOffsetContextProvider");
const Search_1 = require("@components/Search");
const SearchContext_1 = require("@components/Search/SearchContext");
const SearchPageFooter_1 = require("@components/Search/SearchPageFooter");
const SearchFiltersBar_1 = require("@components/Search/SearchPageHeader/SearchFiltersBar");
const SearchPageHeader_1 = require("@components/Search/SearchPageHeader/SearchPageHeader");
const useHandleBackButton_1 = require("@hooks/useHandleBackButton");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useScrollEventEmitter_1 = require("@hooks/useScrollEventEmitter");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
const Navigation_1 = require("@libs/Navigation/Navigation");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const SearchUIUtils_1 = require("@libs/SearchUIUtils");
const variables_1 = require("@styles/variables");
const Report_1 = require("@userActions/Report");
const Search_2 = require("@userActions/Search");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const TOO_CLOSE_TO_TOP_DISTANCE = 10;
const TOO_CLOSE_TO_BOTTOM_DISTANCE = 10;
const ANIMATION_DURATION_IN_MS = 300;
function SearchPageNarrow({ queryJSON, headerButtonsOptions, searchResults, isMobileSelectionModeEnabled, metadata, footerData }) {
    const { translate } = (0, useLocalize_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { clearSelectedTransactions } = (0, SearchContext_1.useSearchContext)();
    const [searchRouterListVisible, setSearchRouterListVisible] = (0, react_1.useState)(false);
    const { isOffline } = (0, useNetwork_1.default)();
    const currentSearchResultsKey = queryJSON?.hash ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const [currentSearchResults] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SNAPSHOT}${currentSearchResultsKey}`, { canBeMissing: true });
    // Controls the visibility of the educational tooltip based on user scrolling.
    // Hides the tooltip when the user is scrolling and displays it once scrolling stops.
    const triggerScrollEvent = (0, useScrollEventEmitter_1.default)();
    const route = (0, native_1.useRoute)();
    const { saveScrollOffset } = (0, react_1.useContext)(ScrollOffsetContextProvider_1.ScrollOffsetContext);
    const scrollOffset = (0, react_native_reanimated_1.useSharedValue)(0);
    const topBarOffset = (0, react_native_reanimated_1.useSharedValue)(StyleUtils.searchHeaderDefaultOffset);
    const handleBackButtonPress = (0, react_1.useCallback)(() => {
        if (!isMobileSelectionModeEnabled) {
            return false;
        }
        topBarOffset.set(StyleUtils.searchHeaderDefaultOffset);
        clearSelectedTransactions();
        (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
        return true;
    }, [isMobileSelectionModeEnabled, clearSelectedTransactions, topBarOffset, StyleUtils.searchHeaderDefaultOffset]);
    (0, useHandleBackButton_1.default)(handleBackButtonPress);
    const topBarAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        top: topBarOffset.get(),
    }));
    const scrollHandler = (0, react_native_reanimated_1.useAnimatedScrollHandler)({
        onScroll: (event) => {
            (0, react_native_reanimated_1.runOnJS)(triggerScrollEvent)();
            const { contentOffset, layoutMeasurement, contentSize } = event;
            if (windowHeight > contentSize.height) {
                topBarOffset.set(StyleUtils.searchHeaderDefaultOffset);
                return;
            }
            const currentOffset = contentOffset.y;
            const isScrollingDown = currentOffset > scrollOffset.get();
            const distanceScrolled = currentOffset - scrollOffset.get();
            (0, react_native_reanimated_1.runOnJS)(saveScrollOffset)(route, currentOffset);
            if (isScrollingDown && contentOffset.y > TOO_CLOSE_TO_TOP_DISTANCE) {
                topBarOffset.set((0, react_native_reanimated_1.clamp)(topBarOffset.get() - distanceScrolled, variables_1.default.minimalTopBarOffset, StyleUtils.searchHeaderDefaultOffset));
            }
            else if (!isScrollingDown && distanceScrolled < 0 && contentOffset.y + layoutMeasurement.height < contentSize.height - TOO_CLOSE_TO_BOTTOM_DISTANCE) {
                topBarOffset.set((0, react_native_reanimated_1.withTiming)(StyleUtils.searchHeaderDefaultOffset, { duration: ANIMATION_DURATION_IN_MS }));
            }
            scrollOffset.set(currentOffset);
        },
    }, []);
    const handleOnBackButtonPress = () => Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ROOT.getRoute({ query: (0, SearchQueryUtils_1.buildCannedSearchQuery)() }));
    const shouldDisplayCancelSearch = shouldUseNarrowLayout && searchRouterListVisible;
    const cancelSearchCallback = (0, react_1.useCallback)(() => {
        setSearchRouterListVisible(false);
    }, []);
    const handleSearchAction = (0, react_1.useCallback)((value) => {
        if (typeof value === 'string') {
            (0, Report_1.searchInServer)(value);
        }
        else {
            (0, Search_2.search)(value);
        }
    }, []);
    if (!queryJSON) {
        return (<ScreenWrapper_1.default testID={SearchPageNarrow.displayName} style={styles.pv0} offlineIndicatorStyle={styles.mtAuto} shouldShowOfflineIndicator={!!searchResults}>
                <FullPageNotFoundView_1.default shouldShow={!queryJSON} onBackButtonPress={handleOnBackButtonPress} shouldShowLink={false}/>
            </ScreenWrapper_1.default>);
    }
    const shouldShowFooter = !!metadata?.count;
    const isDataLoaded = (0, SearchUIUtils_1.isSearchDataLoaded)(searchResults, queryJSON);
    const shouldShowLoadingState = !isOffline && (!isDataLoaded || !!currentSearchResults?.search?.isLoading);
    return (<ScreenWrapper_1.default testID={SearchPageNarrow.displayName} shouldEnableMaxHeight offlineIndicatorStyle={styles.mtAuto} bottomContent={<NavigationTabBar_1.default selectedTab={NAVIGATION_TABS_1.default.SEARCH}/>} headerGapStyles={styles.searchHeaderGap} shouldShowOfflineIndicator={!!searchResults}>
            <react_native_1.View style={[styles.flex1, styles.overflowHidden]}>
                {!isMobileSelectionModeEnabled ? (<react_native_1.View style={[StyleUtils.getSearchPageNarrowHeaderStyles(), searchRouterListVisible && styles.flex1, styles.mh100]}>
                        <react_native_1.View style={[styles.zIndex10, styles.appBG]}>
                            <TopBar_1.default shouldShowLoadingBar={shouldShowLoadingState} breadcrumbLabel={translate('common.reports')} shouldDisplaySearch={false} cancelSearch={shouldDisplayCancelSearch ? cancelSearchCallback : undefined}/>
                        </react_native_1.View>
                        <react_native_1.View style={[styles.flex1]}>
                            <react_native_reanimated_1.default.View style={[topBarAnimatedStyle, !searchRouterListVisible && styles.narrowSearchRouterInactiveStyle, styles.flex1, styles.bgTransparent]}>
                                <react_native_1.View style={[styles.flex1, styles.pt2, styles.appBG]}>
                                    <SearchPageHeader_1.default queryJSON={queryJSON} searchRouterListVisible={searchRouterListVisible} hideSearchRouterList={() => {
                setSearchRouterListVisible(false);
            }} onSearchRouterFocus={() => {
                topBarOffset.set(StyleUtils.searchHeaderDefaultOffset);
                setSearchRouterListVisible(true);
            }} headerButtonsOptions={headerButtonsOptions} handleSearch={handleSearchAction} isMobileSelectionModeEnabled={isMobileSelectionModeEnabled}/>
                                </react_native_1.View>
                                <react_native_1.View style={[styles.appBG]}>
                                    {!searchRouterListVisible && (<SearchFiltersBar_1.default queryJSON={queryJSON} headerButtonsOptions={headerButtonsOptions} isMobileSelectionModeEnabled={isMobileSelectionModeEnabled}/>)}
                                </react_native_1.View>
                            </react_native_reanimated_1.default.View>
                        </react_native_1.View>
                    </react_native_1.View>) : (<>
                        <HeaderWithBackButton_1.default title={translate('common.selectMultiple')} onBackButtonPress={() => {
                topBarOffset.set(StyleUtils.searchHeaderDefaultOffset);
                clearSelectedTransactions();
                (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
            }}/>
                        <SearchPageHeader_1.default queryJSON={queryJSON} headerButtonsOptions={headerButtonsOptions} handleSearch={handleSearchAction} isMobileSelectionModeEnabled={isMobileSelectionModeEnabled}/>
                    </>)}
                {!searchRouterListVisible && (<react_native_1.View style={[styles.flex1]}>
                        <Search_1.default searchResults={searchResults} key={queryJSON.hash} queryJSON={queryJSON} onSearchListScroll={scrollHandler} contentContainerStyle={!isMobileSelectionModeEnabled ? styles.searchListContentContainerStyles : undefined} handleSearch={handleSearchAction} isMobileSelectionModeEnabled={isMobileSelectionModeEnabled}/>
                    </react_native_1.View>)}
                {shouldShowFooter && (<SearchPageFooter_1.default count={footerData.count} total={footerData.total} currency={footerData.currency}/>)}
            </react_native_1.View>
        </ScreenWrapper_1.default>);
}
SearchPageNarrow.displayName = 'SearchPageNarrow';
exports.default = SearchPageNarrow;
