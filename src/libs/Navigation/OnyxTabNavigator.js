"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopTab = void 0;
exports.TabScreenWithFocusTrapWrapper = TabScreenWithFocusTrapWrapper;
const material_top_tabs_1 = require("@react-navigation/material-top-tabs");
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const FocusTrapContainerElement_1 = require("@components/FocusTrap/FocusTrapContainerElement");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Tab_1 = require("@userActions/Tab");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const onTabSelectHandler_1 = require("./onTabSelectHandler");
const OnyxTabNavigatorConfig_1 = require("./OnyxTabNavigatorConfig");
const TopTab = (0, material_top_tabs_1.createMaterialTopTabNavigator)();
exports.TopTab = TopTab;
// The TabFocusTrapContext is to collect the focus trap container element of each tab screen.
// This provider is placed in the OnyxTabNavigator component and the consumer is in the TabScreenWithFocusTrapWrapper component.
const TabFocusTrapContext = react_1.default.createContext(() => { });
const getTabNames = (children) => {
    const result = [];
    react_1.default.Children.forEach(children, (child) => {
        if (!react_1.default.isValidElement(child)) {
            return;
        }
        const element = child;
        if (typeof element.props.name === 'string') {
            result.push(element.props.name);
        }
    });
    return result;
};
// This takes all the same props as MaterialTopTabsNavigator: https://reactnavigation.org/docs/material-top-tab-navigator/#props,
// except ID is now required, and it gets a `selectedTab` from Onyx
// It also takes 2 more optional callbacks to manage the focus trap container elements of the tab bar and the active tab
function OnyxTabNavigator({ id, defaultSelectedTab, tabBar: TabBar, children, onTabBarFocusTrapContainerElementChanged, onActiveTabFocusTrapContainerElementChanged, onTabSelected = () => { }, screenListeners, shouldShowLabelWhenInactive = true, disableSwipe = false, shouldShowProductTrainingTooltip, renderProductTrainingTooltip, lazyLoadEnabled = false, onTabSelect, equalWidth = false, ...rest }) {
    const isFirstMount = (0, react_1.useRef)(true);
    // Mapping of tab name to focus trap container element
    const [focusTrapContainerElementMapping, setFocusTrapContainerElementMapping] = (0, react_1.useState)({});
    const [selectedTab, selectedTabResult] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.SELECTED_TAB}${id}`, { canBeMissing: true });
    const tabNames = (0, react_1.useMemo)(() => getTabNames(children), [children]);
    const validInitialTab = selectedTab && tabNames.includes(selectedTab) ? selectedTab : defaultSelectedTab;
    const LazyPlaceholder = (0, react_1.useCallback)(() => {
        return <FullscreenLoadingIndicator_1.default />;
    }, []);
    // This callback is used to register the focus trap container element of each available tab screen
    const setTabFocusTrapContainerElement = (0, react_1.useCallback)((tabName, containerElement) => {
        setFocusTrapContainerElementMapping((prevMapping) => {
            const resultMapping = { ...prevMapping };
            if (containerElement) {
                resultMapping[tabName] = containerElement;
            }
            else {
                delete resultMapping[tabName];
            }
            return resultMapping;
        });
    }, []);
    /**
     * This is a TabBar wrapper component that includes the focus trap container element callback.
     * In `TabSelector.tsx` component, the callback prop to register focus trap container element is supported out of the box
     */
    const TabBarWithFocusTrapInclusion = (0, react_1.useCallback)((props) => {
        return (<TabBar onFocusTrapContainerElementChanged={onTabBarFocusTrapContainerElementChanged} shouldShowLabelWhenInactive={shouldShowLabelWhenInactive} shouldShowProductTrainingTooltip={shouldShowProductTrainingTooltip} renderProductTrainingTooltip={renderProductTrainingTooltip} equalWidth={equalWidth} 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}/>);
    }, [TabBar, onTabBarFocusTrapContainerElementChanged, shouldShowLabelWhenInactive, shouldShowProductTrainingTooltip, renderProductTrainingTooltip, equalWidth]);
    // If the selected tab changes, we need to update the focus trap container element of the active tab
    (0, react_1.useEffect)(() => {
        onActiveTabFocusTrapContainerElementChanged?.(selectedTab ? focusTrapContainerElementMapping[selectedTab] : null);
    }, [selectedTab, focusTrapContainerElementMapping, onActiveTabFocusTrapContainerElementChanged]);
    if ((0, isLoadingOnyxValue_1.default)(selectedTabResult)) {
        return null;
    }
    return (<TabFocusTrapContext.Provider value={setTabFocusTrapContainerElement}>
            <TopTab.Navigator 
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    {...rest} id={id} initialRouteName={validInitialTab} backBehavior="initialRoute" keyboardDismissMode="none" tabBar={TabBarWithFocusTrapInclusion} onTabSelect={onTabSelect} screenListeners={{
            state: (e) => {
                const event = e;
                const state = event.data.state;
                const index = state.index;
                const routeNames = state.routeNames;
                // For web-based platforms we need to focus the selected tab input once on first mount as well as
                // when the tab selection is changed via internal Pager onPageSelected (passed to the navigator)
                if (isFirstMount.current) {
                    (0, onTabSelectHandler_1.default)(index, onTabSelect);
                    isFirstMount.current = false;
                }
                const newSelectedTab = routeNames.at(index);
                if (selectedTab === newSelectedTab) {
                    return;
                }
                Tab_1.default.setSelectedTab(id, newSelectedTab);
                onTabSelected(newSelectedTab);
            },
            ...(screenListeners ?? {}),
        }} screenOptions={{
            ...OnyxTabNavigatorConfig_1.defaultScreenOptions,
            swipeEnabled: !disableSwipe,
            lazy: lazyLoadEnabled,
            lazyPlaceholder: LazyPlaceholder,
        }}>
                {children}
            </TopTab.Navigator>
        </TabFocusTrapContext.Provider>);
}
/**
 * We should use this wrapper for each tab screen. This will help register the focus trap container element of each tab screen.
 * In the OnyxTabNavigator component, depending on the selected tab, we will further register the correct container element of the current active tab to the parent focus trap.
 * This must be used if we want to include all tabbable elements of one tab screen in the parent focus trap if that tab screen is active.
 * Example usage (check the `IOURequestStartPage.tsx` and `NewChatSelectorPage.tsx` components for more info)
 * ```tsx
 * <OnyxTabNavigator>
 *   <Tab.Screen>
 *     {() => (
 *       <TabScreenWithFocusTrapWrapper>
 *          <Content />
 *        </TabScreenWithFocusTrapWrapper>
 *     )}
 *   </Tab.Screen>
 * </OnyxTabNavigator>
 * ```
 */
function TabScreenWithFocusTrapWrapper({ children }) {
    const route = (0, native_1.useRoute)();
    const styles = (0, useThemeStyles_1.default)();
    const setTabContainerElement = (0, react_1.useContext)(TabFocusTrapContext);
    const handleContainerElementChanged = (0, react_1.useCallback)((element) => {
        setTabContainerElement(route.name, element);
    }, [setTabContainerElement, route.name]);
    return (<FocusTrapContainerElement_1.default onContainerElementChanged={handleContainerElementChanged} style={[styles.w100, styles.h100]}>
            {children}
        </FocusTrapContainerElement_1.default>);
}
OnyxTabNavigator.displayName = 'OnyxTabNavigator';
exports.default = OnyxTabNavigator;
