"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const BankInfo_1 = require("./BankInfo/BankInfo");
const BeneficialOwnersStep_1 = require("./BeneficialOwnerInfo/BeneficialOwnersStep");
const BusinessInfo_1 = require("./BusinessInfo/BusinessInfo");
const CompleteVerification_1 = require("./CompleteVerification/CompleteVerification");
const ConnectBankAccount_1 = require("./ConnectBankAccount/ConnectBankAccount");
const Country_1 = require("./Country");
const RequestorStep_1 = require("./Requestor/RequestorStep");
function USDVerifiedBankAccountFlow({ USDBankAccountStep, policyID = '', onBackButtonPress, requestorStepRef, onfidoToken, setUSDBankAccountStep, setShouldShowConnectedVerifiedBankAccount, }) {
    const styles = (0, useThemeStyles_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    let CurrentStep;
    switch (USDBankAccountStep) {
        case CONST_1.default.BANK_ACCOUNT.STEP.COUNTRY:
            CurrentStep = (<Country_1.default onBackButtonPress={onBackButtonPress} policyID={policyID} setUSDBankAccountStep={setUSDBankAccountStep} stepNames={CONST_1.default.BANK_ACCOUNT.STEP_NAMES}/>);
            break;
        case CONST_1.default.BANK_ACCOUNT.STEP.BANK_ACCOUNT:
            CurrentStep = (<BankInfo_1.default onBackButtonPress={onBackButtonPress} policyID={policyID} setUSDBankAccountStep={setUSDBankAccountStep}/>);
            break;
        case CONST_1.default.BANK_ACCOUNT.STEP.REQUESTOR:
            CurrentStep = (<RequestorStep_1.default ref={requestorStepRef} shouldShowOnfido={!!(onfidoToken && !reimbursementAccount?.achData?.isOnfidoSetupComplete)} onBackButtonPress={onBackButtonPress}/>);
            break;
        case CONST_1.default.BANK_ACCOUNT.STEP.COMPANY:
            CurrentStep = <BusinessInfo_1.default onBackButtonPress={onBackButtonPress}/>;
            break;
        case CONST_1.default.BANK_ACCOUNT.STEP.BENEFICIAL_OWNERS:
            CurrentStep = <BeneficialOwnersStep_1.default onBackButtonPress={onBackButtonPress}/>;
            break;
        case CONST_1.default.BANK_ACCOUNT.STEP.ACH_CONTRACT:
            CurrentStep = <CompleteVerification_1.default onBackButtonPress={onBackButtonPress}/>;
            break;
        case CONST_1.default.BANK_ACCOUNT.STEP.VALIDATION:
            CurrentStep = (<ConnectBankAccount_1.default onBackButtonPress={onBackButtonPress} setUSDBankAccountStep={setUSDBankAccountStep} setShouldShowConnectedVerifiedBankAccount={setShouldShowConnectedVerifiedBankAccount}/>);
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
USDVerifiedBankAccountFlow.displayName = 'USDVerifiedBankAccountFlow';
exports.default = USDVerifiedBankAccountFlow;
