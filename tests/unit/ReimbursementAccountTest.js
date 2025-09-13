"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("@src/libs/actions/ReimbursementAccount/store");
describe('ReimbursementAccountTest', () => {
    describe('hasCreditBankAccount', () => {
        it('should return true if there is a credit bank account', () => {
            const BANK_ACCOUNT_LIST = {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '1': { accountData: { defaultCredit: true }, bankCurrency: 'USD', bankCountry: 'US' },
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '2': { accountData: { defaultCredit: false }, bankCurrency: 'USD', bankCountry: 'US' },
            };
            const result = (0, store_1.hasCreditBankAccount)(BANK_ACCOUNT_LIST);
            expect(result).toBe(true);
        });
        it('should return false if there is no credit bank account', () => {
            const BANK_ACCOUNT_LIST = {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '1': { accountData: { defaultCredit: false }, bankCurrency: 'USD', bankCountry: 'US' },
            };
            const result = (0, store_1.hasCreditBankAccount)(BANK_ACCOUNT_LIST);
            expect(result).toBe(false);
        });
        it('should return false if there is no bank account list', () => {
            const result = (0, store_1.hasCreditBankAccount)(undefined);
            expect(result).toBe(false);
        });
    });
});
