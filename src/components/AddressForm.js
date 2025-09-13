"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const HomeAddressForm_1 = require("@src/types/form/HomeAddressForm");
const AddressSearch_1 = require("./AddressSearch");
const CountrySelector_1 = require("./CountrySelector");
const FormProvider_1 = require("./Form/FormProvider");
const InputWrapper_1 = require("./Form/InputWrapper");
const StateSelector_1 = require("./StateSelector");
const TextInput_1 = require("./TextInput");
function AddressForm({ city = '', country = '', formID, onAddressChanged = () => { }, onSubmit, shouldSaveDraft = false, state = '', street1 = '', street2 = '', submitButtonText = '', zip = '', }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const zipSampleFormat = (country && CONST_1.default.COUNTRY_ZIP_REGEX_DATA[country]?.samples) ?? '';
    const zipFormat = translate('common.zipCodeExampleFormat', { zipSampleFormat });
    const isUSAForm = country === CONST_1.default.COUNTRY.US;
    /**
     * @param translate - translate function
     * @param isUSAForm - selected country ISO code is US
     * @param values - form input values
     * @returns - An object containing the errors for each inputID
     */
    const validator = (0, react_1.useCallback)((values) => {
        const errors = {};
        const requiredFields = ['addressLine1', 'city', 'country', 'state'];
        // Check "State" dropdown is a valid state if selected Country is USA
        if (values.country === CONST_1.default.COUNTRY.US && !values.state) {
            errors.state = translate('common.error.fieldRequired');
        }
        // Add "Field required" errors if any required field is empty
        requiredFields.forEach((fieldKey) => {
            const fieldValue = values[fieldKey] ?? '';
            if ((0, ValidationUtils_1.isRequiredFulfilled)(fieldValue)) {
                return;
            }
            errors[fieldKey] = translate('common.error.fieldRequired');
        });
        if (values.addressLine2.length > CONST_1.default.FORM_CHARACTER_LIMIT) {
            errors.addressLine2 = translate('common.error.characterLimitExceedCounter', {
                length: values.addressLine2.length,
                limit: CONST_1.default.FORM_CHARACTER_LIMIT,
            });
        }
        if (values.city.length > CONST_1.default.FORM_CHARACTER_LIMIT) {
            errors.city = translate('common.error.characterLimitExceedCounter', {
                length: values.city.length,
                limit: CONST_1.default.FORM_CHARACTER_LIMIT,
            });
        }
        if (values.country !== CONST_1.default.COUNTRY.US && values.state.length > CONST_1.default.STATE_CHARACTER_LIMIT) {
            errors.state = translate('common.error.characterLimitExceedCounter', {
                length: values.state.length,
                limit: CONST_1.default.STATE_CHARACTER_LIMIT,
            });
        }
        // If no country is selected, default value is an empty string and there's no related regex data so we default to an empty object
        const countryRegexDetails = (values.country ? CONST_1.default.COUNTRY_ZIP_REGEX_DATA?.[values.country] : {});
        // The postal code system might not exist for a country, so no regex either for them.
        const countrySpecificZipRegex = countryRegexDetails?.regex;
        const countryZipFormat = countryRegexDetails?.samples ?? '';
        if (countrySpecificZipRegex) {
            if (!countrySpecificZipRegex.test(values.zipPostCode?.trim().toUpperCase())) {
                if ((0, ValidationUtils_1.isRequiredFulfilled)(values.zipPostCode?.trim())) {
                    errors.zipPostCode = translate('privatePersonalDetails.error.incorrectZipFormat', { zipFormat: countryZipFormat });
                }
                else {
                    errors.zipPostCode = translate('common.error.fieldRequired');
                }
            }
        }
        else if (!CONST_1.default.GENERIC_ZIP_CODE_REGEX.test(values?.zipPostCode?.trim()?.toUpperCase() ?? '')) {
            errors.zipPostCode = translate('privatePersonalDetails.error.incorrectZipFormat');
        }
        return errors;
    }, [translate]);
    return (<FormProvider_1.default style={[styles.flexGrow1, styles.mh5]} formID={formID} validate={validator} onSubmit={onSubmit} submitButtonText={submitButtonText} enabledWhenOffline addBottomSafeAreaPadding>
            <react_native_1.View>
                <InputWrapper_1.default InputComponent={AddressSearch_1.default} inputID={HomeAddressForm_1.default.ADDRESS_LINE_1} label={translate('common.addressLine', { lineNumber: 1 })} onValueChange={(data, key) => {
            onAddressChanged(data, key);
        }} defaultValue={street1} renamedInputKeys={{
            street: HomeAddressForm_1.default.ADDRESS_LINE_1,
            street2: HomeAddressForm_1.default.ADDRESS_LINE_2,
            city: HomeAddressForm_1.default.CITY,
            state: HomeAddressForm_1.default.STATE,
            zipCode: HomeAddressForm_1.default.ZIP_POST_CODE,
            country: HomeAddressForm_1.default.COUNTRY,
        }} maxInputLength={CONST_1.default.FORM_CHARACTER_LIMIT} shouldSaveDraft={shouldSaveDraft}/>
            </react_native_1.View>
            <react_native_1.View style={styles.formSpaceVertical}/>
            <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={HomeAddressForm_1.default.ADDRESS_LINE_2} label={translate('common.addressLine', { lineNumber: 2 })} aria-label={translate('common.addressLine', { lineNumber: 2 })} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={street2} spellCheck={false} shouldSaveDraft={shouldSaveDraft}/>
            <react_native_1.View style={styles.formSpaceVertical}/>
            <react_native_1.View style={styles.mhn5}>
                <InputWrapper_1.default InputComponent={CountrySelector_1.default} inputID={HomeAddressForm_1.default.COUNTRY} value={country} onValueChange={onAddressChanged} shouldSaveDraft={shouldSaveDraft}/>
            </react_native_1.View>
            <react_native_1.View style={styles.formSpaceVertical}/>
            {isUSAForm ? (<react_native_1.View style={styles.mhn5}>
                    <InputWrapper_1.default InputComponent={StateSelector_1.default} inputID={HomeAddressForm_1.default.STATE} value={state} onValueChange={onAddressChanged} shouldSaveDraft={shouldSaveDraft}/>
                </react_native_1.View>) : (<InputWrapper_1.default InputComponent={TextInput_1.default} inputID={HomeAddressForm_1.default.STATE} label={translate('common.stateOrProvince')} aria-label={translate('common.stateOrProvince')} role={CONST_1.default.ROLE.PRESENTATION} value={state} spellCheck={false} onValueChange={onAddressChanged} shouldSaveDraft={shouldSaveDraft}/>)}
            <react_native_1.View style={styles.formSpaceVertical}/>
            <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={HomeAddressForm_1.default.CITY} label={translate('common.city')} aria-label={translate('common.city')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={city} spellCheck={false} onValueChange={onAddressChanged} shouldSaveDraft={shouldSaveDraft}/>
            <react_native_1.View style={styles.formSpaceVertical}/>
            <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={HomeAddressForm_1.default.ZIP_POST_CODE} label={translate('common.zipPostCode')} aria-label={translate('common.zipPostCode')} role={CONST_1.default.ROLE.PRESENTATION} autoCapitalize="characters" defaultValue={zip} hint={zipFormat} onValueChange={onAddressChanged} shouldSaveDraft={shouldSaveDraft}/>
        </FormProvider_1.default>);
}
AddressForm.displayName = 'AddressForm';
exports.default = AddressForm;
