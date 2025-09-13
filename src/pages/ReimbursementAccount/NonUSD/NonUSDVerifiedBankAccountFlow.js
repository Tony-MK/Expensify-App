"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var FormActions_1 = require("@userActions/FormActions");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var Agreements_1 = require("./Agreements");
var BankInfo_1 = require("./BankInfo/BankInfo");
var BeneficialOwnerInfo_1 = require("./BeneficialOwnerInfo/BeneficialOwnerInfo");
var BusinessInfo_1 = require("./BusinessInfo/BusinessInfo");
var Country_1 = require("./Country");
var Docusign_1 = require("./Docusign");
var Finish_1 = require("./Finish");
var SignerInfo_1 = require("./SignerInfo");
var requiresDocusignStep_1 = require("./utils/requiresDocusignStep");
function NonUSDVerifiedBankAccountFlow(_a) {
    var nonUSDBankAccountStep = _a.nonUSDBankAccountStep, setNonUSDBankAccountStep = _a.setNonUSDBankAccountStep, setShouldShowContinueSetupButton = _a.setShouldShowContinueSetupButton, policyID = _a.policyID, shouldShowContinueSetupButtonValue = _a.shouldShowContinueSetupButtonValue, policyCurrency = _a.policyCurrency, isComingFromExpensifyCard = _a.isComingFromExpensifyCard;
    var styles = (0, useThemeStyles_1.default)();
    var isDocusignStepRequired = (0, requiresDocusignStep_1.default)(policyCurrency);
    var stepNames = isDocusignStepRequired ? CONST_1.default.NON_USD_BANK_ACCOUNT.DOCUSIGN_REQUIRED_STEP_NAMES : CONST_1.default.NON_USD_BANK_ACCOUNT.STEP_NAMES;
    var handleNextNonUSDBankAccountStep = function () {
        switch (nonUSDBankAccountStep) {
            case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.COUNTRY:
                setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BANK_INFO);
                break;
            case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BANK_INFO:
                setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BUSINESS_INFO);
                break;
            case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BUSINESS_INFO:
                setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BENEFICIAL_OWNER_INFO);
                break;
            case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BENEFICIAL_OWNER_INFO:
                setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.SIGNER_INFO);
                break;
            case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.SIGNER_INFO:
                setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.AGREEMENTS);
                break;
            case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.AGREEMENTS:
                setNonUSDBankAccountStep(isDocusignStepRequired ? CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.DOCUSIGN : CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.FINISH);
                break;
            case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.DOCUSIGN:
                setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.FINISH);
                break;
            default:
                return null;
        }
    };
    var nonUSDBankAccountsGoBack = function () {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM);
        switch (nonUSDBankAccountStep) {
            case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.COUNTRY:
                setNonUSDBankAccountStep(null);
                setShouldShowContinueSetupButton(shouldShowContinueSetupButtonValue);
                break;
            case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BANK_INFO:
                setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.COUNTRY);
                break;
            case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BUSINESS_INFO:
                setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BANK_INFO);
                break;
            case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BENEFICIAL_OWNER_INFO:
                setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BUSINESS_INFO);
                break;
            case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.SIGNER_INFO:
                setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BENEFICIAL_OWNER_INFO);
                break;
            case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.AGREEMENTS:
                setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.SIGNER_INFO);
                break;
            case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.DOCUSIGN:
                setNonUSDBankAccountStep(CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.AGREEMENTS);
                break;
            case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.FINISH:
                setShouldShowContinueSetupButton(true);
                setNonUSDBankAccountStep(null);
                break;
            default:
                return null;
        }
    };
    var CurrentStep;
    switch (nonUSDBankAccountStep) {
        case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.COUNTRY:
            CurrentStep = (<Country_1.default onBackButtonPress={nonUSDBankAccountsGoBack} onSubmit={handleNextNonUSDBankAccountStep} policyID={policyID} isComingFromExpensifyCard={isComingFromExpensifyCard} stepNames={stepNames}/>);
            break;
        case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BANK_INFO:
            CurrentStep = (<BankInfo_1.default onBackButtonPress={nonUSDBankAccountsGoBack} onSubmit={handleNextNonUSDBankAccountStep} policyID={policyID} stepNames={stepNames}/>);
            break;
        case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BUSINESS_INFO:
            CurrentStep = (<BusinessInfo_1.default onBackButtonPress={nonUSDBankAccountsGoBack} onSubmit={handleNextNonUSDBankAccountStep} stepNames={stepNames}/>);
            break;
        case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.BENEFICIAL_OWNER_INFO:
            CurrentStep = (<BeneficialOwnerInfo_1.default onBackButtonPress={nonUSDBankAccountsGoBack} onSubmit={handleNextNonUSDBankAccountStep} stepNames={stepNames}/>);
            break;
        case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.SIGNER_INFO:
            CurrentStep = (<SignerInfo_1.default onBackButtonPress={nonUSDBankAccountsGoBack} onSubmit={handleNextNonUSDBankAccountStep} stepNames={stepNames}/>);
            break;
        case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.AGREEMENTS:
            CurrentStep = (<Agreements_1.default onBackButtonPress={nonUSDBankAccountsGoBack} onSubmit={handleNextNonUSDBankAccountStep} policyCurrency={policyCurrency} stepNames={stepNames}/>);
            break;
        case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.DOCUSIGN:
            CurrentStep = (<Docusign_1.default onBackButtonPress={nonUSDBankAccountsGoBack} onSubmit={handleNextNonUSDBankAccountStep} policyCurrency={policyCurrency} stepNames={stepNames}/>);
            break;
        case CONST_1.default.NON_USD_BANK_ACCOUNT.STEP.FINISH:
            CurrentStep = <Finish_1.default />;
            break;
        default:
            CurrentStep = null;
            break;
    }
    if (CurrentStep) {
        return (<react_native_1.View style={styles.flex1} fsClass={CONST_1.default.FULLSTORY.CLASS.MASK}>
                {CurrentStep}
            </react_native_1.View>);
    }
    return null;
}
NonUSDVerifiedBankAccountFlow.displayName = 'NonUSDVerifiedBankAccountFlow';
exports.default = NonUSDVerifiedBankAccountFlow;
