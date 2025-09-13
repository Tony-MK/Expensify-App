"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var AgreementsFullStep_1 = require("@components/SubStepForms/AgreementsFullStep");
var useOnyx_1 = require("@hooks/useOnyx");
var requiresDocusignStep_1 = require("@pages/ReimbursementAccount/NonUSD/utils/requiresDocusignStep");
var getSubStepValues_1 = require("@pages/ReimbursementAccount/utils/getSubStepValues");
var BankAccounts_1 = require("@userActions/BankAccounts");
var FormActions_1 = require("@userActions/FormActions");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
var INPUT_KEYS = {
    provideTruthfulInformation: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.PROVIDE_TRUTHFUL_INFORMATION,
    agreeToTermsAndConditions: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.AGREE_TO_TERMS_AND_CONDITIONS,
    consentToPrivacyNotice: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.CONSENT_TO_PRIVACY_NOTICE,
    authorizedToBindClientToAgreement: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.AUTHORIZED_TO_BIND_CLIENT_TO_AGREEMENT,
};
function Agreements(_a) {
    var _b, _c, _d;
    var onBackButtonPress = _a.onBackButtonPress, onSubmit = _a.onSubmit, stepNames = _a.stepNames, policyCurrency = _a.policyCurrency;
    var reimbursementAccount = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false })[0];
    var reimbursementAccountDraft = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: false })[0];
    var agreementsStepValues = (0, react_1.useMemo)(function () { return (0, getSubStepValues_1.default)(INPUT_KEYS, reimbursementAccountDraft, reimbursementAccount); }, [reimbursementAccount, reimbursementAccountDraft]);
    var bankAccountID = (_c = (_b = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.achData) === null || _b === void 0 ? void 0 : _b.bankAccountID) !== null && _c !== void 0 ? _c : CONST_1.default.DEFAULT_NUMBER_ID;
    var isDocusignStepRequired = (0, requiresDocusignStep_1.default)(policyCurrency);
    var submit = function () {
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
            bankAccountID: bankAccountID,
        });
    };
    (0, react_1.useEffect)(function () {
        if (isDocusignStepRequired) {
            return;
        }
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
    }, [reimbursementAccount, onSubmit, policyCurrency, isDocusignStepRequired]);
    var handleBackButtonPress = function () {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM);
        onBackButtonPress();
    };
    return (<AgreementsFullStep_1.default defaultValues={agreementsStepValues} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} inputIDs={INPUT_KEYS} isLoading={(_d = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.isFinishingCorpayBankAccountOnboarding) !== null && _d !== void 0 ? _d : false} onBackButtonPress={handleBackButtonPress} onSubmit={submit} currency={policyCurrency !== null && policyCurrency !== void 0 ? policyCurrency : ''} startStepIndex={5} stepNames={stepNames}/>);
}
Agreements.displayName = 'Agreements';
exports.default = Agreements;
