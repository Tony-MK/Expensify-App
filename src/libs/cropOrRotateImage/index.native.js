"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expo_image_manipulator_1 = require("expo-image-manipulator");
const react_native_blob_util_1 = require("react-native-blob-util");
const getSaveFormat_1 = require("./getSaveFormat");
/**
 * Crops and rotates the image on ios/android
 */
const cropOrRotateImage = (uri, actions, options) => new Promise((resolve) => {
    const format = (0, getSaveFormat_1.default)(options.type);
    // We need to remove the base64 value from the result, as it is causing crashes on Release builds.
    // More info: https://github.com/Expensify/App/issues/37963#issuecomment-1989260033
    (0, expo_image_manipulator_1.manipulateAsync)(uri, actions, { compress: options.compress, format }).then(({ base64, ...result }) => {
        react_native_blob_util_1.default.fs.stat(result.uri.replace('file://', '')).then(({ size }) => {
            resolve({
                ...result,
                size,
                type: options.type || 'image/jpeg',
                name: options.name || 'fileName.jpg',
            });
        });
    });
});
exports.default = cropOrRotateImage;
