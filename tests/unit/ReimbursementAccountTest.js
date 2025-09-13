"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store_1 = require("@src/libs/actions/ReimbursementAccount/store");
describe('ReimbursementAccountTest', function () {
    describe('hasCreditBankAccount', function () {
        it('should return true if there is a credit bank account', function () {
            var BANK_ACCOUNT_LIST = {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '1': { accountData: { defaultCredit: true }, bankCurrency: 'USD', bankCountry: 'US' },
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '2': { accountData: { defaultCredit: false }, bankCurrency: 'USD', bankCountry: 'US' },
            };
            var result = (0, store_1.hasCreditBankAccount)(BANK_ACCOUNT_LIST);
            expect(result).toBe(true);
        });
        it('should return false if there is no credit bank account', function () {
            var BANK_ACCOUNT_LIST = {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '1': { accountData: { defaultCredit: false }, bankCurrency: 'USD', bankCountry: 'US' },
            };
            var result = (0, store_1.hasCreditBankAccount)(BANK_ACCOUNT_LIST);
            expect(result).toBe(false);
        });
        it('should return false if there is no bank account list', function () {
            var result = (0, store_1.hasCreditBankAccount)(undefined);
            expect(result).toBe(false);
        });
    });
});
