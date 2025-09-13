"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DownloadUtils_1 = require("./DownloadUtils");
/**
 * The function downloads an attachment on web/desktop platforms.
 */
const fileDownload = (url, fileName, successMessage = '', shouldOpenExternalLink = false, formData = undefined, requestType = 'get', onDownloadFailed) => (0, DownloadUtils_1.default)(url, fileName, successMessage, shouldOpenExternalLink, formData, requestType, onDownloadFailed);
exports.default = fileDownload;
