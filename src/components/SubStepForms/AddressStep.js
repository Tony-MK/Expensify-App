"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const AddressFormFields_1 = require("@pages/ReimbursementAccount/AddressFormFields");
const HelpLinks_1 = require("@pages/ReimbursementAccount/USD/Requestor/PersonalInfo/HelpLinks");
function AddressStep({ formID, formTitle, formPOBoxDisclaimer, customValidate, onSubmit, stepFields, inputFieldsIDs, defaultValues, shouldShowHelpLinks, isEditing, shouldDisplayCountrySelector = false, shouldDisplayStateSelector = true, stateSelectorLabel, stateSelectorModalHeaderTitle, stateSelectorSearchInputTitle, onCountryChange, streetTranslationKey = 'common.streetAddress', shouldAllowCountryChange = true, shouldValidateZipCodeFormat = true, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const formRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        // When stepFields change (e.g. country changes) we need to reset state errors manually
        formRef.current?.resetFormFieldError(inputFieldsIDs.state);
    }, [inputFieldsIDs.state, stepFields]);
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, stepFields);
        const street = values[inputFieldsIDs.street];
        if (street && !(0, ValidationUtils_1.isValidAddress)(street)) {
            // @ts-expect-error type mismatch to be fixed
            errors[inputFieldsIDs.street] = translate('bankAccount.error.addressStreet');
        }
        const zipCode = values[inputFieldsIDs.zipCode];
        if (shouldValidateZipCodeFormat && zipCode && (shouldDisplayCountrySelector ? !(0, ValidationUtils_1.isValidZipCodeInternational)(zipCode) : !(0, ValidationUtils_1.isValidZipCode)(zipCode))) {
            // @ts-expect-error type mismatch to be fixed
            errors[inputFieldsIDs.zipCode] = translate('bankAccount.error.zipCode');
        }
        return errors;
    }, [inputFieldsIDs.street, inputFieldsIDs.zipCode, shouldDisplayCountrySelector, shouldValidateZipCodeFormat, stepFields, translate]);
    return (<FormProvider_1.default formID={formID} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} validate={customValidate ?? validate} onSubmit={onSubmit} style={[styles.mh5, styles.flexGrow1]} ref={formRef} enabledWhenOffline>
            <react_native_1.View>
                <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb3]}>{formTitle}</Text_1.default>
                {!!formPOBoxDisclaimer && <Text_1.default style={[styles.textSupporting]}>{formPOBoxDisclaimer}</Text_1.default>}
                <AddressFormFields_1.default inputKeys={inputFieldsIDs} streetTranslationKey={streetTranslationKey} defaultValues={defaultValues} shouldSaveDraft={!isEditing} shouldDisplayStateSelector={shouldDisplayStateSelector} shouldDisplayCountrySelector={shouldDisplayCountrySelector} stateSelectorLabel={stateSelectorLabel} stateSelectorModalHeaderTitle={stateSelectorModalHeaderTitle} stateSelectorSearchInputTitle={stateSelectorSearchInputTitle} onCountryChange={onCountryChange} shouldAllowCountryChange={shouldAllowCountryChange} shouldValidateZipCodeFormat={shouldValidateZipCodeFormat}/>
                {!!shouldShowHelpLinks && <HelpLinks_1.default containerStyles={[styles.mt6]}/>}
            </react_native_1.View>
        </FormProvider_1.default>);
}
AddressStep.displayName = 'AddressStep';
exports.default = AddressStep;
