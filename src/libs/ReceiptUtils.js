"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldValidateFile = void 0;
exports.getThumbnailAndImageURIs = getThumbnailAndImageURIs;
const expensify_common_1 = require("expensify-common");
const findLast_1 = require("lodash/findLast");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const FileUtils_1 = require("./fileDownload/FileUtils");
const TransactionUtils_1 = require("./TransactionUtils");
/**
 * Grab the appropriate receipt image and thumbnail URIs based on file type
 *
 * @param transaction
 * @param receiptPath
 * @param receiptFileName
 */
function getThumbnailAndImageURIs(transaction, receiptPath = null, receiptFileName = null) {
    if (!(0, TransactionUtils_1.hasReceipt)(transaction) && !receiptPath && !receiptFileName) {
        return { isEmptyReceipt: true };
    }
    if ((0, TransactionUtils_1.isFetchingWaypointsFromServer)(transaction)) {
        return { isThumbnail: true, isLocalFile: true };
    }
    // If there're errors, we need to display them in preview. We can store many files in errors, but we just need to get the last one
    const errors = (0, findLast_1.default)(transaction?.errors);
    // URI to image, i.e. blob:new.expensify.com/9ef3a018-4067-47c6-b29f-5f1bd35f213d or expensify.com/receipts/w_e616108497ef940b7210ec6beb5a462d01a878f4.jpg
    const path = errors?.source ?? transaction?.receipt?.source ?? receiptPath ?? '';
    // filename of uploaded image or last part of remote URI
    const filename = errors?.filename ?? transaction?.filename ?? receiptFileName ?? '';
    const isReceiptImage = expensify_common_1.Str.isImage(filename);
    const hasEReceipt = !(0, TransactionUtils_1.hasReceiptSource)(transaction) && transaction?.hasEReceipt;
    const isReceiptPDF = expensify_common_1.Str.isPDF(filename);
    if (hasEReceipt) {
        return { image: ROUTES_1.default.ERECEIPT.getRoute(transaction.transactionID), transaction, filename };
    }
    // For local files, we won't have a thumbnail yet
    if ((isReceiptImage || isReceiptPDF) && typeof path === 'string' && (path.startsWith('blob:') || path.startsWith('file:'))) {
        return { image: path, isLocalFile: true, filename };
    }
    if (isReceiptImage) {
        return { thumbnail: `${path}.1024.jpg`, image: path, filename };
    }
    if (isReceiptPDF && typeof path === 'string') {
        return { thumbnail: `${path.substring(0, path.length - 4)}.jpg.1024.jpg`, image: path, filename };
    }
    const isLocalFile = (0, FileUtils_1.isLocalFile)(path);
    const { fileExtension } = (0, FileUtils_1.splitExtensionFromFileName)(filename);
    return { isThumbnail: true, fileExtension: Object.values(CONST_1.default.IOU.FILE_TYPES).find((type) => type === fileExtension), image: path, isLocalFile, filename };
}
const shouldValidateFile = (file) => {
    return file?.mimeType === CONST_1.default.SHARE_FILE_MIMETYPE.HEIC || file?.mimeType === CONST_1.default.SHARE_FILE_MIMETYPE.IMG;
};
exports.shouldValidateFile = shouldValidateFile;
