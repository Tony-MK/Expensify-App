"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useEnableGlobalReimbursementsStepFormSubmit;
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var useStepFormSubmit_1 = require("./useStepFormSubmit");
/**
 * Hook for handling submit method in EnterSignerInfo substeps.
 * When user is in editing mode, we should save values only when user confirms the change
 * @param onNext - callback
 * @param fieldIds - field IDs for particular step
 * @param shouldSaveDraft - if we should save draft values
 */
function useEnableGlobalReimbursementsStepFormSubmit(_a) {
    var onNext = _a.onNext, fieldIds = _a.fieldIds, shouldSaveDraft = _a.shouldSaveDraft;
    return (0, useStepFormSubmit_1.default)({
        formId: ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS,
        onNext: onNext,
        fieldIds: fieldIds,
        shouldSaveDraft: shouldSaveDraft,
    });
}
