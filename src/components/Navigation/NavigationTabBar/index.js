"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderGap_1 = require("@components/HeaderGap");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const ImageSVG_1 = require("@components/ImageSVG");
const DebugTabView_1 = require("@components/Navigation/DebugTabView");
const Pressable_1 = require("@components/Pressable");
const ProductTrainingContext_1 = require("@components/ProductTrainingContext");
const Text_1 = require("@components/Text");
const EducationalTooltip_1 = require("@components/Tooltip/EducationalTooltip");
const useCurrentUserPersonalDetails_1 = require("@hooks/useCurrentUserPersonalDetails");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSearchTypeMenuSections_1 = require("@hooks/useSearchTypeMenuSections");
const useSidebarOrderedReports_1 = require("@hooks/useSidebarOrderedReports");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useSubscriptionPlan_1 = require("@hooks/useSubscriptionPlan");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWorkspacesTabIndicatorStatus_1 = require("@hooks/useWorkspacesTabIndicatorStatus");
const clearSelectedText_1 = require("@libs/clearSelectedText/clearSelectedText");
const getPlatform_1 = require("@libs/getPlatform");
const interceptAnonymousUser_1 = require("@libs/interceptAnonymousUser");
const usePreserveNavigatorState_1 = require("@libs/Navigation/AppNavigator/createSplitNavigator/usePreserveNavigatorState");
const getAccountTabScreenToOpen_1 = require("@libs/Navigation/helpers/getAccountTabScreenToOpen");
const isRoutePreloaded_1 = require("@libs/Navigation/helpers/isRoutePreloaded");
const navigateToWorkspacesPage_1 = require("@libs/Navigation/helpers/navigateToWorkspacesPage");
const Navigation_1 = require("@libs/Navigation/Navigation");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const WorkspacesSettingsUtils_1 = require("@libs/WorkspacesSettingsUtils");
const navigationRef_1 = require("@navigation/navigationRef");
const NavigationTabBarAvatar_1 = require("@pages/home/sidebar/NavigationTabBarAvatar");
const NavigationTabBarFloatingActionButton_1 = require("@pages/home/sidebar/NavigationTabBarFloatingActionButton");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const NAVIGATION_TABS_1 = require("./NAVIGATION_TABS");
function NavigationTabBar({ selectedTab, isTooltipAllowed = false, isTopLevelBar = false }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const getIconFill = (0, react_1.useCallback)((isSelected, isHovered) => {
        if (isSelected) {
            return theme.iconMenu;
        }
        if (isHovered) {
            return theme.success;
        }
        return theme.icon;
    }, [theme]);
    const { translate, preferredLocale } = (0, useLocalize_1.default)();
    const { indicatorColor: workspacesTabIndicatorColor, status: workspacesTabIndicatorStatus } = (0, useWorkspacesTabIndicatorStatus_1.default)();
    const { orderedReportIDs } = (0, useSidebarOrderedReports_1.useSidebarOrderedReports)();
    const [isDebugModeEnabled] = (0, useOnyx_1.default)(ONYXKEYS_1.default.IS_DEBUG_MODE_ENABLED, { canBeMissing: true });
    const [savedSearches] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SAVED_SEARCHES, { canBeMissing: true });
    const navigationState = (0, native_1.useNavigationState)(native_1.findFocusedRoute);
    const initialNavigationRouteState = (0, navigateToWorkspacesPage_1.getWorkspaceNavigationRouteState)();
    const [lastWorkspacesTabNavigatorRoute, setLastWorkspacesTabNavigatorRoute] = (0, react_1.useState)(initialNavigationRouteState.lastWorkspacesTabNavigatorRoute);
    const [workspacesTabState, setWorkspacesTabState] = (0, react_1.useState)(initialNavigationRouteState.workspacesTabState);
    const params = workspacesTabState?.routes?.at(0)?.params;
    const { typeMenuSections } = (0, useSearchTypeMenuSections_1.default)();
    const subscriptionPlan = (0, useSubscriptionPlan_1.default)();
    const [lastViewedPolicy] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.POLICY, {
        canBeMissing: true,
        selector: (val) => {
            if (!lastWorkspacesTabNavigatorRoute || lastWorkspacesTabNavigatorRoute.name !== NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR || !params?.policyID) {
                return undefined;
            }
            return val?.[`${ONYXKEYS_1.default.COLLECTION.POLICY}${params.policyID}`];
        },
    }, [navigationState]);
    const [reportAttributes] = (0, useOnyx_1.default)(ONYXKEYS_1.default.DERIVED.REPORT_ATTRIBUTES, { selector: (value) => value?.reports, canBeMissing: true });
    const { login: currentUserLogin } = (0, useCurrentUserPersonalDetails_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [chatTabBrickRoad, setChatTabBrickRoad] = (0, react_1.useState)(undefined);
    const platform = (0, getPlatform_1.default)();
    const isWebOrDesktop = platform === CONST_1.default.PLATFORM.WEB || platform === CONST_1.default.PLATFORM.DESKTOP;
    const { renderProductTrainingTooltip: renderInboxTooltip, shouldShowProductTrainingTooltip: shouldShowInboxTooltip, hideProductTrainingTooltip: hideInboxTooltip, } = (0, ProductTrainingContext_1.useProductTrainingContext)(CONST_1.default.PRODUCT_TRAINING_TOOLTIP_NAMES.BOTTOM_NAV_INBOX_TOOLTIP, isTooltipAllowed && selectedTab !== NAVIGATION_TABS_1.default.HOME);
    const StyleUtils = (0, useStyleUtils_1.default)();
    (0, react_1.useEffect)(() => {
        const newWorkspacesTabState = (0, navigateToWorkspacesPage_1.getWorkspaceNavigationRouteState)();
        const newLastRoute = newWorkspacesTabState.lastWorkspacesTabNavigatorRoute;
        const newTabState = newWorkspacesTabState.workspacesTabState;
        setLastWorkspacesTabNavigatorRoute(newLastRoute);
        setWorkspacesTabState(newTabState);
    }, [navigationState]);
    // On a wide layout DebugTabView should be rendered only within the navigation tab bar displayed directly on screens.
    const shouldRenderDebugTabViewOnWideLayout = !!isDebugModeEnabled && !isTopLevelBar;
    (0, react_1.useEffect)(() => {
        setChatTabBrickRoad((0, WorkspacesSettingsUtils_1.getChatTabBrickRoad)(orderedReportIDs, reportAttributes));
    }, [orderedReportIDs, reportAttributes]);
    const navigateToChats = (0, react_1.useCallback)(() => {
        if (selectedTab === NAVIGATION_TABS_1.default.HOME) {
            return;
        }
        hideInboxTooltip();
        Navigation_1.default.navigate(ROUTES_1.default.HOME);
    }, [hideInboxTooltip, selectedTab]);
    const navigateToSearch = (0, react_1.useCallback)(() => {
        if (selectedTab === NAVIGATION_TABS_1.default.SEARCH) {
            return;
        }
        (0, clearSelectedText_1.default)();
        (0, interceptAnonymousUser_1.default)(() => {
            const rootState = navigationRef_1.default.getRootState();
            const lastSearchNavigator = rootState.routes.findLast((route) => route.name === NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR);
            const lastSearchNavigatorState = lastSearchNavigator && lastSearchNavigator.key ? (0, usePreserveNavigatorState_1.getPreservedNavigatorState)(lastSearchNavigator?.key) : undefined;
            const lastSearchRoute = lastSearchNavigatorState?.routes.findLast((route) => route.name === SCREENS_1.default.SEARCH.ROOT);
            if (lastSearchRoute) {
                const { q, ...rest } = lastSearchRoute.params;
                const queryJSON = (0, SearchQueryUtils_1.buildSearchQueryJSON)(q);
                if (queryJSON) {
                    const query = (0, SearchQueryUtils_1.buildSearchQueryString)(queryJSON);
                    Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({
                        query,
                        ...rest,
                    }));
                    return;
                }
            }
            const nonExploreTypeQuery = typeMenuSections.at(0)?.menuItems.at(0)?.searchQuery;
            const savedSearchQuery = Object.values(savedSearches ?? {}).at(0)?.query;
            Navigation_1.default.navigate(ROUTES_1.default.SEARCH_ROOT.getRoute({ query: nonExploreTypeQuery ?? savedSearchQuery ?? (0, SearchQueryUtils_1.buildCannedSearchQuery)() }));
        });
    }, [selectedTab, typeMenuSections, savedSearches]);
    const navigateToSettings = (0, react_1.useCallback)(() => {
        if (selectedTab === NAVIGATION_TABS_1.default.SETTINGS) {
            return;
        }
        (0, interceptAnonymousUser_1.default)(() => {
            if ((0, isRoutePreloaded_1.default)(NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR)) {
                // We use dispatch here because the correct screens and params are preloaded and set up in usePreloadFullScreenNavigators.
                navigationRef_1.default.dispatch({ type: CONST_1.default.NAVIGATION.ACTION_TYPE.PUSH, payload: { name: NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR } });
                return;
            }
            const accountTabPayload = (0, getAccountTabScreenToOpen_1.default)(subscriptionPlan);
            navigationRef_1.default.dispatch(native_1.StackActions.push(NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR, accountTabPayload));
        });
    }, [selectedTab, subscriptionPlan]);
    /**
     * The settings tab is related to SettingsSplitNavigator and WorkspaceSplitNavigator.
     * If the user opens this tab from another tab, it is necessary to check whether it has not been opened before.
     * If so, all previously opened screens have be pushed to the navigation stack to maintain the order of screens within the tab.
     * If the user clicks on the settings tab while on this tab, this button should go back to the previous screen within the tab.
     */
    const showWorkspaces = (0, react_1.useCallback)(() => {
        (0, navigateToWorkspacesPage_1.default)({ shouldUseNarrowLayout, currentUserLogin, policy: lastViewedPolicy });
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
                            <Pressable_1.PressableWithFeedback onPress={navigateToChats} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.inbox')} style={({ hovered }) => [styles.leftNavigationTabBarItem, hovered && styles.navigationTabBarItemHovered]}>
                                {({ hovered }) => (<>
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
                                    </>)}
                            </Pressable_1.PressableWithFeedback>
                        </EducationalTooltip_1.default>
                        <Pressable_1.PressableWithFeedback onPress={navigateToSearch} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.reports')} style={({ hovered }) => [styles.leftNavigationTabBarItem, hovered && styles.navigationTabBarItemHovered]}>
                            {({ hovered }) => (<>
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
                                </>)}
                        </Pressable_1.PressableWithFeedback>
                        <Pressable_1.PressableWithFeedback onPress={showWorkspaces} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate('common.workspacesTabTitle')} style={({ hovered }) => [styles.leftNavigationTabBarItem, hovered && styles.navigationTabBarItemHovered]}>
                            {({ hovered }) => (<>
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
                                </>)}
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
