"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var NavigationTabBar_1 = require("@components/Navigation/NavigationTabBar");
var NAVIGATION_TABS_1 = require("@components/Navigation/NavigationTabBar/NAVIGATION_TABS");
var TopBar_1 = require("@components/Navigation/TopBar");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var ScrollOffsetContextProvider_1 = require("@components/ScrollOffsetContextProvider");
var Search_1 = require("@components/Search");
var SearchContext_1 = require("@components/Search/SearchContext");
var SearchPageFooter_1 = require("@components/Search/SearchPageFooter");
var SearchFiltersBar_1 = require("@components/Search/SearchPageHeader/SearchFiltersBar");
var SearchPageHeader_1 = require("@components/Search/SearchPageHeader/SearchPageHeader");
var useHandleBackButton_1 = require("@hooks/useHandleBackButton");
var useLocalize_1 = require("@hooks/useLocalize");
var useNetwork_1 = require("@hooks/useNetwork");
var useOnyx_1 = require("@hooks/useOnyx");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useScrollEventEmitter_1 = require("@hooks/useScrollEventEmitter");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var useWindowDimensions_1 = require("@hooks/useWindowDimensions");
var MobileSelectionMode_1 = require("@libs/actions/MobileSelectionMode");
var Navigation_1 = require("@libs/Navigation/Navigation");
var SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
var SearchUIUtils_1 = require("@libs/SearchUIUtils");
var variables_1 = require("@styles/variables");
var Report_1 = require("@userActions/Report");
var Search_2 = require("@userActions/Search");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var TOO_CLOSE_TO_TOP_DISTANCE = 10;
var TOO_CLOSE_TO_BOTTOM_DISTANCE = 10;
var ANIMATION_DURATION_IN_MS = 300;
function SearchPageNarrow(_a) {
    var _b, _c;
    var queryJSON = _a.queryJSON, headerButtonsOptions = _a.headerButtonsOptions, searchResults = _a.searchResults, isMobileSelectionModeEnabled = _a.isMobileSelectionModeEnabled, metadata = _a.metadata, footerData = _a.footerData;
    var translate = (0, useLocalize_1.default)().translate;
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var windowHeight = (0, useWindowDimensions_1.default)().windowHeight;
    var styles = (0, useThemeStyles_1.default)();
    var StyleUtils = (0, useStyleUtils_1.default)();
    var clearSelectedTransactions = (0, SearchContext_1.useSearchContext)().clearSelectedTransactions;
    var _d = (0, react_1.useState)(false), searchRouterListVisible = _d[0], setSearchRouterListVisible = _d[1];
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var currentSearchResultsKey = (_b = queryJSON === null || queryJSON === void 0 ? void 0 : queryJSON.hash) !== null && _b !== void 0 ? _b : CONST_1.default.DEFAULT_NUMBER_ID;
    var currentSearchResults = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.SNAPSHOT).concat(currentSearchResultsKey), { canBeMissing: true })[0];
    // Controls the visibility of the educational tooltip based on user scrolling.
    // Hides the tooltip when the user is scrolling and displays it once scrolling stops.
    var triggerScrollEvent = (0, useScrollEventEmitter_1.default)();
    var route = (0, native_1.useRoute)();
    var saveScrollOffset = (0, react_1.useContext)(ScrollOffsetContextProvider_1.ScrollOffsetContext).saveScrollOffset;
    var scrollOffset = (0, react_native_reanimated_1.useSharedValue)(0);
    var topBarOffset = (0, react_native_reanimated_1.useSharedValue)(StyleUtils.searchHeaderDefaultOffset);
    var handleBackButtonPress = (0, react_1.useCallback)(function () {
        if (!isMobileSelectionModeEnabled) {
            return false;
        }
        topBarOffset.set(StyleUtils.searchHeaderDefaultOffset);
        clearSelectedTransactions();
        (0, MobileSelectionMode_1.turnOffMobileSelectionMode)();
        return true;
    }, [isMobileSelectionModeEnabled, clearSelectedTransactions, topBarOffset, StyleUtils.searchHeaderDefaultOffset]);
    (0, useHandleBackButton_1.default)(handleBackButtonPress);
    var topBarAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        top: topBarOffset.get(),
    }); });
    var scrollHandler = (0, react_native_reanimated_1.useAnimatedScrollHandler)({
        onScroll: function (event) {
            (0, react_native_reanimated_1.runOnJS)(triggerScrollEvent)();
            var contentOffset = event.contentOffset, layoutMeasurement = event.layoutMeasurement, contentSize = event.contentSize;
            if (windowHeight > contentSize.height) {
                topBarOffset.set(StyleUtils.searchHeaderDefaultOffset);
                return;
            }
            var currentOffset = contentOffset.y;
            var isScrollingDown = currentOffset > scrollOffset.get();
            var distanceScrolled = currentOffset - scrollOffset.get();
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
    var handleOnBackButtonPress = function () { return Navigation_1.default.goBack(ROUTES_1.default.SEARCH_ROOT.getRoute({ query: (0, SearchQueryUtils_1.buildCannedSearchQuery)() })); };
    var shouldDisplayCancelSearch = shouldUseNarrowLayout && searchRouterListVisible;
    var cancelSearchCallback = (0, react_1.useCallback)(function () {
        setSearchRouterListVisible(false);
    }, []);
    var handleSearchAction = (0, react_1.useCallback)(function (value) {
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
    var shouldShowFooter = !!(metadata === null || metadata === void 0 ? void 0 : metadata.count);
    var isDataLoaded = (0, SearchUIUtils_1.isSearchDataLoaded)(searchResults, queryJSON);
    var shouldShowLoadingState = !isOffline && (!isDataLoaded || !!((_c = currentSearchResults === null || currentSearchResults === void 0 ? void 0 : currentSearchResults.search) === null || _c === void 0 ? void 0 : _c.isLoading));
    return (<ScreenWrapper_1.default testID={SearchPageNarrow.displayName} shouldEnableMaxHeight offlineIndicatorStyle={styles.mtAuto} bottomContent={<NavigationTabBar_1.default selectedTab={NAVIGATION_TABS_1.default.SEARCH}/>} headerGapStyles={styles.searchHeaderGap} shouldShowOfflineIndicator={!!searchResults}>
            <react_native_1.View style={[styles.flex1, styles.overflowHidden]}>
                {!isMobileSelectionModeEnabled ? (<react_native_1.View style={[StyleUtils.getSearchPageNarrowHeaderStyles(), searchRouterListVisible && styles.flex1, styles.mh100]}>
                        <react_native_1.View style={[styles.zIndex10, styles.appBG]}>
                            <TopBar_1.default shouldShowLoadingBar={shouldShowLoadingState} breadcrumbLabel={translate('common.reports')} shouldDisplaySearch={false} cancelSearch={shouldDisplayCancelSearch ? cancelSearchCallback : undefined}/>
                        </react_native_1.View>
                        <react_native_1.View style={[styles.flex1]}>
                            <react_native_reanimated_1.default.View style={[topBarAnimatedStyle, !searchRouterListVisible && styles.narrowSearchRouterInactiveStyle, styles.flex1, styles.bgTransparent]}>
                                <react_native_1.View style={[styles.flex1, styles.pt2, styles.appBG]}>
                                    <SearchPageHeader_1.default queryJSON={queryJSON} searchRouterListVisible={searchRouterListVisible} hideSearchRouterList={function () {
                setSearchRouterListVisible(false);
            }} onSearchRouterFocus={function () {
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
                        <HeaderWithBackButton_1.default title={translate('common.selectMultiple')} onBackButtonPress={function () {
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
