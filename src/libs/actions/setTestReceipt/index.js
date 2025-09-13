"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const Log_1 = require("@libs/Log");
const CONST_1 = require("@src/CONST");
const setTestReceipt = (asset, assetExtension, onFileRead, onFileError) => {
    const filename = `${CONST_1.default.TEST_RECEIPT.FILENAME}_${Date.now()}.${assetExtension}`;
    (0, FileUtils_1.readFileAsync)(asset, filename, (file) => {
        const source = URL.createObjectURL(file);
        onFileRead(source, file, filename);
    }, (error) => {
        Log_1.default.warn('Error reading test receipt:', { message: error });
        onFileError?.(error);
    }, CONST_1.default.TEST_RECEIPT.FILE_TYPE);
};
exports.default = setTestReceipt;
