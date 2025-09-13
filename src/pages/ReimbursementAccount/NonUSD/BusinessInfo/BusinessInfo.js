"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePermissions_1 = require("@hooks/usePermissions");
const useSubStep_1 = require("@hooks/useSubStep");
const getInitialSubStepForBusinessInfoStep_1 = require("@pages/ReimbursementAccount/NonUSD/utils/getInitialSubStepForBusinessInfoStep");
const getSubStepValues_1 = require("@pages/ReimbursementAccount/utils/getSubStepValues");
const BankAccounts_1 = require("@userActions/BankAccounts");
const FormActions_1 = require("@userActions/FormActions");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const Address_1 = require("./subSteps/Address");
const AverageReimbursement_1 = require("./subSteps/AverageReimbursement");
const BusinessType_1 = require("./subSteps/BusinessType");
const Confirmation_1 = require("./subSteps/Confirmation");
const ContactInformation_1 = require("./subSteps/ContactInformation");
const IncorporationLocation_1 = require("./subSteps/IncorporationLocation");
const Name_1 = require("./subSteps/Name");
const PaymentVolume_1 = require("./subSteps/PaymentVolume");
const RegistrationNumber_1 = require("./subSteps/RegistrationNumber");
const TaxIDEINNumber_1 = require("./subSteps/TaxIDEINNumber");
const Website_1 = require("./subSteps/Website");
const bodyContent = [
    Name_1.default,
    Website_1.default,
    Address_1.default,
    ContactInformation_1.default,
    RegistrationNumber_1.default,
    TaxIDEINNumber_1.default,
    IncorporationLocation_1.default,
    BusinessType_1.default,
    PaymentVolume_1.default,
    AverageReimbursement_1.default,
    Confirmation_1.default,
];
const INPUT_KEYS = {
    NAME: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.COMPANY_NAME,
    WEBSITE: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.COMPANY_WEBSITE,
    STREET: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.COMPANY_STREET,
    CITY: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.COMPANY_CITY,
    STATE: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.COMPANY_STATE,
    COMPANY_POSTAL_CODE: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.COMPANY_POSTAL_CODE,
    COMPANY_COUNTRY_CODE: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.COMPANY_COUNTRY_CODE,
    CONTACT_NUMBER: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.BUSINESS_CONTACT_NUMBER,
    CONFIRMATION_EMAIL: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.BUSINESS_CONFIRMATION_EMAIL,
    INCORPORATION_STATE: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.FORMATION_INCORPORATION_STATE,
    INCORPORATION_COUNTRY: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.FORMATION_INCORPORATION_COUNTRY_CODE,
    BUSINESS_REGISTRATION_INCORPORATION_NUMBER: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.BUSINESS_REGISTRATION_INCORPORATION_NUMBER,
    BUSINESS_CATEGORY: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.BUSINESS_CATEGORY,
    APPLICANT_TYPE_ID: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.APPLICANT_TYPE_ID,
    ANNUAL_VOLUME: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.ANNUAL_VOLUME,
    TRADE_VOLUME: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.TRADE_VOLUME,
    TAX_ID_EIN_NUMBER: ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY.TAX_ID_EIN_NUMBER,
};
function BusinessInfo({ onBackButtonPress, onSubmit, stepNames }) {
    const { translate } = (0, useLocalize_1.default)();
    const { isProduction } = (0, useEnvironment_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: true });
    const policyID = reimbursementAccount?.achData?.policyID;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: false });
    const currency = policy?.outputCurrency ?? '';
    const businessInfoStepValues = (0, react_1.useMemo)(() => (0, getSubStepValues_1.default)(INPUT_KEYS, reimbursementAccountDraft, reimbursementAccount), [reimbursementAccount, reimbursementAccountDraft]);
    const bankAccountID = reimbursementAccount?.achData?.bankAccountID ?? CONST_1.default.DEFAULT_NUMBER_ID;
    const startFrom = (0, react_1.useMemo)(() => (0, getInitialSubStepForBusinessInfoStep_1.default)(businessInfoStepValues), [businessInfoStepValues]);
    const country = reimbursementAccount?.achData?.[ReimbursementAccountForm_1.default.ADDITIONAL_DATA.COUNTRY] ?? reimbursementAccountDraft?.[ReimbursementAccountForm_1.default.ADDITIONAL_DATA.COUNTRY] ?? '';
    (0, react_1.useEffect)(() => {
        (0, BankAccounts_1.getCorpayOnboardingFields)(country);
    }, [country]);
    const submit = (0, react_1.useCallback)(() => {
        (0, BankAccounts_1.saveCorpayOnboardingCompanyDetails)({
            ...businessInfoStepValues,
            // Corpay does not accept emails with a "+" character and will not let us connect account at the end of whole flow
            businessConfirmationEmail: !isProduction && isBetaEnabled(CONST_1.default.BETAS.GLOBAL_REIMBURSEMENTS_ON_ND)
                ? expensify_common_1.Str.replaceAll(businessInfoStepValues.businessConfirmationEmail, '+', '')
                : businessInfoStepValues.businessConfirmationEmail,
            fundSourceCountries: country,
            fundDestinationCountries: country,
            currencyNeeded: currency,
            purposeOfTransactionId: CONST_1.default.NON_USD_BANK_ACCOUNT.PURPOSE_OF_TRANSACTION_ID,
        }, bankAccountID);
    }, [businessInfoStepValues, isProduction, isBetaEnabled, country, currency, bankAccountID]);
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (reimbursementAccount?.errors || reimbursementAccount?.isSavingCorpayOnboardingCompanyFields || !reimbursementAccount?.isSuccess) {
            return;
        }
        if (reimbursementAccount?.isSuccess) {
            onSubmit();
            (0, BankAccounts_1.clearReimbursementAccountSaveCorpayOnboardingCompanyDetails)();
        }
        return () => {
            (0, BankAccounts_1.clearReimbursementAccountSaveCorpayOnboardingCompanyDetails)();
        };
    }, [reimbursementAccount, onSubmit]);
    const { componentToRender: SubStep, isEditing, screenIndex, nextScreen, prevScreen, moveTo, goToTheLastStep } = (0, useSubStep_1.default)({ bodyContent, startFrom, onFinished: submit });
    const handleBackButtonPress = () => {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM);
        if (isEditing) {
            goToTheLastStep();
            return;
        }
        if (screenIndex === 0) {
            onBackButtonPress();
        }
        else {
            prevScreen();
        }
    };
    return (<InteractiveStepWrapper_1.default wrapperID={BusinessInfo.displayName} handleBackButtonPress={handleBackButtonPress} headerTitle={translate('businessInfoStep.businessInfoTitle')} stepNames={stepNames} startStepIndex={2}>
            <SubStep isEditing={isEditing} onNext={nextScreen} onMove={moveTo} screenIndex={screenIndex}/>
        </InteractiveStepWrapper_1.default>);
}
BusinessInfo.displayName = 'BusinessInfo';
exports.default = BusinessInfo;
