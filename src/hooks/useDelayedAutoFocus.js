"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var CONST_1 = require("@src/CONST");
function useDelayedAutoFocus(ref, shouldDelayAutoFocus) {
    var focusTimeoutRef = (0, react_1.useRef)(null);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(function () {
        if (!shouldDelayAutoFocus) {
            return undefined;
        }
        focusTimeoutRef.current = setTimeout(function () {
            var _a;
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.focus();
        }, CONST_1.default.ANIMATED_TRANSITION);
        return function () {
            var timeout = focusTimeoutRef.current;
            if (timeout) {
                clearTimeout(timeout);
                focusTimeoutRef.current = null;
            }
        };
    }, [shouldDelayAutoFocus, ref]));
}
exports.default = useDelayedAutoFocus;
