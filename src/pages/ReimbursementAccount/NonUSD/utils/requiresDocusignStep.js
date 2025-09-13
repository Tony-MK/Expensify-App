"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CONST_1 = require("@src/CONST");
/**
 * Checks whether passed currency requires an additional step where we ask for signed form
 * @param currency
 */
function requiresDocusignStep(currency) {
    switch (currency) {
        case CONST_1.default.CURRENCY.USD:
        case CONST_1.default.CURRENCY.CAD:
        case CONST_1.default.CURRENCY.AUD:
            return true;
        default:
            return false;
    }
}
exports.default = requiresDocusignStep;
