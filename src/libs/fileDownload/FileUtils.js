"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfirmModalPrompt = exports.isHeicOrHeifImage = exports.getFileValidationErrorText = exports.isValidReceiptExtension = exports.normalizeFileObject = exports.validateAttachment = exports.validateReceipt = exports.createFile = exports.resizeImageIfNeeded = exports.getImageDimensionsAfterResize = exports.readFileAsync = exports.splitExtensionFromFileName = void 0;
exports.showGeneralErrorAlert = showGeneralErrorAlert;
exports.showSuccessAlert = showSuccessAlert;
exports.showPermissionErrorAlert = showPermissionErrorAlert;
exports.showCameraPermissionsAlert = showCameraPermissionsAlert;
exports.getFileName = getFileName;
exports.getFileType = getFileType;
exports.cleanFileName = cleanFileName;
exports.appendTimeToFileName = appendTimeToFileName;
exports.base64ToFile = base64ToFile;
exports.isLocalFile = isLocalFile;
exports.validateImageForCorruption = validateImageForCorruption;
exports.isImage = isImage;
exports.getFileResolution = getFileResolution;
exports.isHighResolutionImage = isHighResolutionImage;
exports.verifyFileFormat = verifyFileFormat;
const expensify_common_1 = require("expensify-common");
const react_native_1 = require("react-native");
const react_native_blob_util_1 = require("react-native-blob-util");
const react_native_image_size_1 = require("react-native-image-size");
const DateUtils_1 = require("@libs/DateUtils");
const getPlatform_1 = require("@libs/getPlatform");
const Localize_1 = require("@libs/Localize");
const Log_1 = require("@libs/Log");
const saveLastRoute_1 = require("@libs/saveLastRoute");
const CONST_1 = require("@src/CONST");
const getImageManipulator_1 = require("./getImageManipulator");
const getImageResolution_1 = require("./getImageResolution");
/**
 * Show alert on successful attachment download
 * @param successMessage
 */
function showSuccessAlert(successMessage) {
    react_native_1.Alert.alert((0, Localize_1.translateLocal)('fileDownload.success.title'), 
    // successMessage can be an empty string and we want to default to `Localize.translateLocal('fileDownload.success.message')`
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    successMessage || (0, Localize_1.translateLocal)('fileDownload.success.message'), [
        {
            text: (0, Localize_1.translateLocal)('common.ok'),
            style: 'cancel',
        },
    ], { cancelable: false });
}
/**
 * Show alert on attachment download error
 */
function showGeneralErrorAlert() {
    react_native_1.Alert.alert((0, Localize_1.translateLocal)('fileDownload.generalError.title'), (0, Localize_1.translateLocal)('fileDownload.generalError.message'), [
        {
            text: (0, Localize_1.translateLocal)('common.cancel'),
            style: 'cancel',
        },
    ]);
}
/**
 * Show alert on attachment download permissions error
 */
function showPermissionErrorAlert() {
    react_native_1.Alert.alert((0, Localize_1.translateLocal)('fileDownload.permissionError.title'), (0, Localize_1.translateLocal)('fileDownload.permissionError.message'), [
        {
            text: (0, Localize_1.translateLocal)('common.cancel'),
            style: 'cancel',
        },
        {
            text: (0, Localize_1.translateLocal)('common.settings'),
            onPress: () => {
                react_native_1.Linking.openSettings();
            },
        },
    ]);
}
/**
 * Inform the users when they need to grant camera access and guide them to settings
 */
function showCameraPermissionsAlert() {
    react_native_1.Alert.alert((0, Localize_1.translateLocal)('attachmentPicker.cameraPermissionRequired'), (0, Localize_1.translateLocal)('attachmentPicker.expensifyDoesNotHaveAccessToCamera'), [
        {
            text: (0, Localize_1.translateLocal)('common.cancel'),
            style: 'cancel',
        },
        {
            text: (0, Localize_1.translateLocal)('common.settings'),
            onPress: () => {
                react_native_1.Linking.openSettings();
                // In the case of ios, the App reloads when we update camera permission from settings
                // we are saving last route so we can navigate to it after app reload
                (0, saveLastRoute_1.default)();
            },
        },
    ], { cancelable: false });
}
/**
 * Extracts a filename from a given URL and sanitizes it for file system usage.
 *
 * This function takes a URL as input and performs the following operations:
 * 1. Extracts the last segment of the URL.
 * 2. Decodes the extracted segment from URL encoding to a plain string for better readability.
 * 3. Replaces any characters in the decoded string that are illegal in file names
 *    with underscores.
 */
