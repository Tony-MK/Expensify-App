"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var RootNavigatorExtraContent_1 = require("@components/Navigation/RootNavigatorExtraContent");
var useNavigationResetOnLayoutChange_1 = require("@libs/Navigation/AppNavigator/useNavigationResetOnLayoutChange");
var createPlatformStackNavigatorComponent_1 = require("@libs/Navigation/PlatformStackNavigation/createPlatformStackNavigatorComponent");
var defaultPlatformStackScreenOptions_1 = require("@libs/Navigation/PlatformStackNavigation/defaultPlatformStackScreenOptions");
var RootStackRouter_1 = require("./RootStackRouter");
var useCustomRootStackNavigatorState_1 = require("./useCustomRootStackNavigatorState");
var RootStackNavigatorComponent = (0, createPlatformStackNavigatorComponent_1.default)('RootStackNavigator', {
    createRouter: RootStackRouter_1.default,
    defaultScreenOptions: defaultPlatformStackScreenOptions_1.default,
    useCustomEffects: useNavigationResetOnLayoutChange_1.default,
    useCustomState: useCustomRootStackNavigatorState_1.default,
    ExtraContent: RootNavigatorExtraContent_1.default,
});
function createRootStackNavigator(config) {
    // In React Navigation 7 createNavigatorFactory returns any
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (0, native_1.createNavigatorFactory)(RootStackNavigatorComponent)(config);
}
exports.default = createRootStackNavigator;
