"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const util_1 = require("util");
const Localize_1 = require("@libs/Localize");
const CONST_1 = require("@src/CONST");
const ValidationUtils_1 = require("@src/libs/ValidationUtils");
global.TextEncoder = util_1.TextEncoder;
describe('ValidationUtils', () => {
    describe('isValidDate', () => {
        test('Should return true for a valid date within the range', () => {
            const validDate = '2023-07-18';
            const isValid = (0, ValidationUtils_1.isValidDate)(validDate);
            expect(isValid).toBe(true);
        });
        test('Should return false for an invalid date', () => {
            const invalidDate = '2023-07-32';
            const isValid = (0, ValidationUtils_1.isValidDate)(invalidDate);
            expect(isValid).toBe(false);
        });
        test('Should return false for an empty date', () => {
            const invalidDate = '';
            const isValid = (0, ValidationUtils_1.isValidDate)(invalidDate);
            expect(isValid).toBe(false);
        });
        test('Should return false for a date after the range', () => {
            const futureDate = '3042-07-18';
            const isValid = (0, ValidationUtils_1.isValidDate)(futureDate);
            expect(isValid).toBe(false);
        });
        test('Should return false for a invalid date format', () => {
            const validDate = '2025-07';
            const isValid = (0, ValidationUtils_1.isValidDate)(validDate);
            expect(isValid).toBe(false);
        });
    });
    describe('isValidPastDate', () => {
        test('Should return true for a valid past date within the range', () => {
            const validPastDate = '1990-01-01';
            const isValid = (0, ValidationUtils_1.isValidPastDate)(validPastDate);
            expect(isValid).toBe(true);
        });
        test('Should return false for an invalid date', () => {
            const invalidDate = '2023-07-32';
            const isValid = (0, ValidationUtils_1.isValidPastDate)(invalidDate);
            expect(isValid).toBe(false);
        });
        test('Should return false for an empty date', () => {
            const emptyDate = '';
            const isValid = (0, ValidationUtils_1.isValidPastDate)(emptyDate);
            expect(isValid).toBe(false);
        });
        test('Should return false for a future date', () => {
            const futureDate = (0, date_fns_1.format)((0, date_fns_1.addDays)(new Date(), 1), CONST_1.default.DATE.FNS_FORMAT_STRING);
            const isValid = (0, ValidationUtils_1.isValidPastDate)(futureDate);
            expect(isValid).toBe(false);
        });
    });
    describe('isRequiredFulfilled', () => {
        test('Should return true for a non-empty string value', () => {
            const stringValue = 'Test';
            const isFulfilled = (0, ValidationUtils_1.isRequiredFulfilled)(stringValue);
            expect(isFulfilled).toBe(true);
        });
        test('Should return false for an empty string value', () => {
            const emptyStringValue = '';
            const isFulfilled = (0, ValidationUtils_1.isRequiredFulfilled)(emptyStringValue);
            expect(isFulfilled).toBe(false);
        });
        test('Should return false for a whitespace string value', () => {
            const whitespaceStringValue = '   ';
            const isFulfilled = (0, ValidationUtils_1.isRequiredFulfilled)(whitespaceStringValue);
            expect(isFulfilled).toBe(false);
        });
        test('Should return true for a valid date value', () => {
            const dateValue = new Date();
            const isFulfilled = (0, ValidationUtils_1.isRequiredFulfilled)(dateValue);
            expect(isFulfilled).toBe(true);
        });
        test('Should return false for an invalid date value', () => {
            const invalidDateValue = new Date('2023-07-33');
            const isFulfilled = (0, ValidationUtils_1.isRequiredFulfilled)(invalidDateValue);
            expect(isFulfilled).toBe(false);
        });
        test('Should return true for a non-empty array value', () => {
            const arrayValue = [1, 2, 3];
            const isFulfilled = (0, ValidationUtils_1.isRequiredFulfilled)(arrayValue);
            expect(isFulfilled).toBe(true);
        });
        test('Should return false for an empty array value', () => {
            const emptyArrayValue = [];
            const isFulfilled = (0, ValidationUtils_1.isRequiredFulfilled)(emptyArrayValue);
            expect(isFulfilled).toBe(false);
        });
        test('Should return true for a non-empty object value', () => {
            const objectValue = { key: 'value' };
            const isFulfilled = (0, ValidationUtils_1.isRequiredFulfilled)(objectValue);
            expect(isFulfilled).toBe(true);
        });
        test('Should return false for an empty object value', () => {
            const emptyObjectValue = {};
            const isFulfilled = (0, ValidationUtils_1.isRequiredFulfilled)(emptyObjectValue);
            expect(isFulfilled).toBe(false);
        });
    });
    describe('isValidExpirationDate', () => {
        test('Should return true for a valid formats expiration date in the future', () => {
            const firstFutureExpirationDate = '12/25'; // MM/YY format, in the future
            const secondFutureExpirationDate = '12/2025'; // MM/YYYY format, in the future
            const thirdFutureExpirationDate = '1225'; // MMYY format, in the future
            const fourthFutureExpirationDate = '122025'; // MMYYYY format, in the future
            expect((0, ValidationUtils_1.isValidExpirationDate)(firstFutureExpirationDate)).toBe(true);
            expect((0, ValidationUtils_1.isValidExpirationDate)(secondFutureExpirationDate)).toBe(true);
            expect((0, ValidationUtils_1.isValidExpirationDate)(thirdFutureExpirationDate)).toBe(true);
            expect((0, ValidationUtils_1.isValidExpirationDate)(fourthFutureExpirationDate)).toBe(true);
        });
        test('Should return false for a valid expiration date, but in the past', () => {
            const pastExpirationDate = '06/20'; // MM/YY format, in the past
            const isValid = (0, ValidationUtils_1.isValidExpirationDate)(pastExpirationDate);
            expect(isValid).toBe(false);
        });
        test('Should return false for an invalid expiration date format', () => {
            const invalidExpirationDate = '2006'; // Invalid format, missing YYMM
            const isValid = (0, ValidationUtils_1.isValidExpirationDate)(invalidExpirationDate);
            expect(isValid).toBe(false);
        });
    });
    describe('meetsMinimumAgeRequirement', () => {
        test('Should return true for a date that meets the minimum age requirement', () => {
            const validDate = (0, date_fns_1.format)((0, date_fns_1.subYears)(new Date(), 18), CONST_1.default.DATE.FNS_FORMAT_STRING); // Date of birth 18 years ago
            const meetsRequirement = (0, ValidationUtils_1.meetsMinimumAgeRequirement)(validDate);
            expect(meetsRequirement).toBe(true);
        });
        test('Should return false for a date that does not meet the minimum age requirement', () => {
            const invalidDate = (0, date_fns_1.format)((0, date_fns_1.subYears)(new Date(), 17), CONST_1.default.DATE.FNS_FORMAT_STRING); // Date of birth 17 years ago
            const meetsRequirement = (0, ValidationUtils_1.meetsMinimumAgeRequirement)(invalidDate);
            expect(meetsRequirement).toBe(false);
        });
        test('Should return false for an invalid date', () => {
            const invalidDate = '2023-07-32'; // Invalid date
            const meetsRequirement = (0, ValidationUtils_1.meetsMinimumAgeRequirement)(invalidDate);
            expect(meetsRequirement).toBe(false);
        });
    });
    describe('meetsMaximumAgeRequirement', () => {
        test('Should return true for a date that meets the maximum age requirement', () => {
            const validDate = (0, date_fns_1.format)((0, date_fns_1.subYears)(new Date(), 65), CONST_1.default.DATE.FNS_FORMAT_STRING); // Date of birth 65 years ago
            const meetsRequirement = (0, ValidationUtils_1.meetsMaximumAgeRequirement)(validDate);
            expect(meetsRequirement).toBe(true);
        });
        test('Should return false for a date that does not meet the maximum age requirement', () => {
            const invalidDate = (0, date_fns_1.format)((0, date_fns_1.subYears)(new Date(), 151), CONST_1.default.DATE.FNS_FORMAT_STRING); // Date of birth 151 years ago
            const meetsRequirement = (0, ValidationUtils_1.meetsMaximumAgeRequirement)(invalidDate);
            expect(meetsRequirement).toBe(false);
        });
        test('Should return false for an invalid date', () => {
            const invalidDate = '2023-07-32'; // Invalid date
            const meetsRequirement = (0, ValidationUtils_1.meetsMaximumAgeRequirement)(invalidDate);
            expect(meetsRequirement).toBe(false);
        });
    });
    describe('getAgeRequirementError', () => {
        test('Should return an empty string for a date within the specified range', () => {
            const validDate = (0, date_fns_1.format)((0, date_fns_1.subYears)(new Date(), 30), CONST_1.default.DATE.FNS_FORMAT_STRING); // Date of birth 30 years ago
            const error = (0, ValidationUtils_1.getAgeRequirementError)(validDate, 18, 150);
            expect(error).toBe('');
        });
        test('Should return an error message for a date before the minimum age requirement', () => {
            const invalidDate = (0, date_fns_1.format)((0, date_fns_1.subYears)(new Date(), 17), CONST_1.default.DATE.FNS_FORMAT_STRING); // Date of birth 17 years ago
            const error = (0, ValidationUtils_1.getAgeRequirementError)(invalidDate, 18, 150);
            expect(error).toEqual((0, Localize_1.translateLocal)('privatePersonalDetails.error.dateShouldBeBefore', { dateString: (0, date_fns_1.format)((0, date_fns_1.startOfDay)((0, date_fns_1.subYears)(new Date(), 18)), CONST_1.default.DATE.FNS_FORMAT_STRING) }));
        });
        test('Should return an error message for a date after the maximum age requirement', () => {
            const invalidDate = (0, date_fns_1.format)((0, date_fns_1.subYears)(new Date(), 160), CONST_1.default.DATE.FNS_FORMAT_STRING); // Date of birth 160 years ago
            const error = (0, ValidationUtils_1.getAgeRequirementError)(invalidDate, 18, 150);
            expect(error).toEqual((0, Localize_1.translateLocal)('privatePersonalDetails.error.dateShouldBeAfter', { dateString: (0, date_fns_1.format)((0, date_fns_1.startOfDay)((0, date_fns_1.subYears)(new Date(), 150)), CONST_1.default.DATE.FNS_FORMAT_STRING) }));
        });
        test('Should return an error message for an invalid date', () => {
            const invalidDate = '2023-07-32'; // Invalid date
            const error = (0, ValidationUtils_1.getAgeRequirementError)(invalidDate, 18, 150);
            expect(error).toBe((0, Localize_1.translateLocal)('common.error.dateInvalid'));
        });
    });
    describe('isValidTwoFactorCode', () => {
        test('numeric two-factor code', () => {
            expect((0, ValidationUtils_1.isValidTwoFactorCode)('123456')).toBe(true);
        });
        test('numeric two-factor code with leading zeroes', () => {
            expect((0, ValidationUtils_1.isValidTwoFactorCode)('000001')).toBe(true);
        });
        test('alphanumeric two-factor code', () => {
            expect((0, ValidationUtils_1.isValidTwoFactorCode)('abc123')).toBe(false);
        });
        test('special characters two-factor code', () => {
            expect((0, ValidationUtils_1.isValidTwoFactorCode)('!@#$%^')).toBe(false);
        });
        test('partial special characters two-factor code', () => {
            expect((0, ValidationUtils_1.isValidTwoFactorCode)('123$%^')).toBe(false);
        });
    });
    describe('isValidRoomName', () => {
        test('room name without #', () => {
            expect((0, ValidationUtils_1.isValidRoomName)('test')).toBe(false);
        });
        test('room name with upper case letters', () => {
            expect((0, ValidationUtils_1.isValidRoomName)('#Test')).toBe(false);
        });
        test('room name with special character other than dash', () => {
            expect((0, ValidationUtils_1.isValidRoomName)('#test_room')).toBe(false);
        });
        test('room name with less than one character', () => {
            expect((0, ValidationUtils_1.isValidRoomName)('#')).toBe(false);
        });
        test('room name with 101 characters', () => {
            expect((0, ValidationUtils_1.isValidRoomName)('#12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901')).toBe(false);
        });
        test('room name with lowercase letters, numbers, and dashes', () => {
            expect((0, ValidationUtils_1.isValidRoomName)('#this-is-a-room1')).toBe(true);
        });
        test('room name with spanish Accented letters and dashes', () => {
            expect((0, ValidationUtils_1.isValidRoomName)('#sala-de-opinión')).toBe(true);
        });
        test('room name with division sign (÷)', () => {
            expect((0, ValidationUtils_1.isValidRoomName)('#room-name-with-÷-sign')).toBe(false);
        });
        test('room name with Greek alphabets and Cyrillic alphabets', () => {
            expect((0, ValidationUtils_1.isValidRoomName)('#σοβαρός-серьезный')).toBe(true);
        });
    });
    describe('isValidWebsite', () => {
        test('Valid URLs with https protocol', () => {
            expect((0, ValidationUtils_1.isValidWebsite)('https://www.expensify.com')).toBe(true);
            expect((0, ValidationUtils_1.isValidWebsite)('https://expensify.com/inbox/')).toBe(true);
            expect((0, ValidationUtils_1.isValidWebsite)('https://we.are.expensify.com/how-we-got-here')).toBe(true);
            expect((0, ValidationUtils_1.isValidWebsite)('https://blog.google')).toBe(true);
            expect((0, ValidationUtils_1.isValidWebsite)('https://blog.google:65535')).toBe(true);
        });
        test('Valid URLs with http protocol', () => {
            expect((0, ValidationUtils_1.isValidWebsite)('http://www.expensify.com')).toBe(true);
            expect((0, ValidationUtils_1.isValidWebsite)('http://use.expensify.com')).toBe(true);
        });
        test('Valid URL with ftp protocol', () => {
            expect((0, ValidationUtils_1.isValidWebsite)('ftp://expensify.com/files')).toBe(true);
        });
        test('Invalid URLs', () => {
            expect((0, ValidationUtils_1.isValidWebsite)('expensify')).toBe(false);
            expect((0, ValidationUtils_1.isValidWebsite)('expensify.')).toBe(false);
            expect((0, ValidationUtils_1.isValidWebsite)('192.168.0.1')).toBe(false);
            expect((0, ValidationUtils_1.isValidWebsite)('www.googlecom')).toBe(false);
            expect((0, ValidationUtils_1.isValidWebsite)('www.google.com:65536')).toBe(false);
        });
        test('Invalid URLs without protocols', () => {
            expect((0, ValidationUtils_1.isValidWebsite)('www.expensify.com')).toBe(false);
            expect((0, ValidationUtils_1.isValidWebsite)('expensify.com')).toBe(false);
        });
        test('Invalid URLs with special characters and emojis', () => {
            expect((0, ValidationUtils_1.isValidWebsite)('www.~expensify.com')).toBe(false);
            expect((0, ValidationUtils_1.isValidWebsite)('https://www.expen$ify.com')).toBe(false);
            expect((0, ValidationUtils_1.isValidWebsite)('www.expensify😄.com')).toBe(false);
        });
    });
    describe('ValidateAccountRoute', () => {
        test('Valid account route', () => {
            expect((0, ValidationUtils_1.isValidAccountRoute)(123123)).toBe(true);
            expect((0, ValidationUtils_1.isValidAccountRoute)(5612)).toBe(true);
        });
    });
    describe('ValidatePersonName', () => {
        test('Valid person name', () => {
            expect((0, ValidationUtils_1.isValidPersonName)('test name')).toBe(true);
            expect((0, ValidationUtils_1.isValidPersonName)(`X Æ A test`)).toBe(true);
            expect((0, ValidationUtils_1.isValidPersonName)(`a hyphenated-name`)).toBe(true);
        });
        test('Invalid person name', () => {
            expect((0, ValidationUtils_1.isValidPersonName)('123 test')).toBe(false);
            expect((0, ValidationUtils_1.isValidPersonName)('test #$')).toBe(false);
            expect((0, ValidationUtils_1.isValidPersonName)('test123$')).toBe(false);
        });
    });
    describe('ValidateLegalName', () => {
        test('Valid legal name', () => {
            expect((0, ValidationUtils_1.isValidLegalName)('test name')).toBe(true);
            expect((0, ValidationUtils_1.isValidLegalName)(`X Æ A test`)).toBe(true);
        });
        test('Invalid legal name', () => {
            expect((0, ValidationUtils_1.isValidLegalName)(`a hyphenated-name`)).toBe(false);
            expect((0, ValidationUtils_1.isValidLegalName)('άλφα')).toBe(false);
        });
    });
    describe('isValidPaymentZipCode', () => {
        test('Is valid US zip code format (v1)', () => {
            const validZip = '12345';
            const isValid = (0, ValidationUtils_1.isValidPaymentZipCode)(validZip);
            expect(isValid).toBe(true);
        });
        test('Is valid US zip code format with hyphen (v2)', () => {
            const validZip = '12345-6789';
            const isValid = (0, ValidationUtils_1.isValidPaymentZipCode)(validZip);
            expect(isValid).toBe(true);
        });
        test('Is valid UK zip code format with space (v1)', () => {
            const invalidDate = 'AB1 2CD';
            const isValid = (0, ValidationUtils_1.isValidPaymentZipCode)(invalidDate);
            expect(isValid).toBe(true);
        });
        test('Is valid UK zip code format with space (v2)', () => {
            const invalidDate = 'AB12 3CD';
            const isValid = (0, ValidationUtils_1.isValidPaymentZipCode)(invalidDate);
            expect(isValid).toBe(true);
        });
        test('Is valid UK zip code format (v3)', () => {
            const invalidDate = 'AB12CD';
            const isValid = (0, ValidationUtils_1.isValidPaymentZipCode)(invalidDate);
            expect(isValid).toBe(true);
        });
        test('Is valid AU / NZ zip code format', () => {
            const invalidDate = '1234';
            const isValid = (0, ValidationUtils_1.isValidPaymentZipCode)(invalidDate);
            expect(isValid).toBe(true);
        });
        test('Is invalid zip code (other special characters)', () => {
            const futureDate = "@ , : ; ' &";
            const isValid = (0, ValidationUtils_1.isValidPaymentZipCode)(futureDate);
            expect(isValid).toBe(false);
        });
    });
    describe('isValidInputLength', () => {
        // Test Latin alphabet characters (1 byte each in UTF-8)
        describe('Latin alphabet characters', () => {
            test('returns true and correct byte length when Latin string byte length exceeds limit', () => {
                expect((0, ValidationUtils_1.isValidInputLength)('abc', 2)).toEqual({ isValid: false, byteLength: 3 }); // 3 bytes > 2
            });
            test('returns false and correct byte length when Latin string byte length equals limit', () => {
                expect((0, ValidationUtils_1.isValidInputLength)('abc', 3)).toEqual({ isValid: true, byteLength: 3 }); // 3 bytes ≤ 3
            });
            test('returns false and correct byte length when Latin string byte length is less than limit', () => {
                expect((0, ValidationUtils_1.isValidInputLength)('ab', 3)).toEqual({ isValid: true, byteLength: 2 }); // 2 bytes ≤ 3
            });
        });
        // Test Sanskrit characters (typically 3 bytes each in UTF-8)
        describe('Sanskrit characters', () => {
            test('returns true and correct byte length when Sanskrit string byte length exceeds limit', () => {
                expect((0, ValidationUtils_1.isValidInputLength)('कष', 5)).toEqual({ isValid: false, byteLength: 6 }); // 6 bytes > 5
            });
            test('returns false and correct byte length when Sanskrit string byte length equals limit', () => {
                expect((0, ValidationUtils_1.isValidInputLength)('कष', 6)).toEqual({ isValid: true, byteLength: 6 }); // 6 bytes ≤ 6
            });
            test('returns false and correct byte length when Sanskrit string byte length is less than limit', () => {
                expect((0, ValidationUtils_1.isValidInputLength)('क', 4)).toEqual({ isValid: true, byteLength: 3 }); // 3 bytes ≤ 4
            });
        });
        // Test emojis (typically 4 bytes each in UTF-8)
        describe('Emojis', () => {
            test('returns true and correct byte length when emoji byte length exceeds limit', () => {
                expect((0, ValidationUtils_1.isValidInputLength)('😊', 3)).toEqual({ isValid: false, byteLength: 4 }); // 4 bytes > 3
            });
            test('returns false and correct byte length when emoji byte length equals limit', () => {
                expect((0, ValidationUtils_1.isValidInputLength)('😊', 4)).toEqual({ isValid: true, byteLength: 4 }); // 4 bytes ≤ 4
            });
            test('returns false and correct byte length when emoji byte length is less than limit', () => {
                expect((0, ValidationUtils_1.isValidInputLength)('😊', 5)).toEqual({ isValid: true, byteLength: 4 }); // 4 bytes ≤ 5
            });
        });
        // Test empty strings and spaces
        describe('Empty strings and spaces', () => {
            test('returns false and correct byte length for empty string regardless of limit', () => {
                expect((0, ValidationUtils_1.isValidInputLength)('', 0)).toEqual({ isValid: true, byteLength: 0 }); // 0 bytes ≤ 0
                expect((0, ValidationUtils_1.isValidInputLength)('', 1)).toEqual({ isValid: true, byteLength: 0 }); // 0 bytes ≤ 1
            });
            test('returns true and correct byte length when space string byte length exceeds limit', () => {
                expect((0, ValidationUtils_1.isValidInputLength)('   ', 2)).toEqual({ isValid: false, byteLength: 3 }); // 3 bytes > 2
            });
            test('returns false and correct byte length when space string byte length equals limit', () => {
                expect((0, ValidationUtils_1.isValidInputLength)('  ', 2)).toEqual({ isValid: true, byteLength: 2 }); // 2 bytes ≤ 2
            });
        });
        // Test mixed characters
        describe('Mixed characters', () => {
            test('returns true and correct byte length when mixed string byte length exceeds limit', () => {
                expect((0, ValidationUtils_1.isValidInputLength)('aक😊', 6)).toEqual({ isValid: false, byteLength: 8 }); // 1 + 3 + 4 = 8 bytes > 6
            });
            test('returns false and correct byte length when mixed string byte length equals limit', () => {
                expect((0, ValidationUtils_1.isValidInputLength)('aक😊', 8)).toEqual({ isValid: true, byteLength: 8 }); // 1 + 3 + 4 = 8 bytes ≤ 8
            });
            test('returns false and correct byte length when mixed string byte length is less than limit', () => {
                expect((0, ValidationUtils_1.isValidInputLength)('aक', 5)).toEqual({ isValid: true, byteLength: 4 }); // 1 + 3 = 4 bytes ≤ 5
            });
        });
        // Test edge cases
        describe('Edge cases', () => {
            test('handles negative length parameter', () => {
                expect((0, ValidationUtils_1.isValidInputLength)('abc', -1)).toEqual({ isValid: false, byteLength: 3 }); // 3 bytes > -1
            });
            test('handles zero length parameter', () => {
                expect((0, ValidationUtils_1.isValidInputLength)('a', 0)).toEqual({ isValid: false, byteLength: 1 }); // 1 byte > 0
                expect((0, ValidationUtils_1.isValidInputLength)('', 0)).toEqual({ isValid: true, byteLength: 0 }); // 0 bytes ≤ 0
            });
            test('handles special characters (e.g., newlines, tabs)', () => {
                expect((0, ValidationUtils_1.isValidInputLength)('\n\t', 1)).toEqual({ isValid: false, byteLength: 2 }); // 2 bytes > 1
                expect((0, ValidationUtils_1.isValidInputLength)('\n\t', 2)).toEqual({ isValid: true, byteLength: 2 }); // 2 bytes ≤ 2
            });
        });
    });
    describe('isValidRegistrationNumber', () => {
        describe('EU countries', () => {
            test.each([
                ['AT', 'FN123456', true],
                ['AT', 'FN654321a', true],
                ['AT', '123456', false],
                ['BE', '0123.456.789', true],
                ['BE', '1234.567.890', false],
                ['BG', '123456789', true],
                ['BG', '1234567890123', true],
                ['BG', '12345678', false],
                ['DE', 'HRB12345', true],
                ['DE', 'HRA 6789', true],
                ['DE', 'XYZ123', false],
                ['ES', 'A12345678', true],
                ['ES', 'B87654321', true],
                ['ES', '12345678A', false],
            ])('validates EU country registration number', (country, value, expected) => {
                expect((0, ValidationUtils_1.isValidRegistrationNumber)(value, country)).toBe(expected);
            });
        });
        describe('Non-EU countries', () => {
            test.each([
                ['AU', '51824753556', true],
                ['AU', '004085616', true],
                ['AU', '123456789', false],
                ['AU', '51824753557', false],
                ['GB', '12345678', true],
                ['GB', 'SC123456', true],
                ['GB', 'S1234567', false],
                ['GB', '1234567A', false],
                ['CA', '123456789', true],
                ['CA', '123456789RC0001', true],
                ['CA', '12345678', false],
                ['CA', '123456789XX123', false],
            ])('validates Non-EU country registration number', (country, value, expected) => {
                expect((0, ValidationUtils_1.isValidRegistrationNumber)(value, country)).toBe(expected);
            });
        });
    });
});
