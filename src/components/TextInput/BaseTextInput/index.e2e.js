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
var implementation_1 = require("./implementation");
function BaseTextInputE2E(_a) {
    var ref = _a.ref, props = __rest(_a, ["ref"]);
    (0, react_1.useEffect)(function () {
        var testId = props.testID;
        if (!testId) {
            return;
        }
        console.debug("[E2E] BaseTextInput: text-input with testID: ".concat(testId, " changed text to ").concat(props.value));
        react_native_1.DeviceEventEmitter.emit('onChangeText', { testID: testId, value: props.value });
    }, [props.value, props.testID]);
    return (<implementation_1.default ref={ref} 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}/>);
}
exports.default = BaseTextInputE2E;
