"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var RegistrationNumberStep_1 = require("@components/SubStepForms/RegistrationNumberStep");
var useOnyx_1 = require("@hooks/useOnyx");
var useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
var _a = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY, BUSINESS_REGISTRATION_INCORPORATION_NUMBER = _a.BUSINESS_REGISTRATION_INCORPORATION_NUMBER, COMPANY_COUNTRY_CODE = _a.COMPANY_COUNTRY_CODE;
var STEP_FIELDS = [BUSINESS_REGISTRATION_INCORPORATION_NUMBER];
function RegistrationNumber(_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var onNext = _a.onNext, onMove = _a.onMove, isEditing = _a.isEditing;
    var reimbursementAccount = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false })[0];
    var reimbursementAccountDraft = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true })[0];
    var defaultValue = (_d = (_c = (_b = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.achData) === null || _b === void 0 ? void 0 : _b.corpay) === null || _c === void 0 ? void 0 : _c[BUSINESS_REGISTRATION_INCORPORATION_NUMBER]) !== null && _d !== void 0 ? _d : '';
    var businessStepCountryDraftValue = (_h = (_g = (_f = (_e = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.achData) === null || _e === void 0 ? void 0 : _e.corpay) === null || _f === void 0 ? void 0 : _f[COMPANY_COUNTRY_CODE]) !== null && _g !== void 0 ? _g : reimbursementAccountDraft === null || reimbursementAccountDraft === void 0 ? void 0 : reimbursementAccountDraft[COMPANY_COUNTRY_CODE]) !== null && _h !== void 0 ? _h : '';
    var handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext: onNext,
        shouldSaveDraft: isEditing,
    });
    return (<RegistrationNumberStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} onSubmit={handleSubmit} inputID={BUSINESS_REGISTRATION_INCORPORATION_NUMBER} defaultValue={defaultValue} country={businessStepCountryDraftValue} shouldDelayAutoFocus/>);
}
RegistrationNumber.displayName = 'RegistrationNumber';
exports.default = RegistrationNumber;
