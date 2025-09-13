"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const Composer = require("@userActions/Composer");
let keyboardEventListener = null;
const setShouldShowComposeInputKeyboardAwareBuilder = (keyboardEvent) => (shouldShow) => {
    if (keyboardEventListener) {
        keyboardEventListener.remove();
        keyboardEventListener = null;
    }
    if (!shouldShow) {
        Composer.setShouldShowComposeInput(false);
        return;
    }
    // If keyboard is already hidden, we should show composer immediately because keyboardDidHide event won't be called
    if (!react_native_1.Keyboard.isVisible()) {
        Composer.setShouldShowComposeInput(true);
        return;
    }
    keyboardEventListener = react_native_1.Keyboard.addListener(keyboardEvent, () => {
        Composer.setShouldShowComposeInput(true);
        keyboardEventListener?.remove();
    });
};
exports.default = setShouldShowComposeInputKeyboardAwareBuilder;
