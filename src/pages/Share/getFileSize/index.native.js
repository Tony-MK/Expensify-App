"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_fs_1 = require("react-native-fs");
const getFileSize = (uri) => {
    return react_native_fs_1.default.stat(uri).then((fileStat) => {
        return fileStat.size;
    });
};
exports.default = getFileSize;
