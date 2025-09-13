"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useSubStep_1 = require("@hooks/useSubStep");
const FormActions_1 = require("@userActions/FormActions");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const AverageReimbursement_1 = require("./subSteps/AverageReimbursement");
const BusinessType_1 = require("./subSteps/BusinessType");
const Confirmation_1 = require("./subSteps/Confirmation");
const PaymentVolume_1 = require("./subSteps/PaymentVolume");
const RegistrationNumber_1 = require("./subSteps/RegistrationNumber");
const bodyContent = [RegistrationNumber_1.default, BusinessType_1.default, PaymentVolume_1.default, AverageReimbursement_1.default, Confirmation_1.default];
function BusinessInfo({ onBackButtonPress, onSubmit, currency, country }) {
    const { translate } = (0, useLocalize_1.default)();
    const { componentToRender: SubStep, isEditing, screenIndex, nextScreen, prevScreen, moveTo, goToTheLastStep, } = (0, useSubStep_1.default)({ bodyContent, startFrom: 0, onFinished: onSubmit });
    const handleBackButtonPress = () => {
        (0, FormActions_1.clearErrors)(ONYXKEYS_1.default.FORMS.ENABLE_GLOBAL_REIMBURSEMENTS);
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
    return (<InteractiveStepWrapper_1.default wrapperID={BusinessInfo.displayName} handleBackButtonPress={handleBackButtonPress} headerTitle={translate('businessInfoStep.businessInfoTitle')} stepNames={CONST_1.default.ENABLE_GLOBAL_REIMBURSEMENTS.STEP_NAMES} startStepIndex={0}>
            <SubStep isEditing={isEditing} onNext={nextScreen} onMove={moveTo} screenIndex={screenIndex} country={country} currency={currency}/>
        </InteractiveStepWrapper_1.default>);
}
BusinessInfo.displayName = 'BusinessInfo';
exports.default = BusinessInfo;
