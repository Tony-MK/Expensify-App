"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@libs/Navigation/PlatformStackNavigation/types");
const buildPlatformSpecificNavigationOptions_1 = require("./buildPlatformSpecificNavigationOptions");
function convertToNativeNavigationOptions(screenOptions) {
    if (!screenOptions) {
        return undefined;
    }
    if ((0, types_1.isRouteBasedScreenOptions)(screenOptions)) {
        return (props) => {
            const routeBasedScreenOptions = screenOptions(props);
            return { ...(0, buildPlatformSpecificNavigationOptions_1.default)(routeBasedScreenOptions), ...routeBasedScreenOptions.native };
        };
    }
    return { ...(0, buildPlatformSpecificNavigationOptions_1.default)(screenOptions), ...screenOptions.native };
}
exports.default = convertToNativeNavigationOptions;
