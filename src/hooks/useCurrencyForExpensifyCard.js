"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useCurrencyForExpensifyCard;
var CONST_1 = require("@src/CONST");
var useExpensifyCardUkEuSupported_1 = require("./useExpensifyCardUkEuSupported");
var usePolicy_1 = require("./usePolicy");
function useCurrencyForExpensifyCard(_a) {
    var policyID = _a.policyID;
    var policy = (0, usePolicy_1.default)(policyID);
    var isUkEuCurrencySupported = (0, useExpensifyCardUkEuSupported_1.default)(policyID);
    return isUkEuCurrencySupported ? policy === null || policy === void 0 ? void 0 : policy.outputCurrency : CONST_1.default.CURRENCY.USD;
}
