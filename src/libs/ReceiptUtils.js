"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldValidateFile = void 0;
exports.getThumbnailAndImageURIs = getThumbnailAndImageURIs;
var expensify_common_1 = require("expensify-common");
var findLast_1 = require("lodash/findLast");
var CONST_1 = require("@src/CONST");
var ROUTES_1 = require("@src/ROUTES");
var FileUtils_1 = require("./fileDownload/FileUtils");
var TransactionUtils_1 = require("./TransactionUtils");
/**
 * Grab the appropriate receipt image and thumbnail URIs based on file type
 *
 * @param transaction
 * @param receiptPath
 * @param receiptFileName
 */
function getThumbnailAndImageURIs(transaction, receiptPath, receiptFileName) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (receiptPath === void 0) { receiptPath = null; }
    if (receiptFileName === void 0) { receiptFileName = null; }
    if (!(0, TransactionUtils_1.hasReceipt)(transaction) && !receiptPath && !receiptFileName) {
        return { isEmptyReceipt: true };
    }
    if ((0, TransactionUtils_1.isFetchingWaypointsFromServer)(transaction)) {
        return { isThumbnail: true, isLocalFile: true };
    }
    // If there're errors, we need to display them in preview. We can store many files in errors, but we just need to get the last one
    var errors = (0, findLast_1.default)(transaction === null || transaction === void 0 ? void 0 : transaction.errors);
    // URI to image, i.e. blob:new.expensify.com/9ef3a018-4067-47c6-b29f-5f1bd35f213d or expensify.com/receipts/w_e616108497ef940b7210ec6beb5a462d01a878f4.jpg
    var path = (_d = (_c = (_a = errors === null || errors === void 0 ? void 0 : errors.source) !== null && _a !== void 0 ? _a : (_b = transaction === null || transaction === void 0 ? void 0 : transaction.receipt) === null || _b === void 0 ? void 0 : _b.source) !== null && _c !== void 0 ? _c : receiptPath) !== null && _d !== void 0 ? _d : '';
    // filename of uploaded image or last part of remote URI
    var filename = (_g = (_f = (_e = errors === null || errors === void 0 ? void 0 : errors.filename) !== null && _e !== void 0 ? _e : transaction === null || transaction === void 0 ? void 0 : transaction.filename) !== null && _f !== void 0 ? _f : receiptFileName) !== null && _g !== void 0 ? _g : '';
    var isReceiptImage = expensify_common_1.Str.isImage(filename);
    var hasEReceipt = !(0, TransactionUtils_1.hasReceiptSource)(transaction) && (transaction === null || transaction === void 0 ? void 0 : transaction.hasEReceipt);
    var isReceiptPDF = expensify_common_1.Str.isPDF(filename);
    if (hasEReceipt) {
        return { image: ROUTES_1.default.ERECEIPT.getRoute(transaction.transactionID), transaction: transaction, filename: filename };
    }
    // For local files, we won't have a thumbnail yet
    if ((isReceiptImage || isReceiptPDF) && typeof path === 'string' && (path.startsWith('blob:') || path.startsWith('file:'))) {
        return { image: path, isLocalFile: true, filename: filename };
    }
    if (isReceiptImage) {
        return { thumbnail: "".concat(path, ".1024.jpg"), image: path, filename: filename };
    }
    if (isReceiptPDF && typeof path === 'string') {
        return { thumbnail: "".concat(path.substring(0, path.length - 4), ".jpg.1024.jpg"), image: path, filename: filename };
    }
    var isLocalFile = (0, FileUtils_1.isLocalFile)(path);
    var fileExtension = (0, FileUtils_1.splitExtensionFromFileName)(filename).fileExtension;
    return { isThumbnail: true, fileExtension: Object.values(CONST_1.default.IOU.FILE_TYPES).find(function (type) { return type === fileExtension; }), image: path, isLocalFile: isLocalFile, filename: filename };
}
var shouldValidateFile = function (file) {
    return (file === null || file === void 0 ? void 0 : file.mimeType) === CONST_1.default.SHARE_FILE_MIMETYPE.HEIC || (file === null || file === void 0 ? void 0 : file.mimeType) === CONST_1.default.SHARE_FILE_MIMETYPE.IMG;
};
exports.shouldValidateFile = shouldValidateFile;
