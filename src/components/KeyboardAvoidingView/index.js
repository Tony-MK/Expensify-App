"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const BaseKeyboardAvoidingView_1 = require("./BaseKeyboardAvoidingView");
function KeyboardAvoidingView({ shouldOffsetBottomSafeAreaPadding = false, keyboardVerticalOffset: keyboardVerticalOffsetProp, ...restProps }) {
    const { paddingBottom } = (0, useSafeAreaPaddings_1.default)(true);
    const keyboardVerticalOffset = (0, react_1.useMemo)(() => (keyboardVerticalOffsetProp ?? 0) + (shouldOffsetBottomSafeAreaPadding ? -paddingBottom : 0), [keyboardVerticalOffsetProp, paddingBottom, shouldOffsetBottomSafeAreaPadding]);
    return (<BaseKeyboardAvoidingView_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restProps} keyboardVerticalOffset={keyboardVerticalOffset}/>);
}
KeyboardAvoidingView.displayName = 'KeyboardAvoidingView';
exports.default = KeyboardAvoidingView;
