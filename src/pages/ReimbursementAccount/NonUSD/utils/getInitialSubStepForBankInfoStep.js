"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CONST_1 = require("@src/CONST");
/**
 * Returns the initial subStep for the Bank info step based on already existing data
 */
function getInitialSubStepForBusinessInfoStep(data, corpayFields) {
    if (!(corpayFields === null || corpayFields === void 0 ? void 0 : corpayFields.formFields)) {
        return 0;
    }
    var isFieldInvalidOrMissing = function (field) {
        var fieldID = field.id;
        var value = data === null || data === void 0 ? void 0 : data[fieldID];
        if (value === '' || value === null || value === undefined) {
            return true;
        }
        if (field.validationRules && field.validationRules.length > 0) {
            var strValue_1 = String(value);
            return field.validationRules.some(function (rule) {
                if (!rule.regEx) {
                    return false;
                }
                var regex = new RegExp(rule.regEx);
                return !regex.test(strValue_1);
            });
        }
        return false;
    };
    var bankAccountDetailsFields = corpayFields.formFields.filter(function (field) { return !field.id.includes(CONST_1.default.NON_USD_BANK_ACCOUNT.BANK_INFO_STEP_ACCOUNT_HOLDER_KEY_PREFIX); });
    var accountHolderDetailsFields = corpayFields.formFields.filter(function (field) { return field.id.includes(CONST_1.default.NON_USD_BANK_ACCOUNT.BANK_INFO_STEP_ACCOUNT_HOLDER_KEY_PREFIX); });
    var hasInvalidBankAccountDetails = bankAccountDetailsFields.some(isFieldInvalidOrMissing);
    var hasInvalidAccountHolderDetails = accountHolderDetailsFields.some(isFieldInvalidOrMissing);
    if (hasInvalidBankAccountDetails) {
        return 0;
    }
    if (hasInvalidAccountHolderDetails) {
        return 1;
    }
    return 2;
}
exports.default = getInitialSubStepForBusinessInfoStep;
