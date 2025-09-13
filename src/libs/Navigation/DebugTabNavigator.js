"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const stack_1 = require("@react-navigation/stack");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Expensicons = require("@components/Icon/Expensicons");
const getBackground_1 = require("@components/TabSelector/getBackground");
const getOpacity_1 = require("@components/TabSelector/getOpacity");
const TabSelectorItem_1 = require("@components/TabSelector/TabSelectorItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function getIconAndTitle(route, translate) {
    switch (route) {
        case CONST_1.default.DEBUG.DETAILS:
            return { icon: Expensicons.Info, title: translate('debug.details') };
        case CONST_1.default.DEBUG.JSON:
            return { icon: Expensicons.Eye, title: translate('debug.JSON') };
        case CONST_1.default.DEBUG.REPORT_ACTIONS:
            return { icon: Expensicons.Document, title: translate('debug.reportActions') };
        case CONST_1.default.DEBUG.REPORT_ACTION_PREVIEW:
            return { icon: Expensicons.Document, title: translate('debug.reportActionPreview') };
        case CONST_1.default.DEBUG.TRANSACTION_VIOLATIONS:
            return { icon: Expensicons.Exclamation, title: translate('debug.violations') };
        default:
            throw new Error(`Route ${route} has no icon nor title set.`);
    }
}
const StackNavigator = (0, stack_1.createStackNavigator)();
function DebugTabNavigator({ id, routes }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const navigation = (0, native_1.useNavigation)();
    const { translate } = (0, useLocalize_1.default)();
    const [currentTab, setCurrentTab] = (0, react_1.useState)(routes.at(0)?.name);
    const defaultAffectedAnimatedTabs = (0, react_1.useMemo)(() => Array.from({ length: routes.length }, (v, i) => i), [routes.length]);
    const [affectedAnimatedTabs, setAffectedAnimatedTabs] = (0, react_1.useState)(defaultAffectedAnimatedTabs);
    const routeData = (0, native_1.useRoute)();
    (0, react_1.useEffect)(() => {
        // It is required to wait transition end to reset affectedAnimatedTabs because tabs style is still animating during transition.
        setTimeout(() => {
            setAffectedAnimatedTabs(defaultAffectedAnimatedTabs);
        }, CONST_1.default.ANIMATED_TRANSITION);
    }, [defaultAffectedAnimatedTabs, currentTab]);
    return (<>
            <react_native_1.View style={styles.tabSelector}>
                {routes.map((route, index) => {
            const isActive = route.name === currentTab;
            const activeOpacity = (0, getOpacity_1.default)({
                routesLength: routes.length,
                tabIndex: index,
                active: true,
                affectedTabs: affectedAnimatedTabs,
                position: undefined,
                isActive,
            });
            const inactiveOpacity = (0, getOpacity_1.default)({
                routesLength: routes.length,
                tabIndex: index,
                active: false,
                affectedTabs: affectedAnimatedTabs,
                position: undefined,
                isActive,
            });
            const backgroundColor = (0, getBackground_1.default)({
                routesLength: routes.length,
                tabIndex: index,
                affectedTabs: affectedAnimatedTabs,
                theme,
                position: undefined,
                isActive,
            });
            const { icon, title } = getIconAndTitle(route.name, translate);
            const onPress = () => {
                navigation.navigate(routeData.name, { ...routeData?.params, screen: route.name });
                setCurrentTab(route.name);
            };
            return (<TabSelectorItem_1.default key={route.name} icon={icon} title={title} onPress={onPress} activeOpacity={activeOpacity} inactiveOpacity={inactiveOpacity} backgroundColor={backgroundColor} isActive={isActive}/>);
        })}
            </react_native_1.View>
            <StackNavigator.Navigator id={id} screenOptions={{
            animation: 'none',
            headerShown: false,
        }} screenListeners={{
            state: (e) => {
                const event = e;
                const state = event.data.state;
                const routeNames = state.routeNames;
                const newSelectedTab = state.routes.at(state.routes.length - 1)?.name;
                if (currentTab === newSelectedTab || (currentTab && !routeNames.includes(currentTab))) {
                    return;
                }
                setCurrentTab(newSelectedTab);
            },
        }}>
                {routes.map((route) => (<StackNavigator.Screen key={route.name} name={route.name} component={route.component}/>))}
            </StackNavigator.Navigator>
        </>);
}
exports.default = DebugTabNavigator;
