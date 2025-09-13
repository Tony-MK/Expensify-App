"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expo_image_manipulator_1 = require("expo-image-manipulator");
const getSaveFormat_1 = require("./getSaveFormat");
const cropOrRotateImage = (uri, actions, options) => new Promise((resolve) => {
    const format = (0, getSaveFormat_1.default)(options.type);
    (0, expo_image_manipulator_1.manipulateAsync)(uri, actions, { compress: options.compress, format }).then((result) => {
        fetch(result.uri)
            .then((res) => res.blob())
            .then((blob) => {
            const file = new File([blob], options.name || 'fileName.jpeg', { type: options.type || 'image/jpeg' });
            file.uri = URL.createObjectURL(file);
            resolve(file);
        });
    });
});
exports.default = cropOrRotateImage;
