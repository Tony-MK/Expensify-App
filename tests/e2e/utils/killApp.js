"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const execAsync_1 = require("./execAsync");
const killApp = function (platform = 'android', packageName = config_1.default.MAIN_APP_PACKAGE) {
    if (platform !== 'android') {
        throw new Error(`killApp() missing implementation for platform: ${platform}`);
    }
    // Use adb to kill the app
    return (0, execAsync_1.default)(`adb shell am force-stop ${packageName}`);
};
exports.default = killApp;
