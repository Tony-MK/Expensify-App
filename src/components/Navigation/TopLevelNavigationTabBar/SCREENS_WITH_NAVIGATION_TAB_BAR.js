"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RELATIONS_1 = require("@libs/Navigation/linkingConfig/RELATIONS");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const SCREENS_1 = require("@src/SCREENS");
const SCREENS_WITH_NAVIGATION_TAB_BAR = [...Object.keys(RELATIONS_1.SIDEBAR_TO_SPLIT), NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR, SCREENS_1.default.SEARCH.ROOT, SCREENS_1.default.WORKSPACES_LIST];
exports.default = SCREENS_WITH_NAVIGATION_TAB_BAR;
