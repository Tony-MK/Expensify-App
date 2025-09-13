"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useSubStep_1 = require("@hooks/useSubStep");
const FormActions_1 = require("@userActions/FormActions");
const UploadPowerform_1 = require("./subSteps/UploadPowerform");
function DocusignFullStep({ defaultValue, formID, inputID, isLoading, onBackButtonPress, onSubmit, currency, startStepIndex, stepNames, }) {
    const { translate } = (0, useLocalize_1.default)();
    const bodyContent = [UploadPowerform_1.default];
    const { componentToRender: SubStep, isEditing, screenIndex, nextScreen, prevScreen, moveTo, goToTheLastStep, } = (0, useSubStep_1.default)({ bodyContent, startFrom: 0, onFinished: onSubmit });
    const handleBackButtonPress = () => {
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
