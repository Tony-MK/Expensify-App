"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const react_native_1 = require("react-native");
const checkForUpdates_1 = require("@libs/checkForUpdates");
const DateUtils_1 = require("@libs/DateUtils");
const Visibility_1 = require("@libs/Visibility");
const CONFIG_1 = require("@src/CONFIG");
const package_json_1 = require("../../../package.json");
/**
 * Download the latest app version from the server, and if it is different than the current one,
 * then refresh. If the page is visible, prompt the user to refresh.
 */
function webUpdate() {
    fetch('/version.json', { cache: 'no-cache' })
        .then((response) => response.json())
        .then(({ version }) => {
        if (version === package_json_1.default.version) {
            return;
        }
        if (!Visibility_1.default.isVisible()) {
            // Page is hidden, refresh immediately
            window.location.reload();
            return;
        }
        // Prompt user to refresh the page
        if (window.confirm('Refresh the page to get the latest updates!')) {
            window.location.reload();
        }
    });
}
/**
 * Create an object whose shape reflects the callbacks used in checkForUpdates.
 */
const webUpdater = () => ({
    init: () => {
        // We want to check for updates and refresh the page if necessary when the app is background.
        // That way, it will auto-update silently when they minimize the page,
        // and we don't bug the user any more than necessary :)
        window.addEventListener('visibilitychange', () => {
            if (Visibility_1.default.isVisible()) {
                return;
            }
            webUpdate();
        });
    },
    update: () => webUpdate(),
});
function default_1() {
    react_native_1.AppRegistry.runApplication(CONFIG_1.default.APP_NAME, {
        rootTag: document.getElementById('root'),
    });
    // When app loads, get current version (production only)
    if (CONFIG_1.default.IS_IN_PRODUCTION) {
        (0, checkForUpdates_1.default)(webUpdater());
    }
    // Start current date updater
    DateUtils_1.default.startCurrentDateUpdater();
}
