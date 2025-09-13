"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullNameStep_1 = require("@components/SubStepForms/FullNameStep");
const useLocalize_1 = require("@hooks/useLocalize");
const usePersonalDetailsFormSubmit_1 = require("@hooks/usePersonalDetailsFormSubmit");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const PersonalDetailsForm_1 = require("@src/types/form/PersonalDetailsForm");
const STEP_FIELDS = [PersonalDetailsForm_1.default.LEGAL_FIRST_NAME, PersonalDetailsForm_1.default.LEGAL_LAST_NAME];
function LegalName({ isEditing, onNext, onMove, personalDetailsValues }) {
    const { translate } = (0, useLocalize_1.default)();
    const defaultValues = {
        firstName: personalDetailsValues[PersonalDetailsForm_1.default.LEGAL_FIRST_NAME],
        lastName: personalDetailsValues[PersonalDetailsForm_1.default.LEGAL_LAST_NAME],
    };
    const handleSubmit = (0, usePersonalDetailsFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: true,
    });
    return (<FullNameStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.PERSONAL_DETAILS_FORM} formTitle={translate('privatePersonalDetails.enterLegalName')} onSubmit={handleSubmit} stepFields={STEP_FIELDS} firstNameInputID={PersonalDetailsForm_1.default.LEGAL_FIRST_NAME} lastNameInputID={PersonalDetailsForm_1.default.LEGAL_LAST_NAME} defaultValues={defaultValues} shouldShowHelpLinks={false}/>);
}
LegalName.displayName = 'LegalName';
exports.default = LegalName;
