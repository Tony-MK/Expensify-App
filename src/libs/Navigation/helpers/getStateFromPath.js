"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const linkingConfig_1 = require("@libs/Navigation/linkingConfig");
const getMatchingNewRoute_1 = require("./getMatchingNewRoute");
/**
 * @param path - The path to parse
 * @returns - It's possible that there is no navigation action for the given path
 */
function getStateFromPath(path) {
    const normalizedPath = !path.startsWith('/') ? `/${path}` : path;
    const normalizedPathAfterRedirection = (0, getMatchingNewRoute_1.default)(normalizedPath) ?? normalizedPath;
    // This function is used in the linkTo function where we want to use default getStateFromPath function.
    const state = (0, native_1.getStateFromPath)(normalizedPathAfterRedirection, linkingConfig_1.linkingConfig.config);
    if (!state) {
        throw new Error('Failed to parse the path to a navigation state.');
    }
    return state;
}
exports.default = getStateFromPath;
