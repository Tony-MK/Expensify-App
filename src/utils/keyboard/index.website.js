"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const Browser_1 = require("@libs/Browser");
const CONST_1 = require("@src/CONST");
let isVisible = false;
const initialViewportHeight = window?.visualViewport?.height;
const handleResize = () => {
    const viewportHeight = window?.visualViewport?.height;
    if (!viewportHeight || !initialViewportHeight) {
        return;
    }
    // Determine if the keyboard is visible by checking if the height difference exceeds 152px.
    // The 152px threshold accounts for UI elements such as smart banners on iOS Retina (max ~152px)
    // and smaller overlays like offline indicators on Android. Height differences > 152px reliably indicate keyboard visibility.
    isVisible = initialViewportHeight - viewportHeight > CONST_1.default.SMART_BANNER_HEIGHT;
};
window.visualViewport?.addEventListener('resize', handleResize);
const dismiss = () => {
    return new Promise((resolve) => {
        if (!isVisible || !(0, Browser_1.isMobile)()) {
            resolve();
            return;
        }
        const handleDismissResize = () => {
            const viewportHeight = window?.visualViewport?.height;
            if (!viewportHeight || !initialViewportHeight) {
                return;
            }
            const isKeyboardVisible = initialViewportHeight - viewportHeight > CONST_1.default.SMART_BANNER_HEIGHT;
            if (isKeyboardVisible) {
                return;
            }
            window.visualViewport?.removeEventListener('resize', handleDismissResize);
            return resolve();
        };
        window.visualViewport?.addEventListener('resize', handleDismissResize);
        react_native_1.Keyboard.dismiss();
    });
};
const utils = { dismiss };
exports.default = utils;