function getFileName(url) {
    const fileName = url.split('/').pop()?.split('?')[0].split('#')[0] ?? '';
    if (!fileName) {
        Log_1.default.warn('[FileUtils] Could not get attachment name', { url });
    }
    return decodeURIComponent(fileName).replace(CONST_1.default.REGEX.ILLEGAL_FILENAME_CHARACTERS, '_');
}
function isImage(fileName) {
    return CONST_1.default.FILE_TYPE_REGEX.IMAGE.test(fileName);
}
function isVideo(fileName) {
    return CONST_1.default.FILE_TYPE_REGEX.VIDEO.test(fileName);
}
/**
 * Returns file type based on the uri
 */
function getFileType(fileUrl) {
    if (!fileUrl) {
        return;
    }
    const fileName = getFileName(fileUrl);
    if (!fileName) {
        return;
    }
    if (isImage(fileName)) {
        return CONST_1.default.ATTACHMENT_FILE_TYPE.IMAGE;
    }
    if (isVideo(fileName)) {
        return CONST_1.default.ATTACHMENT_FILE_TYPE.VIDEO;
    }
    return CONST_1.default.ATTACHMENT_FILE_TYPE.FILE;
}
/**
 * Returns the filename split into fileName and fileExtension
 */
const splitExtensionFromFileName = (fullFileName) => {
    const fileName = fullFileName.trim();
    const splitFileName = fileName.split('.');
    const fileExtension = splitFileName.length > 1 ? splitFileName.pop() : '';
    return { fileName: splitFileName.join('.'), fileExtension: fileExtension ?? '' };
};
exports.splitExtensionFromFileName = splitExtensionFromFileName;
/**
 * Returns the filename replacing special characters with underscore
 */
function cleanFileName(fileName) {
    return fileName.replace(/[^a-zA-Z0-9\-._]/g, '_');
}
function appendTimeToFileName(fileName) {
    const file = splitExtensionFromFileName(fileName);
    let newFileName = `${file.fileName}-${DateUtils_1.default.getDBTime()}`;
    // Replace illegal characters before trying to download the attachment.
    newFileName = newFileName.replace(CONST_1.default.REGEX.ILLEGAL_FILENAME_CHARACTERS, '_');
    if (file.fileExtension) {
        newFileName += `.${file.fileExtension}`;
    }
    return newFileName;
}
/**
 * Reads a locally uploaded file
 * @param path - the blob url of the locally uploaded file
 * @param fileName - name of the file to read
 */
const readFileAsync = (path, fileName, onSuccess, onFailure = () => { }, fileType = '') => new Promise((resolve) => {
    if (!path) {
        resolve();
        onFailure('[FileUtils] Path not specified');
        return;
    }
    fetch(path)
        .then((res) => {
        // For some reason, fetch is "Unable to read uploaded file"
        // on Android even though the blob is returned, so we'll ignore
        // in that case
        if (!res.ok && react_native_1.Platform.OS !== 'android') {
            throw Error(res.statusText);
        }
        res.blob()
            .then((blob) => {
            // On Android devices, fetching blob for a file with name containing spaces fails to retrieve the type of file.
            // In this case, let us fallback on fileType provided by the caller of this function.
            const file = new File([blob], cleanFileName(fileName), { type: blob.type || fileType });
            file.source = path;
            // For some reason, the File object on iOS does not have a uri property
            // so images aren't uploaded correctly to the backend
            file.uri = path;
            onSuccess(file);
            resolve(file);
        })
            .catch((e) => {
            console.debug('[FileUtils] Could not read uploaded file', e);
            onFailure(e);
            resolve();
        });
    })
        .catch((e) => {
        console.debug('[FileUtils] Could not read uploaded file', e);
        onFailure(e);
        resolve();
    });
});
exports.readFileAsync = readFileAsync;
/**
 * Converts a base64 encoded image string to a File instance.
 * Adds a `uri` property to the File instance for accessing the blob as a URI.
 *
 * @param base64 - The base64 encoded image string.
 * @param filename - Desired filename for the File instance.
 * @returns The File instance created from the base64 string with an additional `uri` property.
 *
 * @example
 * const base64Image = "data:image/png;base64,..."; // your base64 encoded image
 * const imageFile = base64ToFile(base64Image, "example.png");
 * console.log(imageFile.uri); // Blob URI
 */
