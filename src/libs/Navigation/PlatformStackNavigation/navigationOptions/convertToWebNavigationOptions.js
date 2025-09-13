"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@libs/Navigation/PlatformStackNavigation/types");
const buildPlatformSpecificNavigationOptions_1 = require("./buildPlatformSpecificNavigationOptions");
function convertToWebNavigationOptions(screenOptions) {
    if (!screenOptions) {
        return undefined;
    }
    if ((0, types_1.isRouteBasedScreenOptions)(screenOptions)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (props) => {
            const routeBasedScreenOptions = screenOptions(props);
            return { ...(0, buildPlatformSpecificNavigationOptions_1.default)(routeBasedScreenOptions), ...routeBasedScreenOptions.web };
        };
    }
    return { ...(0, buildPlatformSpecificNavigationOptions_1.default)(screenOptions), ...screenOptions.web };
}
exports.default = convertToWebNavigationOptions;
