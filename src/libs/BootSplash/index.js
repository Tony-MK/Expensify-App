"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const Timing_1 = require("@libs/actions/Timing");
const Log_1 = require("@libs/Log");
const CONST_1 = require("@src/CONST");
function resolveAfter(delay) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}
function hide() {
    Log_1.default.info('[BootSplash] hiding splash screen', false);
    return document.fonts.ready.then(() => {
        const splash = document.getElementById('splash');
        if (splash) {
            splash.style.opacity = '0';
        }
        react_native_1.InteractionManager.runAfterInteractions(() => {
            Timing_1.default.end(CONST_1.default.TIMING.SPLASH_SCREEN);
        });
        return resolveAfter(250).then(() => {
            if (!splash?.parentNode) {
                return;
            }
            splash.parentNode.removeChild(splash);
        });
    });
}
exports.default = {
    hide,
    logoSizeRatio: 1,
    navigationBarHeight: 0,
};
