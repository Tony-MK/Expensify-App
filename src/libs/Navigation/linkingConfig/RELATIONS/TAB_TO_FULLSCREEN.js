"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var NAVIGATION_TABS_1 = require("@components/Navigation/NavigationTabBar/NAVIGATION_TABS");
var NAVIGATORS_1 = require("@src/NAVIGATORS");
var SCREENS_1 = require("@src/SCREENS");
var TAB_TO_FULLSCREEN = (_a = {},
    _a[NAVIGATION_TABS_1.default.HOME] = [NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR],
    _a[NAVIGATION_TABS_1.default.SEARCH] = [NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR],
    _a[NAVIGATION_TABS_1.default.SETTINGS] = [NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR],
    _a[NAVIGATION_TABS_1.default.WORKSPACES] = [SCREENS_1.default.WORKSPACES_LIST, NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR],
    _a);
exports.default = TAB_TO_FULLSCREEN;
