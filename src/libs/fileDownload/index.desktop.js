"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ELECTRON_EVENTS_1 = require("@desktop/ELECTRON_EVENTS");
const CONST_1 = require("@src/CONST");
const DownloadUtils_1 = require("./DownloadUtils");
/**
 * The function downloads an attachment on desktop platforms.
 */
const fileDownload = (url, fileName, successMessage, shouldOpenExternalLink, formData, requestType, onDownloadFailed) => {
    if (requestType === CONST_1.default.NETWORK.METHOD.POST) {
        window.electron.send(ELECTRON_EVENTS_1.default.DOWNLOAD);
        return (0, DownloadUtils_1.default)(url, fileName, successMessage, shouldOpenExternalLink, formData, requestType, onDownloadFailed);
    }
    const options = {
        filename: fileName,
        saveAs: true,
    };
    window.electron.send(ELECTRON_EVENTS_1.default.DOWNLOAD, { url, options });
    return new Promise((resolve) => {
        // This sets a timeout that will resolve the promise after 5 seconds to prevent indefinite hanging
        const downloadTimeout = setTimeout(() => {
            resolve();
        }, CONST_1.default.DOWNLOADS_TIMEOUT);
        const handleDownloadStatus = (...args) => {
            const arg = Array.isArray(args) ? args.at(0) : null;
            const eventUrl = arg && typeof arg === 'object' && 'url' in arg ? arg.url : null;
            if (eventUrl === url) {
                clearTimeout(downloadTimeout);
                resolve();
            }
        };
        window.electron.on(ELECTRON_EVENTS_1.default.DOWNLOAD_COMPLETED, handleDownloadStatus);
        window.electron.on(ELECTRON_EVENTS_1.default.DOWNLOAD_FAILED, handleDownloadStatus);
        window.electron.on(ELECTRON_EVENTS_1.default.DOWNLOAD_CANCELED, handleDownloadStatus);
    });
};
exports.default = fileDownload;
