"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
/**
 * Returns the initial subStep for the Bank info step based on already existing data
 */
function getInitialSubStepForBusinessInfoStep(data, corpayFields) {
    if (!corpayFields?.formFields) {
        return 0;
    }
    const isFieldInvalidOrMissing = (field) => {
        const fieldID = field.id;
        const value = data?.[fieldID];
        if (value === '' || value === null || value === undefined) {
            return true;
        }
        if (field.validationRules && field.validationRules.length > 0) {
            const strValue = String(value);
            return field.validationRules.some((rule) => {
                if (!rule.regEx) {
                    return false;
                }
                const regex = new RegExp(rule.regEx);
                return !regex.test(strValue);
            });
        }
        return false;
    };
    const bankAccountDetailsFields = corpayFields.formFields.filter((field) => !field.id.includes(CONST_1.default.NON_USD_BANK_ACCOUNT.BANK_INFO_STEP_ACCOUNT_HOLDER_KEY_PREFIX));
    const accountHolderDetailsFields = corpayFields.formFields.filter((field) => field.id.includes(CONST_1.default.NON_USD_BANK_ACCOUNT.BANK_INFO_STEP_ACCOUNT_HOLDER_KEY_PREFIX));
    const hasInvalidBankAccountDetails = bankAccountDetailsFields.some(isFieldInvalidOrMissing);
    const hasInvalidAccountHolderDetails = accountHolderDetailsFields.some(isFieldInvalidOrMissing);
    if (hasInvalidBankAccountDetails) {
        return 0;
    }
    if (hasInvalidAccountHolderDetails) {
        return 1;
    }
    return 2;
}
exports.default = getInitialSubStepForBusinessInfoStep;
