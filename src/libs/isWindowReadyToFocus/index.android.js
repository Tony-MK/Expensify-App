"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
let isWindowReadyPromise = Promise.resolve();
let resolveWindowReadyToFocus;
react_native_1.AppState.addEventListener('focus', () => {
    if (!resolveWindowReadyToFocus) {
        return;
    }
    resolveWindowReadyToFocus();
});
react_native_1.AppState.addEventListener('blur', () => {
    isWindowReadyPromise = new Promise((resolve) => {
        resolveWindowReadyToFocus = resolve;
    });
});
/**
 * If we want to show the soft keyboard reliably, we need to ensure that the input's window gains focus first.
 * Fortunately, we only need to manage the focus of the app window now,
 * so we can achieve this by listening to the 'focus' event of the AppState.
 * See {@link https://developer.android.com/develop/ui/views/touch-and-input/keyboard-input/visibility#ShowReliably}
 */
const isWindowReadyToFocus = () => isWindowReadyPromise;
exports.default = isWindowReadyToFocus;
