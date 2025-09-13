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
const { ANNUAL_VOLUME } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
const STEP_FIELDS = [ANNUAL_VOLUME];
function PaymentVolume({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [corpayOnboardingFields] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CORPAY_ONBOARDING_FIELDS, { canBeMissing: false });
    const policyID = reimbursementAccount?.achData?.policyID;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: false });
    const currency = policy?.outputCurrency ?? '';
    const annualVolumeRangeListOptions = (0, react_1.useMemo)(() => (0, getListOptionsFromCorpayPicklist_1.default)(corpayOnboardingFields?.picklists.AnnualVolumeRange), [corpayOnboardingFields]);
    const annualVolumeDefaultValue = reimbursementAccount?.achData?.corpay?.[ANNUAL_VOLUME] ?? '';
    const pushRowFields = (0, react_1.useMemo)(() => [
        {
            inputID: ANNUAL_VOLUME,
            defaultValue: annualVolumeDefaultValue,
            options: annualVolumeRangeListOptions,
            description: translate('businessInfoStep.annualPaymentVolumeInCurrency', { currencyCode: currency }),
            modalHeaderTitle: translate('businessInfoStep.selectAnnualPaymentVolume'),
            searchInputTitle: translate('businessInfoStep.findAnnualPaymentVolume'),
        },
    ], [annualVolumeDefaultValue, annualVolumeRangeListOptions, translate, currency]);
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    if (corpayOnboardingFields === undefined) {
        return null;
    }
    return (<PushRowFieldsStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('businessInfoStep.whatsTheBusinessAnnualPayment')} onSubmit={handleSubmit} pushRowFields={pushRowFields}/>);
}
PaymentVolume.displayName = 'PaymentVolume';
exports.default = PaymentVolume;
