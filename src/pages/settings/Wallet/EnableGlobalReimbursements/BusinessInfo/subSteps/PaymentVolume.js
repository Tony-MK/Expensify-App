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
const { ANNUAL_VOLUME } = EnableGlobalReimbursementsForm_1.default;
const STEP_FIELDS = [ANNUAL_VOLUME];
function PaymentVolume({ onNext, onMove, isEditing, currency }) {
    const { translate } = (0, useLocalize_1.default)();
    const [enableGlobalReimbursementsDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS_DRAFT, { canBeMissing: true });
    const [corpayOnboardingFields] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CORPAY_ONBOARDING_FIELDS, { canBeMissing: true });
    const annualVolumeRangeListOptions = (0, react_1.useMemo)(() => (0, getListOptionsFromCorpayPicklist_1.default)(corpayOnboardingFields?.picklists.AnnualVolumeRange), [corpayOnboardingFields]);
    const pushRowFields = (0, react_1.useMemo)(() => [
        {
            inputID: ANNUAL_VOLUME,
            defaultValue: enableGlobalReimbursementsDraft?.[ANNUAL_VOLUME] ?? '',
            options: annualVolumeRangeListOptions,
            description: translate('businessInfoStep.annualPaymentVolumeInCurrency', { currencyCode: currency }),
            modalHeaderTitle: translate('businessInfoStep.selectAnnualPaymentVolume'),
            searchInputTitle: translate('businessInfoStep.findAnnualPaymentVolume'),
        },
    ], [enableGlobalReimbursementsDraft, currency, annualVolumeRangeListOptions, translate]);
    const handleSubmit = (0, useEnableGlobalReimbursementsStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    if (corpayOnboardingFields === undefined) {
        return null;
    }
    return (<PushRowFieldsStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS} formTitle={translate('businessInfoStep.whatsTheBusinessAnnualPayment')} onSubmit={handleSubmit} pushRowFields={pushRowFields}/>);
}
PaymentVolume.displayName = 'PaymentVolume';
exports.default = PaymentVolume;
