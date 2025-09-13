"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var CountryFullStep_1 = require("@components/SubStepForms/CountryFullStep");
function Country(_a) {
    var onBackButtonPress = _a.onBackButtonPress, onSubmit = _a.onSubmit, stepNames = _a.stepNames, policyID = _a.policyID, isComingFromExpensifyCard = _a.isComingFromExpensifyCard;
    return (<CountryFullStep_1.default onBackButtonPress={onBackButtonPress} onSubmit={onSubmit} isComingFromExpensifyCard={isComingFromExpensifyCard} stepNames={stepNames} policyID={policyID}/>);
}
Country.displayName = 'Country';
exports.default = Country;
