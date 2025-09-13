"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPlatform_1 = require("@libs/getPlatform");
const CONST_1 = require("@src/CONST");
const navBarManager = {
    setButtonStyle: () => { },
    getType: () => ((0, getPlatform_1.default)() === CONST_1.default.PLATFORM.IOS ? CONST_1.default.NAVIGATION_BAR_TYPE.GESTURE_BAR : CONST_1.default.NAVIGATION_BAR_TYPE.NONE),
};
exports.default = navBarManager;
