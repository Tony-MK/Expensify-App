"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("../../src/CONST");
const DateUtils_1 = require("../../src/libs/DateUtils");
const FileUtils = require("../../src/libs/fileDownload/FileUtils");
jest.useFakeTimers();
const createMockFile = (name, size) => ({
    name,
    size,
});
describe('FileUtils', () => {
    describe('splitExtensionFromFileName', () => {
        it('should return correct file name and extension', () => {
            const file = FileUtils.splitExtensionFromFileName('image.jpg');
            expect(file.fileName).toEqual('image');
            expect(file.fileExtension).toEqual('jpg');
        });
        it('should return correct file name and extension even with multiple dots on the file name', () => {
            const file = FileUtils.splitExtensionFromFileName('image.pdf.jpg');
            expect(file.fileName).toEqual('image.pdf');
            expect(file.fileExtension).toEqual('jpg');
        });
        it('should return empty extension if the file name does not have it', () => {
            const file = FileUtils.splitExtensionFromFileName('image');
            expect(file.fileName).toEqual('image');
            expect(file.fileExtension).toEqual('');
        });
    });
    describe('appendTimeToFileName', () => {
        it('should append current time to the end of the file name', () => {
            const actualFileName = FileUtils.appendTimeToFileName('image.jpg');
            const expectedFileName = `image-${DateUtils_1.default.getDBTime()}.jpg`;
            expect(actualFileName).toEqual(expectedFileName.replace(CONST_1.default.REGEX.ILLEGAL_FILENAME_CHARACTERS, '_'));
        });
        it('should append current time to the end of the file name without extension', () => {
            const actualFileName = FileUtils.appendTimeToFileName('image');
            const expectedFileName = `image-${DateUtils_1.default.getDBTime()}`;
            expect(actualFileName).toEqual(expectedFileName.replace(CONST_1.default.REGEX.ILLEGAL_FILENAME_CHARACTERS, '_'));
        });
    });
    describe('validateAttachment', () => {
        it('should not return FILE_TOO_SMALL when validating small attachment', () => {
            const file = createMockFile('file.csv', CONST_1.default.API_ATTACHMENT_VALIDATIONS.MIN_SIZE - 1);
            const error = FileUtils.validateAttachment(file, false, false);
            expect(error).not.toBe(CONST_1.default.FILE_VALIDATION_ERRORS.FILE_TOO_SMALL);
        });
        it('should return FILE_TOO_SMALL when validating small receipt', () => {
            const file = createMockFile('receipt.jpg', CONST_1.default.API_ATTACHMENT_VALIDATIONS.MIN_SIZE - 1);
            const error = FileUtils.validateAttachment(file, false, true);
            expect(error).toBe(CONST_1.default.FILE_VALIDATION_ERRORS.FILE_TOO_SMALL);
        });
        it('should return FILE_TOO_LARGE for large non-image file', () => {
            const file = createMockFile('file.pdf', CONST_1.default.API_ATTACHMENT_VALIDATIONS.MAX_SIZE + 1);
            const error = FileUtils.validateAttachment(file);
            expect(error).toBe(CONST_1.default.FILE_VALIDATION_ERRORS.FILE_TOO_LARGE);
        });
        it('should return FILE_TOO_LARGE_MULTIPLE when checking multiple files', () => {
            const file = createMockFile('file.pdf', CONST_1.default.API_ATTACHMENT_VALIDATIONS.MAX_SIZE + 1);
            const error = FileUtils.validateAttachment(file, true);
            expect(error).toBe(CONST_1.default.FILE_VALIDATION_ERRORS.FILE_TOO_LARGE_MULTIPLE);
        });
        it('should return WRONG_FILE_TYPE for invalid receipt extension', () => {
            const file = createMockFile('receipt.exe', CONST_1.default.API_ATTACHMENT_VALIDATIONS.RECEIPT_MAX_SIZE - 1);
            const error = FileUtils.validateAttachment(file, false, true);
            expect(error).toBe(CONST_1.default.FILE_VALIDATION_ERRORS.WRONG_FILE_TYPE);
        });
        it('should return empty string for valid image receipt', () => {
            const file = createMockFile('receipt.jpg', CONST_1.default.API_ATTACHMENT_VALIDATIONS.RECEIPT_MAX_SIZE - 1);
            const error = FileUtils.validateAttachment(file, false, true);
            expect(error).toBe('');
        });
    });
});
