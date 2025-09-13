"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
var useLocalize_1 = require("@hooks/useLocalize");
var useSubStep_1 = require("@hooks/useSubStep");
var FormActions_1 = require("@userActions/FormActions");
var Confirmation_1 = require("./subSteps/Confirmation");
function AgreementsFullStep(_a) {
    var defaultValues = _a.defaultValues, formID = _a.formID, inputIDs = _a.inputIDs, isLoading = _a.isLoading, onBackButtonPress = _a.onBackButtonPress, onSubmit = _a.onSubmit, currency = _a.currency, stepNames = _a.stepNames, startStepIndex = _a.startStepIndex;
    var translate = (0, useLocalize_1.default)().translate;
    var bodyContent = [Confirmation_1.default];
    var _b = (0, useSubStep_1.default)({ bodyContent: bodyContent, startFrom: 0, onFinished: onSubmit }), SubStep = _b.componentToRender, isEditing = _b.isEditing, screenIndex = _b.screenIndex, nextScreen = _b.nextScreen, prevScreen = _b.prevScreen, moveTo = _b.moveTo, goToTheLastStep = _b.goToTheLastStep;
    var handleBackButtonPress = function () {
        (0, FormActions_1.clearErrors)(formID);
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
    return (<InteractiveStepWrapper_1.default wrapperID={AgreementsFullStep.displayName} handleBackButtonPress={handleBackButtonPress} headerTitle={translate('agreementsStep.agreements')} stepNames={stepNames} startStepIndex={startStepIndex}>
            <SubStep defaultValues={defaultValues} formID={formID} inputIDs={inputIDs} isEditing={isEditing} isLoading={isLoading} onMove={moveTo} onNext={nextScreen} currency={currency}/>
        </InteractiveStepWrapper_1.default>);
}
AgreementsFullStep.displayName = 'AgreementsFullStep';
exports.default = AgreementsFullStep;
