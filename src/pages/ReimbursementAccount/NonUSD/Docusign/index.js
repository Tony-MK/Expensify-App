"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var DocusignFullStep_1 = require("@components/SubStepForms/DocusignFullStep");
var useOnyx_1 = require("@hooks/useOnyx");
var getSubStepValues_1 = require("@pages/ReimbursementAccount/utils/getSubStepValues");
var BankAccounts_1 = require("@userActions/BankAccounts");
var FormActions_1 = require("@userActions/FormActions");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
var INPUT_KEYS = {
    PROVIDE_TRUTHFUL_INFORMATION: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.PROVIDE_TRUTHFUL_INFORMATION,
    AGREE_TO_TERMS_AND_CONDITIONS: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.AGREE_TO_TERMS_AND_CONDITIONS,
    CONSENT_TO_PRIVACY_NOTICE: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.CONSENT_TO_PRIVACY_NOTICE,
    AUTHORIZED_TO_BIND_CLIENT_TO_AGREEMENT: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.AUTHORIZED_TO_BIND_CLIENT_TO_AGREEMENT,
    ACH_AUTHORIZATION_FORM: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.ACH_AUTHORIZATION_FORM,
};
function Docusign(_a) {
    var _b, _c, _d;
    var onBackButtonPress = _a.onBackButtonPress, onSubmit = _a.onSubmit, stepNames = _a.stepNames, policyCurrency = _a.policyCurrency;
    var reimbursementAccount = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false })[0];
    var reimbursementAccountDraft = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: false })[0];
    var finalStepValues = (0, react_1.useMemo)(function () { return (0, getSubStepValues_1.default)(INPUT_KEYS, reimbursementAccountDraft, reimbursementAccount); }, [reimbursementAccount, reimbursementAccountDraft]);
    var bankAccountID = (_c = (_b = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.achData) === null || _b === void 0 ? void 0 : _b.bankAccountID) !== null && _c !== void 0 ? _c : CONST_1.default.DEFAULT_NUMBER_ID;
    var submit = function () {
        (0, BankAccounts_1.finishCorpayBankAccountOnboarding)({
            inputs: JSON.stringify({
                provideTruthfulInformation: finalStepValues.provideTruthfulInformation,
                agreeToTermsAndConditions: finalStepValues.agreeToTermsAndConditions,
                consentToPrivacyNotice: finalStepValues.consentToPrivacyNotice,
                authorizedToBindClientToAgreement: finalStepValues.authorizedToBindClientToAgreement,
            }),
            achAuthorizationForm: finalStepValues.achAuthorizationForm.at(0),
            bankAccountID: bankAccountID,
        });
    };
    (0, react_1.useEffect)(function () {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if ((reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.errors) || (reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.isFinishingCorpayBankAccountOnboarding) || !(reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.isSuccess)) {
            return;
        }
        if (reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.isSuccess) {
            onSubmit();
            (0, BankAccounts_1.clearReimbursementAccountFinishCorpayBankAccountOnboarding)();
        }
        return function () {
            (0, BankAccounts_1.clearReimbursementAccountFinishCorpayBankAccountOnboarding)();
        };
    }, [reimbursementAccount, onSubmit]);
    var handleBackButtonPress = function () {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM);
        onBackButtonPress();
    };
    return (<DocusignFullStep_1.default defaultValue={finalStepValues.achAuthorizationForm} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} inputID={INPUT_KEYS.ACH_AUTHORIZATION_FORM} isLoading={(_d = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.isFinishingCorpayBankAccountOnboarding) !== null && _d !== void 0 ? _d : false} onBackButtonPress={handleBackButtonPress} onSubmit={submit} currency={policyCurrency} startStepIndex={6} stepNames={stepNames}/>);
}
Docusign.displayName = 'Docusign';
exports.default = Docusign;
