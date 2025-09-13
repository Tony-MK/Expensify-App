"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const execAsync_1 = require("./execAsync");
const launchApp = (platform = 'android', packageName = config_1.default.MAIN_APP_PACKAGE, activityPath = config_1.default.ACTIVITY_PATH, launchArgs = {}) => {
    if (platform !== 'android') {
        throw new Error(`launchApp() missing implementation for platform: ${platform}`);
    }
    // Use adb to start the app
    const launchArgsString = Object.keys(launchArgs)
        .map((key) => `${typeof launchArgs[key] === 'boolean' ? '--ez' : '--es'} ${key} ${launchArgs[key]}`)
        .join(' ');
    return (0, execAsync_1.default)(`adb shell am start -n ${packageName}/${activityPath} ${launchArgsString}`);
};
exports.default = launchApp;
