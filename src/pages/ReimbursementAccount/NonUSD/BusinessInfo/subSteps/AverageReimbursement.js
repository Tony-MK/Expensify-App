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
const { TRADE_VOLUME } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
const STEP_FIELDS = [TRADE_VOLUME];
function AverageReimbursement({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [corpayOnboardingFields] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CORPAY_ONBOARDING_FIELDS, { canBeMissing: false });
    const policyID = reimbursementAccount?.achData?.policyID;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: false });
    const currency = policy?.outputCurrency ?? '';
    const tradeVolumeRangeListOptions = (0, react_1.useMemo)(() => (0, getListOptionsFromCorpayPicklist_1.default)(corpayOnboardingFields?.picklists.TradeVolumeRange), [corpayOnboardingFields]);
    const pushRowFields = (0, react_1.useMemo)(() => [
        {
            inputID: TRADE_VOLUME,
            defaultValue: reimbursementAccount?.achData?.corpay?.[TRADE_VOLUME] ?? '',
            options: tradeVolumeRangeListOptions,
            description: translate('businessInfoStep.averageReimbursementAmountInCurrency', { currencyCode: currency }),
            modalHeaderTitle: translate('businessInfoStep.selectAverageReimbursement'),
            searchInputTitle: translate('businessInfoStep.findAverageReimbursement'),
        },
    ], [reimbursementAccount, currency, tradeVolumeRangeListOptions, translate]);
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    if (corpayOnboardingFields === undefined) {
        return null;
    }
    return (<PushRowFieldsStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('businessInfoStep.whatsYourExpectedAverageReimbursements')} onSubmit={handleSubmit} pushRowFields={pushRowFields}/>);
}
AverageReimbursement.displayName = 'AverageReimbursement';
exports.default = AverageReimbursement;
