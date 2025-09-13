"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCropRect = calculateCropRect;
exports.cropImageToAspectRatio = cropImageToAspectRatio;
var react_native_image_size_1 = require("react-native-image-size");
var cropOrRotateImage_1 = require("@libs/cropOrRotateImage");
function calculateCropRect(imageWidth, imageHeight, aspectRatioWidth, aspectRatioHeight, shouldAlignTop) {
    var sourceAspectRatio = imageWidth / imageHeight;
    var targetAspectRatio = aspectRatioWidth / aspectRatioHeight;
    var width = imageWidth;
    var height = imageHeight;
    var originX = 0;
    var originY = 0;
    if (sourceAspectRatio > targetAspectRatio) {
        width = height * targetAspectRatio;
        originX = (imageWidth - width) / 2;
    }
    else {
        height = width * (aspectRatioHeight / aspectRatioWidth);
        originY = shouldAlignTop ? 0 : (imageHeight - height) / 2;
    }
    return { width: width, height: height, originX: originX, originY: originY };
}
var IMAGE_TYPE = 'png';
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
        .then(function (imageSize) {
        var isRotated = (imageSize === null || imageSize === void 0 ? void 0 : imageSize.rotation) === 90 || (imageSize === null || imageSize === void 0 ? void 0 : imageSize.rotation) === 270;
        var imageWidth = isRotated ? imageSize === null || imageSize === void 0 ? void 0 : imageSize.height : imageSize === null || imageSize === void 0 ? void 0 : imageSize.width;
        var imageHeight = isRotated ? imageSize === null || imageSize === void 0 ? void 0 : imageSize.width : imageSize === null || imageSize === void 0 ? void 0 : imageSize.height;
        if (!imageWidth || !imageHeight || !aspectRatioWidth || !aspectRatioHeight) {
            return image;
        }
        var crop = calculateCropRect(imageWidth, imageHeight, aspectRatioWidth, aspectRatioHeight, shouldAlignTop);
        var croppedFilename = "receipt_cropped_".concat(Date.now(), ".").concat(IMAGE_TYPE);
        return (0, cropOrRotateImage_1.default)(image.source, [{ crop: crop }], { compress: 1, name: croppedFilename, type: IMAGE_TYPE }).then(function (croppedImage) {
            if (!(croppedImage === null || croppedImage === void 0 ? void 0 : croppedImage.uri) || !(croppedImage === null || croppedImage === void 0 ? void 0 : croppedImage.name)) {
                return image;
            }
            return { file: croppedImage, filename: croppedImage.name, source: croppedImage.uri };
        });
    })
        .catch(function () { return image; });
}
