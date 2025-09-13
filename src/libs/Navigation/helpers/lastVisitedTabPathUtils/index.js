"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearSessionStorage = clearSessionStorage;
exports.getLastVisitedWorkspaceTabScreen = getLastVisitedWorkspaceTabScreen;
exports.getLastVisitedTabPath = getLastVisitedTabPath;
exports.saveSettingsTabPathToSessionStorage = saveSettingsTabPathToSessionStorage;
exports.getSettingsTabStateFromSessionStorage = getSettingsTabStateFromSessionStorage;
exports.saveWorkspacesTabPathToSessionStorage = saveWorkspacesTabPathToSessionStorage;
exports.getWorkspacesTabStateFromSessionStorage = getWorkspacesTabStateFromSessionStorage;
const native_1 = require("@react-navigation/native");
const getStateFromPath_1 = require("@libs/Navigation/helpers/getStateFromPath");
const CONST_1 = require("@src/CONST");
/**
 * Clears all session storage data.
 */
function clearSessionStorage() {
    sessionStorage.clear();
}
/**
 * Generic function to save a path to session storage by key
 */
function saveTabPathToSessionStorage(key, url) {
    sessionStorage.setItem(key, url);
}
/**
 * Converts stored path to navigation state
 */
function getTabStateFromSessionStorage(key) {
    const path = sessionStorage.getItem(key);
    if (!path) {
        return undefined;
    }
    return (0, getStateFromPath_1.default)(path);
}
/**
 * Generic function to extract the path from currently focused route
 */
function getLastVisitedTabPath(state) {
    const focusedRoute = (0, native_1.findFocusedRoute)(state);
    if (!focusedRoute) {
        return undefined;
    }
    return focusedRoute.path;
}
function saveWorkspacesTabPathToSessionStorage(url) {
    saveTabPathToSessionStorage(CONST_1.default.SESSION_STORAGE_KEYS.LAST_VISITED_PATH.WORKSPACES_TAB, url);
}
function getWorkspacesTabStateFromSessionStorage() {
    return getTabStateFromSessionStorage(CONST_1.default.SESSION_STORAGE_KEYS.LAST_VISITED_PATH.WORKSPACES_TAB);
}
function saveSettingsTabPathToSessionStorage(url) {
    saveTabPathToSessionStorage(CONST_1.default.SESSION_STORAGE_KEYS.LAST_VISITED_PATH.SETTINGS_TAB, url);
}
function getSettingsTabStateFromSessionStorage() {
    return getTabStateFromSessionStorage(CONST_1.default.SESSION_STORAGE_KEYS.LAST_VISITED_PATH.SETTINGS_TAB);
}
function getLastVisitedWorkspaceTabScreen() {
    const workspacesTabState = getWorkspacesTabStateFromSessionStorage();
    return workspacesTabState?.routes?.at(-1)?.state?.routes?.at(-1)?.name;
}
