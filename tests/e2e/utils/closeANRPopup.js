"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const execAsync_1 = require("./execAsync");
const closeANRPopup = function (platform = 'android') {
    if (platform !== 'android') {
        throw new Error(`closeANRPopup() missing implementation for platform: ${platform}`);
    }
    // Press "Enter" to close the ANR popup
    return (0, execAsync_1.default)(`adb shell input keyevent KEYCODE_ENTER`);
};
exports.default = closeANRPopup;
