"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
function useRefreshKeyAfterInteraction(defaultValue) {
    var _a = (0, react_1.useState)(0), counter = _a[0], setCounter = _a[1];
    (0, react_1.useEffect)(function () {
        react_native_1.InteractionManager.runAfterInteractions(function () {
            setCounter(function (prev) { return prev + 1; });
        });
    }, []);
    return "".concat(defaultValue, "-").concat(counter);
}
exports.default = useRefreshKeyAfterInteraction;
