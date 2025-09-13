"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
/**
 * Validate if the submit shortcut should be triggered depending on the button state
 *
 * @param isDisabled Indicates whether the button should be disabled
 * @param isLoading Indicates whether the button should be disabled and in the loading state
 * @param event Focused input event
 * @returns Returns `true` if the shortcut should be triggered
 */
const validateSubmitShortcut = (isDisabled, isLoading, event) => {
    const eventTarget = event?.target;
    if (isDisabled ||
        isLoading ||
        eventTarget.nodeName === CONST_1.default.ELEMENT_NAME.TEXTAREA ||
        (eventTarget.nodeName === CONST_1.default.ELEMENT_NAME.INPUT && eventTarget.autocomplete === 'one-time-code') ||
        (eventTarget?.contentEditable === 'true' && eventTarget.ariaMultiLine)) {
        return false;
    }
    event?.preventDefault();
    return true;
};
exports.default = validateSubmitShortcut;
