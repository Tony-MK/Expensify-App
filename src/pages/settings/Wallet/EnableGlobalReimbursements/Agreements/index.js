"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AgreementsFullStep_1 = require("@components/SubStepForms/AgreementsFullStep");
const useOnyx_1 = require("@hooks/useOnyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EnableGlobalReimbursementsForm_1 = require("@src/types/form/EnableGlobalReimbursementsForm");
const inputIDs = {
    provideTruthfulInformation: EnableGlobalReimbursementsForm_1.default.PROVIDE_TRUTHFUL_INFORMATION,
    agreeToTermsAndConditions: EnableGlobalReimbursementsForm_1.default.AGREE_TO_TERMS_AND_CONDITIONS,
    consentToPrivacyNotice: EnableGlobalReimbursementsForm_1.default.CONSENT_TO_PRIVACY_NOTICE,
    authorizedToBindClientToAgreement: EnableGlobalReimbursementsForm_1.default.AUTHORIZED_TO_BIND_CLIENT_TO_AGREEMENT,
};
function Agreements({ onBackButtonPress, onSubmit, currency }) {
    const [enableGlobalReimbursementsDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS_DRAFT, { canBeMissing: true });
    const defaultValues = Object.fromEntries(Object.keys(inputIDs).map((key) => {
        const typedKey = key;
        return [typedKey, enableGlobalReimbursementsDraft?.[typedKey] ?? false];
    }));
    return (<AgreementsFullStep_1.default defaultValues={defaultValues} formID={ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS} inputIDs={inputIDs} isLoading={false} onBackButtonPress={onBackButtonPress} onSubmit={onSubmit} currency={currency} startStepIndex={1} stepNames={CONST_1.default.ENABLE_GLOBAL_REIMBURSEMENTS.STEP_NAMES}/>);
}
Agreements.displayName = 'Agreements';
exports.default = Agreements;
