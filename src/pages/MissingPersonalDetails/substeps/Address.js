"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const AddressSearch_1 = require("@components/AddressSearch");
const CountryPicker_1 = require("@components/CountryPicker");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const StatePicker_1 = require("@components/StatePicker");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const usePersonalDetailsFormSubmit_1 = require("@hooks/usePersonalDetailsFormSubmit");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const PersonalDetailsForm_1 = require("@src/types/form/PersonalDetailsForm");
const STEP_FIELDS = [PersonalDetailsForm_1.default.ADDRESS_LINE_1, PersonalDetailsForm_1.default.ADDRESS_LINE_2, PersonalDetailsForm_1.default.CITY, PersonalDetailsForm_1.default.STATE, PersonalDetailsForm_1.default.ZIP_POST_CODE, PersonalDetailsForm_1.default.COUNTRY];
function AddressStep({ isEditing, onNext, personalDetailsValues }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [currentCountry, setCurrentCountry] = (0, react_1.useState)(personalDetailsValues[PersonalDetailsForm_1.default.COUNTRY]);
    const [state, setState] = (0, react_1.useState)(personalDetailsValues[PersonalDetailsForm_1.default.STATE]);
    const [city, setCity] = (0, react_1.useState)(personalDetailsValues[PersonalDetailsForm_1.default.CITY]);
    const [zipcode, setZipcode] = (0, react_1.useState)(personalDetailsValues[PersonalDetailsForm_1.default.ZIP_POST_CODE]);
    const handleSubmit = (0, usePersonalDetailsFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: true,
    });
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        const addressRequiredFields = [PersonalDetailsForm_1.default.ADDRESS_LINE_1, PersonalDetailsForm_1.default.CITY, PersonalDetailsForm_1.default.COUNTRY, PersonalDetailsForm_1.default.STATE];
        addressRequiredFields.forEach((fieldKey) => {
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
            if (!countrySpecificZipRegex.test(values[PersonalDetailsForm_1.default.ZIP_POST_CODE]?.trim().toUpperCase())) {
                if ((0, ValidationUtils_1.isRequiredFulfilled)(values[PersonalDetailsForm_1.default.ZIP_POST_CODE]?.trim())) {
                    errors[PersonalDetailsForm_1.default.ZIP_POST_CODE] = translate('privatePersonalDetails.error.incorrectZipFormat', { zipFormat: countryZipFormat });
                }
                else {
                    errors[PersonalDetailsForm_1.default.ZIP_POST_CODE] = translate('common.error.fieldRequired');
                }
            }
        }
        else if (!CONST_1.default.GENERIC_ZIP_CODE_REGEX.test(values[PersonalDetailsForm_1.default.ZIP_POST_CODE]?.trim()?.toUpperCase() ?? '')) {
            errors[PersonalDetailsForm_1.default.ZIP_POST_CODE] = translate('privatePersonalDetails.error.incorrectZipFormat');
        }
        return errors;
    }, [translate]);
    const handleAddressChange = (0, react_1.useCallback)((value, key) => {
        const addressPart = value;
        const addressPartKey = key;
        if (addressPartKey !== PersonalDetailsForm_1.default.COUNTRY && addressPartKey !== PersonalDetailsForm_1.default.STATE && addressPartKey !== PersonalDetailsForm_1.default.CITY && addressPartKey !== PersonalDetailsForm_1.default.ZIP_POST_CODE) {
            return;
        }
        if (addressPartKey === PersonalDetailsForm_1.default.COUNTRY) {
            setCurrentCountry(addressPart);
            setState('');
            setCity('');
            setZipcode('');
            return;
        }
        if (addressPartKey === PersonalDetailsForm_1.default.STATE) {
            setState(addressPart);
            setCity('');
            setZipcode('');
            return;
        }
        if (addressPartKey === PersonalDetailsForm_1.default.CITY) {
            setCity(addressPart);
            setZipcode('');
            return;
        }
        setZipcode(addressPart);
    }, []);
    const isUSAForm = currentCountry === CONST_1.default.COUNTRY.US;
    const zipSampleFormat = (currentCountry && CONST_1.default.COUNTRY_ZIP_REGEX_DATA[currentCountry]?.samples) ?? '';
    const zipFormat = translate('common.zipCodeExampleFormat', { zipSampleFormat });
    return (<FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.PERSONAL_DETAILS_FORM} submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')} onSubmit={handleSubmit} validate={validate} style={[styles.flexGrow1, styles.mt3]} submitButtonStyles={[styles.ph5, styles.mb0]} enabledWhenOffline>
            <react_native_1.View style={styles.ph5}>
                <Text_1.default style={[styles.textHeadlineLineHeightXXL, styles.mb3]}>{translate('privatePersonalDetails.enterAddress')}</Text_1.default>
                <react_native_1.View>
                    <InputWrapper_1.default InputComponent={AddressSearch_1.default} inputID={PersonalDetailsForm_1.default.ADDRESS_LINE_1} label={translate('common.addressLine', { lineNumber: 1 })} onValueChange={(data, key) => {
            handleAddressChange(data, key);
        }} defaultValue={personalDetailsValues[PersonalDetailsForm_1.default.ADDRESS_LINE_1]} renamedInputKeys={{
            street: PersonalDetailsForm_1.default.ADDRESS_LINE_1,
            street2: PersonalDetailsForm_1.default.ADDRESS_LINE_2,
            city: PersonalDetailsForm_1.default.CITY,
            state: PersonalDetailsForm_1.default.STATE,
            zipCode: PersonalDetailsForm_1.default.ZIP_POST_CODE,
            country: PersonalDetailsForm_1.default.COUNTRY,
        }} maxInputLength={CONST_1.default.FORM_CHARACTER_LIMIT}/>
                </react_native_1.View>
                <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={PersonalDetailsForm_1.default.ADDRESS_LINE_2} label={translate('common.addressLine', { lineNumber: 2 })} aria-label={translate('common.addressLine', { lineNumber: 2 })} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={personalDetailsValues[PersonalDetailsForm_1.default.ADDRESS_LINE_2]} spellCheck={false} containerStyles={styles.mt5}/>
                <react_native_1.View style={[styles.mt2, styles.mhn5]}>
                    <InputWrapper_1.default InputComponent={CountryPicker_1.default} inputID={PersonalDetailsForm_1.default.COUNTRY} value={currentCountry} onValueChange={handleAddressChange}/>
                </react_native_1.View>
                {isUSAForm ? (<react_native_1.View style={[styles.mt2, styles.mhn5]}>
                        <InputWrapper_1.default InputComponent={StatePicker_1.default} inputID={PersonalDetailsForm_1.default.STATE} value={state} onValueChange={handleAddressChange}/>
                    </react_native_1.View>) : (<InputWrapper_1.default InputComponent={TextInput_1.default} inputID={PersonalDetailsForm_1.default.STATE} label={translate('common.stateOrProvince')} aria-label={translate('common.stateOrProvince')} role={CONST_1.default.ROLE.PRESENTATION} value={state} spellCheck={false} onValueChange={handleAddressChange} containerStyles={styles.mt2}/>)}
                <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={PersonalDetailsForm_1.default.CITY} label={translate('common.city')} aria-label={translate('common.city')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={city} spellCheck={false} onValueChange={handleAddressChange} containerStyles={isUSAForm ? styles.mt2 : styles.mt5}/>
                <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={PersonalDetailsForm_1.default.ZIP_POST_CODE} label={translate('common.zipPostCode')} aria-label={translate('common.zipPostCode')} role={CONST_1.default.ROLE.PRESENTATION} autoCapitalize="characters" defaultValue={zipcode} hint={zipFormat} onValueChange={handleAddressChange} containerStyles={styles.mt5}/>
            </react_native_1.View>
        </FormProvider_1.default>);
}
AddressStep.displayName = 'AddressStep';
exports.default = AddressStep;
