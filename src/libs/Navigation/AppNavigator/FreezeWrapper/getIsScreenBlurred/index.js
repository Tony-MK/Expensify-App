"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isNavigatorName_1 = require("@libs/Navigation/helpers/isNavigatorName");
function getIsScreenBlurred(state, currentRouteKey) {
    const lastFullScreenRoute = state.routes.findLast((route) => (0, isNavigatorName_1.isFullScreenName)(route.name));
    return lastFullScreenRoute?.key !== currentRouteKey;
}
exports.default = getIsScreenBlurred;
