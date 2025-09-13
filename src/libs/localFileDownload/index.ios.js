"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const react_native_blob_util_1 = require("react-native-blob-util");
const localFileCreate_1 = require("@libs/localFileCreate");
/**
 * Writes a local file to the app's internal directory with the given fileName
 * and textContent, so we're able to share it using iOS' share API.
 * After the file is shared, it is removed from the internal dir.
 */
const localFileDownload = (fileName, textContent) => {
    (0, localFileCreate_1.default)(fileName, textContent).then(({ path, newFileName }) => {
        react_native_1.Share.share({ url: path, title: newFileName }).finally(() => {
            react_native_blob_util_1.default.fs.unlink(path);
        });
    });
};
exports.default = localFileDownload;
