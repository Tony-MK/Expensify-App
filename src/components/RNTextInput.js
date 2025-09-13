"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var useTheme_1 = require("@hooks/useTheme");
var CONST_1 = require("@src/CONST");
// Convert the underlying TextInput into an Animated component so that we can take an animated ref and pass it to a worklet
var AnimatedTextInput = react_native_reanimated_1.default.createAnimatedComponent(react_native_1.TextInput);
function RNTextInputWithRef(_a) {
    var ref = _a.ref, _b = _a.forwardedFSClass, forwardedFSClass = _b === void 0 ? CONST_1.default.FULLSTORY.CLASS.MASK : _b, props = __rest(_a, ["ref", "forwardedFSClass"]);
    var theme = (0, useTheme_1.default)();
    return (<AnimatedTextInput allowFontScaling={false} textBreakStrategy="simple" keyboardAppearance={theme.colorScheme} ref={function (refHandle) {
            if (typeof ref !== 'function') {
                return;
            }
            ref(refHandle);
        }} 
    // eslint-disable-next-line react/forbid-component-props
    fsClass={forwardedFSClass} 
    // eslint-disable-next-line
    {...props}/>);
}
RNTextInputWithRef.displayName = 'RNTextInputWithRef';
exports.default = RNTextInputWithRef;
