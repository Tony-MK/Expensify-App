"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CountryFullStep_1 = require("@components/SubStepForms/CountryFullStep");
function Country({ onBackButtonPress, onSubmit, stepNames, policyID, isComingFromExpensifyCard }) {
    return (<CountryFullStep_1.default onBackButtonPress={onBackButtonPress} onSubmit={onSubmit} isComingFromExpensifyCard={isComingFromExpensifyCard} stepNames={stepNames} policyID={policyID}/>);
}
Country.displayName = 'Country';
exports.default = Country;
