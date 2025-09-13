"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("expensify-common/dist/CONST");
const react_1 = require("react");
const react_native_1 = require("react-native");
const AddressSearch_1 = require("@components/AddressSearch");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const PushRowWithModal_1 = require("@components/PushRowWithModal");
const TextInput_1 = require("@components/TextInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_2 = require("@src/CONST");
const PROVINCES_LIST_OPTIONS = Object.keys(CONST_1.CONST.PROVINCES).reduce((acc, key) => {
    acc[CONST_1.CONST.PROVINCES[key].provinceISO] = CONST_1.CONST.PROVINCES[key].provinceName;
    return acc;
}, {});
const STATES_LIST_OPTIONS = Object.keys(CONST_1.CONST.STATES).reduce((acc, key) => {
    acc[CONST_1.CONST.STATES[key].stateISO] = CONST_1.CONST.STATES[key].stateName;
    return acc;
}, {});
function AddressFormFields({ shouldSaveDraft = false, defaultValues, values, errors, inputKeys, streetTranslationKey, containerStyles, shouldDisplayCountrySelector = false, shouldDisplayStateSelector = true, stateSelectorLabel, stateSelectorModalHeaderTitle, stateSelectorSearchInputTitle, onCountryChange, shouldAllowCountryChange = true, shouldValidateZipCodeFormat = true, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [countryInEditMode, setCountryInEditMode] = (0, react_1.useState)(defaultValues?.country ?? CONST_2.default.COUNTRY.US);
    // When draft values are not being saved we need to relay on local state to determine the currently selected country
    const currentlySelectedCountry = shouldSaveDraft ? defaultValues?.country : countryInEditMode;
    const handleCountryChange = (country) => {
        if (typeof country === 'string' && country !== '') {
            setCountryInEditMode(country);
        }
        onCountryChange?.(country);
    };
    return (<react_native_1.View style={containerStyles}>
            <react_native_1.View>
                <InputWrapper_1.default InputComponent={AddressSearch_1.default} inputID={inputKeys?.street} shouldSaveDraft={shouldSaveDraft} label={translate(streetTranslationKey)} containerStyles={styles.mt6} value={values?.street} defaultValue={defaultValues?.street} errorText={errors?.street ? translate('bankAccount.error.addressStreet') : ''} renamedInputKeys={inputKeys} maxInputLength={CONST_2.default.FORM_CHARACTER_LIMIT} limitSearchesToCountry={shouldAllowCountryChange ? undefined : defaultValues?.country} onCountryChange={handleCountryChange}/>
            </react_native_1.View>
            <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={inputKeys.city ?? 'cityInput'} shouldSaveDraft={shouldSaveDraft} label={translate('common.city')} accessibilityLabel={translate('common.city')} role={CONST_2.default.ROLE.PRESENTATION} value={values?.city} defaultValue={defaultValues?.city} errorText={errors?.city ? translate('bankAccount.error.addressCity') : ''} containerStyles={styles.mt6}/>

            {shouldDisplayStateSelector && (<react_native_1.View style={[styles.mt3, styles.mhn5]}>
                    <InputWrapper_1.default InputComponent={PushRowWithModal_1.default} optionsList={shouldDisplayCountrySelector && currentlySelectedCountry === CONST_2.default.COUNTRY.CA ? PROVINCES_LIST_OPTIONS : STATES_LIST_OPTIONS} shouldSaveDraft={shouldSaveDraft} description={stateSelectorLabel ?? translate('common.state')} modalHeaderTitle={stateSelectorModalHeaderTitle ?? translate('common.state')} searchInputTitle={stateSelectorSearchInputTitle ?? translate('common.state')} value={values?.state} defaultValue={defaultValues?.state} inputID={inputKeys.state ?? 'stateInput'} errorText={errors?.state ? translate('bankAccount.error.addressState') : ''}/>
                </react_native_1.View>)}
            <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={inputKeys.zipCode ?? 'zipCodeInput'} shouldSaveDraft={shouldSaveDraft} label={translate('common.zip')} accessibilityLabel={translate('common.zip')} role={CONST_2.default.ROLE.PRESENTATION} inputMode={shouldValidateZipCodeFormat ? CONST_2.default.INPUT_MODE.NUMERIC : undefined} value={values?.zipCode} defaultValue={defaultValues?.zipCode} errorText={errors?.zipCode ? translate('bankAccount.error.zipCode') : ''} hint={translate('common.zipCodeExampleFormat', { zipSampleFormat: CONST_2.default.COUNTRY_ZIP_REGEX_DATA.US.samples })} containerStyles={styles.mt3}/>
            {shouldDisplayCountrySelector && (<react_native_1.View style={[styles.mt3, styles.mhn5]}>
                    <InputWrapper_1.default InputComponent={PushRowWithModal_1.default} inputID={inputKeys?.country ?? 'country'} shouldSaveDraft={shouldSaveDraft} optionsList={CONST_2.default.ALL_COUNTRIES} description={translate('common.country')} modalHeaderTitle={translate('countryStep.selectCountry')} searchInputTitle={translate('countryStep.findCountry')} value={values?.country} defaultValue={defaultValues?.country} onValueChange={handleCountryChange} stateInputIDToReset={inputKeys.state ?? 'stateInput'} shouldAllowChange={shouldAllowCountryChange}/>
                </react_native_1.View>)}
        </react_native_1.View>);
}
AddressFormFields.displayName = 'AddressFormFields';
exports.default = AddressFormFields;
