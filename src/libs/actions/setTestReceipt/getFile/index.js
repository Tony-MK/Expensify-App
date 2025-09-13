"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_blob_util_1 = require("react-native-blob-util");
const react_native_fs_1 = require("react-native-fs");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const getFile = (source, path, assetExtension) => {
    if (CONFIG_1.default.ENVIRONMENT === CONST_1.default.ENVIRONMENT.DEV) {
        return react_native_blob_util_1.default.config({
            fileCache: true,
            appendExt: assetExtension,
            path,
        }).fetch('GET', source);
    }
    return react_native_fs_1.default.copyFileRes(`${source}.${assetExtension}`, path);
};
exports.default = getFile;
