"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DateOfBirthStep_1 = require("@components/SubStepForms/DateOfBirthStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const DOB = CONST_1.default.BANK_ACCOUNT.BENEFICIAL_OWNER_INFO_STEP.BENEFICIAL_OWNER_DATA.DOB;
const BENEFICIAL_OWNER_PREFIX = CONST_1.default.BANK_ACCOUNT.BENEFICIAL_OWNER_INFO_STEP.BENEFICIAL_OWNER_DATA.PREFIX;
function DateOfBirthUBO({ onNext, onMove, isEditing, beneficialOwnerBeingModifiedID }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const dobInputID = `${BENEFICIAL_OWNER_PREFIX}_${beneficialOwnerBeingModifiedID}_${DOB}`;
    const dobDefaultValue = String(reimbursementAccountDraft?.[dobInputID] ?? '');
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: [dobInputID],
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<DateOfBirthStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('beneficialOwnerInfoStep.enterTheDateOfBirthOfTheOwner')} onSubmit={handleSubmit} stepFields={[dobInputID]} dobInputID={dobInputID} dobDefaultValue={dobDefaultValue}/>);
}
DateOfBirthUBO.displayName = 'DateOfBirthUBO';
exports.default = DateOfBirthUBO;
