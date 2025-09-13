"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
/**
 * Stop the startup trace for the app.
 */
const startupTimer = {
    stop: () => {
        react_native_1.NativeModules.StartupTimer.stop();
    },
};
exports.default = startupTimer;
