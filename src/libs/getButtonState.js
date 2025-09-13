"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
/**
 * Get the string representation of a button's state.
 */
function getButtonState(isActive = false, isPressed = false, isComplete = false, isDisabled = false, isInteractive = true) {
    if (!isInteractive) {
        return CONST_1.default.BUTTON_STATES.DEFAULT;
    }
    if (isDisabled) {
        return CONST_1.default.BUTTON_STATES.DISABLED;
    }
    if (isComplete) {
        return CONST_1.default.BUTTON_STATES.COMPLETE;
    }
    if (isPressed) {
        return CONST_1.default.BUTTON_STATES.PRESSED;
    }
    if (isActive) {
        return CONST_1.default.BUTTON_STATES.ACTIVE;
    }
    return CONST_1.default.BUTTON_STATES.DEFAULT;
}
exports.default = getButtonState;
