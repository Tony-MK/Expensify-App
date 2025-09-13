"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isNavigatorName_1 = require("@libs/Navigation/helpers/isNavigatorName");
function getIsScreenBlurred(state, currentRouteKey) {
    // If the screen is one of the last two fullscreen routes in the stack, it is not freezed on native platforms.
    // One screen below the focused one should not be freezed to allow users to return by swiping left.
    const lastTwoFullScreenRoutes = state.routes.filter((route) => (0, isNavigatorName_1.isFullScreenName)(route.name)).slice(-2);
    return !lastTwoFullScreenRoutes.some((route) => route.key === currentRouteKey);
}
exports.default = getIsScreenBlurred;
