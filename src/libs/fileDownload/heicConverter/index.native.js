"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expo_image_manipulator_1 = require("expo-image-manipulator");
const FileUtils_1 = require("@libs/fileDownload/FileUtils");
const CONST_1 = require("@src/CONST");
/**
 * Helper function to convert HEIC/HEIF image to JPEG using ImageManipulator
 * @param file - The original file object
 * @param sourceUri - URI of the image to convert
 * @param originalExtension - The original file extension pattern to replace
 * @param callbacks - Callback functions for the conversion process
 */
const convertImageWithManipulator = (file, sourceUri, originalExtension, { onSuccess = () => { }, onError = () => { }, onFinish = () => { }, } = {}) => {
    expo_image_manipulator_1.ImageManipulator.manipulate(sourceUri)
        .renderAsync()
        .then((manipulatedImage) => manipulatedImage.saveAsync({ format: expo_image_manipulator_1.SaveFormat.JPEG }))
        .then((manipulationResult) => {
        const convertedFile = {
            uri: manipulationResult.uri,
            name: file.name?.replace(originalExtension, '.jpg') ?? 'converted-image.jpg',
            type: 'image/jpeg',
            size: file.size,
            width: manipulationResult.width,
            height: manipulationResult.height,
        };
        onSuccess(convertedFile);
    })
        .catch((err) => {
        console.error('Error converting HEIC/HEIF to JPEG:', err);
        onError(err, file);
    })
        .finally(() => {
        onFinish();
    });
};
/**
 * Native implementation for converting HEIC/HEIF images to JPEG
 * @param file - The file to check and potentially convert
 * @param callbacks - Object containing callback functions for different stages of conversion
 */
const convertHeicImage = (file, { onSuccess = () => { }, onError = () => { }, onStart = () => { }, onFinish = () => { } } = {}) => {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const needsConversion = file.name?.toLowerCase().endsWith('.heic') || file.name?.toLowerCase().endsWith('.heif');
    if (!needsConversion || !file.uri || !file.type?.startsWith('image')) {
        onSuccess(file);
        return;
    }
    onStart();
    if (!file.uri) {
        onError(new Error('File URI is undefined'), file);
        onFinish();
        return;
    }
    // Conversion based on extension
    if (needsConversion) {
        const fileUri = file.uri;
        convertImageWithManipulator(file, fileUri, /\.(heic|heif)$/i, {
            onSuccess,
            onError,
            onFinish,
        });
        return;
    }
    // If not detected by extension, check using file signatures
    (0, FileUtils_1.verifyFileFormat)({ fileUri: file.uri, formatSignatures: CONST_1.default.HEIC_SIGNATURES })
        .then((isHEIC) => {
        if (isHEIC) {
            const fileUri = file.uri;
            if (!fileUri) {
                onError(new Error('File URI is undefined'), file);
                onFinish();
                return;
            }
            convertImageWithManipulator(file, fileUri, /\.heic$/i, {
                onSuccess,
                onError,
                onFinish,
            });
            return;
        }
        onSuccess(file);
    })
        .catch((err) => {
        console.error('Error processing the file:', err);
        onError(err, file);
    })
        .finally(() => {
        onFinish();
    });
};
exports.default = convertHeicImage;
