"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_blob_util_1 = require("react-native-blob-util");
const FileUtils = require("@libs/fileDownload/FileUtils");
const localFileCreate_1 = require("@libs/localFileCreate");
/**
 * Writes a local file to the app's internal directory with the given fileName
 * and textContent, so we're able to copy it to the Android public download dir.
 * After the file is copied, it is removed from the internal dir.
 */
const localFileDownload = (fileName, textContent, successMessage) => {
    (0, localFileCreate_1.default)(fileName, textContent).then(({ path, newFileName }) => {
        react_native_blob_util_1.default.MediaCollection.copyToMediaStore({
            name: newFileName,
            parentFolder: '', // subdirectory in the Media Store, empty goes to 'Downloads'
            mimeType: 'text/plain',
        }, 'Download', path)
            .then(() => {
            FileUtils.showSuccessAlert(successMessage);
        })
            .catch(() => {
            FileUtils.showGeneralErrorAlert();
        })
            .finally(() => {
            react_native_blob_util_1.default.fs.unlink(path);
        });
    });
};
exports.default = localFileDownload;
