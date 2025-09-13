"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const SCREENS_1 = require("@src/SCREENS");
// This file is used to define the relationship between the sidebar (LHN) and the parent split navigator.
const SIDEBAR_TO_SPLIT = {
    [SCREENS_1.default.SETTINGS.ROOT]: NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR,
    [SCREENS_1.default.HOME]: NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR,
    [SCREENS_1.default.WORKSPACE.INITIAL]: NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR,
};
exports.default = SIDEBAR_TO_SPLIT;
