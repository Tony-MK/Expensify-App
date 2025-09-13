"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useExpensifyCardUkEuSupported;
const CardUtils_1 = require("@libs/CardUtils");
const CONST_1 = require("@src/CONST");
const usePermissions_1 = require("./usePermissions");
const usePolicy_1 = require("./usePolicy");
function useExpensifyCardUkEuSupported(policyID) {
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const policy = (0, usePolicy_1.default)(policyID);
    return (0, CardUtils_1.isCurrencySupportedForECards)(policy?.outputCurrency) && isBetaEnabled(CONST_1.default.BETAS.EXPENSIFY_CARD_EU_UK);
}
