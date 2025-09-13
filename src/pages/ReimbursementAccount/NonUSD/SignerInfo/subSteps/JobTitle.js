"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SingleFieldStep_1 = require("@components/SubStepForms/SingleFieldStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const { SIGNER_JOB_TITLE } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
function JobTitle({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const inputID = SIGNER_JOB_TITLE;
    const defaultValue = String(reimbursementAccountDraft?.[inputID] ?? '');
    const validate = (0, react_1.useCallback)((values) => {
        return (0, ValidationUtils_1.getFieldRequiredErrors)(values, [inputID]);
    }, [inputID]);
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: [inputID],
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<SingleFieldStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('signerInfoStep.whatsYourJobTitle')} validate={validate} onSubmit={handleSubmit} inputId={inputID} inputLabel={translate('signerInfoStep.jobTitle')} inputMode={CONST_1.default.INPUT_MODE.TEXT} defaultValue={defaultValue} shouldShowHelpLinks={false}/>);
}
JobTitle.displayName = 'JobTitle';
exports.default = JobTitle;
