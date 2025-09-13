"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useKeyboardState;
const react_1 = require("react");
const withKeyboardState_1 = require("@components/withKeyboardState");
/**
 * Hook for getting current state of keyboard
 * whether the keyboard is open
 */
function useKeyboardState() {
    return (0, react_1.useContext)(withKeyboardState_1.KeyboardStateContext);
}
