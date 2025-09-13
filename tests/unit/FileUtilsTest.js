"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CONST_1 = require("../../src/CONST");
var DateUtils_1 = require("../../src/libs/DateUtils");
var FileUtils = require("../../src/libs/fileDownload/FileUtils");
jest.useFakeTimers();
var createMockFile = function (name, size) { return ({
    name: name,
    size: size,
}); };
describe('FileUtils', function () {
    describe('splitExtensionFromFileName', function () {
        it('should return correct file name and extension', function () {
            var file = FileUtils.splitExtensionFromFileName('image.jpg');
            expect(file.fileName).toEqual('image');
            expect(file.fileExtension).toEqual('jpg');
        });
        it('should return correct file name and extension even with multiple dots on the file name', function () {
            var file = FileUtils.splitExtensionFromFileName('image.pdf.jpg');
            expect(file.fileName).toEqual('image.pdf');
            expect(file.fileExtension).toEqual('jpg');
        });
        it('should return empty extension if the file name does not have it', function () {
            var file = FileUtils.splitExtensionFromFileName('image');
            expect(file.fileName).toEqual('image');
            expect(file.fileExtension).toEqual('');
        });
    });
    describe('appendTimeToFileName', function () {
        it('should append current time to the end of the file name', function () {
            var actualFileName = FileUtils.appendTimeToFileName('image.jpg');
            var expectedFileName = "image-".concat(DateUtils_1.default.getDBTime(), ".jpg");
            expect(actualFileName).toEqual(expectedFileName.replace(CONST_1.default.REGEX.ILLEGAL_FILENAME_CHARACTERS, '_'));
        });
        it('should append current time to the end of the file name without extension', function () {
            var actualFileName = FileUtils.appendTimeToFileName('image');
            var expectedFileName = "image-".concat(DateUtils_1.default.getDBTime());
            expect(actualFileName).toEqual(expectedFileName.replace(CONST_1.default.REGEX.ILLEGAL_FILENAME_CHARACTERS, '_'));
        });
    });
    describe('validateAttachment', function () {
        it('should not return FILE_TOO_SMALL when validating small attachment', function () {
            var file = createMockFile('file.csv', CONST_1.default.API_ATTACHMENT_VALIDATIONS.MIN_SIZE - 1);
            var error = FileUtils.validateAttachment(file, false, false);
            expect(error).not.toBe(CONST_1.default.FILE_VALIDATION_ERRORS.FILE_TOO_SMALL);
        });
        it('should return FILE_TOO_SMALL when validating small receipt', function () {
            var file = createMockFile('receipt.jpg', CONST_1.default.API_ATTACHMENT_VALIDATIONS.MIN_SIZE - 1);
            var error = FileUtils.validateAttachment(file, false, true);
            expect(error).toBe(CONST_1.default.FILE_VALIDATION_ERRORS.FILE_TOO_SMALL);
        });
        it('should return FILE_TOO_LARGE for large non-image file', function () {
            var file = createMockFile('file.pdf', CONST_1.default.API_ATTACHMENT_VALIDATIONS.MAX_SIZE + 1);
            var error = FileUtils.validateAttachment(file);
            expect(error).toBe(CONST_1.default.FILE_VALIDATION_ERRORS.FILE_TOO_LARGE);
        });
        it('should return FILE_TOO_LARGE_MULTIPLE when checking multiple files', function () {
            var file = createMockFile('file.pdf', CONST_1.default.API_ATTACHMENT_VALIDATIONS.MAX_SIZE + 1);
            var error = FileUtils.validateAttachment(file, true);
            expect(error).toBe(CONST_1.default.FILE_VALIDATION_ERRORS.FILE_TOO_LARGE_MULTIPLE);
        });
        it('should return WRONG_FILE_TYPE for invalid receipt extension', function () {
            var file = createMockFile('receipt.exe', CONST_1.default.API_ATTACHMENT_VALIDATIONS.RECEIPT_MAX_SIZE - 1);
            var error = FileUtils.validateAttachment(file, false, true);
            expect(error).toBe(CONST_1.default.FILE_VALIDATION_ERRORS.WRONG_FILE_TYPE);
        });
        it('should return empty string for valid image receipt', function () {
            var file = createMockFile('receipt.jpg', CONST_1.default.API_ATTACHMENT_VALIDATIONS.RECEIPT_MAX_SIZE - 1);
            var error = FileUtils.validateAttachment(file, false, true);
            expect(error).toBe('');
        });
    });
});
