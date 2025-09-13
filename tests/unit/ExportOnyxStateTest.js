"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@libs/ExportOnyxState/common");
describe('maskOnyxState', () => {
    const mockSession = {
        authToken: 'sensitive-auth-token',
        encryptedAuthToken: 'sensitive-encrypted-token',
        email: 'user@example.com',
        accountID: 12345,
    };
    it('should mask session details by default', () => {
        const input = { session: mockSession };
        const result = (0, common_1.maskOnyxState)(input);
        expect(result.session.authToken).toBe('***');
        expect(result.session.encryptedAuthToken).toBe('***');
    });
    it('should not mask fragile data when isMaskingFragileDataEnabled is false', () => {
        const input = {
            session: mockSession,
        };
        const result = (0, common_1.maskOnyxState)(input);
        expect(result.session.authToken).toBe('***');
        expect(result.session.encryptedAuthToken).toBe('***');
        expect(result.session.email).toBe('user@example.com');
    });
    it('should mask fragile data when isMaskingFragileDataEnabled is true', () => {
        const input = {
            session: mockSession,
        };
        const result = (0, common_1.maskOnyxState)(input, true);
        expect(result.session.authToken).toBe('***');
        expect(result.session.encryptedAuthToken).toBe('***');
    });
    it('should mask emails as a string value in property with a random email', () => {
        const input = {
            session: mockSession,
        };
        const result = (0, common_1.maskOnyxState)(input);
        expect(result.session.email).toMatch(common_1.emailRegex);
    });
    it('should mask array of emails with random emails', () => {
        const input = {
            session: mockSession,
            emails: ['user@example.com', 'user2@example.com'],
        };
        const result = (0, common_1.maskOnyxState)(input, true);
        expect(result.emails.at(0)).toMatch(common_1.emailRegex);
        expect(result.emails.at(1)).toMatch(common_1.emailRegex);
    });
    it('should mask emails in keys of objects', () => {
        const input = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'user@example.com': 'value',
            session: mockSession,
        };
        const result = (0, common_1.maskOnyxState)(input, true);
        expect(Object.keys(result).at(0)).toMatch(common_1.emailRegex);
    });
    it('should mask emails that are part of a string', () => {
        const input = {
            session: mockSession,
            emailString: 'user@example.com is a test string',
        };
        const result = (0, common_1.maskOnyxState)(input, true);
        expect(result.emailString).not.toContain('user@example.com');
    });
    it('should mask keys that are in the fixed list', () => {
        const input = {
            session: mockSession,
            edits: ['hey', 'hi'],
            lastMessageHtml: 'hey',
        };
        const result = (0, common_1.maskOnyxState)(input, true);
        expect(result.edits).toEqual(['***', '***']);
        expect(result.lastMessageHtml).not.toEqual(input.lastMessageHtml);
    });
});
