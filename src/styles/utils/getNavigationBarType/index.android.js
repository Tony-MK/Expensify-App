"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NavBarManager_1 = require("@libs/NavBarManager");
const CONST_1 = require("@src/CONST");
const getNavigationBarType = (insets) => {
    const bottomInset = insets?.bottom ?? 0;
    // If the bottom safe area inset is 0, we consider the device to have no navigation bar (or it being hidden by default).
    // This could be mean either hidden soft keys, gesture navigation without a gesture bar or physical buttons.
    if (bottomInset === 0) {
        return CONST_1.default.NAVIGATION_BAR_TYPE.NONE;
    }
    return NavBarManager_1.default.getType();
};
exports.default = getNavigationBarType;
