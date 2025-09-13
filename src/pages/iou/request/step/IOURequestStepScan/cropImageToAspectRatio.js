"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCropRect = calculateCropRect;
exports.cropImageToAspectRatio = cropImageToAspectRatio;
const react_native_image_size_1 = require("react-native-image-size");
const cropOrRotateImage_1 = require("@libs/cropOrRotateImage");
function calculateCropRect(imageWidth, imageHeight, aspectRatioWidth, aspectRatioHeight, shouldAlignTop) {
    const sourceAspectRatio = imageWidth / imageHeight;
    const targetAspectRatio = aspectRatioWidth / aspectRatioHeight;
    let width = imageWidth;
    let height = imageHeight;
    let originX = 0;
    let originY = 0;
    if (sourceAspectRatio > targetAspectRatio) {
        width = height * targetAspectRatio;
        originX = (imageWidth - width) / 2;
    }
    else {
        height = width * (aspectRatioHeight / aspectRatioWidth);
        originY = shouldAlignTop ? 0 : (imageHeight - height) / 2;
    }
    return { width, height, originX, originY };
}
const IMAGE_TYPE = 'png';
function cropImageToAspectRatio(
/** Source image */
image, 
/** Width portion of the target aspect ratio (e.g., 16 for 16:9) */
aspectRatioWidth, 
/** Height portion of the target aspect ratio (e.g., 9 for 16:9) */
aspectRatioHeight, 
/** Vertically align the crop to the top (true) or center (false) */
shouldAlignTop) {
    return react_native_image_size_1.default.getSize(image.source)
        .then((imageSize) => {
        const isRotated = imageSize?.rotation === 90 || imageSize?.rotation === 270;
        const imageWidth = isRotated ? imageSize?.height : imageSize?.width;
        const imageHeight = isRotated ? imageSize?.width : imageSize?.height;
        if (!imageWidth || !imageHeight || !aspectRatioWidth || !aspectRatioHeight) {
            return image;
        }
        const crop = calculateCropRect(imageWidth, imageHeight, aspectRatioWidth, aspectRatioHeight, shouldAlignTop);
        const croppedFilename = `receipt_cropped_${Date.now()}.${IMAGE_TYPE}`;
        return (0, cropOrRotateImage_1.default)(image.source, [{ crop }], { compress: 1, name: croppedFilename, type: IMAGE_TYPE }).then((croppedImage) => {
            if (!croppedImage?.uri || !croppedImage?.name) {
                return image;
            }
            return { file: croppedImage, filename: croppedImage.name, source: croppedImage.uri };
        });
    })
        .catch(() => image);
}
