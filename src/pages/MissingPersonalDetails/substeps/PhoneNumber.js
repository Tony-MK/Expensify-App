"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SingleFieldStep_1 = require("@components/SubStepForms/SingleFieldStep");
const useLocalize_1 = require("@hooks/useLocalize");
const usePersonalDetailsFormSubmit_1 = require("@hooks/usePersonalDetailsFormSubmit");
const LoginUtils_1 = require("@libs/LoginUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const PersonalDetailsForm_1 = require("@src/types/form/PersonalDetailsForm");
const STEP_FIELDS = [PersonalDetailsForm_1.default.PHONE_NUMBER];
function PhoneNumberStep({ isEditing, onNext, onMove, personalDetailsValues }) {
    const { translate } = (0, useLocalize_1.default)();
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        const phoneNumber = values[PersonalDetailsForm_1.default.PHONE_NUMBER];
        const phoneNumberWithCountryCode = (0, LoginUtils_1.appendCountryCode)(phoneNumber);
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(phoneNumber)) {
            errors[PersonalDetailsForm_1.default.PHONE_NUMBER] = translate('common.error.fieldRequired');
            return errors;
        }
        if (!(0, ValidationUtils_1.isValidPhoneNumber)(phoneNumberWithCountryCode)) {
            errors[PersonalDetailsForm_1.default.PHONE_NUMBER] = translate('common.error.phoneNumber');
        }
        return errors;
    }, [translate]);
    const handleSubmit = (0, usePersonalDetailsFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: true,
    });
    return (<SingleFieldStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.PERSONAL_DETAILS_FORM} formTitle={translate('privatePersonalDetails.enterPhoneNumber')} validate={validate} onSubmit={(values) => {
            handleSubmit({ ...values, phoneNumber: (0, LoginUtils_1.formatE164PhoneNumber)(values[PersonalDetailsForm_1.default.PHONE_NUMBER]) ?? '' });
        }} inputId={PersonalDetailsForm_1.default.PHONE_NUMBER} inputLabel={translate('common.phoneNumber')} inputMode={CONST_1.default.INPUT_MODE.TEL} defaultValue={personalDetailsValues[PersonalDetailsForm_1.default.PHONE_NUMBER]} shouldShowHelpLinks={false}/>);
}
PhoneNumberStep.displayName = 'PhoneNumberStep';
exports.default = PhoneNumberStep;
