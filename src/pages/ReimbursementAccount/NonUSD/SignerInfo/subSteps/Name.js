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
const { SIGNER_FULL_NAME } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
function Name({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const inputID = SIGNER_FULL_NAME;
    const defaultValue = String(reimbursementAccountDraft?.[inputID] ?? '');
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [inputID]);
        if (values[inputID] && !(0, ValidationUtils_1.isValidLegalName)(String(values[inputID]))) {
            errors[inputID] = translate('bankAccount.error.fullName');
        }
        return errors;
    }, [inputID, translate]);
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: [inputID],
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<SingleFieldStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('signerInfoStep.whatsYourName')} validate={validate} onSubmit={handleSubmit} inputId={inputID} inputLabel={translate('signerInfoStep.fullName')} inputMode={CONST_1.default.INPUT_MODE.TEXT} defaultValue={defaultValue} shouldShowHelpLinks={false}/>);
}
Name.displayName = 'Name';
exports.default = Name;
