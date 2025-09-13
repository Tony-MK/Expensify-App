"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SCREENS_1 = require("@src/SCREENS");
/**
 * This file is used to define the relationship between the sidebar and the right hand pane (RHP) screen.
 * This means that going back from RHP will take the user directly to the sidebar. On wide layout the default central screen will be used to fill the space.
 */
const SIDEBAR_TO_RHP = {
    [SCREENS_1.default.SETTINGS.ROOT]: [SCREENS_1.default.SETTINGS.SHARE_CODE, SCREENS_1.default.SETTINGS.PROFILE.STATUS, SCREENS_1.default.SETTINGS.PREFERENCES.PRIORITY_MODE],
};
exports.default = SIDEBAR_TO_RHP;
