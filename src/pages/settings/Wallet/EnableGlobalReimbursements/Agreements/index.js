"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var AgreementsFullStep_1 = require("@components/SubStepForms/AgreementsFullStep");
var useOnyx_1 = require("@hooks/useOnyx");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var EnableGlobalReimbursementsForm_1 = require("@src/types/form/EnableGlobalReimbursementsForm");
var inputIDs = {
    provideTruthfulInformation: EnableGlobalReimbursementsForm_1.default.PROVIDE_TRUTHFUL_INFORMATION,
    agreeToTermsAndConditions: EnableGlobalReimbursementsForm_1.default.AGREE_TO_TERMS_AND_CONDITIONS,
    consentToPrivacyNotice: EnableGlobalReimbursementsForm_1.default.CONSENT_TO_PRIVACY_NOTICE,
    authorizedToBindClientToAgreement: EnableGlobalReimbursementsForm_1.default.AUTHORIZED_TO_BIND_CLIENT_TO_AGREEMENT,
};
function Agreements(_a) {
    var onBackButtonPress = _a.onBackButtonPress, onSubmit = _a.onSubmit, currency = _a.currency;
    var enableGlobalReimbursementsDraft = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS_DRAFT, { canBeMissing: true })[0];
    var defaultValues = Object.fromEntries(Object.keys(inputIDs).map(function (key) {
        var _a;
        var typedKey = key;
        return [typedKey, (_a = enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[typedKey]) !== null && _a !== void 0 ? _a : false];
    }));
    return (<AgreementsFullStep_1.default defaultValues={defaultValues} formID={ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS} inputIDs={inputIDs} isLoading={false} onBackButtonPress={onBackButtonPress} onSubmit={onSubmit} currency={currency} startStepIndex={1} stepNames={CONST_1.default.ENABLE_GLOBAL_REIMBURSEMENTS.STEP_NAMES}/>);
}
Agreements.displayName = 'Agreements';
exports.default = Agreements;
