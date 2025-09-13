"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Navigation_1 = require("@libs/Navigation/Navigation");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const isNavigatorName_1 = require("./isNavigatorName");
const isSearchTopmostFullScreenRoute = () => {
    const rootState = Navigation_1.navigationRef.getRootState();
    if (!rootState) {
        return false;
    }
    return rootState.routes.findLast((route) => (0, isNavigatorName_1.isFullScreenName)(route.name))?.name === NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR;
};
exports.default = isSearchTopmostFullScreenRoute;
