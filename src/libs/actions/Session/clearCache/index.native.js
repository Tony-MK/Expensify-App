"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_fs_1 = require("react-native-fs");
// `unlink` is used to delete the caches directory
const clearStorage = () => (0, react_native_fs_1.unlink)(react_native_fs_1.CachesDirectoryPath);
exports.default = clearStorage;
