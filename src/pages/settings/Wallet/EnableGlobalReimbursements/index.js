"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useOnyx_1 = require("@hooks/useOnyx");
var Navigation_1 = require("@navigation/Navigation");
var BankAccounts_1 = require("@userActions/BankAccounts");
var FormActions_1 = require("@userActions/FormActions");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var EnableGlobalReimbursementsForm_1 = require("@src/types/form/EnableGlobalReimbursementsForm");
var Agreements_1 = require("./Agreements");
var BusinessInfo_1 = require("./BusinessInfo");
var Docusign_1 = require("./Docusign");
function EnableGlobalReimbursements(_a) {
    var _b, _c, _d, _e;
    var route = _a.route;
    var bankAccountID = (_b = route.params) === null || _b === void 0 ? void 0 : _b.bankAccountID;
    var bankAccountList = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: false })[0];
    var enableGlobalReimbursements = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS, { canBeMissing: true })[0];
    var enableGlobalReimbursementsDraft = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS_DRAFT, { canBeMissing: true })[0];
    var currency = (_d = (_c = bankAccountList === null || bankAccountList === void 0 ? void 0 : bankAccountList[bankAccountID]) === null || _c === void 0 ? void 0 : _c.bankCurrency) !== null && _d !== void 0 ? _d : '';
    var country = (_e = bankAccountList === null || bankAccountList === void 0 ? void 0 : bankAccountList[bankAccountID]) === null || _e === void 0 ? void 0 : _e.bankCountry;
    var _f = (0, react_1.useState)(CONST_1.default.ENABLE_GLOBAL_REIMBURSEMENTS.STEP.BUSINESS_INFO), enableGlobalReimbursementsStep = _f[0], setEnableGlobalReimbursementsStep = _f[1];
    (0, react_1.useEffect)(function () {
        (0, BankAccounts_1.getCorpayOnboardingFields)(country);
    }, [country]);
    var handleNextEnableGlobalReimbursementsStep = function () {
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
                        provideTruthfulInformation: enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[EnableGlobalReimbursementsForm_1.default.PROVIDE_TRUTHFUL_INFORMATION],
                        agreeToTermsAndConditions: enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[EnableGlobalReimbursementsForm_1.default.AGREE_TO_TERMS_AND_CONDITIONS],
                        consentToPrivacyNotice: enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[EnableGlobalReimbursementsForm_1.default.CONSENT_TO_PRIVACY_NOTICE],
                        authorizedToBindClientToAgreement: enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[EnableGlobalReimbursementsForm_1.default.AUTHORIZED_TO_BIND_CLIENT_TO_AGREEMENT],
                        natureOfBusiness: enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[EnableGlobalReimbursementsForm_1.default.BUSINESS_CATEGORY],
                        applicantTypeId: enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[EnableGlobalReimbursementsForm_1.default.APPLICANT_TYPE_ID],
                        tradeVolume: enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[EnableGlobalReimbursementsForm_1.default.TRADE_VOLUME],
                        annualVolume: enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[EnableGlobalReimbursementsForm_1.default.ANNUAL_VOLUME],
                        businessRegistrationIncorporationNumber: enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[EnableGlobalReimbursementsForm_1.default.BUSINESS_REGISTRATION_INCORPORATION_NUMBER],
                        fundSourceCountries: country,
                        fundDestinationCountries: country,
                        currencyNeeded: currency,
                        purposeOfTransactionId: CONST_1.default.NON_USD_BANK_ACCOUNT.PURPOSE_OF_TRANSACTION_ID,
                    }),
                    achAuthorizationForm: enableGlobalReimbursementsDraft === null || enableGlobalReimbursementsDraft === void 0 ? void 0 : enableGlobalReimbursementsDraft[EnableGlobalReimbursementsForm_1.default.ACH_AUTHORIZATION_FORM].at(0),
                    bankAccountID: Number(bankAccountID),
                });
        }
    };
    var handleEnableGlobalReimbursementGoBack = function () {
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
    (0, react_1.useEffect)(function () {
        return (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS);
    }, []);
    (0, react_1.useEffect)(function () {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        if ((enableGlobalReimbursements === null || enableGlobalReimbursements === void 0 ? void 0 : enableGlobalReimbursements.errors) || (enableGlobalReimbursements === null || enableGlobalReimbursements === void 0 ? void 0 : enableGlobalReimbursements.isEnablingGlobalReimbursements) || !(enableGlobalReimbursements === null || enableGlobalReimbursements === void 0 ? void 0 : enableGlobalReimbursements.isSuccess)) {
            return;
        }
        if (enableGlobalReimbursements === null || enableGlobalReimbursements === void 0 ? void 0 : enableGlobalReimbursements.isSuccess) {
            (0, BankAccounts_1.clearEnableGlobalReimbursementsForUSDBankAccount)();
            Navigation_1.default.closeRHPFlow();
        }
        return function () {
            (0, BankAccounts_1.clearEnableGlobalReimbursementsForUSDBankAccount)();
        };
    }, [enableGlobalReimbursements === null || enableGlobalReimbursements === void 0 ? void 0 : enableGlobalReimbursements.errors, enableGlobalReimbursements === null || enableGlobalReimbursements === void 0 ? void 0 : enableGlobalReimbursements.isEnablingGlobalReimbursements, enableGlobalReimbursements === null || enableGlobalReimbursements === void 0 ? void 0 : enableGlobalReimbursements.isSuccess]);
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
