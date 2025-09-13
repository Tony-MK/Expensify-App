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
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var BaseTextInput_1 = require("./BaseTextInput");
function TextInput(_a) {
    var ref = _a.ref, props = __rest(_a, ["ref"]);
    var styles = (0, useThemeStyles_1.default)();
    (0, react_1.useEffect)(function () {
        if (!props.disableKeyboard) {
            return;
        }
        var appStateSubscription = react_native_1.AppState.addEventListener('change', function (nextAppState) {
            if (!nextAppState.match(/inactive|background/)) {
                return;
            }
            react_native_1.Keyboard.dismiss();
        });
        return function () {
            appStateSubscription.remove();
        };
    }, [props.disableKeyboard]);
    return (<BaseTextInput_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} 
    // Setting autoCompleteType to new-password throws an error on Android/iOS, so fall back to password in that case
    // eslint-disable-next-line react/jsx-props-no-multi-spaces
    ref={ref} autoCompleteType={props.autoCompleteType === 'new-password' ? 'password' : props.autoCompleteType} inputStyle={[styles.baseTextInput, props.inputStyle]} textInputContainerStyles={[props.textInputContainerStyles]}/>);
}
TextInput.displayName = 'TextInput';
exports.default = TextInput;
