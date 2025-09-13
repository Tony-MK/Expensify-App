"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const PushRowFieldsStep_1 = require("@components/SubStepForms/PushRowFieldsStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const getListOptionsFromCorpayPicklist_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getListOptionsFromCorpayPicklist");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const { BUSINESS_CATEGORY, APPLICANT_TYPE_ID } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
const STEP_FIELDS = [BUSINESS_CATEGORY, APPLICANT_TYPE_ID];
function BusinessType({ onNext, isEditing, onMove }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [corpayOnboardingFields] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CORPAY_ONBOARDING_FIELDS, { canBeMissing: false });
    const incorporationTypeListOptions = (0, react_1.useMemo)(() => (0, getListOptionsFromCorpayPicklist_1.default)(corpayOnboardingFields?.picklists.ApplicantType), [corpayOnboardingFields]);
    const natureOfBusinessListOptions = (0, react_1.useMemo)(() => (0, getListOptionsFromCorpayPicklist_1.default)(corpayOnboardingFields?.picklists.NatureOfBusiness), [corpayOnboardingFields]);
    const incorporationTypeDefaultValue = reimbursementAccount?.achData?.corpay?.[APPLICANT_TYPE_ID] ?? '';
    const businessCategoryDefaultValue = reimbursementAccount?.achData?.corpay?.[BUSINESS_CATEGORY] ?? '';
    const pushRowFields = (0, react_1.useMemo)(() => [
        {
            inputID: APPLICANT_TYPE_ID,
            defaultValue: incorporationTypeDefaultValue,
            options: incorporationTypeListOptions,
            description: translate('businessInfoStep.incorporationTypeName'),
            modalHeaderTitle: translate('businessInfoStep.selectIncorporationType'),
            searchInputTitle: translate('businessInfoStep.findIncorporationType'),
        },
        {
            inputID: BUSINESS_CATEGORY,
            defaultValue: businessCategoryDefaultValue,
            options: natureOfBusinessListOptions,
            description: translate('businessInfoStep.businessCategory'),
            modalHeaderTitle: translate('businessInfoStep.selectBusinessCategory'),
            searchInputTitle: translate('businessInfoStep.findBusinessCategory'),
        },
    ], [businessCategoryDefaultValue, incorporationTypeDefaultValue, incorporationTypeListOptions, natureOfBusinessListOptions, translate]);
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    if (corpayOnboardingFields === undefined) {
        return null;
    }
    return (<PushRowFieldsStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('businessInfoStep.whatTypeOfBusinessIsIt')} onSubmit={handleSubmit} pushRowFields={pushRowFields}/>);
}
BusinessType.displayName = 'BusinessType';
exports.default = BusinessType;
