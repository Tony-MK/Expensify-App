"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const validateFormDataParameter_1 = require("@libs/validateFormDataParameter");
/**
 * Prepares the request payload (body) for a given command and data.
 * This function is specifically designed for native platforms (IOS and Android) to handle the regeneration of blob files. It ensures that files, such as receipts, are properly read and appended to the FormData object before the request is sent.
 */
const prepareRequestPayload = (command, data, initiatedOffline) => {
    const formData = new FormData();
    let promiseChain = Promise.resolve();
    Object.keys(data).forEach((key) => {
        promiseChain = promiseChain.then(() => {
            const value = data[key];
            if (value === undefined) {
                return Promise.resolve();
            }
            if ((key === 'receipt' || key === 'file') && initiatedOffline) {
                const { uri: path = '', source } = value;
                if (!source) {
                    (0, validateFormDataParameter_1.default)(command, key, value);
                    formData.append(key, value);
                    return Promise.resolve();
                }
                return (0, FileUtils_1.readFileAsync)(source, path, () => { }).then((file) => {
                    if (!file) {
                        return;
                    }
                    (0, validateFormDataParameter_1.default)(command, key, file);
                    formData.append(key, file);
                });
            }
            (0, validateFormDataParameter_1.default)(command, key, value);
            formData.append(key, value);
            return Promise.resolve();
        });
    });
    return promiseChain.then(() => formData);
};
exports.default = prepareRequestPayload;
