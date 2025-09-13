"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_onyx_1 = require("react-native-onyx");
var PersonalDetailsUtils_1 = require("@libs/PersonalDetailsUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var TestHelper_1 = require("../../utils/TestHelper");
describe('PersonalDetailsUtils', function () {
    describe('getEffectiveDisplayName', function () {
        test('should return undefined when personalDetail is undefined', function () {
            var result = (0, PersonalDetailsUtils_1.getEffectiveDisplayName)(TestHelper_1.formatPhoneNumber, undefined);
            expect(result).toBeUndefined();
        });
        test('should return undefined when personalDetail has neither login nor displayName', function () {
            var personalDetail = { accountID: 123 };
            var result = (0, PersonalDetailsUtils_1.getEffectiveDisplayName)(TestHelper_1.formatPhoneNumber, personalDetail);
            expect(result).toBeUndefined();
        });
        test('should return displayName when login is empty or null but displayName exists', function () {
            var personalDetail1 = { accountID: 123, displayName: 'John Doe', login: '' };
            var personalDetail2 = { accountID: 456, displayName: 'Jane Smith', login: null }; // Simulate null login
            var result = (0, PersonalDetailsUtils_1.getEffectiveDisplayName)(TestHelper_1.formatPhoneNumber, personalDetail1);
            expect(result).toBe('John Doe');
            result = (0, PersonalDetailsUtils_1.getEffectiveDisplayName)(TestHelper_1.formatPhoneNumber, personalDetail2);
            expect(result).toBe('Jane Smith');
        });
        test('should return login (email) when only login exists (not a phone number)', function () {
            var personalDetail = { accountID: 123, login: 'john.doe@example.com' };
            var result = (0, PersonalDetailsUtils_1.getEffectiveDisplayName)(TestHelper_1.formatPhoneNumber, personalDetail);
            expect(result).toBe('john.doe@example.com');
        });
        test('should return national format for phone login if from the same region (US)', function () {
            var personalDetail = { accountID: 123, login: '+15551234567' };
            var result = (0, PersonalDetailsUtils_1.getEffectiveDisplayName)(TestHelper_1.formatPhoneNumber, personalDetail);
            expect(result).toBe('+1 555-123-4567');
        });
        test('should return international format for phone login if from a different region (GB)', function () {
            var personalDetail = { accountID: 123, login: '+442079460000' };
            var result = (0, PersonalDetailsUtils_1.getEffectiveDisplayName)(TestHelper_1.formatPhoneNumber, personalDetail);
            expect(result).toBe('+44 20 7946 0000');
        });
        test('should return formatted login (email) when both login and displayName exist (login takes precedence)', function () {
            var personalDetail = {
                accountID: 123,
                login: 'john.doe@example.com',
                displayName: 'John Doe Full Name',
            };
            var result = (0, PersonalDetailsUtils_1.getEffectiveDisplayName)(TestHelper_1.formatPhoneNumber, personalDetail);
            expect(result).toBe('john.doe@example.com');
        });
        test('should return formatted login (phone) when both login (same region) and displayName exist', function () {
            var personalDetail = {
                accountID: 123,
                login: '+15551234567',
                displayName: 'John Doe Full Name',
            };
            var result = (0, PersonalDetailsUtils_1.getEffectiveDisplayName)(TestHelper_1.formatPhoneNumber, personalDetail);
            expect(result).toBe('+1 555-123-4567');
        });
        test('should return formatted login (phone) when both login (different region) and displayName exist', function () {
            var personalDetail = {
                accountID: 123,
                login: '+442079460000',
                displayName: 'Jane Smith Full Name',
            };
            var result = (0, PersonalDetailsUtils_1.getEffectiveDisplayName)(TestHelper_1.formatPhoneNumber, personalDetail);
            expect(result).toBe('+44 20 7946 0000');
        });
        test('should correctly handle login with SMS domain', function () {
            var personalDetail = {
                accountID: 123,
                login: "+18005550000",
                displayName: 'SMS User',
            };
            var result = (0, PersonalDetailsUtils_1.getEffectiveDisplayName)(TestHelper_1.formatPhoneNumber, personalDetail);
            expect(result).toBe('(800) 555-0000');
        });
        test('should fall back to displayName if formatted login is an empty string and displayName exists', function () {
            var personalDetail = { accountID: 123, login: '', displayName: 'Fallback Name' };
            var result = (0, PersonalDetailsUtils_1.getEffectiveDisplayName)(TestHelper_1.formatPhoneNumber, personalDetail);
            expect(result).toBe('Fallback Name');
        });
    });
    describe('getPersonalDetailsOnyxDataForOptimisticUsers', function () {
        test('should return correct optimistic and finally data', function () {
            var newLogins = ['3322076524', 'test2@test.com', '+14185438090'];
            var newAccountIDs = [1, 2, 3];
            var result = (0, PersonalDetailsUtils_1.getPersonalDetailsOnyxDataForOptimisticUsers)(newLogins, newAccountIDs, TestHelper_1.formatPhoneNumber);
            var expected = {
                optimisticData: [
                    {
                        key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                        onyxMethod: 'merge',
                        value: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            '1': {
                                accountID: 1,
                                displayName: '3322076524',
                                isOptimisticPersonalDetail: true,
                                login: '3322076524',
                            },
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            '2': {
                                accountID: 2,
                                displayName: 'test2@test.com',
                                isOptimisticPersonalDetail: true,
                                login: 'test2@test.com',
                            },
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            '3': {
                                accountID: 3,
                                displayName: '(418) 543-8090',
                                isOptimisticPersonalDetail: true,
                                login: '+14185438090',
                            },
                        },
                    },
                ],
                finallyData: [
                    {
                        key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
                        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                        value: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            '1': null,
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            '2': null,
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            '3': null,
                        },
                    },
                ],
            };
            expect(result).toEqual(expected);
        });
    });
    describe('createDisplayName', function () {
        test('should return full name when firstName and lastName are both non-empty', function () {
            var login = 'test@example.com';
            var personalDetails = { firstName: 'John', lastName: 'Doe' };
            var result = (0, PersonalDetailsUtils_1.createDisplayName)(login, personalDetails, TestHelper_1.formatPhoneNumber);
            expect(result).toBe('John Doe');
        });
        // Scenario 2.2: Only firstName is present
        test('should return firstName when only firstName is present (lastName is empty string)', function () {
            var login = 'test@example.com';
            var personalDetails = { firstName: 'Jane', lastName: '' };
            var result = (0, PersonalDetailsUtils_1.createDisplayName)(login, personalDetails, TestHelper_1.formatPhoneNumber);
            expect(result).toBe('Jane');
        });
        test('should return firstName when only firstName is present (lastName is undefined)', function () {
            var login = 'test@example.com';
            var personalDetails = { firstName: 'Jane', lastName: undefined };
            var result = (0, PersonalDetailsUtils_1.createDisplayName)(login, personalDetails, TestHelper_1.formatPhoneNumber);
            expect(result).toBe('Jane');
        });
        test('should return firstName when only firstName is present (lastName is null)', function () {
            var login = 'test@example.com';
            var personalDetails = { firstName: 'Jane', lastName: undefined };
            var result = (0, PersonalDetailsUtils_1.createDisplayName)(login, personalDetails, TestHelper_1.formatPhoneNumber);
            expect(result).toBe('Jane');
        });
        // Scenario 2.3: Only lastName is present
        test('should return lastName when only lastName is present (firstName is empty string)', function () {
            var login = 'test@example.com';
            var personalDetails = { firstName: '', lastName: 'Smith' };
            var result = (0, PersonalDetailsUtils_1.createDisplayName)(login, personalDetails, TestHelper_1.formatPhoneNumber);
            expect(result).toBe('Smith');
        });
        test('should return lastName when only lastName is present (firstName is undefined)', function () {
            var login = 'test@example.com';
            var personalDetails = { firstName: undefined, lastName: 'Smith' };
            var result = (0, PersonalDetailsUtils_1.createDisplayName)(login, personalDetails, TestHelper_1.formatPhoneNumber);
            expect(result).toBe('Smith');
        });
        test('should return lastName when only lastName is present (firstName is null)', function () {
            var login = 'test@example.com';
            var personalDetails = { firstName: undefined, lastName: 'Smith' };
            var result = (0, PersonalDetailsUtils_1.createDisplayName)(login, personalDetails, TestHelper_1.formatPhoneNumber);
            expect(result).toBe('Smith');
        });
        // Scenario 2.4: Neither firstName nor lastName is present (empty, null, or undefined)
        test('should fall back to formatted login when firstName and lastName are empty strings', function () {
            var login = 'user@example.com';
            var personalDetails = { firstName: '', lastName: '' };
            var result = (0, PersonalDetailsUtils_1.createDisplayName)(login, personalDetails, TestHelper_1.formatPhoneNumber);
            expect(result).toBe(login);
        });
        test('should fall back to formatted login when firstName and lastName are null', function () {
            var login = 'another@example.com';
            var personalDetails = { firstName: undefined, lastName: undefined };
            var result = (0, PersonalDetailsUtils_1.createDisplayName)(login, personalDetails, TestHelper_1.formatPhoneNumber);
            expect(result).toBe(login);
        });
        test('should fall back to formatted login when firstName and lastName are undefined', function () {
            var login = '+442079460000'; // Use an international number to verify formatting fallback
            var personalDetails = { firstName: undefined, lastName: undefined };
            var result = (0, PersonalDetailsUtils_1.createDisplayName)(login, personalDetails, TestHelper_1.formatPhoneNumber);
            expect(result).toBe('+44 20 7946 0000'); // Expect international phone number to be formatted
        });
        test('should fall back to formatted SMS login when firstName and lastName are empty', function () {
            var login = '+18005550000@expensify.sms';
            var personalDetails = { firstName: '', lastName: '' };
            var result = (0, PersonalDetailsUtils_1.createDisplayName)(login, personalDetails, TestHelper_1.formatPhoneNumber);
            expect(result).toBe('(800) 555-0000');
        });
        test('should trim leading/trailing spaces from a single name component', function () {
            var login = 'test@example.com';
            var personalDetails = { firstName: '  SingleName  ', lastName: '' };
            var result = (0, PersonalDetailsUtils_1.createDisplayName)(login, personalDetails, TestHelper_1.formatPhoneNumber);
            expect(result).toBe('SingleName');
        });
        test('should correctly handle spaces when one name component is empty', function () {
            var login = 'test@example.com';
            var personalDetails = { firstName: '', lastName: '  Last  ' };
            var result = (0, PersonalDetailsUtils_1.createDisplayName)(login, personalDetails, TestHelper_1.formatPhoneNumber);
            expect(result).toBe('Last');
        });
        test('should return formatted email login when passedPersonalDetails is null', function () {
            var login = 'test@example.com';
            var result = (0, PersonalDetailsUtils_1.createDisplayName)(login, null, TestHelper_1.formatPhoneNumber);
            // Expect email to remain unchanged by formatPhoneNumber
            expect(result).toBe(login);
        });
        test('should return formatted US phone login when passedPersonalDetails is undefined', function () {
            var login = '+15551234567';
            var result = (0, PersonalDetailsUtils_1.createDisplayName)(login, undefined, TestHelper_1.formatPhoneNumber);
            // Expect US phone number to be formatted based on country code
            expect(result).toBe('+1 555-123-4567');
        });
        test('should return formatted international phone login when passedPersonalDetails is undefined', function () {
            var login = '+442079460000'; // UK number
            var result = (0, PersonalDetailsUtils_1.createDisplayName)(login, undefined, TestHelper_1.formatPhoneNumber);
            expect(result).toBe('+44 20 7946 0000');
        });
        test('should return formatted SMS login (stripped of suffix) when passedPersonalDetails is null', function () {
            var login = '+18005550000@expensify.sms';
            var result = (0, PersonalDetailsUtils_1.createDisplayName)(login, null, TestHelper_1.formatPhoneNumber);
            // This test assumes `formatPhoneNumber` correctly strips the `@expensify.sms` suffix
            // and formats the remaining phone number, as implied by the function's internal comment.
            expect(result).toBe('(800) 555-0000');
        });
    });
});
