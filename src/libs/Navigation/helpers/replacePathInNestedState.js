"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/naming-convention */
const native_1 = require("@react-navigation/native");
function replacePathInNestedState(state, path) {
    const found = (0, native_1.findFocusedRoute)(state);
    if (!found) {
        return;
    }
    found.path = path;
}
exports.default = replacePathInNestedState;
