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
exports.getPressableProps = getPressableProps;
var react_1 = require("react");
var react_native_1 = require("react-native");
var implementation_1 = require("./implementation");
var pressableRegistry = new Map();
function getPressableProps(testId) {
    return pressableRegistry.get(testId);
}
function E2EGenericPressableWrapper(_a) {
    var ref = _a.ref, props = __rest(_a, ["ref"]);
    (0, react_1.useEffect)(function () {
        var testId = props.testID;
        if (!testId) {
            return;
        }
        console.debug("[E2E] E2EGenericPressableWrapper: Registering pressable with testID: ".concat(testId));
        pressableRegistry.set(testId, props);
        react_native_1.DeviceEventEmitter.emit('onBecameVisible', testId);
    }, [props]);
    return (<implementation_1.default 
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props} ref={ref}/>);
}
E2EGenericPressableWrapper.displayName = 'E2EGenericPressableWrapper';
exports.default = E2EGenericPressableWrapper;
