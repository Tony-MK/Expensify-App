"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Web does not support Haptic feedback
 */
const hapticFeedback = {
    press: () => { },
    longPress: () => { },
    success: () => { },
    error: () => { },
};
exports.default = hapticFeedback;
