"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getOnyxValue;
const react_native_onyx_1 = require("react-native-onyx");
function getOnyxValue(key) {
    return new Promise((resolve) => {
        react_native_onyx_1.default.connect({
            key,
            callback: (value) => resolve(value),
        });
    });
}
