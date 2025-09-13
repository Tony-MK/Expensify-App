"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var SearchSidebar_1 = require("@components/Navigation/SearchSidebar");
var usePreserveNavigatorState_1 = require("@libs/Navigation/AppNavigator/createSplitNavigator/usePreserveNavigatorState");
var useNavigationResetOnLayoutChange_1 = require("@libs/Navigation/AppNavigator/useNavigationResetOnLayoutChange");
var createPlatformStackNavigatorComponent_1 = require("@navigation/PlatformStackNavigation/createPlatformStackNavigatorComponent");
var defaultPlatformStackScreenOptions_1 = require("@navigation/PlatformStackNavigation/defaultPlatformStackScreenOptions");
var SearchFullscreenRouter_1 = require("./SearchFullscreenRouter");
var useCustomState_1 = require("./useCustomState");
function useCustomEffects(props) {
    (0, useNavigationResetOnLayoutChange_1.default)(props);
    (0, usePreserveNavigatorState_1.default)(props.state, props.parentRoute);
}
var SearchFullscreenNavigatorComponent = (0, createPlatformStackNavigatorComponent_1.default)('SearchFullscreenNavigator', {
    createRouter: SearchFullscreenRouter_1.default,
    defaultScreenOptions: defaultPlatformStackScreenOptions_1.default,
    useCustomEffects: useCustomEffects,
    useCustomState: useCustomState_1.default,
    ExtraContent: SearchSidebar_1.default,
});
function createSearchFullscreenNavigator(config) {
    // In React Navigation 7 createNavigatorFactory returns any
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (0, native_1.createNavigatorFactory)(SearchFullscreenNavigatorComponent)(config);
}
exports.default = createSearchFullscreenNavigator;
