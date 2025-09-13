"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CountryFullStep_1 = require("@components/SubStepForms/CountryFullStep");
const ReimbursementAccount_1 = require("@userActions/ReimbursementAccount");
const CONST_1 = require("@src/CONST");
function Country({ onBackButtonPress, stepNames, setUSDBankAccountStep, policyID }) {
    const submit = () => {
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
