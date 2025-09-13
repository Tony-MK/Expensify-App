"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DateOfBirthStep_1 = require("@components/SubStepForms/DateOfBirthStep");
const useLocalize_1 = require("@hooks/useLocalize");
const usePersonalDetailsFormSubmit_1 = require("@hooks/usePersonalDetailsFormSubmit");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const PersonalDetailsForm_1 = require("@src/types/form/PersonalDetailsForm");
const STEP_FIELDS = [PersonalDetailsForm_1.default.DATE_OF_BIRTH];
function DateOfBirth({ isEditing, onNext, onMove, personalDetailsValues }) {
    const { translate } = (0, useLocalize_1.default)();
    const handleSubmit = (0, usePersonalDetailsFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: true,
    });
    return (<DateOfBirthStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.PERSONAL_DETAILS_FORM} formTitle={translate('privatePersonalDetails.enterDateOfBirth')} onSubmit={handleSubmit} stepFields={STEP_FIELDS} dobInputID={PersonalDetailsForm_1.default.DATE_OF_BIRTH} dobDefaultValue={personalDetailsValues[PersonalDetailsForm_1.default.DATE_OF_BIRTH]}/>);
}
DateOfBirth.displayName = 'DateOfBirth';
exports.default = DateOfBirth;
