"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_keyboard_controller_1 = require("react-native-keyboard-controller");
const useRestoreInputFocus = (isLostFocus) => {
    const keyboardVisibleBeforeLoosingFocusRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        if (isLostFocus) {
            keyboardVisibleBeforeLoosingFocusRef.current = react_native_1.Keyboard.isVisible();
        }
        if (!isLostFocus && keyboardVisibleBeforeLoosingFocusRef.current) {
            react_native_1.InteractionManager.runAfterInteractions(() => {
                react_native_keyboard_controller_1.KeyboardController.setFocusTo('current');
            });
        }
    }, [isLostFocus]);
};
exports.default = useRestoreInputFocus;
