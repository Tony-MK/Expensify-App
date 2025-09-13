"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isNavigatorName_1 = require("@libs/Navigation/helpers/isNavigatorName");
// Visible directly means not through the overlay. So the full screen (split navigator or search) has to be the last route on the root stack.
function getIsNavigationTabBarVisibleDirectly(state) {
    return (0, isNavigatorName_1.isFullScreenName)(state?.routes.at(-1)?.name);
}
exports.default = getIsNavigationTabBarVisibleDirectly;
