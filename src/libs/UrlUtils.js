"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Add / to the end of any URL if not present
 */
function addTrailingForwardSlash(url) {
    if (!url.endsWith('/')) {
        return `${url}/`;
    }
    return url;
}
exports.default = addTrailingForwardSlash;
