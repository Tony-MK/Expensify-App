"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_blob_util_1 = require("react-native-blob-util");
const getFile = (source, path, assetExtension) => {
    return react_native_blob_util_1.default.config({
        fileCache: true,
        appendExt: assetExtension,
        path,
    }).fetch('GET', source);
};
exports.default = getFile;
