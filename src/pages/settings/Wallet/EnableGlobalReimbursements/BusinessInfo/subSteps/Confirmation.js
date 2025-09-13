"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmationStep_1 = require("@components/SubStepForms/ConfirmationStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EnableGlobalReimbursementsForm_1 = require("@src/types/form/EnableGlobalReimbursementsForm");
const { BUSINESS_REGISTRATION_INCORPORATION_NUMBER, ANNUAL_VOLUME, APPLICANT_TYPE_ID, TRADE_VOLUME, BUSINESS_CATEGORY } = EnableGlobalReimbursementsForm_1.default;
const displayStringValue = (list, matchingName) => {
    return list.find((item) => item.name === matchingName)?.stringValue ?? '';
};
function Confirmation({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [enableGlobalReimbursementsDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS_DRAFT, { canBeMissing: false });
    const [corpayOnboardingFields] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CORPAY_ONBOARDING_FIELDS, { canBeMissing: false });
    const error = (0, ErrorUtils_1.getLatestErrorMessage)(enableGlobalReimbursementsDraft);
    const paymentVolume = (0, react_1.useMemo)(() => displayStringValue(corpayOnboardingFields?.picklists.AnnualVolumeRange ?? [], enableGlobalReimbursementsDraft?.[ANNUAL_VOLUME] ?? ''), [corpayOnboardingFields?.picklists.AnnualVolumeRange, enableGlobalReimbursementsDraft]);
    const businessCategory = (0, react_1.useMemo)(() => displayStringValue(corpayOnboardingFields?.picklists.NatureOfBusiness ?? [], enableGlobalReimbursementsDraft?.[BUSINESS_CATEGORY] ?? ''), [corpayOnboardingFields?.picklists.NatureOfBusiness, enableGlobalReimbursementsDraft]);
    const businessType = (0, react_1.useMemo)(() => displayStringValue(corpayOnboardingFields?.picklists.ApplicantType ?? [], enableGlobalReimbursementsDraft?.[APPLICANT_TYPE_ID] ?? ''), [corpayOnboardingFields?.picklists.ApplicantType, enableGlobalReimbursementsDraft]);
    const tradeVolumeRange = (0, react_1.useMemo)(() => displayStringValue(corpayOnboardingFields?.picklists.TradeVolumeRange ?? [], enableGlobalReimbursementsDraft?.[TRADE_VOLUME] ?? ''), [corpayOnboardingFields?.picklists.TradeVolumeRange, enableGlobalReimbursementsDraft]);
    const summaryItems = (0, react_1.useMemo)(() => [
        {
            title: enableGlobalReimbursementsDraft?.[BUSINESS_REGISTRATION_INCORPORATION_NUMBER] ?? '',
            description: translate('businessInfoStep.registrationNumber'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(0);
            },
        },
        {
            title: businessType,
            description: translate('businessInfoStep.businessType'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(1);
            },
        },
        {
            title: businessCategory,
            description: translate('businessInfoStep.businessCategory'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(1);
            },
        },
        {
            title: paymentVolume,
            description: translate('businessInfoStep.annualPaymentVolume'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(2);
            },
        },
        {
            title: tradeVolumeRange,
            description: translate('businessInfoStep.averageReimbursementAmount'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(3);
            },
        },
    ], [businessCategory, businessType, enableGlobalReimbursementsDraft, onMove, paymentVolume, tradeVolumeRange, translate]);
    return (<ConfirmationStep_1.default isEditing={isEditing} error={error} onNext={onNext} onMove={onMove} pageTitle={translate('businessInfoStep.letsDoubleCheck')} summaryItems={summaryItems} showOnfidoLinks={false}/>);
}
Confirmation.displayName = 'Confirmation';
exports.default = Confirmation;
