"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var RegistrationNumberStep_1 = require("@components/SubStepForms/RegistrationNumberStep");
var useEnableGlobalReimbursementsStepFormSubmit_1 = require("@hooks/useEnableGlobalReimbursementsStepFormSubmit");
var useOnyx_1 = require("@hooks/useOnyx");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var EnableGlobalReimbursementsForm_1 = require("@src/types/form/EnableGlobalReimbursementsForm");
var BUSINESS_REGISTRATION_INCORPORATION_NUMBER = EnableGlobalReimbursementsForm_1.default.BUSINESS_REGISTRATION_INCORPORATION_NUMBER;
var STEP_FIELDS = [BUSINESS_REGISTRATION_INCORPORATION_NUMBER];
function RegistrationNumber(_a) {
    var _b;
    var onNext = _a.onNext, onMove = _a.onMove, isEditing = _a.isEditing, country = _a.country;
    var enableGlobalReimbursementsDraft = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS_DRAFT, { canBeMissing: true })[0];
    var handleSubmit = (0, useEnableGlobalReimbursementsStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext: onNext,
        shouldSaveDraft: isEditing,
    });
    return (<RegistrationNumberStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS} onSubmit={handleSubmit} inputID={BUSINESS_REGISTRATION_INCORPORATION_NUMBER} defaultValue={(_b = enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[BUSINESS_REGISTRATION_INCORPORATION_NUMBER]) !== null && _b !== void 0 ? _b : ''} country={country} shouldDelayAutoFocus/>);
}
RegistrationNumber.displayName = 'RegistrationNumber';
exports.default = RegistrationNumber;
