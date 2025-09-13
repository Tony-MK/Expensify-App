"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shouldRenderTransferOwnerButton_1 = require("@libs/shouldRenderTransferOwnerButton");
describe('shouldRenderTransferOwnerButton', function () {
    it('should return true if the user has debit card funds', function () {
        var FUND_LIST = {
            defaultCard: {
                isDefault: true,
                accountData: {
                    cardYear: new Date().getFullYear(),
                    cardMonth: new Date().getMonth() + 1,
                    additionalData: {
                        isBillingCard: true,
                    },
                },
            },
        };
        // eslint-disable-next-line testing-library/render-result-naming-convention
        var result = (0, shouldRenderTransferOwnerButton_1.default)(FUND_LIST);
        expect(result).toBe(true);
    });
    it('should return false if fund list is empty', function () {
        var FUND_LIST = {};
        // eslint-disable-next-line testing-library/render-result-naming-convention
        var result = (0, shouldRenderTransferOwnerButton_1.default)(FUND_LIST);
        expect(result).toBe(false);
    });
});
