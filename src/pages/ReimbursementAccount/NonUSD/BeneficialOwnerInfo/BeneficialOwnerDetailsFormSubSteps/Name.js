"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullNameStep_1 = require("@components/SubStepForms/FullNameStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const { FIRST_NAME, LAST_NAME, PREFIX } = CONST_1.default.NON_USD_BANK_ACCOUNT.BENEFICIAL_OWNER_INFO_STEP.BENEFICIAL_OWNER_DATA;
function Name({ onNext, isEditing, onMove, isUserEnteringHisOwnData, ownerBeingModifiedID }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const firstNameInputID = `${PREFIX}_${ownerBeingModifiedID}_${FIRST_NAME}`;
    const lastNameInputID = `${PREFIX}_${ownerBeingModifiedID}_${LAST_NAME}`;
    const stepFields = (0, react_1.useMemo)(() => [firstNameInputID, lastNameInputID], [firstNameInputID, lastNameInputID]);
    const formTitle = translate(isUserEnteringHisOwnData ? 'ownershipInfoStep.whatsYourName' : 'ownershipInfoStep.whatsTheOwnersName');
    const defaultValues = {
        firstName: String(reimbursementAccountDraft?.[firstNameInputID] ?? ''),
        lastName: String(reimbursementAccountDraft?.[lastNameInputID] ?? ''),
    };
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: stepFields,
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<FullNameStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={formTitle} onSubmit={handleSubmit} stepFields={stepFields} firstNameInputID={firstNameInputID} lastNameInputID={lastNameInputID} defaultValues={defaultValues} shouldShowHelpLinks={false}/>);
}
Name.displayName = 'Name';
exports.default = Name;
