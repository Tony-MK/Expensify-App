"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isNavigatorName_1 = require("@libs/Navigation/helpers/isNavigatorName");
const RELATIONS_1 = require("@libs/Navigation/linkingConfig/RELATIONS");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
function getSelectedTab(state) {
    const topmostFullScreenRoute = state?.routes.findLast((route) => (0, isNavigatorName_1.isFullScreenName)(route.name));
    return RELATIONS_1.FULLSCREEN_TO_TAB[topmostFullScreenRoute?.name ?? NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR];
}
exports.default = getSelectedTab;