function base64ToFile(base64, filename) {
    // Decode the base64 string
    const byteString = atob(base64.split(',').at(1) ?? '');
    // Get the mime type from the base64 string
    const mimeString = base64.split(',').at(0)?.split(':').at(1)?.split(';').at(0);
    // Convert byte string to Uint8Array
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }
    // Create a blob from the Uint8Array
    const blob = new Blob([uint8Array], { type: mimeString });
    // Create a File instance from the Blob
    const file = new File([blob], filename, { type: mimeString, lastModified: Date.now() });
    // Add a uri property to the File instance for accessing the blob as a URI
    file.uri = URL.createObjectURL(blob);
    return file;
}
function validateImageForCorruption(file) {
    if (!expensify_common_1.Str.isImage(file.name ?? '') || !file.uri) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        react_native_image_size_1.default.getSize(file.uri ?? '')
            .then((size) => {
            if (size.height <= 0 || size.width <= 0) {
                return reject(new Error('Error reading file: The file is corrupted'));
            }
            resolve();
        })
            .catch(() => {
            return reject(new Error('Error reading file: The file is corrupted'));
        });
    });
}
/** Verify file format based on the magic bytes of the file - some formats might be identified by multiple signatures */
function verifyFileFormat({ fileUri, formatSignatures }) {
    const MAGIC_BYTES_NEEDED = 16;
    if (!fileUri || !formatSignatures || formatSignatures.length === 0) {
        return Promise.resolve(false);
    }
    const cleanUri = fileUri.replace('file://', '');
    if (react_native_1.Platform.OS === 'ios') {
        return react_native_blob_util_1.default.fs.readFile(cleanUri, 'base64').then((fullBase64Data) => {
            const base64CharsNeeded = Math.ceil((MAGIC_BYTES_NEEDED * 4) / 3);
            const base64Data = fullBase64Data.substring(0, base64CharsNeeded);
            if (!base64Data) {
                return false;
            }
            try {
                const binaryString = atob(base64Data);
                const startOffset = 4;
                const bytesToRead = 12;
                const endOffset = startOffset + bytesToRead;
                if (binaryString.length < endOffset) {
                    return false;
                }
                const bytes = new Uint8Array(bytesToRead);
                for (let i = 0; i < bytesToRead; i++) {
                    bytes[i] = binaryString.charCodeAt(startOffset + i);
                }
                const hex = Array.from(bytes)
                    .map((b) => b.toString(16).padStart(2, '0'))
                    .join('');
                const result = formatSignatures.some((signature) => hex.startsWith(signature));
                return result;
            }
            catch (e) {
                return false;
            }
        });
    }
    return new Promise((resolve) => {
        react_native_blob_util_1.default.fs
            .readStream(cleanUri, 'base64', 64, 0)
            .then((stream) => {
            let base64Data = '';
            let hasEnoughData = false;
            const processData = () => {
                if (!base64Data) {
                    resolve(false);
                    return;
                }
                try {
                    const binaryString = atob(base64Data);
                    const startOffset = 4;
                    const bytesToRead = 12;
                    const endOffset = startOffset + bytesToRead;
                    if (binaryString.length < endOffset) {
                        resolve(false);
                        return;
                    }
                    const bytes = new Uint8Array(bytesToRead);
                    for (let i = 0; i < bytesToRead; i++) {
                        bytes[i] = binaryString.charCodeAt(startOffset + i);
                    }
                    const hex = Array.from(bytes)
                        .map((b) => b.toString(16).padStart(2, '0'))
                        .join('');
                    const result = formatSignatures.some((signature) => hex.startsWith(signature));
                    resolve(result);
                }
                catch (e) {
                    resolve(false);
                }
            };
            stream.onData((chunk) => {
                if (hasEnoughData) {
                    return;
                }
                try {
                    let chunkStr;
                    if (Array.isArray(chunk)) {
                        chunkStr = chunk.map((code) => String.fromCharCode(code)).join('');
                    }
                    else {
                        chunkStr = chunk;
                    }
                    base64Data += chunkStr;
                    const decodedByteCount = Math.floor((base64Data.length * 3) / 4);
                    if (decodedByteCount >= MAGIC_BYTES_NEEDED) {
                        hasEnoughData = true;
                        processData();
                    }
                }
                catch (e) {
                    if (!hasEnoughData) {
                        hasEnoughData = true;
                        resolve(false);
                    }
                }
            });
            stream.onError(() => {
                if (hasEnoughData) {
                    return;
                }
                hasEnoughData = true;
                resolve(false);
            });
            stream.onEnd(() => {
                if (hasEnoughData) {
                    return;
                }
                hasEnoughData = true;
                processData();
            });
            stream.open();
        })
            .catch(() => resolve(false));
    });
}
function isLocalFile(receiptUri) {
    if (!receiptUri) {
        return false;
    }
    return typeof receiptUri === 'number' || receiptUri?.startsWith('blob:') || receiptUri?.startsWith('file:') || receiptUri?.startsWith('/');
}
function getFileResolution(targetFile) {
    if (!targetFile) {
        return Promise.resolve(null);
    }
    // If the file already has width and height, return them directly
    if ('width' in targetFile && 'height' in targetFile) {
        return Promise.resolve({ width: targetFile.width ?? 0, height: targetFile.height ?? 0 });
    }
    // Otherwise, attempt to get the image resolution
    return (0, getImageResolution_1.default)(targetFile)
        .then(({ width, height }) => ({ width, height }))
        .catch((error) => {
        Log_1.default.hmmm('Failed to get image resolution:', error);
        return null;
    });
}
function isHighResolutionImage(resolution) {
    return resolution !== null && (resolution.width > CONST_1.default.IMAGE_HIGH_RESOLUTION_THRESHOLD || resolution.height > CONST_1.default.IMAGE_HIGH_RESOLUTION_THRESHOLD);
}
const getImageDimensionsAfterResize = (file) => react_native_image_size_1.default.getSize(file.uri ?? '').then(({ width, height }) => {
    const scaleFactor = CONST_1.default.MAX_IMAGE_DIMENSION / (width < height ? height : width);
    const newWidth = Math.max(1, width * scaleFactor);
    const newHeight = Math.max(1, height * scaleFactor);
    return { width: newWidth, height: newHeight };
});
exports.getImageDimensionsAfterResize = getImageDimensionsAfterResize;
const resizeImageIfNeeded = (file) => {
    if (!file || !expensify_common_1.Str.isImage(file.name ?? '') || (file?.size ?? 0) <= CONST_1.default.API_ATTACHMENT_VALIDATIONS.MAX_SIZE) {
        return Promise.resolve(file);
    }
    return getImageDimensionsAfterResize(file).then(({ width, height }) => (0, getImageManipulator_1.default)({ fileUri: file.uri ?? '', width, height, fileName: file.name ?? '', type: file.type }));
};
exports.resizeImageIfNeeded = resizeImageIfNeeded;
const createFile = (file) => {
    if ((0, getPlatform_1.default)() === CONST_1.default.PLATFORM.ANDROID || (0, getPlatform_1.default)() === CONST_1.default.PLATFORM.IOS) {
        return {
            uri: file.uri,
            name: file.name,
            type: file.type,
        };
    }
    return new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
    });
};
exports.createFile = createFile;
const validateReceipt = (file, setUploadReceiptError) => {
    return validateImageForCorruption(file)
        .then(() => {
        const { fileExtension } = splitExtensionFromFileName(file?.name ?? '');
        if (!CONST_1.default.API_ATTACHMENT_VALIDATIONS.ALLOWED_RECEIPT_EXTENSIONS.includes(fileExtension.toLowerCase())) {
            setUploadReceiptError(true, 'attachmentPicker.wrongFileType', 'attachmentPicker.notAllowedExtension');
            return false;
        }
        if (!expensify_common_1.Str.isImage(file.name ?? '') && (file?.size ?? 0) > CONST_1.default.API_ATTACHMENT_VALIDATIONS.RECEIPT_MAX_SIZE) {
            setUploadReceiptError(true, 'attachmentPicker.attachmentTooLarge', 'attachmentPicker.sizeExceededWithLimit');
            return false;
        }
        if ((file?.size ?? 0) < CONST_1.default.API_ATTACHMENT_VALIDATIONS.MIN_SIZE) {
            setUploadReceiptError(true, 'attachmentPicker.attachmentTooSmall', 'attachmentPicker.sizeNotMet');
            return false;
        }
        return true;
    })
        .catch(() => {
        setUploadReceiptError(true, 'attachmentPicker.attachmentError', 'attachmentPicker.errorWhileSelectingCorruptedAttachment');
        return false;
    });
};
exports.validateReceipt = validateReceipt;
const isValidReceiptExtension = (file) => {
    const { fileExtension } = splitExtensionFromFileName(file?.name ?? '');
    return CONST_1.default.API_ATTACHMENT_VALIDATIONS.ALLOWED_RECEIPT_EXTENSIONS.includes(fileExtension.toLowerCase());
};
exports.isValidReceiptExtension = isValidReceiptExtension;
const isHeicOrHeifImage = (file) => {
    return (file?.type?.startsWith('image') &&
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        (file.name?.toLowerCase().endsWith('.heic') || file.name?.toLowerCase().endsWith('.heif')));
};
exports.isHeicOrHeifImage = isHeicOrHeifImage;
/**
 * Normalizes a file-like object specifically for Android clipboard image pasting,
 * where limited file metadata is available (e.g., only a URI).
 * If the object is already a File or contains a size, it is returned as-is.
 * Otherwise, it attempts to fetch the file via its URI and reconstruct a File
 * with full metadata (name, size, type).
 */
