"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const RegistrationNumberStep_1 = require("@components/SubStepForms/RegistrationNumberStep");
const useEnableGlobalReimbursementsStepFormSubmit_1 = require("@hooks/useEnableGlobalReimbursementsStepFormSubmit");
const useOnyx_1 = require("@hooks/useOnyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EnableGlobalReimbursementsForm_1 = require("@src/types/form/EnableGlobalReimbursementsForm");
const { BUSINESS_REGISTRATION_INCORPORATION_NUMBER } = EnableGlobalReimbursementsForm_1.default;
const STEP_FIELDS = [BUSINESS_REGISTRATION_INCORPORATION_NUMBER];
function RegistrationNumber({ onNext, onMove, isEditing, country }) {
    const [enableGlobalReimbursementsDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS_DRAFT, { canBeMissing: true });
    const handleSubmit = (0, useEnableGlobalReimbursementsStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<RegistrationNumberStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS} onSubmit={handleSubmit} inputID={BUSINESS_REGISTRATION_INCORPORATION_NUMBER} defaultValue={enableGlobalReimbursementsDraft?.[BUSINESS_REGISTRATION_INCORPORATION_NUMBER] ?? ''} country={country} shouldDelayAutoFocus/>);
}
RegistrationNumber.displayName = 'RegistrationNumber';
exports.default = RegistrationNumber;
