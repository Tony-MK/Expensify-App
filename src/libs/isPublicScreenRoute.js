"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isPublicScreenRoute;
const ROUTES_1 = require("@src/ROUTES");
function isPublicScreenRoute(route) {
    return Object.values(ROUTES_1.PUBLIC_SCREENS_ROUTES).some((screenRoute) => {
        const routeRegex = new RegExp(`^${screenRoute.replace(/:\w+/g, '\\w+')}$`);
        return routeRegex.test(route);
    });
}
