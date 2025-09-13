"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Configures notification handling while in the foreground on iOS and Android. This is a no-op on other platforms.
 */
const ForegroundNotifications = {
    configureForegroundNotifications: () => { },
    disableForegroundNotifications: () => { },
};
exports.default = ForegroundNotifications;
