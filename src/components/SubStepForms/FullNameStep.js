"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const HelpLinks_1 = require("@pages/ReimbursementAccount/USD/Requestor/PersonalInfo/HelpLinks");
const CONST_1 = require("@src/CONST");
function FullNameStep({ formID, formTitle, customValidate, onSubmit, stepFields, firstNameInputID, lastNameInputID, defaultValues, isEditing, shouldShowHelpLinks = true, customFirstNameLabel, customLastNameLabel, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, stepFields);
        const firstName = values[firstNameInputID];
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(firstName)) {
            // @ts-expect-error type mismatch to be fixed
            errors[firstNameInputID] = translate('common.error.fieldRequired');
        }
        else if (!(0, ValidationUtils_1.isValidLegalName)(firstName)) {
            // @ts-expect-error type mismatch to be fixed
            errors[firstNameInputID] = translate('privatePersonalDetails.error.hasInvalidCharacter');
        }
        else if (firstName.length > CONST_1.default.LEGAL_NAME.MAX_LENGTH) {
            // @ts-expect-error type mismatch to be fixed
            errors[firstNameInputID] = translate('common.error.characterLimitExceedCounter', {
                length: firstName.length,
                limit: CONST_1.default.LEGAL_NAME.MAX_LENGTH,
            });
        }
        if ((0, ValidationUtils_1.doesContainReservedWord)(firstName, CONST_1.default.DISPLAY_NAME.RESERVED_NAMES)) {
            // @ts-expect-error type mismatch to be fixed
            errors[firstNameInputID] = translate('personalDetails.error.containsReservedWord');
        }
        const lastName = values[lastNameInputID];
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(lastName)) {
            // @ts-expect-error type mismatch to be fixed
            errors[lastNameInputID] = translate('common.error.fieldRequired');
        }
        else if (!(0, ValidationUtils_1.isValidLegalName)(lastName)) {
            // @ts-expect-error type mismatch to be fixed
            errors[lastNameInputID] = translate('privatePersonalDetails.error.hasInvalidCharacter');
        }
        else if (lastName.length > CONST_1.default.LEGAL_NAME.MAX_LENGTH) {
            // @ts-expect-error type mismatch to be fixed
            errors[lastNameInputID] = translate('common.error.characterLimitExceedCounter', {
                length: lastName.length,
                limit: CONST_1.default.LEGAL_NAME.MAX_LENGTH,
            });
        }
        if ((0, ValidationUtils_1.doesContainReservedWord)(lastName, CONST_1.default.DISPLAY_NAME.RESERVED_NAMES)) {
            // @ts-expect-error type mismatch to be fixed
            errors[lastNameInputID] = translate('personalDetails.error.containsReservedWord');
        }
        return errors;
    }, [firstNameInputID, lastNameInputID, stepFields, translate]);
    return (<FormProvider_1.default formID={formID} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} validate={customValidate ?? validate} onSubmit={onSubmit} style={[styles.mh5, styles.flexGrow1]} enabledWhenOffline>
            <react_native_1.View>
                <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb6]}>{formTitle}</Text_1.default>
                <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={firstNameInputID} label={customFirstNameLabel ?? translate('personalInfoStep.legalFirstName')} aria-label={customFirstNameLabel ?? translate('personalInfoStep.legalFirstName')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={defaultValues.firstName} shouldSaveDraft={!isEditing} containerStyles={[styles.mb6]}/>
                <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={lastNameInputID} label={customLastNameLabel ?? translate('personalInfoStep.legalLastName')} aria-label={customLastNameLabel ?? translate('personalInfoStep.legalLastName')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={defaultValues.lastName} shouldSaveDraft={!isEditing} containerStyles={[styles.mb6]}/>
                {shouldShowHelpLinks && <HelpLinks_1.default />}
            </react_native_1.View>
        </FormProvider_1.default>);
}
FullNameStep.displayName = 'FullNameStep';
exports.default = FullNameStep;
