"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useCurrencyForExpensifyCard;
const CONST_1 = require("@src/CONST");
const useExpensifyCardUkEuSupported_1 = require("./useExpensifyCardUkEuSupported");
const usePolicy_1 = require("./usePolicy");
function useCurrencyForExpensifyCard({ policyID }) {
    const policy = (0, usePolicy_1.default)(policyID);
    const isUkEuCurrencySupported = (0, useExpensifyCardUkEuSupported_1.default)(policyID);
    return isUkEuCurrencySupported ? policy?.outputCurrency : CONST_1.default.CURRENCY.USD;
}
