"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DocusignFullStep_1 = require("@components/SubStepForms/DocusignFullStep");
const useOnyx_1 = require("@hooks/useOnyx");
const getSubStepValues_1 = require("@pages/ReimbursementAccount/utils/getSubStepValues");
const BankAccounts_1 = require("@userActions/BankAccounts");
const FormActions_1 = require("@userActions/FormActions");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const INPUT_KEYS = {
    PROVIDE_TRUTHFUL_INFORMATION: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.PROVIDE_TRUTHFUL_INFORMATION,
    AGREE_TO_TERMS_AND_CONDITIONS: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.AGREE_TO_TERMS_AND_CONDITIONS,
    CONSENT_TO_PRIVACY_NOTICE: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.CONSENT_TO_PRIVACY_NOTICE,
    AUTHORIZED_TO_BIND_CLIENT_TO_AGREEMENT: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.AUTHORIZED_TO_BIND_CLIENT_TO_AGREEMENT,
    ACH_AUTHORIZATION_FORM: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.ACH_AUTHORIZATION_FORM,
};
function Docusign({ onBackButtonPress, onSubmit, stepNames, policyCurrency }) {
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: false });
    const finalStepValues = (0, react_1.useMemo)(() => (0, getSubStepValues_1.default)(INPUT_KEYS, reimbursementAccountDraft, reimbursementAccount), [reimbursementAccount, reimbursementAccountDraft]);
    const bankAccountID = reimbursementAccount?.achData?.bankAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const submit = () => {
        (0, BankAccounts_1.finishCorpayBankAccountOnboarding)({
            inputs: JSON.stringify({
                provideTruthfulInformation: finalStepValues.provideTruthfulInformation,
                agreeToTermsAndConditions: finalStepValues.agreeToTermsAndConditions,
                consentToPrivacyNotice: finalStepValues.consentToPrivacyNotice,
                authorizedToBindClientToAgreement: finalStepValues.authorizedToBindClientToAgreement,
            }),
            achAuthorizationForm: finalStepValues.achAuthorizationForm.at(0),
            bankAccountID,
        });
    };
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (reimbursementAccount?.errors || reimbursementAccount?.isFinishingCorpayBankAccountOnboarding || !reimbursementAccount?.isSuccess) {
            return;
        }
        if (reimbursementAccount?.isSuccess) {
            onSubmit();
            (0, BankAccounts_1.clearReimbursementAccountFinishCorpayBankAccountOnboarding)();
        }
        return () => {
            (0, BankAccounts_1.clearReimbursementAccountFinishCorpayBankAccountOnboarding)();
        };
    }, [reimbursementAccount, onSubmit]);
    const handleBackButtonPress = () => {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM);
        onBackButtonPress();
    };
    return (<DocusignFullStep_1.default defaultValue={finalStepValues.achAuthorizationForm} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} inputID={INPUT_KEYS.ACH_AUTHORIZATION_FORM} isLoading={reimbursementAccount?.isFinishingCorpayBankAccountOnboarding ?? false} onBackButtonPress={handleBackButtonPress} onSubmit={submit} currency={policyCurrency} startStepIndex={6} stepNames={stepNames}/>);
}
Docusign.displayName = 'Docusign';
exports.default = Docusign;
