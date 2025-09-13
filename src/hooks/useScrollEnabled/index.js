"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const useScrollEnabled = () => {
    const isFocused = (0, native_1.useIsFocused)();
    return isFocused;
};
exports.default = useScrollEnabled;
