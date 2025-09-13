"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isRoutePreloaded;
const navigationRef_1 = require("@libs/Navigation/navigationRef");
function isRoutePreloaded(routeName) {
    const rootState = navigationRef_1.default.getRootState();
    return rootState.preloadedRoutes.some((preloadedRoute) => preloadedRoute.name === routeName);
}
