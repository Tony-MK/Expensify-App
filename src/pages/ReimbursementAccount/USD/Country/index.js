"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var CountryFullStep_1 = require("@components/SubStepForms/CountryFullStep");
var ReimbursementAccount_1 = require("@userActions/ReimbursementAccount");
var CONST_1 = require("@src/CONST");
function Country(_a) {
    var onBackButtonPress = _a.onBackButtonPress, stepNames = _a.stepNames, setUSDBankAccountStep = _a.setUSDBankAccountStep, policyID = _a.policyID;
    var submit = function () {
        if (!setUSDBankAccountStep) {
            return;
        }
        setUSDBankAccountStep(CONST_1.default.BANK_ACCOUNT.STEP.BANK_ACCOUNT);
        (0, ReimbursementAccount_1.goToWithdrawalAccountSetupStep)(CONST_1.default.BANK_ACCOUNT.STEP.BANK_ACCOUNT);
    };
    return (<CountryFullStep_1.default onBackButtonPress={onBackButtonPress} onSubmit={submit} stepNames={stepNames} policyID={policyID}/>);
}
Country.displayName = 'Country';
exports.default = Country;
