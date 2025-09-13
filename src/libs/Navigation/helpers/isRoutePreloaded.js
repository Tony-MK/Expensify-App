"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isRoutePreloaded;
var navigationRef_1 = require("@libs/Navigation/navigationRef");
function isRoutePreloaded(routeName) {
    var rootState = navigationRef_1.default.getRootState();
    return rootState.preloadedRoutes.some(function (preloadedRoute) { return preloadedRoute.name === routeName; });
}
