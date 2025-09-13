"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_keyboard_controller_1 = require("react-native-keyboard-controller");
function KeyboardProviderWrapper({ children }) {
    return (<react_native_keyboard_controller_1.KeyboardProvider statusBarTranslucent navigationBarTranslucent>
            {children}
        </react_native_keyboard_controller_1.KeyboardProvider>);
}
exports.default = KeyboardProviderWrapper;
