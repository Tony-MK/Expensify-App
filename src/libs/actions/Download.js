"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDownload = setDownload;
exports.clearDownloads = clearDownloads;
const react_native_onyx_1 = require("react-native-onyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
/**
 * Set whether an attachment is being downloaded so that a spinner can be shown.
 */
function setDownload(sourceID, isDownloading) {
    return react_native_onyx_1.default.merge(`${ONYXKEYS_1.default.COLLECTION.DOWNLOAD}${sourceID}`, { isDownloading });
}
function clearDownloads() {
    react_native_onyx_1.default.setCollection(ONYXKEYS_1.default.COLLECTION.DOWNLOAD, {});
}
