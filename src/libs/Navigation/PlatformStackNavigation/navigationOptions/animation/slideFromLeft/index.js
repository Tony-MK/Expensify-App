"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gestureDirection_1 = require("@libs/Navigation/PlatformStackNavigation/navigationOptions/gestureDirection");
const __1 = require("..");
const slideFromLeft = {
    animation: __1.InternalPlatformAnimations.SLIDE_FROM_LEFT,
    gestureDirection: gestureDirection_1.default.HORIZONTAL_INVERTED,
};
exports.default = slideFromLeft;
