"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useExpensifyCardUkEuSupported;
var CardUtils_1 = require("@libs/CardUtils");
var CONST_1 = require("@src/CONST");
var usePermissions_1 = require("./usePermissions");
var usePolicy_1 = require("./usePolicy");
function useExpensifyCardUkEuSupported(policyID) {
    var isBetaEnabled = (0, usePermissions_1.default)().isBetaEnabled;
    var policy = (0, usePolicy_1.default)(policyID);
    return (0, CardUtils_1.isCurrencySupportedForECards)(policy === null || policy === void 0 ? void 0 : policy.outputCurrency) && isBetaEnabled(CONST_1.default.BETAS.EXPENSIFY_CARD_EU_UK);
}
