"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_keyboard_controller_1 = require("react-native-keyboard-controller");
function BaseKeyboardAvoidingView(props) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <react_native_keyboard_controller_1.KeyboardAvoidingView {...props}/>;
}
BaseKeyboardAvoidingView.displayName = 'BaseKeyboardAvoidingView';
exports.default = BaseKeyboardAvoidingView;
