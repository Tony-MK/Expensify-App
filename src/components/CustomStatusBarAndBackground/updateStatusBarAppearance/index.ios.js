"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateStatusBarAppearance;
const StatusBar_1 = require("@libs/StatusBar");
// eslint-disable-next-line @typescript-eslint/naming-convention
function updateStatusBarAppearance({ statusBarStyle }) {
    if (!statusBarStyle) {
        return;
    }
    StatusBar_1.default.setBarStyle(statusBarStyle, true);
}
