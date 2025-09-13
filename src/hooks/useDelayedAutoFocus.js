"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const CONST_1 = require("@src/CONST");
function useDelayedAutoFocus(ref, shouldDelayAutoFocus) {
    const focusTimeoutRef = (0, react_1.useRef)(null);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        if (!shouldDelayAutoFocus) {
            return undefined;
        }
        focusTimeoutRef.current = setTimeout(() => {
            ref.current?.focus();
        }, CONST_1.default.ANIMATED_TRANSITION);
        return () => {
            const timeout = focusTimeoutRef.current;
            if (timeout) {
                clearTimeout(timeout);
                focusTimeoutRef.current = null;
            }
        };
    }, [shouldDelayAutoFocus, ref]));
}
exports.default = useDelayedAutoFocus;
