"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const react_native_1 = require("react-native");
const Timing_1 = require("@userActions/Timing");
const CONST_1 = require("@src/CONST");
function default_1() {
    Timing_1.default.start(CONST_1.default.TIMING.SPLASH_SCREEN);
    react_native_1.AppState.addEventListener('change', (state) => {
        if (state === 'active') {
            return;
        }
        Timing_1.default.clearData();
    });
}