const normalizeFileObject = (file) => {
    if (file instanceof File || file instanceof Blob) {
        return Promise.resolve(file);
    }
    const isAndroidNative = (0, getPlatform_1.default)() === CONST_1.default.PLATFORM.ANDROID;
    const isIOSNative = (0, getPlatform_1.default)() === CONST_1.default.PLATFORM.IOS;
    const isNativePlatform = isAndroidNative || isIOSNative;
    if (!isNativePlatform || 'size' in file) {
        return Promise.resolve(file);
    }
    if (typeof file.uri !== 'string') {
        return Promise.resolve(file);
    }
    return fetch(file.uri)
        .then((response) => response.blob())
        .then((blob) => {
        const name = file.name ?? 'unknown';
        const type = file.type ?? blob.type ?? 'application/octet-stream';
        const normalizedFile = new File([blob], name, { type });
        return normalizedFile;
    })
        .catch((error) => {
        return Promise.reject(error);
    });
};
exports.normalizeFileObject = normalizeFileObject;
const validateAttachment = (file, isCheckingMultipleFiles, isValidatingReceipt) => {
    const maxFileSize = isValidatingReceipt ? CONST_1.default.API_ATTACHMENT_VALIDATIONS.RECEIPT_MAX_SIZE : CONST_1.default.API_ATTACHMENT_VALIDATIONS.MAX_SIZE;
    if (!expensify_common_1.Str.isImage(file.name ?? '') && !isHeicOrHeifImage(file) && (file?.size ?? 0) > maxFileSize) {
        return isCheckingMultipleFiles ? CONST_1.default.FILE_VALIDATION_ERRORS.FILE_TOO_LARGE_MULTIPLE : CONST_1.default.FILE_VALIDATION_ERRORS.FILE_TOO_LARGE;
    }
    if (isValidatingReceipt && (file?.size ?? 0) < CONST_1.default.API_ATTACHMENT_VALIDATIONS.MIN_SIZE) {
        return CONST_1.default.FILE_VALIDATION_ERRORS.FILE_TOO_SMALL;
    }
    if (isValidatingReceipt && !isValidReceiptExtension(file)) {
        return isCheckingMultipleFiles ? CONST_1.default.FILE_VALIDATION_ERRORS.WRONG_FILE_TYPE_MULTIPLE : CONST_1.default.FILE_VALIDATION_ERRORS.WRONG_FILE_TYPE;
    }
    return '';
};
exports.validateAttachment = validateAttachment;
const getFileValidationErrorText = (validationError, additionalData = {}, isValidatingReceipt = false) => {
    if (!validationError) {
        return {
            title: '',
            reason: '',
        };
    }
    const maxSize = isValidatingReceipt ? CONST_1.default.API_ATTACHMENT_VALIDATIONS.RECEIPT_MAX_SIZE : CONST_1.default.API_ATTACHMENT_VALIDATIONS.MAX_SIZE;
    switch (validationError) {
        case CONST_1.default.FILE_VALIDATION_ERRORS.WRONG_FILE_TYPE:
            return {
                title: (0, Localize_1.translateLocal)('attachmentPicker.wrongFileType'),
                reason: (0, Localize_1.translateLocal)('attachmentPicker.notAllowedExtension'),
            };
        case CONST_1.default.FILE_VALIDATION_ERRORS.WRONG_FILE_TYPE_MULTIPLE:
            return {
                title: (0, Localize_1.translateLocal)('attachmentPicker.someFilesCantBeUploaded'),
                reason: (0, Localize_1.translateLocal)('attachmentPicker.unsupportedFileType', { fileType: additionalData.fileType ?? '' }),
            };
        case CONST_1.default.FILE_VALIDATION_ERRORS.FILE_TOO_LARGE:
            return {
                title: (0, Localize_1.translateLocal)('attachmentPicker.attachmentTooLarge'),
                reason: isValidatingReceipt
                    ? (0, Localize_1.translateLocal)('attachmentPicker.sizeExceededWithLimit', {
                        maxUploadSizeInMB: additionalData.maxUploadSizeInMB ?? CONST_1.default.API_ATTACHMENT_VALIDATIONS.RECEIPT_MAX_SIZE / 1024 / 1024,
                    })
                    : (0, Localize_1.translateLocal)('attachmentPicker.sizeExceeded'),
            };
        case CONST_1.default.FILE_VALIDATION_ERRORS.FILE_TOO_LARGE_MULTIPLE:
            return {
                title: (0, Localize_1.translateLocal)('attachmentPicker.someFilesCantBeUploaded'),
                reason: (0, Localize_1.translateLocal)('attachmentPicker.sizeLimitExceeded', {
                    maxUploadSizeInMB: additionalData.maxUploadSizeInMB ?? maxSize / 1024 / 1024,
                }),
            };
        case CONST_1.default.FILE_VALIDATION_ERRORS.FILE_TOO_SMALL:
            return {
                title: (0, Localize_1.translateLocal)('attachmentPicker.attachmentTooSmall'),
                reason: (0, Localize_1.translateLocal)('attachmentPicker.sizeNotMet'),
            };
        case CONST_1.default.FILE_VALIDATION_ERRORS.FOLDER_NOT_ALLOWED:
            return {
                title: (0, Localize_1.translateLocal)('attachmentPicker.attachmentError'),
                reason: (0, Localize_1.translateLocal)('attachmentPicker.folderNotAllowedMessage'),
            };
        case CONST_1.default.FILE_VALIDATION_ERRORS.MAX_FILE_LIMIT_EXCEEDED:
            return {
                title: (0, Localize_1.translateLocal)('attachmentPicker.someFilesCantBeUploaded'),
                reason: (0, Localize_1.translateLocal)('attachmentPicker.maxFileLimitExceeded'),
            };
        case CONST_1.default.FILE_VALIDATION_ERRORS.FILE_CORRUPTED:
            return {
                title: (0, Localize_1.translateLocal)('attachmentPicker.attachmentError'),
                reason: (0, Localize_1.translateLocal)('attachmentPicker.errorWhileSelectingCorruptedAttachment'),
            };
        case CONST_1.default.FILE_VALIDATION_ERRORS.PROTECTED_FILE:
            return {
                title: (0, Localize_1.translateLocal)('attachmentPicker.attachmentError'),
                reason: (0, Localize_1.translateLocal)('attachmentPicker.protectedPDFNotSupported'),
            };
        default:
            return {
                title: (0, Localize_1.translateLocal)('attachmentPicker.attachmentError'),
                reason: (0, Localize_1.translateLocal)('attachmentPicker.errorWhileSelectingCorruptedAttachment'),
            };
    }
};
exports.getFileValidationErrorText = getFileValidationErrorText;
const getConfirmModalPrompt = (attachmentInvalidReason) => {
    if (!attachmentInvalidReason) {
        return '';
    }
    if (attachmentInvalidReason === 'attachmentPicker.sizeExceededWithLimit') {
        return (0, Localize_1.translateLocal)(attachmentInvalidReason, { maxUploadSizeInMB: CONST_1.default.API_ATTACHMENT_VALIDATIONS.RECEIPT_MAX_SIZE / (1024 * 1024) });
    }
    return (0, Localize_1.translateLocal)(attachmentInvalidReason);
};
exports.getConfirmModalPrompt = getConfirmModalPrompt;
