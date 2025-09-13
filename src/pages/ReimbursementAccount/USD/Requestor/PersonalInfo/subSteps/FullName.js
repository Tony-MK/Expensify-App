"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullNameStep_1 = require("@components/SubStepForms/FullNameStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const PERSONAL_INFO_STEP_KEY = ReimbursementAccountForm_1.default.PERSONAL_INFO_STEP;
const STEP_FIELDS = [PERSONAL_INFO_STEP_KEY.FIRST_NAME, PERSONAL_INFO_STEP_KEY.LAST_NAME];
function FullName({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT);
    const defaultValues = {
        firstName: reimbursementAccount?.achData?.[PERSONAL_INFO_STEP_KEY.FIRST_NAME] ?? '',
        lastName: reimbursementAccount?.achData?.[PERSONAL_INFO_STEP_KEY.LAST_NAME] ?? '',
    };
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<FullNameStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('personalInfoStep.enterYourLegalFirstAndLast')} onSubmit={handleSubmit} stepFields={STEP_FIELDS} firstNameInputID={PERSONAL_INFO_STEP_KEY.FIRST_NAME} lastNameInputID={PERSONAL_INFO_STEP_KEY.LAST_NAME} defaultValues={defaultValues}/>);
}
FullName.displayName = 'FullName';
exports.default = FullName;
