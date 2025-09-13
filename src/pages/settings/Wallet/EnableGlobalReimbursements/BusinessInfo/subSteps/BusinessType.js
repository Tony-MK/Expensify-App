"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var PushRowFieldsStep_1 = require("@components/SubStepForms/PushRowFieldsStep");
var useEnableGlobalReimbursementsStepFormSubmit_1 = require("@hooks/useEnableGlobalReimbursementsStepFormSubmit");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var getListOptionsFromCorpayPicklist_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getListOptionsFromCorpayPicklist");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var EnableGlobalReimbursementsForm_1 = require("@src/types/form/EnableGlobalReimbursementsForm");
var APPLICANT_TYPE_ID = EnableGlobalReimbursementsForm_1.default.APPLICANT_TYPE_ID, BUSINESS_CATEGORY = EnableGlobalReimbursementsForm_1.default.BUSINESS_CATEGORY;
var STEP_FIELDS = [APPLICANT_TYPE_ID, BUSINESS_CATEGORY];
function BusinessType(_a) {
    var onNext = _a.onNext, onMove = _a.onMove, isEditing = _a.isEditing;
    var translate = (0, useLocalize_1.default)().translate;
    var enableGlobalReimbursementsDraft = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS_DRAFT, { canBeMissing: true })[0];
    var corpayOnboardingFields = (0, useOnyx_1.default)(ONYXKEYS_1.default.CORPAY_ONBOARDING_FIELDS, { canBeMissing: true })[0];
    var incorporationTypeListOptions = (0, react_1.useMemo)(function () { return (0, getListOptionsFromCorpayPicklist_1.default)(corpayOnboardingFields === null || corpayOnboardingFields === void 0 ? void 0 : corpayOnboardingFields.picklists.ApplicantType); }, [corpayOnboardingFields]);
    var natureOfBusinessListOptions = (0, react_1.useMemo)(function () { return (0, getListOptionsFromCorpayPicklist_1.default)(corpayOnboardingFields === null || corpayOnboardingFields === void 0 ? void 0 : corpayOnboardingFields.picklists.NatureOfBusiness); }, [corpayOnboardingFields]);
    var pushRowFields = (0, react_1.useMemo)(function () {
        var _a, _b;
        return [
            {
                inputID: APPLICANT_TYPE_ID,
                defaultValue: (_a = enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[APPLICANT_TYPE_ID]) !== null && _a !== void 0 ? _a : '',
                options: incorporationTypeListOptions,
                description: translate('businessInfoStep.incorporationTypeName'),
                modalHeaderTitle: translate('businessInfoStep.selectIncorporationType'),
                searchInputTitle: translate('businessInfoStep.findIncorporationType'),
            },
            {
                inputID: BUSINESS_CATEGORY,
                defaultValue: (_b = enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[BUSINESS_CATEGORY]) !== null && _b !== void 0 ? _b : '',
                options: natureOfBusinessListOptions,
                description: translate('businessInfoStep.businessCategory'),
                modalHeaderTitle: translate('businessInfoStep.selectBusinessCategory'),
                searchInputTitle: translate('businessInfoStep.findBusinessCategory'),
            },
        ];
    }, [enableGlobalReimbursementsDraft, incorporationTypeListOptions, natureOfBusinessListOptions, translate]);
    var handleSubmit = (0, useEnableGlobalReimbursementsStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext: onNext,
        shouldSaveDraft: isEditing,
    });
    if (corpayOnboardingFields === undefined) {
        return null;
    }
    return (<PushRowFieldsStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS} formTitle={translate('businessInfoStep.whatTypeOfBusinessIsIt')} onSubmit={handleSubmit} pushRowFields={pushRowFields}/>);
}
BusinessType.displayName = 'BusinessType';
exports.default = BusinessType;
