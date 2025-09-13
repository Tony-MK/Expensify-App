"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const react_native_blob_util_1 = require("react-native-blob-util");
const react_native_fs_1 = require("react-native-fs");
const CONST_1 = require("@src/CONST");
const FileUtils_1 = require("./FileUtils");
/**
 * Android permission check to store images
 */
function hasAndroidPermission() {
    // On Android API Level 33 and above, these permissions do nothing and always return 'never_ask_again'
    // More info here: https://stackoverflow.com/a/74296799
    if (Number(react_native_1.Platform.Version) >= 33) {
        return Promise.resolve(true);
    }
    // Read and write permission
    const writePromise = react_native_1.PermissionsAndroid.check(react_native_1.PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    const readPromise = react_native_1.PermissionsAndroid.check(react_native_1.PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    return Promise.all([writePromise, readPromise]).then(([hasWritePermission, hasReadPermission]) => {
        if (hasWritePermission && hasReadPermission) {
            return true; // Return true if permission is already given
        }
        // Ask for permission if not given
        return react_native_1.PermissionsAndroid.requestMultiple([react_native_1.PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, react_native_1.PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]).then((status) => status['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' && status['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted');
    });
}
/**
 * Handling the download
 */
function handleDownload(url, fileName, successMessage, shouldUnlink = true) {
    return new Promise((resolve) => {
        const dirs = react_native_blob_util_1.default.fs.dirs;
        // Android files will download to Download directory
        const path = dirs.DownloadDir;
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- Disabling this line for safeness as nullish coalescing works only if the value is undefined or null, and since fileName can be an empty string we want to default to `FileUtils.getFileName(url)`
        const attachmentName = (0, FileUtils_1.appendTimeToFileName)(fileName || (0, FileUtils_1.getFileName)(url));
        const isLocalFile = url.startsWith('file://');
        let attachmentPath = isLocalFile ? url : undefined;
        let fetchedAttachment = Promise.resolve();
        if (!isLocalFile) {
            // Fetching the attachment
            fetchedAttachment = react_native_blob_util_1.default.config({
                fileCache: true,
                path: `${path}/${attachmentName}`,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: false,
                    path: `${path}/Expensify/${attachmentName}`,
                },
            }).fetch('GET', url);
        }
        // Resolving the fetched attachment
        fetchedAttachment
            .then((attachment) => {
            if (!isLocalFile && (!attachment || !attachment.info())) {
                return Promise.reject();
            }
            if (!isLocalFile) {
                attachmentPath = attachment.path();
            }
            return react_native_blob_util_1.default.MediaCollection.copyToMediaStore({
                name: attachmentName,
                parentFolder: 'Expensify',
                mimeType: null,
            }, 'Download', attachmentPath ?? '');
        })
            .then(() => {
            if (attachmentPath && shouldUnlink) {
                react_native_blob_util_1.default.fs.unlink(attachmentPath);
            }
            (0, FileUtils_1.showSuccessAlert)(successMessage);
        })
            .catch(() => {
            (0, FileUtils_1.showGeneralErrorAlert)();
        })
            .finally(() => resolve());
    });
}
const postDownloadFile = (url, fileName, formData, onDownloadFailed) => {
    const fetchOptions = {
        method: 'POST',
        body: formData,
    };
    return fetch(url, fetchOptions)
        .then((response) => {
        if (!response.ok) {
            throw new Error('Failed to download file');
        }
        const contentType = response.headers.get('content-type');
        if (contentType === 'application/json' && fileName?.includes('.csv')) {
            throw new Error();
        }
        return response.text();
    })
        .then((fileData) => {
        const finalFileName = (0, FileUtils_1.appendTimeToFileName)(fileName ?? 'Expensify');
        const downloadPath = `${react_native_fs_1.default.DownloadDirectoryPath}/${finalFileName}`;
        return react_native_fs_1.default.writeFile(downloadPath, fileData, 'utf8').then(() => downloadPath);
    })
        .then((downloadPath) => react_native_blob_util_1.default.MediaCollection.copyToMediaStore({
        name: (0, FileUtils_1.getFileName)(downloadPath),
        parentFolder: 'Expensify',
        mimeType: null,
    }, 'Download', downloadPath).then(() => downloadPath))
        .then((downloadPath) => {
        react_native_blob_util_1.default.fs.unlink(downloadPath);
        (0, FileUtils_1.showSuccessAlert)();
    })
        .catch(() => {
        if (!onDownloadFailed) {
            (0, FileUtils_1.showGeneralErrorAlert)();
        }
        onDownloadFailed?.();
    });
};
/**
 * Checks permission and downloads the file for Android
 */
const fileDownload = (url, fileName, successMessage, _, formData, requestType, onDownloadFailed, shouldUnlink) => new Promise((resolve) => {
    hasAndroidPermission()
        .then((hasPermission) => {
        if (hasPermission) {
            if (requestType === CONST_1.default.NETWORK.METHOD.POST) {
                return postDownloadFile(url, fileName, formData, onDownloadFailed);
            }
            return handleDownload(url, fileName, successMessage, shouldUnlink);
        }
        (0, FileUtils_1.showPermissionErrorAlert)();
    })
        .catch(() => {
        (0, FileUtils_1.showPermissionErrorAlert)();
    })
        .finally(() => resolve());
});
exports.default = fileDownload;
