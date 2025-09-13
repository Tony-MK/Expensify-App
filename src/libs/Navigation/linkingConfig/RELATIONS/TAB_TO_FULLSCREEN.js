"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NAVIGATION_TABS_1 = require("@components/Navigation/NavigationTabBar/NAVIGATION_TABS");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const SCREENS_1 = require("@src/SCREENS");
const TAB_TO_FULLSCREEN = {
    [NAVIGATION_TABS_1.default.HOME]: [NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR],
    [NAVIGATION_TABS_1.default.SEARCH]: [NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR],
    [NAVIGATION_TABS_1.default.SETTINGS]: [NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR],
    [NAVIGATION_TABS_1.default.WORKSPACES]: [SCREENS_1.default.WORKSPACES_LIST, NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR],
};
exports.default = TAB_TO_FULLSCREEN;
