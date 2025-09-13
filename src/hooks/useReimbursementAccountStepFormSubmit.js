"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useReimbursementAccountStepFormSubmit;
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useStepFormSubmit_1 = require("./useStepFormSubmit");
/**
 * Hook for handling submit method in ReimbursementAccount substeps.
 * When user is in editing mode, we should save values only when user confirms the change
 * @param onNext - callback
 * @param fieldIds - field IDs for particular step
 * @param shouldSaveDraft - if we should save draft values
 */
function useReimbursementAccountStepFormSubmit({ onNext, fieldIds, shouldSaveDraft }) {
    return (0, useStepFormSubmit_1.default)({
        formId: ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM,
        onNext,
        fieldIds,
        shouldSaveDraft,
    });
}
