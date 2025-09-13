"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const stack_1 = require("@react-navigation/stack");
const react_1 = require("react");
const customHistory_1 = require("@libs/Navigation/AppNavigator/customHistory");
const convertToWebNavigationOptions_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/convertToWebNavigationOptions");
function createPlatformStackNavigatorComponent(displayName, options) {
    const createRouter = (0, customHistory_1.addCustomHistoryRouterExtension)(options?.createRouter ?? native_1.StackRouter);
    const useCustomState = options?.useCustomState ?? (() => undefined);
    const defaultScreenOptions = options?.defaultScreenOptions;
    const ExtraContent = options?.ExtraContent;
    const NavigationContentWrapper = options?.NavigationContentWrapper;
    const useCustomEffects = options?.useCustomEffects ?? (() => undefined);
    function PlatformNavigator({ id, initialRouteName, screenOptions, screenListeners, children, sidebarScreen, defaultCentralScreen, parentRoute, persistentScreens, ...props }) {
        const { navigation, state: originalState, descriptors, describe, NavigationContent, } = (0, native_1.useNavigationBuilder)(createRouter, {
            id,
            children,
            screenOptions: { ...defaultScreenOptions, ...screenOptions },
            screenListeners,
            initialRouteName,
            defaultCentralScreen,
            sidebarScreen,
            parentRoute,
            persistentScreens,
        }, convertToWebNavigationOptions_1.default);
        const customCodeProps = (0, react_1.useMemo)(() => ({
            state: originalState,
            navigation,
            descriptors,
            displayName,
            parentRoute,
        }), [originalState, navigation, descriptors, parentRoute]);
        const stateToRender = useCustomState(customCodeProps);
        const state = (0, react_1.useMemo)(() => stateToRender ?? originalState, [originalState, stateToRender]);
        const customCodePropsWithCustomState = (0, react_1.useMemo)(() => ({
            ...customCodeProps,
            state,
        }), [customCodeProps, state]);
        // Executes custom effects defined in "useCustomEffects" navigator option.
        useCustomEffects(customCodePropsWithCustomState);
        const mappedState = (0, react_1.useMemo)(() => {
            return {
                ...state,
                routes: state.routes.map((route) => {
                    // eslint-disable-next-line rulesdir/no-negated-variables
                    const dontDetachScreen = persistentScreens?.includes(route.name) ? { dontDetachScreen: true } : {};
                    return { ...route, ...dontDetachScreen };
                }),
            };
        }, [persistentScreens, state]);
        const Content = (0, react_1.useMemo)(() => (<NavigationContent>
                    <stack_1.StackView 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props} direction="ltr" state={mappedState} descriptors={descriptors} navigation={navigation} describe={describe}/>

                    {!!ExtraContent && (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <ExtraContent {...customCodePropsWithCustomState}/>)}
                </NavigationContent>), [NavigationContent, customCodePropsWithCustomState, describe, descriptors, mappedState, navigation, props]);
        // eslint-disable-next-line react/jsx-props-no-spreading
        return NavigationContentWrapper === undefined ? Content : <NavigationContentWrapper {...customCodePropsWithCustomState}>{Content}</NavigationContentWrapper>;
    }
    PlatformNavigator.displayName = displayName;
    return PlatformNavigator;
}
exports.default = createPlatformStackNavigatorComponent;
