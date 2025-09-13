"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = shouldSkipDeepLinkNavigation;
const ROUTES_1 = require("@src/ROUTES");
function shouldSkipDeepLinkNavigation(route) {
    // When deep-linking to desktop app with `transition` route we don't want to call navigate
    // on the route because it will display an infinite loading indicator.
    // See issue: https://github.com/Expensify/App/issues/33149
    //
    // In general, we don't want to repeat the navigation, when the component might redirect to a different page when first mounted,
    // like with the verify account page components. See PR: https://github.com/Expensify/App/pull/68401
    if (route.includes(ROUTES_1.default.TRANSITION_BETWEEN_APPS) || route.includes(ROUTES_1.VERIFY_ACCOUNT)) {
        return true;
    }
    return false;
}
