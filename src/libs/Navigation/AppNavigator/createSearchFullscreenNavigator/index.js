"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const SearchSidebar_1 = require("@components/Navigation/SearchSidebar");
const usePreserveNavigatorState_1 = require("@libs/Navigation/AppNavigator/createSplitNavigator/usePreserveNavigatorState");
const useNavigationResetOnLayoutChange_1 = require("@libs/Navigation/AppNavigator/useNavigationResetOnLayoutChange");
const createPlatformStackNavigatorComponent_1 = require("@navigation/PlatformStackNavigation/createPlatformStackNavigatorComponent");
const defaultPlatformStackScreenOptions_1 = require("@navigation/PlatformStackNavigation/defaultPlatformStackScreenOptions");
const SearchFullscreenRouter_1 = require("./SearchFullscreenRouter");
const useCustomState_1 = require("./useCustomState");
function useCustomEffects(props) {
    (0, useNavigationResetOnLayoutChange_1.default)(props);
    (0, usePreserveNavigatorState_1.default)(props.state, props.parentRoute);
}
const SearchFullscreenNavigatorComponent = (0, createPlatformStackNavigatorComponent_1.default)('SearchFullscreenNavigator', {
    createRouter: SearchFullscreenRouter_1.default,
    defaultScreenOptions: defaultPlatformStackScreenOptions_1.default,
    useCustomEffects,
    useCustomState: useCustomState_1.default,
    ExtraContent: SearchSidebar_1.default,
});
function createSearchFullscreenNavigator(config) {
    // In React Navigation 7 createNavigatorFactory returns any
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (0, native_1.createNavigatorFactory)(SearchFullscreenNavigatorComponent)(config);
}
exports.default = createSearchFullscreenNavigator;
