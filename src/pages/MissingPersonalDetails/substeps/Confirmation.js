"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmationStep_1 = require("@components/SubStepForms/ConfirmationStep");
const useLocalize_1 = require("@hooks/useLocalize");
const CONST_1 = require("@src/CONST");
const PersonalDetailsForm_1 = require("@src/types/form/PersonalDetailsForm");
const PERSONAL_DETAILS_STEP_INDEXES = CONST_1.default.MISSING_PERSONAL_DETAILS_INDEXES.MAPPING;
function Confirmation({ personalDetailsValues: values, onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const summaryItems = [
        {
            description: translate('personalInfoStep.legalName'),
            title: `${values[PersonalDetailsForm_1.default.LEGAL_FIRST_NAME]} ${values[PersonalDetailsForm_1.default.LEGAL_LAST_NAME]}`,
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(PERSONAL_DETAILS_STEP_INDEXES.LEGAL_NAME);
            },
        },
        {
            description: translate('common.dob'),
            title: values[PersonalDetailsForm_1.default.DATE_OF_BIRTH],
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(PERSONAL_DETAILS_STEP_INDEXES.DATE_OF_BIRTH);
            },
        },
        {
            description: translate('personalInfoStep.address'),
            title: `${values[PersonalDetailsForm_1.default.ADDRESS_LINE_1]}, ${values[PersonalDetailsForm_1.default.ADDRESS_LINE_2] ? `${values[PersonalDetailsForm_1.default.ADDRESS_LINE_2]}, ` : ''}${values[PersonalDetailsForm_1.default.CITY]}, ${values[PersonalDetailsForm_1.default.STATE]}, ${values[PersonalDetailsForm_1.default.ZIP_POST_CODE].toUpperCase()}, ${values[PersonalDetailsForm_1.default.COUNTRY]}`,
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(PERSONAL_DETAILS_STEP_INDEXES.ADDRESS);
            },
        },
        {
            description: translate('common.phoneNumber'),
            title: values[PersonalDetailsForm_1.default.PHONE_NUMBER],
            shouldShowRightIcon: true,
            onPress: () => {
                onMove(PERSONAL_DETAILS_STEP_INDEXES.PHONE_NUMBER);
            },
        },
    ];
    return (<ConfirmationStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} pageTitle={translate('personalInfoStep.letsDoubleCheck')} summaryItems={summaryItems} showOnfidoLinks={false}/>);
}
Confirmation.displayName = 'Confirmation';
exports.default = Confirmation;
