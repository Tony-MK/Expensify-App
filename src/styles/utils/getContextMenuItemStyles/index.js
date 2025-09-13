"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const variables_1 = require("@styles/variables");
const getContextMenuItemStyles = (styles, windowWidth) => {
    if (windowWidth && windowWidth > variables_1.default.mobileResponsiveWidthBreakpoint) {
        return [styles.popoverMenuItem, styles.contextMenuItemPopoverMaxWidth];
    }
    return [styles.popoverMenuItem];
};
exports.default = getContextMenuItemStyles;
