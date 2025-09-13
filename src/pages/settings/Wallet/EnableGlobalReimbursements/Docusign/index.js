"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DocusignFullStep_1 = require("@components/SubStepForms/DocusignFullStep");
const useOnyx_1 = require("@hooks/useOnyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EnableGlobalReimbursementsForm_1 = require("@src/types/form/EnableGlobalReimbursementsForm");
function Docusign({ onBackButtonPress, onSubmit, currency }) {
    const [enableGlobalReimbursements] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS, { canBeMissing: true });
    const [enableGlobalReimbursementsDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS_DRAFT, { canBeMissing: true });
    const defaultValue = enableGlobalReimbursementsDraft?.[EnableGlobalReimbursementsForm_1.default.ACH_AUTHORIZATION_FORM] ?? [];
    return (<DocusignFullStep_1.default defaultValue={defaultValue} formID={ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS} inputID={EnableGlobalReimbursementsForm_1.default.ACH_AUTHORIZATION_FORM} isLoading={enableGlobalReimbursements?.isEnablingGlobalReimbursements ?? false} onBackButtonPress={onBackButtonPress} onSubmit={onSubmit} currency={currency} startStepIndex={2} stepNames={CONST_1.default.ENABLE_GLOBAL_REIMBURSEMENTS.STEP_NAMES}/>);
}
Docusign.displayName = 'Docusign';
exports.default = Docusign;
