"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const RegistrationNumberStep_1 = require("@components/SubStepForms/RegistrationNumberStep");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const { BUSINESS_REGISTRATION_INCORPORATION_NUMBER, COMPANY_COUNTRY_CODE } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
const STEP_FIELDS = [BUSINESS_REGISTRATION_INCORPORATION_NUMBER];
function RegistrationNumber({ onNext, onMove, isEditing }) {
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true });
    const defaultValue = reimbursementAccount?.achData?.corpay?.[BUSINESS_REGISTRATION_INCORPORATION_NUMBER] ?? '';
    const businessStepCountryDraftValue = reimbursementAccount?.achData?.corpay?.[COMPANY_COUNTRY_CODE] ?? reimbursementAccountDraft?.[COMPANY_COUNTRY_CODE] ?? '';
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<RegistrationNumberStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} onSubmit={handleSubmit} inputID={BUSINESS_REGISTRATION_INCORPORATION_NUMBER} defaultValue={defaultValue} country={businessStepCountryDraftValue} shouldDelayAutoFocus/>);
}
RegistrationNumber.displayName = 'RegistrationNumber';
exports.default = RegistrationNumber;
