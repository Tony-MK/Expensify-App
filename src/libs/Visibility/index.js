"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
/**
 * Detects whether the app is visible or not.
 */
const isVisible = () => document.visibilityState === 'visible';
/**
 * Whether the app is focused.
 */
const hasFocus = () => document.hasFocus();
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
