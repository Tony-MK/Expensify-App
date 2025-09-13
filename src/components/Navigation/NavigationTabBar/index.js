"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var react_native_1 = require("react-native");
var HeaderGap_1 = require("@components/HeaderGap");
var Icon_1 = require("@components/Icon");
var Expensicons = require("@components/Icon/Expensicons");
var ImageSVG_1 = require("@components/ImageSVG");
var DebugTabView_1 = require("@components/Navigation/DebugTabView");
var Pressable_1 = require("@components/Pressable");
var ProductTrainingContext_1 = require("@components/ProductTrainingContext");
var Text_1 = require("@components/Text");
var EducationalTooltip_1 = require("@components/Tooltip/EducationalTooltip");
var useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
var useSearchTypeMenuSections_1 = require("@hooks/useSearchTypeMenuSections");
var useSidebarOrderedReports_1 = require("@hooks/useSidebarOrderedReports");
var useStyleUtils_1 = require("@hooks/useStyleUtils");
var useSubscriptionPlan_1 = require("@hooks/useSubscriptionPlan");
var useTheme_1 = require("@hooks/useTheme");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var useWorkspacesTabIndicatorStatus_1 = require("@hooks/useWorkspacesTabIndicatorStatus");
var clearSelectedText_1 = require("@libs/clearSelectedText/clearSelectedText");
var getPlatform_1 = require("@libs/getPlatform");
var interceptAnonymousUser_1 = require("@libs/interceptAnonymousUser");
var usePreserveNavigatorState_1 = require("@libs/Navigation/AppNavigator/createSplitNavigator/usePreserveNavigatorState");
var getAccountTabScreenToOpen_1 = require("@libs/Navigation/helpers/getAccountTabScreenToOpen");
var isRoutePreloaded_1 = require("@libs/Navigation/helpers/isRoutePreloaded");
var navigateToWorkspacesPage_1 = require("@libs/Navigation/helpers/navigateToWorkspacesPage");
var Navigation_1 = require("@libs/Navigation/Navigation");
var SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
var WorkspacesSettingsUtils_1 = require("@libs/WorkspacesSettingsUtils");
var navigationRef_1 = require("@navigation/navigationRef");
var NavigationTabBarAvatar_1 = require("@pages/home/sidebar/NavigationTabBarAvatar");
var NavigationTabBarFloatingActionButton_1 = require("@pages/home/sidebar/NavigationTabBarFloatingActionButton");
var variables_1 = require("@styles/variables");
var CONST_1 = require("@src/CONST");
var NAVIGATORS_1 = require("@src/NAVIGATORS");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ROUTES_1 = require("@src/ROUTES");
var SCREENS_1 = require("@src/SCREENS");
var NAVIGATION_TABS_1 = require("./NAVIGATION_TABS");
function NavigationTabBar(_a) {
    var _b, _c;
    var selectedTab = _a.selectedTab, _d = _a.isTooltipAllowed, isTooltipAllowed = _d === void 0 ? false : _d, _e = _a.isTopLevelBar, isTopLevelBar = _e === void 0 ? false : _e;
    var theme = (0, useTheme_1.default)();
    var styles = (0, useThemeStyles_1.default)();
    var getIconFill = (0, react_1.useCallback)(function (isSelected, isHovered) {
        if (isSelected) {
            return theme.iconMenu;
        }
        if (isHovered) {
            return theme.success;
        }
        return theme.icon;
    }, [theme]);
    var _f = (0, useLocalize_1.default)(), translate = _f.translate, preferredLocale = _f.preferredLocale;
    var _g = (0, useWorkspacesTabIndicatorStatus_1.default)(), workspacesTabIndicatorColor = _g.indicatorColor, workspacesTabIndicatorStatus = _g.status;
    var orderedReportIDs = (0, useSidebarOrderedReports_1.useSidebarOrderedReports)().orderedReportIDs;
    var isDebugModeEnabled = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_DEBUG_MODE_ENABLED, { canBeMissing: true })[0];
    var savedSearches = (0, useOnyx_1.default)(ONYXKEYS_1.default.SAVED_SEARCHES, { canBeMissing: true })[0];
    var navigationState = (0, native_1.useNavigationState)(native_1.findFocusedRoute);
    var initialNavigationRouteState = (0, navigateToWorkspacesPage_1.getWorkspaceNavigationRouteState)();
    var _h = (0, react_1.useState)(initialNavigationRouteState.lastWorkspacesTabNavigatorRoute), lastWorkspacesTabNavigatorRoute = _h[0], setLastWorkspacesTabNavigatorRoute = _h[1];
    var _j = (0, react_1.useState)(initialNavigationRouteState.workspacesTabState), workspacesTabState = _j[0], setWorkspacesTabState = _j[1];
    var params = (_c = (_b = workspacesTabState === null || workspacesTabState === void 0 ? void 0 : workspacesTabState.routes) === null || _b === void 0 ? void 0 : _b.at(0)) === null || _c === void 0 ? void 0 : _c.params;
    var typeMenuSections = (0, useSearchTypeMenuSections_1.default)().typeMenuSections;
    var subscriptionPlan = (0, useSubscriptionPlan_1.default)();
    var lastViewedPolicy = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, {
        canBeMissing: true,
        selector: function (val) {
            if (!lastWorkspacesTabNavigatorRoute || lastWorkspacesTabNavigatorRoute.name !== NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR || !(params === null || params === void 0 ? void 0 : params.policyID)) {
                return undefined;
            }
            return val === null || val === void 0 ? void 0 : val["".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(params.policyID)];
        },
    }, [navigationState])[0];
    var reportAttributes = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { selector: function (value) { return value === null || value === void 0 ? void 0 : value.reports; }, canBeMissing: true })[0];
    var currentUserLogin = (0, useCurrentUserPersonalDetails_1.default)().login;
    var shouldUseNarrowLayout = (0, useResponsiveLayout_1.default)().shouldUseNarrowLayout;
    var _k = (0, react_1.useState)(undefined), chatTabBrickRoad = _k[0], setChatTabBrickRoad = _k[1];
    var platform = (0, getPlatform_1.default)();
    var isWebOrDesktop = platform === CONST_1.default.PLATFORM.WEB || platform === CONST_1.default.PLATFORM.DESKTOP;
    var _l = (0, ProductTrainingContext_1.useProductTrainingContext)(CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.BOTTOM_NAV_INBOX_TOOLTIP, isTooltipAllowed && selectedTab !== NAVIGATION_TABS_1.default.HOME), renderInboxTooltip = _l.renderProductTrainingTooltip, shouldShowInboxTooltip = _l.shouldShowProductTrainingTooltip, hideInboxTooltip = _l.hideProductTrainingTooltip;
    var StyleUtils = (0, useStyleUtils_1.default)();
    (0, react_1.useEffect)(function () {
        var newWorkspacesTabState = (0, navigateToWorkspacesPage_1.getWorkspaceNavigationRouteState)();
        var newLastRoute = newWorkspacesTabState.lastWorkspacesTabNavigatorRoute;
        var newTabState = newWorkspacesTabState.workspacesTabState;
        setLastWorkspacesTabNavigatorRoute(newLastRoute);
        setWorkspacesTabState(newTabState);
    }, [navigationState]);
    // On a wide layout DebugTabView should be rendered only within the navigation tab bar displayed directly on screens.
    var shouldRenderDebugTabViewOnWideLayout = !!isDebugModeEnabled && !isTopLevelBar;
    (0, react_1.useEffect)(function () {
        setChatTabBrickRoad((0, WorkspacesSettingsUtils_1.getChatTabBrickRoad)(orderedReportIDs, reportAttributes));
    }, [orderedReportIDs, reportAttributes]);
    var navigateToChats = (0, react_1.useCallback)(function () {
        if (selectedTab === NAVIGATION_TABS_1.default.HOME) {
            return;
        }
        hideInboxTooltip();
        Navigation_1.default.navigate(ROUTES_1.default.HOME);
    }, [hideInboxTooltip, selectedTab]);
    var navigateToSearch = (0, react_1.useCallback)(function () {
        if (selectedTab === NAVIGATION_TABS_1.default.SEARCH) {
            return;
        }
        (0, clearSelectedText_1.default)();
        (0, interceptAnonymousUser_1.default)(function () {
            var _a, _b, _c, _d;
            var rootState = navigationRef_1.default.getRootState();
            var lastSearchNavigator = rootState.routes.findLast(function (route) { return route.name === NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR; });
            var lastSearchNavigatorState = lastSearchNavigator && lastSearchNavigator.key ? (0, usePreserveNavigatorState_1.getPreservedNavigatorState)(lastSearchNavigator === null || lastSearchNavigator === void 0 ? void 0 : lastSearchNavigator.key) : undefined;
            var lastSearchRoute = lastSearchNavigatorState === null || lastSearchNavigatorState === void 0 ? void 0 : lastSearchNavigatorState.routes.findLast(function (route) { return route.name === SCREENS_1.default.SEARCH.ROOT; });
            if (lastSearchRoute) {
                var _e = lastSearchRoute.params, q = _e.q, rest = __rest(_e, ["q"]);
                var queryJSON = (0, SearchQueryUtils_1.buildSearchQueryJSON)(q);
                if (queryJSON) {
                    var query = (0, SearchQueryUtils_1.buildSearchQueryString)(queryJSON);
                    Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute(__assign({ query: query }, rest)));
                    return;
                }
            }
            var nonExploreTypeQuery = (_b = (_a = typeMenuSections.at(0)) === null || _a === void 0 ? void 0 : _a.menuItems.at(0)) === null || _b === void 0 ? void 0 : _b.searchQuery;
            var savedSearchQuery = (_c = Object.values(savedSearches !== null && savedSearches !== void 0 ? savedSearches : {}).at(0)) === null || _c === void 0 ? void 0 : _c.query;
            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({ query: (_d = nonExploreTypeQuery !== null && nonExploreTypeQuery !== void 0 ? nonExploreTypeQuery : savedSearchQuery) !== null && _d !== void 0 ? _d : (0, SearchQueryUtils_1.buildCannedSearchQuery)() }));
        });
    }, [selectedTab, typeMenuSections, savedSearches]);
    var navigateToSettings = (0, react_1.useCallback)(function () {
        if (selectedTab === NAVIGATION_TABS_1.default.SETTINGS) {
            return;
        }
        (0, interceptAnonymousUser_1.default)(function () {
            if ((0, isRoutePreloaded_1.default)(NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR)) {
                // We use dispatch here because the correct screens and params are preloaded and set up in usePreloadFullScreenNavigators.
                navigationRef_1.default.dispatch({ type: CONST_1.default.NAVIGATION.ACTION_TYPE.PUSH, payload: { name: NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR } });
                return;
            }
            var accountTabPayload = (0, getAccountTabScreenToOpen_1.default)(subscriptionPlan);
            navigationRef_1.default.dispatch(native_1.StackActions.push(NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR, accountTabPayload));
        });
    }, [selectedTab, subscriptionPlan]);
    /**
     * The settings tab is related to SettingsSplitNavigator and WorkspaceSplitNavigator.
     * If the user opens this tab from another tab, it is necessary to check whether it has not been opened before.
     * If so, all previously opened screens have be pushed to the navigation stack to maintain the order of screens within the tab.
     * If the user clicks on the settings tab while on this tab, this button should go back to the previous screen within the tab.
     */
    var showWorkspaces = (0, react_1.useCallback)(function () {
        (0, navigateToWorkspacesPage_1.default)({ shouldUseNarrowLayout: shouldUseNarrowLayout, currentUserLogin: currentUserLogin, policy: lastViewedPolicy });
    }, [shouldUseNarrowLayout, currentUserLogin, lastViewedPolicy]);
    if (!shouldUseNarrowLayout) {
        return (<>
                {shouldRenderDebugTabViewOnWideLayout && (<DebugTabView_1.default selectedTab={selectedTab} chatTabBrickRoad={chatTabBrickRoad}/>)}
                <react_native_1.View style={styles.leftNavigationTabBarContainer}>
                    <HeaderGap_1.default />
                    <react_native_1.View style={styles.flex1}>
                        <Pressable_1.PressableWithFeedback accessibilityRole={CONST_1.default.ROLE.BUTTON} accessibilityLabel="Home" accessible testID="ExpensifyLogoButton" onPress={navigateToChats} wrapperStyle={styles.leftNavigationTabBarItem}>
                            <ImageSVG_1.default style={StyleUtils.getAvatarStyle(CONST_1.default.AVATAR_SIZE.DEFAULT)} src={Expensicons.ExpensifyAppIcon}/>
                        </Pressable_1.PressableWithFeedback>
                        <EducationalTooltip_1.default shouldRender={shouldShowInboxTooltip} anchorAlignment={{
                horizontal: isWebOrDesktop ? CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.CENTER : CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
                vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
            }} shiftHorizontal={isWebOrDesktop ? 0 : variables_1.default.navigationTabBarInboxTooltipShiftHorizontal} renderTooltipContent={renderInboxTooltip} wrapperStyle={styles.productTrainingTooltipWrapper} shouldHideOnNavigate={false} onTooltipPress={navigateToChats}>
                            <Pressable_1.PressableWithFeedback onPress={navigateToChats} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.inbox')} style={function (_a) {
            var hovered = _a.hovered;
            return [styles.leftNavigationTabBarItem, hovered && styles.navigationTabBarItemHovered];
        }}>
                                {function (_a) {
                var hovered = _a.hovered;
                return (<>
                                        <react_native_1.View>
                                            <Icon_1.default src={Expensicons.Inbox} fill={getIconFill(selectedTab === NAVIGATION_TABS_1.default.HOME, hovered)} width={variables_1.default.iconBottomBar} height={variables_1.default.iconBottomBar}/>
                                            {!!chatTabBrickRoad && (<react_native_1.View style={[
                            styles.navigationTabBarStatusIndicator(chatTabBrickRoad === CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.INFO ? theme.iconSuccessFill : theme.danger),
                            hovered && { borderColor: theme.sidebarHover },
                        ]}/>)}
                                        </react_native_1.View>
                                        <Text_1.default numberOfLines={2} style={[
                        styles.textSmall,
                        styles.textAlignCenter,
                        styles.mt1Half,
                        selectedTab === NAVIGATION_TABS_1.default.HOME ? styles.textBold : styles.textSupporting,
                        styles.navigationTabBarLabel,
                    ]}>
                                            {translate('common.inbox')}
                                        </Text_1.default>
                                    </>);
            }}
                            </Pressable_1.PressableWithFeedback>
                        </EducationalTooltip_1.default>
                        <Pressable_1.PressableWithFeedback onPress={navigateToSearch} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.reports')} style={function (_a) {
            var hovered = _a.hovered;
            return [styles.leftNavigationTabBarItem, hovered && styles.navigationTabBarItemHovered];
        }}>
                            {function (_a) {
                var hovered = _a.hovered;
                return (<>
                                    <react_native_1.View>
                                        <Icon_1.default src={Expensicons.MoneySearch} fill={getIconFill(selectedTab === NAVIGATION_TABS_1.default.SEARCH, hovered)} width={variables_1.default.iconBottomBar} height={variables_1.default.iconBottomBar}/>
                                    </react_native_1.View>
                                    <Text_1.default numberOfLines={2} style={[
                        styles.textSmall,
                        styles.textAlignCenter,
                        styles.mt1Half,
                        selectedTab === NAVIGATION_TABS_1.default.SEARCH ? styles.textBold : styles.textSupporting,
                        styles.navigationTabBarLabel,
                    ]}>
                                        {translate('common.reports')}
                                    </Text_1.default>
                                </>);
            }}
                        </Pressable_1.PressableWithFeedback>
                        <Pressable_1.PressableWithFeedback onPress={showWorkspaces} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.workspacesTabTitle')} style={function (_a) {
            var hovered = _a.hovered;
            return [styles.leftNavigationTabBarItem, hovered && styles.navigationTabBarItemHovered];
        }}>
                            {function (_a) {
                var hovered = _a.hovered;
                return (<>
                                    <react_native_1.View>
                                        <Icon_1.default src={Expensicons.Buildings} fill={getIconFill(selectedTab === NAVIGATION_TABS_1.default.WORKSPACES, hovered)} width={variables_1.default.iconBottomBar} height={variables_1.default.iconBottomBar}/>
                                        {!!workspacesTabIndicatorStatus && (<react_native_1.View style={[styles.navigationTabBarStatusIndicator(workspacesTabIndicatorColor), hovered && { borderColor: theme.sidebarHover }]}/>)}
                                    </react_native_1.View>
                                    <Text_1.default numberOfLines={preferredLocale === CONST_1.default.LOCALES.DE || preferredLocale === CONST_1.default.LOCALES.NL ? 1 : 2} style={[
                        styles.textSmall,
                        styles.textAlignCenter,
                        styles.mt1Half,
                        selectedTab === NAVIGATION_TABS_1.default.WORKSPACES ? styles.textBold : styles.textSupporting,
                        styles.navigationTabBarLabel,
                    ]}>
                                        {translate('common.workspacesTabTitle')}
                                    </Text_1.default>
                                </>);
            }}
                        </Pressable_1.PressableWithFeedback>
                        <NavigationTabBarAvatar_1.default style={styles.leftNavigationTabBarItem} isSelected={selectedTab === NAVIGATION_TABS_1.default.SETTINGS} onPress={navigateToSettings}/>
                    </react_native_1.View>
                    <react_native_1.View style={styles.leftNavigationTabBarItem}>
                        <NavigationTabBarFloatingActionButton_1.default isTooltipAllowed={isTooltipAllowed}/>
                    </react_native_1.View>
                </react_native_1.View>
            </>);
    }
    return (<>
            {!!isDebugModeEnabled && (<DebugTabView_1.default selectedTab={selectedTab} chatTabBrickRoad={chatTabBrickRoad}/>)}
            <react_native_1.View style={styles.navigationTabBarContainer}>
                <EducationalTooltip_1.default shouldRender={shouldShowInboxTooltip} anchorAlignment={{
            horizontal: isWebOrDesktop ? CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.CENTER : CONST_1.default.MODAL.ANCHOR_ORIGIN_HORIZONTAL.LEFT,
            vertical: CONST_1.default.MODAL.ANCHOR_ORIGIN_VERTICAL.BOTTOM,
        }} shiftHorizontal={isWebOrDesktop ? 0 : variables_1.default.navigationTabBarInboxTooltipShiftHorizontal} renderTooltipContent={renderInboxTooltip} wrapperStyle={styles.productTrainingTooltipWrapper} shouldHideOnNavigate={false} onTooltipPress={navigateToChats}>
                    <Pressable_1.PressableWithFeedback onPress={navigateToChats} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.inbox')} wrapperStyle={styles.flex1} style={styles.navigationTabBarItem}>
                        <react_native_1.View>
                            <Icon_1.default src={Expensicons.Inbox} fill={selectedTab === NAVIGATION_TABS_1.default.HOME ? theme.iconMenu : theme.icon} width={variables_1.default.iconBottomBar} height={variables_1.default.iconBottomBar}/>
                            {!!chatTabBrickRoad && (<react_native_1.View style={styles.navigationTabBarStatusIndicator(chatTabBrickRoad === CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.INFO ? theme.iconSuccessFill : theme.danger)}/>)}
                        </react_native_1.View>
                        <Text_1.default numberOfLines={1} style={[
            styles.textSmall,
            styles.textAlignCenter,
            styles.mt1Half,
            selectedTab === NAVIGATION_TABS_1.default.HOME ? styles.textBold : styles.textSupporting,
            styles.navigationTabBarLabel,
        ]}>
                            {translate('common.inbox')}
                        </Text_1.default>
                    </Pressable_1.PressableWithFeedback>
                </EducationalTooltip_1.default>
                <Pressable_1.PressableWithFeedback onPress={navigateToSearch} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.reports')} wrapperStyle={styles.flex1} style={styles.navigationTabBarItem}>
                    <react_native_1.View>
                        <Icon_1.default src={Expensicons.MoneySearch} fill={selectedTab === NAVIGATION_TABS_1.default.SEARCH ? theme.iconMenu : theme.icon} width={variables_1.default.iconBottomBar} height={variables_1.default.iconBottomBar}/>
                    </react_native_1.View>
                    <Text_1.default numberOfLines={1} style={[
            styles.textSmall,
            styles.textAlignCenter,
            styles.mt1Half,
            selectedTab === NAVIGATION_TABS_1.default.SEARCH ? styles.textBold : styles.textSupporting,
            styles.navigationTabBarLabel,
        ]}>
                        {translate('common.reports')}
                    </Text_1.default>
                </Pressable_1.PressableWithFeedback>
                <react_native_1.View style={[styles.flex1, styles.navigationTabBarItem]}>
                    <NavigationTabBarFloatingActionButton_1.default isTooltipAllowed={isTooltipAllowed}/>
                </react_native_1.View>
                <Pressable_1.PressableWithFeedback onPress={showWorkspaces} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.workspacesTabTitle')} wrapperStyle={styles.flex1} style={styles.navigationTabBarItem}>
                    <react_native_1.View>
                        <Icon_1.default src={Expensicons.Buildings} fill={selectedTab === NAVIGATION_TABS_1.default.WORKSPACES ? theme.iconMenu : theme.icon} width={variables_1.default.iconBottomBar} height={variables_1.default.iconBottomBar}/>
                        {!!workspacesTabIndicatorStatus && <react_native_1.View style={styles.navigationTabBarStatusIndicator(workspacesTabIndicatorColor)}/>}
                    </react_native_1.View>
                    <Text_1.default numberOfLines={1} style={[
            styles.textSmall,
            styles.textAlignCenter,
            styles.mt1Half,
            selectedTab === NAVIGATION_TABS_1.default.WORKSPACES ? styles.textBold : styles.textSupporting,
            styles.navigationTabBarLabel,
        ]}>
                        {translate('common.workspacesTabTitle')}
                    </Text_1.default>
                </Pressable_1.PressableWithFeedback>
                <NavigationTabBarAvatar_1.default style={styles.navigationTabBarItem} isSelected={selectedTab === NAVIGATION_TABS_1.default.SETTINGS} onPress={navigateToSettings}/>
            </react_native_1.View>
        </>);
}
NavigationTabBar.displayName = 'NavigationTabBar';
exports.default = (0, react_1.memo)(NavigationTabBar);
