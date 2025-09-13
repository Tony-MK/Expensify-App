"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
var useLocalize_1 = require("@hooks/useLocalize");
var useSubStep_1 = require("@hooks/useSubStep");
var FormActions_1 = require("@userActions/FormActions");
var UploadPowerform_1 = require("./subSteps/UploadPowerform");
function DocusignFullStep(_a) {
    var defaultValue = _a.defaultValue, formID = _a.formID, inputID = _a.inputID, isLoading = _a.isLoading, onBackButtonPress = _a.onBackButtonPress, onSubmit = _a.onSubmit, currency = _a.currency, startStepIndex = _a.startStepIndex, stepNames = _a.stepNames;
    var translate = (0, useLocalize_1.default)().translate;
    var bodyContent = [UploadPowerform_1.default];
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
    return (<InteractiveStepWrapper_1.default wrapperID={DocusignFullStep.displayName} handleBackButtonPress={handleBackButtonPress} headerTitle={translate('docusignStep.subheader')} stepNames={stepNames} startStepIndex={startStepIndex}>
            <SubStep defaultValue={defaultValue} formID={formID} inputID={inputID} isLoading={isLoading} isEditing={isEditing} onMove={moveTo} onNext={nextScreen} currency={currency}/>
        </InteractiveStepWrapper_1.default>);
}
DocusignFullStep.displayName = 'DocusignFullStep';
exports.default = DocusignFullStep;
