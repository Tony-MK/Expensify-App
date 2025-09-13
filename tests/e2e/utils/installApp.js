"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const execAsync_1 = require("./execAsync");
const Logger = require("./logger");
/**
 * Installs the app on the currently connected device for the given platform.
 * It removes the app first if it already exists, so it's a clean installation.
 */
function default_1(packageName, path, platform = 'android', flag = '') {
    if (platform !== 'android') {
        throw new Error(`installApp() missing implementation for platform: ${platform}`);
    }
    const installCommand = flag ? `adb install ${flag}` : 'adb install';
    // Uninstall first, then install
    return ((0, execAsync_1.default)(`adb uninstall ${packageName}`)
        .catch((error) => {
        // Ignore errors
        Logger.warn('Failed to uninstall app:', error.message);
    })
        // install and grant push notifications permissions right away (the popup may block e2e tests sometimes)
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .finally(() => 
    // install the app
    (0, execAsync_1.default)(`${installCommand} ${path}`).then(() => 
    // and grant push notifications permissions right away (the popup may block e2e tests sometimes)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (0, execAsync_1.default)(`adb shell pm grant ${packageName.split('/').at(0)} android.permission.POST_NOTIFICATIONS`).catch((_) => 
    // in case of error - just log it and continue (if we request this permission on Android < 13 it'll fail because there is no such permission)
    Logger.warn('Failed to grant push notifications permissions. It might be due to the fact that push-notifications permission type is not supported on this OS version yet. Continue tests execution...')))));
}
