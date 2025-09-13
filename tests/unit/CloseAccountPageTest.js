"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const LoginUtils_1 = require("@libs/LoginUtils");
const sanitizePhoneOrEmail = (value) => value.replace(/\s/g, '').toLowerCase();
const validatePhoneOrEmail = (inputValue, storedValue, translate) => {
    const errors = {};
    if (inputValue && storedValue) {
        let isValid = false;
        if (expensify_common_1.Str.isValidEmail(storedValue)) {
            isValid = sanitizePhoneOrEmail(storedValue) === sanitizePhoneOrEmail(inputValue);
        }
        else {
            const normalizedStored = (0, LoginUtils_1.formatE164PhoneNumber)((0, LoginUtils_1.getPhoneNumberWithoutSpecialChars)(storedValue)) ?? '';
            const normalizedInput = (0, LoginUtils_1.formatE164PhoneNumber)((0, LoginUtils_1.getPhoneNumberWithoutSpecialChars)(inputValue)) ?? '';
            isValid = normalizedStored === normalizedInput;
        }
        if (!isValid) {
            errors.phoneOrEmail = translate('closeAccountPage.enterYourDefaultContactMethod');
        }
    }
    return errors;
};
describe('CloseAccountPage Validation', () => {
    const mockTranslate = () => 'Please enter your default contact method';
    describe('Phone Number Validation', () => {
        it('Should validate matching phone numbers in different formats', () => {
            const storedPhone = '+1 (234) 567-8901';
            const testCases = ['+1 (234) 567-8901', '+12345678901', '+1 234 567 8901'];
            testCases.forEach((inputPhone) => {
                const errors = validatePhoneOrEmail(inputPhone, storedPhone, mockTranslate);
                expect(errors.phoneOrEmail).toBeUndefined();
            });
        });
        it('Should reject non-matching phone numbers', () => {
            const storedPhone = '+1 (234) 567-8901';
            const wrongNumbers = ['+1 (234) 567-8902', '+1 (555) 123-4567', '+44 20 8759 9036'];
            wrongNumbers.forEach((inputPhone) => {
                const errors = validatePhoneOrEmail(inputPhone, storedPhone, mockTranslate);
                expect(errors.phoneOrEmail).toBe('Please enter your default contact method');
            });
        });
        it('Should handle international phone numbers', () => {
            const storedPhone = '+44 20 8759 9036';
            const validInputs = ['+44 20 8759 9036', '+442087599036', '44 20 8759 9036'];
            validInputs.forEach((inputPhone) => {
                const errors = validatePhoneOrEmail(inputPhone, storedPhone, mockTranslate);
                expect(errors.phoneOrEmail).toBeUndefined();
            });
        });
    });
    describe('Email Validation', () => {
        it('Should validate matching emails with different casing and spacing', () => {
            const storedEmail = 'user@example.com';
            const testCases = ['user@example.com', 'USER@EXAMPLE.COM', ' user@example.com ', 'User@Example.Com'];
            testCases.forEach((inputEmail) => {
                const errors = validatePhoneOrEmail(inputEmail, storedEmail, mockTranslate);
                expect(errors.phoneOrEmail).toBeUndefined();
            });
        });
        it('Should reject non-matching emails', () => {
            const storedEmail = 'user@example.com';
            const wrongEmails = ['different@example.com', 'user@different.com', 'user@example.net'];
            wrongEmails.forEach((inputEmail) => {
                const errors = validatePhoneOrEmail(inputEmail, storedEmail, mockTranslate);
                expect(errors.phoneOrEmail).toBe('Please enter your default contact method');
            });
        });
    });
    describe('Mixed Validation', () => {
        it('Should reject phone input when stored value is email', () => {
            const storedEmail = 'user@example.com';
            const phoneInput = '+1 (234) 567-8901';
            const errors = validatePhoneOrEmail(phoneInput, storedEmail, mockTranslate);
            expect(errors.phoneOrEmail).toBe('Please enter your default contact method');
        });
        it('Should reject email input when stored value is phone', () => {
            const storedPhone = '+1 (234) 567-8901';
            const emailInput = 'user@example.com';
            const errors = validatePhoneOrEmail(emailInput, storedPhone, mockTranslate);
            expect(errors.phoneOrEmail).toBe('Please enter your default contact method');
        });
    });
    describe('Edge Cases', () => {
        it('Should handle empty inputs', () => {
            const errors = validatePhoneOrEmail('', 'user@example.com', mockTranslate);
            expect(errors.phoneOrEmail).toBeUndefined();
        });
        it('Should handle invalid phone number formats', () => {
            const storedPhone = '+1 (234) 567-8901';
            const invalidInputs = ['invalid-phone', '123', 'not-a-number'];
            invalidInputs.forEach((inputPhone) => {
                const errors = validatePhoneOrEmail(inputPhone, storedPhone, mockTranslate);
                expect(errors.phoneOrEmail).toBe('Please enter your default contact method');
            });
        });
    });
});
