"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useNavigationResetOnLayoutChange_1 = require("@libs/Navigation/AppNavigator/useNavigationResetOnLayoutChange");
const createPlatformStackNavigatorComponent_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigatorComponent");
const defaultPlatformStackScreenOptions_1 = require("@libs/Navigation/PlatformStackNavigation/defaultPlatformStackScreenOptions");
const SidebarSpacerWrapper_1 = require("./SidebarSpacerWrapper");
const SplitRouter_1 = require("./SplitRouter");
const usePreserveNavigatorState_1 = require("./usePreserveNavigatorState");
function useCustomEffects(props) {
    (0, useNavigationResetOnLayoutChange_1.default)(props);
    (0, usePreserveNavigatorState_1.default)(props.state, props.parentRoute);
}
function useCustomSplitNavigatorState({ state }) {
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const sidebarScreenRoute = state.routes.at(0);
    if (!sidebarScreenRoute) {
        return state;
    }
    const centralScreenRoutes = state.routes.slice(1);
    const routesToRender = shouldUseNarrowLayout ? state.routes.slice(-2) : [sidebarScreenRoute, ...centralScreenRoutes.slice(-2)];
    return { ...state, routes: routesToRender, index: routesToRender.length - 1 };
}
const SplitNavigatorComponent = (0, createPlatformStackNavigatorComponent_1.default)('SplitNavigator', {
    createRouter: SplitRouter_1.default,
    useCustomEffects,
    defaultScreenOptions: defaultPlatformStackScreenOptions_1.default,
    useCustomState: useCustomSplitNavigatorState,
    NavigationContentWrapper: SidebarSpacerWrapper_1.default,
});
function createSplitNavigator(config) {
    // In React Navigation 7 createNavigatorFactory returns any
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (0, native_1.createNavigatorFactory)(SplitNavigatorComponent)(config);
}
exports.default = createSplitNavigator;
