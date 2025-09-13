"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UPDATE_INTERVAL = 1000 * 60 * 60 * 8;
function checkForUpdates(platformSpecificUpdater) {
    if (typeof platformSpecificUpdater.init === 'function') {
        platformSpecificUpdater.init();
    }
    // Check for updates every hour
    setInterval(() => {
        platformSpecificUpdater.update();
    }, UPDATE_INTERVAL);
}
exports.default = checkForUpdates;
