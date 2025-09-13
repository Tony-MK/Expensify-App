"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiUtils = require("@libs/ApiUtils");
const tryResolveUrlFromApiRoot_1 = require("@libs/tryResolveUrlFromApiRoot");
const Link = require("@userActions/Link");
const CONST_1 = require("@src/CONST");
const FileUtils_1 = require("./FileUtils");
const createDownloadLink = (href, fileName) => {
    // creating anchor tag to initiate download
    const link = document.createElement('a');
    // adding href to anchor
    link.href = href;
    link.style.display = 'none';
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- Disabling this line for safeness as nullish coalescing works only if the value is undefined or null, and since fileName can be an empty string we want to default to `FileUtils.getFileName(url)`
    link.download = fileName;
    // Append to html link element page
    document.body.appendChild(link);
    // Start download
    link.click();
    // Clean up and remove the link
    URL.revokeObjectURL(link.href);
    link.parentNode?.removeChild(link);
};
/**
 * The function downloads an attachment on web/desktop platforms.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchFileDownload = (url, fileName, successMessage = '', shouldOpenExternalLink = false, formData = undefined, requestType = 'get', onDownloadFailed) => {
    const resolvedUrl = (0, tryResolveUrlFromApiRoot_1.default)(url);
    const isApiUrl = resolvedUrl.startsWith(ApiUtils.getApiRoot());
    const isAttachmentUrl = CONST_1.default.ATTACHMENT_LOCAL_URL_PREFIX.some((prefix) => resolvedUrl.startsWith(prefix));
    const isSageUrl = url === CONST_1.default.EXPENSIFY_PACKAGE_FOR_SAGE_INTACCT;
    if (
    // We have two file download cases that we should allow: 1. downloading attachments 2. downloading Expensify package for Sage Intacct
    shouldOpenExternalLink ||
        (!isApiUrl && !isAttachmentUrl && !isSageUrl)) {
        // Different origin URLs might pose a CORS issue during direct downloads.
        // Opening in a new tab avoids this limitation, letting the browser handle the download.
        Link.openExternalLink(url);
        return Promise.resolve();
    }
    const fetchOptions = {
        method: requestType,
        body: formData,
        credentials: 'same-origin',
    };
    return fetch(url, fetchOptions)
        .then((response) => {
        const contentType = response.headers.get('content-type');
        if (contentType === 'application/json' && fileName?.includes('.csv')) {
            throw new Error();
        }
        return response.blob();
    })
        .then((blob) => {
        // Create blob link to download
        const href = URL.createObjectURL(new Blob([blob]));
        const completeFileName = (0, FileUtils_1.appendTimeToFileName)(fileName ?? (0, FileUtils_1.getFileName)(url));
        createDownloadLink(href, completeFileName);
    })
        .catch(() => {
        if (onDownloadFailed) {
            onDownloadFailed();
        }
        else {
            // file could not be downloaded, open sourceURL in new tab
            Link.openExternalLink(url);
        }
    });
};
exports.default = fetchFileDownload;
