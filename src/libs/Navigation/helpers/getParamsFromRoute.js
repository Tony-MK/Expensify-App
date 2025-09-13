"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@libs/Navigation/linkingConfig/config");
const ROUTES_1 = require("@src/ROUTES");
function getParamsFromRoute(screenName, includeSharedParams) {
    const routeConfig = config_1.normalizedConfigs[screenName];
    if (!routeConfig?.pattern) {
        return [];
    }
    const route = routeConfig.pattern;
    const pathParams = route.match(/(?<=[:?&])(\w+)(?=[/=?&]|$)/g) ?? [];
    if (!includeSharedParams) {
        return pathParams;
    }
    // Get shared parameters from the configuration
    const sharedParams = ROUTES_1.SHARED_ROUTE_PARAMS[screenName] ?? [];
    // Combine both path parameters and shared parameters, removing duplicates
    return [...new Set([...pathParams, ...sharedParams])];
}
exports.default = getParamsFromRoute;
