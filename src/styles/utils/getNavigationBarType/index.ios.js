"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
const getNavigationBarType = (insets) => {
    const bottomInset = insets?.bottom ?? 0;
    // If there is no bottom safe area inset, the device uses a physical navigation button.
    if (bottomInset === 0) {
        return CONST_1.default.NAVIGATION_BAR_TYPE.NONE;
    }
    // On iOS, if there is a bottom safe area inset, it means the device uses a gesture bar.
    return CONST_1.default.NAVIGATION_BAR_TYPE.GESTURE_BAR;
};
exports.default = getNavigationBarType;
