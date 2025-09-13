"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const Navigation_1 = require("@navigation/Navigation");
const BankAccounts_1 = require("@userActions/BankAccounts");
const FormActions_1 = require("@userActions/FormActions");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EnableGlobalReimbursementsForm_1 = require("@src/types/form/EnableGlobalReimbursementsForm");
const Agreements_1 = require("./Agreements");
const BusinessInfo_1 = require("./BusinessInfo");
const Docusign_1 = require("./Docusign");
function EnableGlobalReimbursements({ route }) {
    const bankAccountID = route.params?.bankAccountID;
    const [bankAccountList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: false });
    const [enableGlobalReimbursements] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS, { canBeMissing: true });
    const [enableGlobalReimbursementsDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS_DRAFT, { canBeMissing: true });
    const currency = bankAccountList?.[bankAccountID]?.bankCurrency ?? '';
    const country = bankAccountList?.[bankAccountID]?.bankCountry;
    const [enableGlobalReimbursementsStep, setEnableGlobalReimbursementsStep] = (0, react_1.useState)(CONST_1.default.ENABLE_GLOBAL_REIMBURSEMENTS.STEP.BUSINESS_INFO);
    (0, react_1.useEffect)(() => {
        (0, BankAccounts_1.getCorpayOnboardingFields)(country);
    }, [country]);
    const handleNextEnableGlobalReimbursementsStep = () => {
        switch (enableGlobalReimbursementsStep) {
            case CONST_1.default.ENABLE_GLOBAL_REIMBURSEMENTS.STEP.BUSINESS_INFO:
                setEnableGlobalReimbursementsStep(CONST_1.default.ENABLE_GLOBAL_REIMBURSEMENTS.STEP.AGREEMENTS);
                break;
            case CONST_1.default.ENABLE_GLOBAL_REIMBURSEMENTS.STEP.AGREEMENTS:
                setEnableGlobalReimbursementsStep(CONST_1.default.ENABLE_GLOBAL_REIMBURSEMENTS.STEP.DOCUSIGN);
                break;
            default:
                (0, BankAccounts_1.enableGlobalReimbursementsForUSDBankAccount)({
                    inputs: JSON.stringify({
                        provideTruthfulInformation: enableGlobalReimbursementsDraft?.[EnableGlobalReimbursementsForm_1.default.PROVIDE_TRUTHFUL_INFORMATION],
                        agreeToTermsAndConditions: enableGlobalReimbursementsDraft?.[EnableGlobalReimbursementsForm_1.default.AGREE_TO_TERMS_AND_CONDITIONS],
                        consentToPrivacyNotice: enableGlobalReimbursementsDraft?.[EnableGlobalReimbursementsForm_1.default.CONSENT_TO_PRIVACY_NOTICE],
                        authorizedToBindClientToAgreement: enableGlobalReimbursementsDraft?.[EnableGlobalReimbursementsForm_1.default.AUTHORIZED_TO_BIND_CLIENT_TO_AGREEMENT],
                        natureOfBusiness: enableGlobalReimbursementsDraft?.[EnableGlobalReimbursementsForm_1.default.BUSINESS_CATEGORY],
                        applicantTypeId: enableGlobalReimbursementsDraft?.[EnableGlobalReimbursementsForm_1.default.APPLICANT_TYPE_ID],
                        tradeVolume: enableGlobalReimbursementsDraft?.[EnableGlobalReimbursementsForm_1.default.TRADE_VOLUME],
                        annualVolume: enableGlobalReimbursementsDraft?.[EnableGlobalReimbursementsForm_1.default.ANNUAL_VOLUME],
                        businessRegistrationIncorporationNumber: enableGlobalReimbursementsDraft?.[EnableGlobalReimbursementsForm_1.default.BUSINESS_REGISTRATION_INCORPORATION_NUMBER],
                        fundSourceCountries: country,
                        fundDestinationCountries: country,
                        currencyNeeded: currency,
                        purposeOfTransactionId: CONST_1.default.NON_USD_BANK_ACCOUNT.PURPOSE_OF_TRANSACTION_ID,
                    }),
                    achAuthorizationForm: enableGlobalReimbursementsDraft?.[EnableGlobalReimbursementsForm_1.default.ACH_AUTHORIZATION_FORM].at(0),
                    bankAccountID: Number(bankAccountID),
                });
        }
    };
    const handleEnableGlobalReimbursementGoBack = () => {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS);
        switch (enableGlobalReimbursementsStep) {
            case CONST_1.default.ENABLE_GLOBAL_REIMBURSEMENTS.STEP.BUSINESS_INFO:
                Navigation_1.default.goBack();
                break;
            case CONST_1.default.ENABLE_GLOBAL_REIMBURSEMENTS.STEP.AGREEMENTS:
                setEnableGlobalReimbursementsStep(CONST_1.default.ENABLE_GLOBAL_REIMBURSEMENTS.STEP.BUSINESS_INFO);
                break;
            case CONST_1.default.ENABLE_GLOBAL_REIMBURSEMENTS.STEP.DOCUSIGN:
                setEnableGlobalReimbursementsStep(CONST_1.default.ENABLE_GLOBAL_REIMBURSEMENTS.STEP.AGREEMENTS);
                break;
            default:
                return null;
        }
    };
    (0, react_1.useEffect)(() => {
        return (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS);
    }, []);
    (0, react_1.useEffect)(() => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if (enableGlobalReimbursements?.errors || enableGlobalReimbursements?.isEnablingGlobalReimbursements || !enableGlobalReimbursements?.isSuccess) {
            return;
        }
        if (enableGlobalReimbursements?.isSuccess) {
            (0, BankAccounts_1.clearEnableGlobalReimbursementsForUSDBankAccount)();
            Navigation_1.default.closeRHPFlow();
        }
        return () => {
            (0, BankAccounts_1.clearEnableGlobalReimbursementsForUSDBankAccount)();
        };
    }, [enableGlobalReimbursements?.errors, enableGlobalReimbursements?.isEnablingGlobalReimbursements, enableGlobalReimbursements?.isSuccess]);
    switch (enableGlobalReimbursementsStep) {
        case CONST_1.default.ENABLE_GLOBAL_REIMBURSEMENTS.STEP.BUSINESS_INFO:
            return (<BusinessInfo_1.default onBackButtonPress={handleEnableGlobalReimbursementGoBack} onSubmit={handleNextEnableGlobalReimbursementsStep} currency={currency} country={country}/>);
        case CONST_1.default.ENABLE_GLOBAL_REIMBURSEMENTS.STEP.AGREEMENTS:
            return (<Agreements_1.default onBackButtonPress={handleEnableGlobalReimbursementGoBack} onSubmit={handleNextEnableGlobalReimbursementsStep} currency={currency}/>);
        case CONST_1.default.ENABLE_GLOBAL_REIMBURSEMENTS.STEP.DOCUSIGN:
            return (<Docusign_1.default onBackButtonPress={handleEnableGlobalReimbursementGoBack} onSubmit={handleNextEnableGlobalReimbursementsStep} currency={currency}/>);
        default:
            return null;
    }
}
EnableGlobalReimbursements.displayName = 'EnableGlobalReimbursements';
exports.default = EnableGlobalReimbursements;
