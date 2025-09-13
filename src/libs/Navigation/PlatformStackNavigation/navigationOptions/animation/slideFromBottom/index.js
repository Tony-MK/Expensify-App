"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gestureDirection_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/gestureDirection");
const __1 = require("..");
const slideFromBottom = {
    animation: __1.InternalPlatformAnimations.SLIDE_FROM_BOTTOM,
    gestureDirection: gestureDirection_1.default.VERTICAL,
};
exports.default = slideFromBottom;
