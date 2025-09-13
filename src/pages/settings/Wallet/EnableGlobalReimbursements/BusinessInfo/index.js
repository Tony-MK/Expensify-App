"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var InteractiveStepWrapper_1 = require("@components/InteractiveStepWrapper");
var useLocalize_1 = require("@hooks/useLocalize");
var useSubStep_1 = require("@hooks/useSubStep");
var FormActions_1 = require("@userActions/FormActions");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var AverageReimbursement_1 = require("./subSteps/AverageReimbursement");
var BusinessType_1 = require("./subSteps/BusinessType");
var Confirmation_1 = require("./subSteps/Confirmation");
var PaymentVolume_1 = require("./subSteps/PaymentVolume");
var RegistrationNumber_1 = require("./subSteps/RegistrationNumber");
var bodyContent = [RegistrationNumber_1.default, BusinessType_1.default, PaymentVolume_1.default, AverageReimbursement_1.default, Confirmation_1.default];
function BusinessInfo(_a) {
    var onBackButtonPress = _a.onBackButtonPress, onSubmit = _a.onSubmit, currency = _a.currency, country = _a.country;
    var translate = (0, useLocalize_1.default)().translate;
    var _b = (0, useSubStep_1.default)({ bodyContent: bodyContent, startFrom: 0, onFinished: onSubmit }), SubStep = _b.componentToRender, isEditing = _b.isEditing, screenIndex = _b.screenIndex, nextScreen = _b.nextScreen, prevScreen = _b.prevScreen, moveTo = _b.moveTo, goToTheLastStep = _b.goToTheLastStep;
    var handleBackButtonPress = function () {
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
