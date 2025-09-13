"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateStatusBarAppearance;
const StatusBar_1 = require("@libs/StatusBar");
// eslint-disable-next-line @typescript-eslint/naming-convention
function updateStatusBarAppearance({ statusBarStyle }) {
    StatusBar_1.default.setBackgroundColor('transparent');
    StatusBar_1.default.setTranslucent(true);
    if (statusBarStyle) {
        StatusBar_1.default.setBarStyle(statusBarStyle, true);
    }
}
