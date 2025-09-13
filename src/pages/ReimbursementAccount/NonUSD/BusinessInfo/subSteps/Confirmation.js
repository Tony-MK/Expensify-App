"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("expensify-common/dist/CONST");
const react_1 = require("react");
const ConfirmationStep_1 = require("@components/SubStepForms/ConfirmationStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const getSubStepValues_1 = require("@pages/ReimbursementAccount/utils/getSubStepValues");
const CONST_2 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const BUSINESS_INFO_STEP_KEYS = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
const { COMPANY_NAME, COMPANY_WEBSITE, BUSINESS_REGISTRATION_INCORPORATION_NUMBER, TAX_ID_EIN_NUMBER, COMPANY_COUNTRY_CODE, COMPANY_STREET, COMPANY_CITY, COMPANY_STATE, COMPANY_POSTAL_CODE, BUSINESS_CONTACT_NUMBER, BUSINESS_CONFIRMATION_EMAIL, FORMATION_INCORPORATION_COUNTRY_CODE, FORMATION_INCORPORATION_STATE, ANNUAL_VOLUME, APPLICANT_TYPE_ID, TRADE_VOLUME, BUSINESS_CATEGORY, } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
const displayStringValue = (list, matchingName) => {
    return list.find((item) => item.name === matchingName)?.stringValue ?? '';
};
const displayAddress = (street, city, state, zipCode, country) => {
    return country === CONST_2.default.COUNTRY.US || country === CONST_2.default.COUNTRY.CA ? `${street}, ${city}, ${state}, ${zipCode}, ${country}` : `${street}, ${city}, ${zipCode}, ${country}`;
};
const displayIncorporationLocation = (country, state) => {
    const countryFullName = CONST_2.default.ALL_COUNTRIES[country];
    const stateFullName = CONST_1.CONST.STATES[state]?.stateName ?? CONST_1.CONST.PROVINCES[state]?.provinceName;
    return country === CONST_2.default.COUNTRY.US || country === CONST_2.default.COUNTRY.CA ? `${stateFullName}, ${countryFullName}` : `${countryFullName}`;
};
function Confirmation({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: false });
    const [corpayOnboardingFields] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CORPAY_ONBOARDING_FIELDS, { canBeMissing: false });
    const error = (0, ErrorUtils_1.getLatestErrorMessage)(reimbursementAccount);
    const values = (0, react_1.useMemo)(() => (0, getSubStepValues_1.default)(BUSINESS_INFO_STEP_KEYS, reimbursementAccountDraft, reimbursementAccount), [reimbursementAccount, reimbursementAccountDraft]);
    const paymentVolume = (0, react_1.useMemo)(() => displayStringValue(corpayOnboardingFields?.picklists.AnnualVolumeRange ?? [], values[ANNUAL_VOLUME]), [corpayOnboardingFields?.picklists.AnnualVolumeRange, values]);
    const businessCategory = (0, react_1.useMemo)(() => displayStringValue(corpayOnboardingFields?.picklists.NatureOfBusiness ?? [], values[BUSINESS_CATEGORY]), [corpayOnboardingFields?.picklists.NatureOfBusiness, values]);
    const businessType = (0, react_1.useMemo)(() => displayStringValue(corpayOnboardingFields?.picklists.ApplicantType ?? [], values[APPLICANT_TYPE_ID]), [corpayOnboardingFields?.picklists.ApplicantType, values]);
    const tradeVolumeRange = (0, react_1.useMemo)(() => displayStringValue(corpayOnboardingFields?.picklists.TradeVolumeRange ?? [], values[TRADE_VOLUME]), [corpayOnboardingFields?.picklists.TradeVolumeRange, values]);
    const summaryItems = (0, react_1.useMemo)(() => [
        {
            title: values[COMPANY_NAME],
            description: translate('businessInfoStep.legalBusinessName'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(0);
            },
        },
        {
            title: values[COMPANY_WEBSITE],
            description: translate('businessInfoStep.companyWebsite'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(1);
            },
        },
        {
            title: values[BUSINESS_REGISTRATION_INCORPORATION_NUMBER],
            description: translate('businessInfoStep.registrationNumber'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(4);
            },
        },
        {
            title: values[TAX_ID_EIN_NUMBER],
            description: translate('businessInfoStep.taxIDEIN', { country: values[COMPANY_COUNTRY_CODE] }),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(5);
            },
        },
        {
            title: displayAddress(values[COMPANY_STREET], values[COMPANY_CITY], values[COMPANY_STATE], values[COMPANY_POSTAL_CODE], values[COMPANY_COUNTRY_CODE]),
            description: translate('businessInfoStep.businessAddress'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(2);
            },
        },
        {
            title: values[BUSINESS_CONTACT_NUMBER],
            description: translate('common.phoneNumber'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(3);
            },
        },
        {
            title: values[BUSINESS_CONFIRMATION_EMAIL],
            description: translate('common.email'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(3);
            },
        },
        {
            title: businessType,
            description: translate('businessInfoStep.businessType'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(7);
            },
        },
        {
            title: displayIncorporationLocation(values[FORMATION_INCORPORATION_COUNTRY_CODE], values[FORMATION_INCORPORATION_STATE]),
            description: translate('businessInfoStep.incorporation'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(6);
            },
        },
        {
            title: businessCategory,
            description: translate('businessInfoStep.businessCategory'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(7);
            },
        },
        {
            title: paymentVolume,
            description: translate('businessInfoStep.annualPaymentVolume'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(8);
            },
        },
        {
            title: tradeVolumeRange,
            description: translate('businessInfoStep.averageReimbursementAmount'),
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(9);
            },
        },
    ], [businessCategory, businessType, onMove, paymentVolume, tradeVolumeRange, translate, values]);
    return (<ConfirmationStep_1.default isEditing={isEditing} error={error} onNext={onNext} onMove={onMove} pageTitle={translate('businessInfoStep.letsDoubleCheck')} summaryItems={summaryItems} isLoading={reimbursementAccount?.isSavingCorpayOnboardingCompanyFields} showOnfidoLinks={false}/>);
}
Confirmation.displayName = 'Confirmation';
exports.default = Confirmation;
