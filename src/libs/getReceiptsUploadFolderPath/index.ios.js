"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_blob_util_1 = require("react-native-blob-util");
const CONST_1 = require("@src/CONST");
const getReceiptsUploadFolderPath = () => `${react_native_blob_util_1.default.fs.dirs.DocumentDir}${CONST_1.default.RECEIPTS_UPLOAD_PATH}`;
exports.default = getReceiptsUploadFolderPath;
