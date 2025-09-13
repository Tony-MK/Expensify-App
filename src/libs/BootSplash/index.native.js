"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const Timing_1 = require("@libs/actions/Timing");
const Log_1 = require("@libs/Log");
const CONST_1 = require("@src/CONST");
const BootSplash = react_native_1.NativeModules.BootSplash;
function hide() {
    Log_1.default.info('[BootSplash] hiding splash screen', false);
    return BootSplash.hide().finally(() => {
        react_native_1.InteractionManager.runAfterInteractions(() => {
            Timing_1.default.end(CONST_1.default.TIMING.SPLASH_SCREEN);
        });
    });
}
exports.default = {
    hide,
    logoSizeRatio: BootSplash.logoSizeRatio || 1,
    navigationBarHeight: BootSplash.navigationBarHeight || 0,
};
