"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getImageManipulator;
const expo_image_manipulator_1 = require("expo-image-manipulator");
function getImageManipulator({ fileUri, width, height, fileName }) {
    return (0, expo_image_manipulator_1.manipulateAsync)(fileUri ?? '', [{ resize: { width, height } }]).then((result) => fetch(result.uri)
        .then((res) => res.blob())
        .then((blob) => {
        const resizedFile = new File([blob], `${fileName}.jpeg`, { type: 'image/jpeg' });
        resizedFile.uri = URL.createObjectURL(resizedFile);
        return resizedFile;
    }));
}
