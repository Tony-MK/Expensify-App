"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const navBarManager = {
    setButtonStyle: (style) => {
        react_native_1.NativeModules.RNNavBarManager.setButtonStyle(style);
    },
    getType: () => {
        return react_native_1.NativeModules.RNNavBarManager.getType();
    },
};
exports.default = navBarManager;
