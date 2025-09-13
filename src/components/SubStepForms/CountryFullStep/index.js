"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useSubStep_1 = require("@hooks/useSubStep");
const FormActions_1 = require("@userActions/FormActions");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const Confirmation_1 = require("./subSteps/Confirmation");
const bodyContent = [Confirmation_1.default];
function CountryFullStep({ onBackButtonPress, stepNames, onSubmit, policyID, isComingFromExpensifyCard }) {
    const { translate } = (0, useLocalize_1.default)();
    const { componentToRender: SubStep, isEditing, screenIndex, nextScreen, prevScreen, moveTo, goToTheLastStep, } = (0, useSubStep_1.default)({ bodyContent, startFrom: 0, onFinished: onSubmit });
    const handleBackButtonPress = () => {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM);
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
    return (<InteractiveStepWrapper_1.default wrapperID={CountryFullStep.displayName} handleBackButtonPress={handleBackButtonPress} headerTitle={translate('countryStep.confirmCurrency')} stepNames={stepNames} startStepIndex={0}>
            <SubStep isEditing={isEditing} onNext={nextScreen} onMove={moveTo} isComingFromExpensifyCard={isComingFromExpensifyCard} policyID={policyID}/>
        </InteractiveStepWrapper_1.default>);
}
CountryFullStep.displayName = 'Country';
exports.default = CountryFullStep;
