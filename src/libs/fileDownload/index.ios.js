"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const camera_roll_1 = require("@react-native-camera-roll/camera-roll");
const react_native_blob_util_1 = require("react-native-blob-util");
const react_native_fs_1 = require("react-native-fs");
const react_native_share_1 = require("react-native-share");
const CONST_1 = require("@src/CONST");
const FileUtils_1 = require("./FileUtils");
/**
 * Downloads the file to Documents section in iOS
 */
function downloadFile(fileUrl, fileName) {
    const dirs = react_native_blob_util_1.default.fs.dirs;
    // The iOS files will download to documents directory
    const path = dirs.DocumentDir;
    // Fetching the attachment
    return react_native_blob_util_1.default.config({
        fileCache: true,
        path: `${path}/${fileName}`,
        addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: `${path}/Expensify/${fileName}`,
        },
    }).fetch('GET', fileUrl);
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
        const expensifyDir = `${react_native_fs_1.default.DocumentDirectoryPath}/Expensify`;
        const localPath = `${expensifyDir}/${finalFileName}`;
        return react_native_fs_1.default.mkdir(expensifyDir).then(() => {
            return react_native_fs_1.default.writeFile(localPath, fileData, 'utf8')
                .then(() => react_native_share_1.default.open({ url: localPath, failOnCancel: false, saveToFiles: true }))
                .then(() => react_native_fs_1.default.unlink(localPath));
        });
    })
        .catch(() => {
        if (!onDownloadFailed) {
            (0, FileUtils_1.showGeneralErrorAlert)();
        }
        onDownloadFailed?.();
    });
};
/**
 * Download the image to photo lib in iOS
 */
function downloadImage(fileUrl) {
    return camera_roll_1.CameraRoll.saveAsset(fileUrl);
}
/**
 * Download the video to photo lib in iOS
 */
function downloadVideo(fileUrl, fileName) {
    return new Promise((resolve, reject) => {
        let documentPathUri = null;
        let cameraRollAsset;
        // Because CameraRoll doesn't allow direct downloads of video with remote URIs, we first download as documents, then copy to photo lib and unlink the original file.
        downloadFile(fileUrl, fileName)
            .then((attachment) => {
            documentPathUri = attachment.data;
            if (!documentPathUri) {
                throw new Error('Error downloading video');
            }
            return camera_roll_1.CameraRoll.saveAsset(documentPathUri);
        })
            .then((attachment) => {
            cameraRollAsset = attachment;
            if (!documentPathUri) {
                throw new Error('Error downloading video');
            }
            return react_native_blob_util_1.default.fs.unlink(documentPathUri);
        })
            .then(() => {
            resolve(cameraRollAsset);
        })
            .catch((err) => reject(err));
    });
}
/**
 * Download the file based on type(image, video, other file types)for iOS
 */
const fileDownload = (fileUrl, fileName, successMessage, _, formData, requestType, onDownloadFailed) => new Promise((resolve) => {
    let fileDownloadPromise;
    const fileType = (0, FileUtils_1.getFileType)(fileUrl);
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- Disabling this line for safeness as nullish coalescing works only if the value is undefined or null, and since fileName can be an empty string we want to default to `FileUtils.getFileName(url)`
    const attachmentName = (0, FileUtils_1.appendTimeToFileName)(fileName || (0, FileUtils_1.getFileName)(fileUrl));
    switch (fileType) {
        case CONST_1.default.ATTACHMENT_FILE_TYPE.IMAGE:
            fileDownloadPromise = downloadImage(fileUrl);
            break;
        case CONST_1.default.ATTACHMENT_FILE_TYPE.VIDEO:
            fileDownloadPromise = downloadVideo(fileUrl, attachmentName);
            break;
        default:
            if (requestType === CONST_1.default.NETWORK.METHOD.POST) {
                fileDownloadPromise = postDownloadFile(fileUrl, fileName, formData, onDownloadFailed);
                break;
            }
            fileDownloadPromise = downloadFile(fileUrl, attachmentName);
            break;
    }
    fileDownloadPromise
        .then((attachment) => {
        if (!attachment) {
            return;
        }
        (0, FileUtils_1.showSuccessAlert)(successMessage);
    })
        .catch((err) => {
        // iOS shows permission popup only once. Subsequent request will only throw an error.
        // We catch the error and show a redirection link to the settings screen
        if (err.message === CONST_1.default.IOS_CAMERA_ROLL_ACCESS_ERROR) {
            (0, FileUtils_1.showPermissionErrorAlert)();
        }
        else {
            (0, FileUtils_1.showGeneralErrorAlert)();
        }
    })
        .finally(() => resolve());
});
exports.default = fileDownload;
