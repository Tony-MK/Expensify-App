"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * The KeyboardAvoidingView stub implementation for web and other platforms where the keyboard is handled automatically.
 */
const react_1 = require("react");
const react_native_1 = require("react-native");
function BaseKeyboardAvoidingView(props) {
    const { behavior, contentContainerStyle, enabled, keyboardVerticalOffset, ...rest } = props;
    return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <react_native_1.View {...rest}/>);
}
BaseKeyboardAvoidingView.displayName = 'BaseKeyboardAvoidingView';
exports.default = BaseKeyboardAvoidingView;
