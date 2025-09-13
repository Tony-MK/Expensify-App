"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useSubStep_1 = require("@hooks/useSubStep");
const FormActions_1 = require("@userActions/FormActions");
const Confirmation_1 = require("./subSteps/Confirmation");
function AgreementsFullStep({ defaultValues, formID, inputIDs, isLoading, onBackButtonPress, onSubmit, currency, stepNames, startStepIndex, }) {
    const { translate } = (0, useLocalize_1.default)();
    const bodyContent = [Confirmation_1.default];
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
    return (<InteractiveStepWrapper_1.default wrapperID={AgreementsFullStep.displayName} handleBackButtonPress={handleBackButtonPress} headerTitle={translate('agreementsStep.agreements')} stepNames={stepNames} startStepIndex={startStepIndex}>
            <SubStep defaultValues={defaultValues} formID={formID} inputIDs={inputIDs} isEditing={isEditing} isLoading={isLoading} onMove={moveTo} onNext={nextScreen} currency={currency}/>
        </InteractiveStepWrapper_1.default>);
}
AgreementsFullStep.displayName = 'AgreementsFullStep';
exports.default = AgreementsFullStep;
