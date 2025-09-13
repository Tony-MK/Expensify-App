"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moveAccessibilityFocus = (ref) => {
    if (!ref?.current) {
        return;
    }
    ref.current.focus();
};
exports.default = moveAccessibilityFocus;
