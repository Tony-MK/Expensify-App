"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var DocusignFullStep_1 = require("@components/SubStepForms/DocusignFullStep");
var useOnyx_1 = require("@hooks/useOnyx");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var EnableGlobalReimbursementsForm_1 = require("@src/types/form/EnableGlobalReimbursementsForm");
function Docusign(_a) {
    var _b, _c;
    var onBackButtonPress = _a.onBackButtonPress, onSubmit = _a.onSubmit, currency = _a.currency;
    var enableGlobalReimbursements = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS, { canBeMissing: true })[0];
    var enableGlobalReimbursementsDraft = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS_DRAFT, { canBeMissing: true })[0];
    var defaultValue = (_b = enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[EnableGlobalReimbursementsForm_1.default.ACH_AUTHORIZATION_FORM]) !== null && _b !== void 0 ? _b : [];
    return (<DocusignFullStep_1.default defaultValue={defaultValue} formID={ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS} inputID={EnableGlobalReimbursementsForm_1.default.ACH_AUTHORIZATION_FORM} isLoading={(_c = enableGlobalReimbursements === null || enableGlobalReimbursements === void 0 ? void 0 : enableGlobalReimbursements.isEnablingGlobalReimbursements) !== null && _c !== void 0 ? _c : false} onBackButtonPress={onBackButtonPress} onSubmit={onSubmit} currency={currency} startStepIndex={2} stepNames={CONST_1.default.ENABLE_GLOBAL_REIMBURSEMENTS.STEP_NAMES}/>);
}
Docusign.displayName = 'Docusign';
exports.default = Docusign;
