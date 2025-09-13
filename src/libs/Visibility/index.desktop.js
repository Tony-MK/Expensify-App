"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ELECTRON_EVENTS_1 = require("@desktop/ELECTRON_EVENTS");
/**
 * Detects whether the app is visible or not. Electron supports document.visibilityState,
 * but switching to another app while Electron is partially occluded will not trigger a state of hidden
 * so we ask the main process synchronously whether the BrowserWindow.isFocused()
 */
const isVisible = () => !!window.electron.sendSync(ELECTRON_EVENTS_1.default.REQUEST_VISIBILITY);
const hasFocus = () => true;
/**
 * Adds event listener for changes in visibility state
 */
const onVisibilityChange = (callback) => {
    // Deliberately strip callback argument to be consistent across implementations
    window.electron.on(ELECTRON_EVENTS_1.default.FOCUS, () => callback());
    window.electron.on(ELECTRON_EVENTS_1.default.BLUR, () => callback());
    return () => {
        window.electron.removeAllListeners(ELECTRON_EVENTS_1.default.FOCUS);
        window.electron.removeAllListeners(ELECTRON_EVENTS_1.default.BLUR);
    };
};
exports.default = {
    isVisible,
    onVisibilityChange,
    hasFocus,
};
