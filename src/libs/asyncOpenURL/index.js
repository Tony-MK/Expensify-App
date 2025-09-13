"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const Log_1 = require("@libs/Log");
const asyncOpenURL = (promise, url) => {
    if (!url) {
        return;
    }
    promise
        .then((params) => {
        react_native_1.Linking.openURL(typeof url === 'string' ? url : url(params));
    })
        .catch(() => {
        Log_1.default.warn('[asyncOpenURL] error occurred while opening URL', { url });
    });
};
exports.default = asyncOpenURL;
