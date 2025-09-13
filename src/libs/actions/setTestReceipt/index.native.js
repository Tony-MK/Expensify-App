"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const react_native_blob_util_1 = require("react-native-blob-util");
const Log_1 = require("@libs/Log");
const CONST_1 = require("@src/CONST");
const getFile_1 = require("./getFile");
const setTestReceipt = (asset, assetExtension, onFileRead, onFileError) => {
    const filename = `${CONST_1.default.TEST_RECEIPT.FILENAME}_${Date.now()}.${assetExtension}`;
    const path = `${react_native_blob_util_1.default.fs.dirs.CacheDir}/${filename}`;
    const source = react_native_1.Image.resolveAssetSource(asset).uri;
    (0, getFile_1.default)(source, path, assetExtension)
        .then(() => {
        const file = {
            uri: `file://${path}`,
            name: filename,
            type: CONST_1.default.TEST_RECEIPT.FILE_TYPE,
            size: 0,
        };
        if (!file.uri) {
            Log_1.default.warn('Error reading test receipt');
            return;
        }
        onFileRead(file.uri, file, filename);
    })
        .catch((error) => {
        Log_1.default.warn('Error reading test receipt:', { message: error });
        onFileError?.(error);
    });
};
exports.default = setTestReceipt;
