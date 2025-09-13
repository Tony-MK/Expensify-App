"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RHP_TO_WORKSPACES_LIST = exports.FULLSCREEN_TO_TAB = exports.TAB_TO_FULLSCREEN = exports.SPLIT_TO_SIDEBAR = exports.SIDEBAR_TO_SPLIT = exports.WORKSPACE_TO_RHP = exports.SIDEBAR_TO_RHP = exports.SEARCH_TO_RHP = exports.RHP_TO_SEARCH = exports.RHP_TO_SIDEBAR = exports.RHP_TO_WORKSPACE = exports.RHP_TO_SETTINGS = exports.SETTINGS_TO_RHP = void 0;
const SEARCH_TO_RHP_1 = require("./SEARCH_TO_RHP");
exports.SEARCH_TO_RHP = SEARCH_TO_RHP_1.default;
const SETTINGS_TO_RHP_1 = require("./SETTINGS_TO_RHP");
exports.SETTINGS_TO_RHP = SETTINGS_TO_RHP_1.default;
const SIDEBAR_TO_RHP_1 = require("./SIDEBAR_TO_RHP");
exports.SIDEBAR_TO_RHP = SIDEBAR_TO_RHP_1.default;
const SIDEBAR_TO_SPLIT_1 = require("./SIDEBAR_TO_SPLIT");
exports.SIDEBAR_TO_SPLIT = SIDEBAR_TO_SPLIT_1.default;
const TAB_TO_FULLSCREEN_1 = require("./TAB_TO_FULLSCREEN");
exports.TAB_TO_FULLSCREEN = TAB_TO_FULLSCREEN_1.default;
const WORKSPACE_TO_RHP_1 = require("./WORKSPACE_TO_RHP");
exports.WORKSPACE_TO_RHP = WORKSPACE_TO_RHP_1.default;
const WORKSPACES_LIST_TO_RHP_1 = require("./WORKSPACES_LIST_TO_RHP");
/**
 * This module manages the relationships between different fullscreen navigators and screens in the app.
 * It defines how screens in fullscreen navigator relate to screens in another navigator, particularly
 * for handling RHP (Right Hand Panel) navigation.
 *
 * For detailed information about setting the correct screen underneath RHP,
 * see the NAVIGATION.md documentation.
 */
function createInverseRelation(relations) {
    const reversedRelations = {};
    Object.entries(relations).forEach(([key, values]) => {
        const valuesWithType = (Array.isArray(values) ? values : [values]);
        valuesWithType.forEach((value) => {
            reversedRelations[value] = key;
        });
    });
    return reversedRelations;
}
const RHP_TO_SETTINGS = createInverseRelation(SETTINGS_TO_RHP_1.default);
exports.RHP_TO_SETTINGS = RHP_TO_SETTINGS;
const RHP_TO_WORKSPACE = createInverseRelation(WORKSPACE_TO_RHP_1.default);
exports.RHP_TO_WORKSPACE = RHP_TO_WORKSPACE;
const RHP_TO_SIDEBAR = createInverseRelation(SIDEBAR_TO_RHP_1.default);
exports.RHP_TO_SIDEBAR = RHP_TO_SIDEBAR;
const SPLIT_TO_SIDEBAR = createInverseRelation(SIDEBAR_TO_SPLIT_1.default);
exports.SPLIT_TO_SIDEBAR = SPLIT_TO_SIDEBAR;
const RHP_TO_WORKSPACES_LIST = createInverseRelation(WORKSPACES_LIST_TO_RHP_1.default);
exports.RHP_TO_WORKSPACES_LIST = RHP_TO_WORKSPACES_LIST;
const RHP_TO_SEARCH = createInverseRelation(SEARCH_TO_RHP_1.default);
exports.RHP_TO_SEARCH = RHP_TO_SEARCH;
const FULLSCREEN_TO_TAB = createInverseRelation(TAB_TO_FULLSCREEN_1.default);
exports.FULLSCREEN_TO_TAB = FULLSCREEN_TO_TAB;
