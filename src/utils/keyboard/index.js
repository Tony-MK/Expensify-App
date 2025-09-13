"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
let isVisible = false;
react_native_1.Keyboard.addListener('keyboardDidHide', () => {
    isVisible = false;
});
react_native_1.Keyboard.addListener('keyboardDidShow', () => {
    isVisible = true;
});
const dismiss = () => {
    return new Promise((resolve) => {
        if (!isVisible) {
            resolve();
            return;
        }
        const subscription = react_native_1.Keyboard.addListener('keyboardDidHide', () => {
            resolve(undefined);
            subscription.remove();
        });
        react_native_1.Keyboard.dismiss();
    });
};
const utils = { dismiss };
exports.default = utils;
