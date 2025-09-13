"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const createPlatformStackNavigatorComponent_1 = require("./createPlatformStackNavigatorComponent");
const defaultPlatformStackScreenOptions_1 = require("./defaultPlatformStackScreenOptions");
const PlatformStackNavigatorComponent = (0, createPlatformStackNavigatorComponent_1.default)('PlatformStackNavigator', { defaultScreenOptions: defaultPlatformStackScreenOptions_1.default });
function createPlatformStackNavigator(config) {
    // In React Navigation 7 createNavigatorFactory returns any
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (0, native_1.createNavigatorFactory)(PlatformStackNavigatorComponent)(config);
}
exports.default = createPlatformStackNavigator;
