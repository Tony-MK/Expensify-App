"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AgreementsFullStep_1 = require("@components/SubStepForms/AgreementsFullStep");
const useOnyx_1 = require("@hooks/useOnyx");
const requiresDocusignStep_1 = require("@pages/ReimbursementAccount/NonUSD/utils/requiresDocusignStep");
const getSubStepValues_1 = require("@pages/ReimbursementAccount/utils/getSubStepValues");
const BankAccounts_1 = require("@userActions/BankAccounts");
const FormActions_1 = require("@userActions/FormActions");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const INPUT_KEYS = {
    provideTruthfulInformation: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.PROVIDE_TRUTHFUL_INFORMATION,
    agreeToTermsAndConditions: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.AGREE_TO_TERMS_AND_CONDITIONS,
    consentToPrivacyNotice: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.CONSENT_TO_PRIVACY_NOTICE,
    authorizedToBindClientToAgreement: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.AUTHORIZED_TO_BIND_CLIENT_TO_AGREEMENT,
};
function Agreements({ onBackButtonPress, onSubmit, stepNames, policyCurrency }) {
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: false });
    const agreementsStepValues = (0, react_1.useMemo)(() => (0, getSubStepValues_1.default)(INPUT_KEYS, reimbursementAccountDraft, reimbursementAccount), [reimbursementAccount, reimbursementAccountDraft]);
    const bankAccountID = reimbursementAccount?.achData?.bankAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const isDocusignStepRequired = (0, requiresDocusignStep_1.default)(policyCurrency);
    const submit = () => {
        if (isDocusignStepRequired) {
            onSubmit();
            return;
        }
        (0, BankAccounts_1.finishCorpayBankAccountOnboarding)({
            inputs: JSON.stringify({
                provideTruthfulInformation: agreementsStepValues.provideTruthfulInformation,
                agreeToTermsAndConditions: agreementsStepValues.agreeToTermsAndConditions,
                consentToPrivacyNotice: agreementsStepValues.consentToPrivacyNotice,
                authorizedToBindClientToAgreement: agreementsStepValues.authorizedToBindClientToAgreement,
            }),
            bankAccountID,
        });
    };
    (0, react_1.useEffect)(() => {
        if (isDocusignStepRequired) {
            return;
        }
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
    }, [reimbursementAccount, onSubmit, policyCurrency, isDocusignStepRequired]);
    const handleBackButtonPress = () => {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM);
        onBackButtonPress();
    };
    return (<AgreementsFullStep_1.default defaultValues={agreementsStepValues} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} inputIDs={INPUT_KEYS} isLoading={reimbursementAccount?.isFinishingCorpayBankAccountOnboarding ?? false} onBackButtonPress={handleBackButtonPress} onSubmit={submit} currency={policyCurrency ?? ''} startStepIndex={5} stepNames={stepNames}/>);
}
Agreements.displayName = 'Agreements';
exports.default = Agreements;
