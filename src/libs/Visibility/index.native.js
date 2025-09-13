"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Mobile apps do not require this check for visibility as
// they do not use the Notification lib.
const react_native_1 = require("react-native");
const isVisible = () => react_native_1.AppState.currentState === 'active';
const hasFocus = () => true;
/**
 * Adds event listener for changes in visibility state
 */
const onVisibilityChange = (callback) => {
    // Deliberately strip callback argument to be consistent across implementations
    const subscription = react_native_1.AppState.addEventListener('change', () => callback());
    return () => subscription.remove();
};
exports.default = {
    isVisible,
    hasFocus,
    onVisibilityChange,
};
