"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var BankInfo_1 = require("./BankInfo/BankInfo");
var BeneficialOwnersStep_1 = require("./BeneficialOwnerInfo/BeneficialOwnersStep");
var BusinessInfo_1 = require("./BusinessInfo/BusinessInfo");
var CompleteVerification_1 = require("./CompleteVerification/CompleteVerification");
var ConnectBankAccount_1 = require("./ConnectBankAccount/ConnectBankAccount");
var Country_1 = require("./Country");
var RequestorStep_1 = require("./Requestor/RequestorStep");
function USDVerifiedBankAccountFlow(_a) {
    var _b;
    var USDBankAccountStep = _a.USDBankAccountStep, _c = _a.policyID, policyID = _c === void 0 ? '' : _c, onBackButtonPress = _a.onBackButtonPress, requestorStepRef = _a.requestorStepRef, onfidoToken = _a.onfidoToken, setUSDBankAccountStep = _a.setUSDBankAccountStep, setShouldShowConnectedVerifiedBankAccount = _a.setShouldShowConnectedVerifiedBankAccount;
    var styles = (0, useThemeStyles_1.default)();
    var reimbursementAccount = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false })[0];
    var CurrentStep;
    switch (USDBankAccountStep) {
        case CONST_1.default.BANK_ACCOUNT.STEP.COUNTRY:
            CurrentStep = (<Country_1.default onBackButtonPress={onBackButtonPress} policyID={policyID} setUSDBankAccountStep={setUSDBankAccountStep} stepNames={CONST_1.default.BANK_ACCOUNT.STEP_NAMES}/>);
            break;
        case CONST_1.default.BANK_ACCOUNT.STEP.BANK_ACCOUNT:
            CurrentStep = (<BankInfo_1.default onBackButtonPress={onBackButtonPress} policyID={policyID} setUSDBankAccountStep={setUSDBankAccountStep}/>);
            break;
        case CONST_1.default.BANK_ACCOUNT.STEP.REQUESTOR:
            CurrentStep = (<RequestorStep_1.default ref={requestorStepRef} shouldShowOnfido={!!(onfidoToken && !((_b = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.achData) === null || _b === void 0 ? void 0 : _b.isOnfidoSetupComplete))} onBackButtonPress={onBackButtonPress}/>);
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
