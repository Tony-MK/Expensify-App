"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getHeicConverter = function () {
    // Use the CSP variant to ensure the library is loaded in a secure context. See https://github.com/hoppergee/heic-to?tab=readme-ov-file#cotent-security-policy
    // Use webpackMode: "eager" to ensure the library is loaded immediately without evaluating the code. See https://github.com/Expensify/App/pull/68727#issuecomment-3227196372
    // @ts-expect-error - heic-to/csp is not correctly typed but exists
    return Promise.resolve().then(function () { return require(/* webpackMode: "eager" */ 'heic-to/csp'); }).then(function (_a) {
        var heicTo = _a.heicTo, isHeic = _a.isHeic;
        return ({ heicTo: heicTo, isHeic: isHeic });
    });
};
/**
 * Web implementation for converting HEIC/HEIF images to JPEG
 * @param file - The file to check and potentially convert
 * @param callbacks - Object containing callback functions for different stages of conversion
 */
var convertHeicImage = function (file, _a) {
    var _b, _c, _d;
    var _e = _a === void 0 ? {} : _a, _f = _e.onSuccess, onSuccess = _f === void 0 ? function () { } : _f, _g = _e.onError, onError = _g === void 0 ? function () { } : _g, _h = _e.onStart, onStart = _h === void 0 ? function () { } : _h, _j = _e.onFinish, onFinish = _j === void 0 ? function () { } : _j;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    var needsConversion = ((_b = file.name) === null || _b === void 0 ? void 0 : _b.toLowerCase().endsWith('.heic')) || ((_c = file.name) === null || _c === void 0 ? void 0 : _c.toLowerCase().endsWith('.heif'));
    if (!needsConversion || !file.uri || !((_d = file.type) === null || _d === void 0 ? void 0 : _d.startsWith('image'))) {
        onSuccess(file);
        return;
    }
    onStart();
    if (!file.uri) {
        onError(new Error('File URI is undefined'), file);
        onFinish();
        return;
    }
    // Start loading the conversion library in parallel with fetching the file
    var libraryPromise = getHeicConverter().catch(function (importError) {
        console.error('Error loading heic-to library:', importError);
        // Re-throw a normalized error so the outer catch can handle it uniformly
        throw new Error('HEIC conversion library unavailable');
    });
    var fetchBlobPromise = fetch(file.uri).then(function (response) { return response.blob(); });
    Promise.all([libraryPromise, fetchBlobPromise])
        .then(function (_a) {
        var _b;
        var _c = _a[0], heicTo = _c.heicTo, isHeic = _c.isHeic, blob = _a[1];
        var fileFromBlob = new File([blob], (_b = file.name) !== null && _b !== void 0 ? _b : 'temp-file', { type: blob.type });
        return isHeic(fileFromBlob).then(function (isHEIC) {
            if (isHEIC || needsConversion) {
                return heicTo({
                    blob: blob,
                    type: 'image/jpeg',
                })
                    .then(function (convertedBlob) {
                    var fileName = file.name ? file.name.replace(/\.(heic|heif)$/i, '.jpg') : 'converted-image.jpg';
                    var jpegFile = new File([convertedBlob], fileName, { type: 'image/jpeg' });
                    jpegFile.uri = URL.createObjectURL(jpegFile);
                    onSuccess(jpegFile);
                })
                    .catch(function (err) {
                    console.error('Error converting image format to JPEG:', err);
                    onError(err, file);
                });
            }
            onSuccess(file);
        });
    })
        .catch(function (err) {
        console.error('Error processing the file:', err);
        onError(err, file);
    })
        .finally(function () {
        onFinish();
    });
};
exports.default = convertHeicImage;
