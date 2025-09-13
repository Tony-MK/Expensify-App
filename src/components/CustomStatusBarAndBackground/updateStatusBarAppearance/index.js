"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateStatusBarAppearance;
const StatusBar_1 = require("@libs/StatusBar");
function updateStatusBarAppearance({ backgroundColor, statusBarStyle }) {
    if (backgroundColor) {
        StatusBar_1.default.setBackgroundColor(backgroundColor, true);
    }
    if (statusBarStyle) {
        StatusBar_1.default.setBarStyle(statusBarStyle, true);
    }
}
