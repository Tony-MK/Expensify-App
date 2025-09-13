"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_blob_util_1 = require("react-native-blob-util");
const FileUtils = require("@libs/fileDownload/FileUtils");
/**
 * Creates a blob file using RN Fetch Blob
 * @param fileName name of the file
 * @param textContent content of the file
 * @returns path, filename and size of the newly created file
 */
const localFileCreate = (fileName, textContent) => {
    const newFileName = FileUtils.appendTimeToFileName(fileName);
    const dir = react_native_blob_util_1.default.fs.dirs.DocumentDir;
    const path = `${dir}/${newFileName}.txt`;
    return react_native_blob_util_1.default.fs.writeFile(path, textContent, 'utf8').then(() => react_native_blob_util_1.default.fs.stat(path).then(({ size }) => ({ path, newFileName, size })));
};
exports.default = localFileCreate;
