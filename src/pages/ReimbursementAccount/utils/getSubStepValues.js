"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
function getSubStepValues(inputKeys, reimbursementAccountDraft, reimbursementAccount) {
    return Object.entries(inputKeys).reduce((acc, [, value]) => {
        acc[value] = (reimbursementAccountDraft?.[value] ??
            reimbursementAccount?.achData?.[value] ??
            reimbursementAccount?.achData?.corpay?.[value] ??
            (value === ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.ACH_AUTHORIZATION_FORM ? [] : ''));
        return acc;
    }, {});
}
exports.default = getSubStepValues;
