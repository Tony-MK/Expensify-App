"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
const PaymentUtils_1 = require("@src/libs/PaymentUtils");
describe('PaymentUtils', () => {
    it('Test rounding wallet transfer instant fee', () => {
        expect((0, PaymentUtils_1.calculateWalletTransferBalanceFee)(2100, CONST_1.default.WALLET.TRANSFER_METHOD_TYPE.INSTANT)).toBe(32);
    });
});
