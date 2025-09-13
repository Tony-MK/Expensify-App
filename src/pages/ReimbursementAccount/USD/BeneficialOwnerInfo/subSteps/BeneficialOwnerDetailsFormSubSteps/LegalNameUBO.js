"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullNameStep_1 = require("@components/SubStepForms/FullNameStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const { FIRST_NAME, LAST_NAME } = CONST_1.default.BANK_ACCOUNT.BENEFICIAL_OWNER_INFO_STEP.BENEFICIAL_OWNER_DATA;
const BENEFICIAL_OWNER_PREFIX = CONST_1.default.BANK_ACCOUNT.BENEFICIAL_OWNER_INFO_STEP.BENEFICIAL_OWNER_DATA.PREFIX;
function LegalNameUBO({ onNext, onMove, isEditing, beneficialOwnerBeingModifiedID }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const firstNameInputID = `${BENEFICIAL_OWNER_PREFIX}_${beneficialOwnerBeingModifiedID}_${FIRST_NAME}`;
    const lastNameInputID = `${BENEFICIAL_OWNER_PREFIX}_${beneficialOwnerBeingModifiedID}_${LAST_NAME}`;
    const stepFields = [firstNameInputID, lastNameInputID];
    const defaultValues = {
        firstName: String(reimbursementAccountDraft?.[firstNameInputID] ?? ''),
        lastName: String(reimbursementAccountDraft?.[lastNameInputID] ?? ''),
    };
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: stepFields,
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<FullNameStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('beneficialOwnerInfoStep.enterLegalFirstAndLastName')} onSubmit={handleSubmit} stepFields={stepFields} firstNameInputID={firstNameInputID} lastNameInputID={lastNameInputID} defaultValues={defaultValues}/>);
}
LegalNameUBO.displayName = 'LegalNameUBO';
exports.default = LegalNameUBO;
