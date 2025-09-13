"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const PushRowFieldsStep_1 = require("@components/SubStepForms/PushRowFieldsStep");
const useEnableGlobalReimbursementsStepFormSubmit_1 = require("@hooks/useEnableGlobalReimbursementsStepFormSubmit");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const getListOptionsFromCorpayPicklist_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getListOptionsFromCorpayPicklist");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EnableGlobalReimbursementsForm_1 = require("@src/types/form/EnableGlobalReimbursementsForm");
const { APPLICANT_TYPE_ID, BUSINESS_CATEGORY } = EnableGlobalReimbursementsForm_1.default;
const STEP_FIELDS = [APPLICANT_TYPE_ID, BUSINESS_CATEGORY];
function BusinessType({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [enableGlobalReimbursementsDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS_DRAFT, { canBeMissing: true });
    const [corpayOnboardingFields] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CORPAY_ONBOARDING_FIELDS, { canBeMissing: true });
    const incorporationTypeListOptions = (0, react_1.useMemo)(() => (0, getListOptionsFromCorpayPicklist_1.default)(corpayOnboardingFields?.picklists.ApplicantType), [corpayOnboardingFields]);
    const natureOfBusinessListOptions = (0, react_1.useMemo)(() => (0, getListOptionsFromCorpayPicklist_1.default)(corpayOnboardingFields?.picklists.NatureOfBusiness), [corpayOnboardingFields]);
    const pushRowFields = (0, react_1.useMemo)(() => [
        {
            inputID: APPLICANT_TYPE_ID,
            defaultValue: enableGlobalReimbursementsDraft?.[APPLICANT_TYPE_ID] ?? '',
            options: incorporationTypeListOptions,
            description: translate('businessInfoStep.incorporationTypeName'),
            modalHeaderTitle: translate('businessInfoStep.selectIncorporationType'),
            searchInputTitle: translate('businessInfoStep.findIncorporationType'),
        },
        {
            inputID: BUSINESS_CATEGORY,
            defaultValue: enableGlobalReimbursementsDraft?.[BUSINESS_CATEGORY] ?? '',
            options: natureOfBusinessListOptions,
            description: translate('businessInfoStep.businessCategory'),
            modalHeaderTitle: translate('businessInfoStep.selectBusinessCategory'),
            searchInputTitle: translate('businessInfoStep.findBusinessCategory'),
        },
    ], [enableGlobalReimbursementsDraft, incorporationTypeListOptions, natureOfBusinessListOptions, translate]);
    const handleSubmit = (0, useEnableGlobalReimbursementsStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    if (corpayOnboardingFields === undefined) {
        return null;
    }
    return (<PushRowFieldsStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS} formTitle={translate('businessInfoStep.whatTypeOfBusinessIsIt')} onSubmit={handleSubmit} pushRowFields={pushRowFields}/>);
}
BusinessType.displayName = 'BusinessType';
exports.default = BusinessType;
