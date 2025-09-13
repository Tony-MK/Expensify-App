"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useStepFormSubmit;
const react_1 = require("react");
const FormActions = require("@userActions/FormActions");
/**
 * Hook for handling submit method in substeps.
 * When user is in editing mode, we should save values only when user confirms the change
 * @param formId - ID for particular form
 * @param onNext - callback
 * @param fieldIds - field IDs for particular step
 * @param shouldSaveDraft - if we should save draft values
 */
function useStepFormSubmit({ formId, onNext, fieldIds, shouldSaveDraft }) {
    return (0, react_1.useCallback)((values) => {
        if (shouldSaveDraft) {
            const stepValues = fieldIds.reduce((acc, key) => {
                acc[key] = values[key];
                return acc;
            }, {});
            FormActions.setDraftValues(formId, stepValues);
            onNext(stepValues);
            return;
        }
        onNext();
    }, [onNext, formId, fieldIds, shouldSaveDraft]);
}
