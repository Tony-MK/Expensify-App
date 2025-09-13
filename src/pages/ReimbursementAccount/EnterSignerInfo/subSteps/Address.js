"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AddressStep_1 = require("@components/SubStepForms/AddressStep");
const useEnterSignerInfoStepFormSubmit_1 = require("@hooks/useEnterSignerInfoStepFormSubmit");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const EnterSignerInfoForm_1 = require("@src/types/form/EnterSignerInfoForm");
function Address({ onNext, isEditing, onMove }) {
    const { translate } = (0, useLocalize_1.default)();
    const [enterSignerInfoFormDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM_DRAFT, { canBeMissing: false });
    const inputKeys = {
        street: EnterSignerInfoForm_1.default.SIGNER_STREET,
        city: EnterSignerInfoForm_1.default.SIGNER_CITY,
        state: EnterSignerInfoForm_1.default.SIGNER_STATE,
        zipCode: EnterSignerInfoForm_1.default.SIGNER_ZIP_CODE,
        country: EnterSignerInfoForm_1.default.SIGNER_COUNTRY,
    };
    const defaultValues = {
        street: String(enterSignerInfoFormDraft?.[inputKeys.street] ?? ''),
        city: String(enterSignerInfoFormDraft?.[inputKeys.city] ?? ''),
        state: String(enterSignerInfoFormDraft?.[inputKeys.state] ?? ''),
        zipCode: String(enterSignerInfoFormDraft?.[inputKeys.zipCode] ?? ''),
        country: (enterSignerInfoFormDraft?.[inputKeys.country] ?? ''),
    };
    const formTitle = translate('ownershipInfoStep.whatsYourAddress');
    // Has to be stored in state and updated on country change due to the fact that we can't relay on onyxValues when user is editing the form (draft values are not being saved in that case)
    const [shouldDisplayStateSelector, setShouldDisplayStateSelector] = (0, react_1.useState)(defaultValues.country === CONST_1.default.COUNTRY.US || defaultValues.country === CONST_1.default.COUNTRY.CA || defaultValues.country === '');
    const [shouldValidateZipCodeFormat, setShouldValidateZipCodeFormat] = (0, react_1.useState)(defaultValues.country === CONST_1.default.COUNTRY.US);
    const stepFieldsWithState = (0, react_1.useMemo)(() => [inputKeys.street, inputKeys.city, inputKeys.state, inputKeys.zipCode, inputKeys.country], [inputKeys.country, inputKeys.city, inputKeys.state, inputKeys.street, inputKeys.zipCode]);
    const stepFieldsWithoutState = (0, react_1.useMemo)(() => [inputKeys.street, inputKeys.city, inputKeys.zipCode, inputKeys.country], [inputKeys.country, inputKeys.city, inputKeys.street, inputKeys.zipCode]);
    const stepFields = shouldDisplayStateSelector ? stepFieldsWithState : stepFieldsWithoutState;
    const handleCountryChange = (country) => {
        if (typeof country !== 'string' || country === '') {
            return;
        }
        setShouldDisplayStateSelector(country === CONST_1.default.COUNTRY.US || country === CONST_1.default.COUNTRY.CA);
        setShouldValidateZipCodeFormat(country === CONST_1.default.COUNTRY.US);
    };
    const handleSubmit = (0, useEnterSignerInfoStepFormSubmit_1.default)({
        fieldIds: stepFields,
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<AddressStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM} formTitle={formTitle} formPOBoxDisclaimer={translate('common.noPO')} onSubmit={handleSubmit} stepFields={stepFields} inputFieldsIDs={inputKeys} defaultValues={defaultValues} onCountryChange={handleCountryChange} shouldDisplayStateSelector={shouldDisplayStateSelector} shouldDisplayCountrySelector shouldValidateZipCodeFormat={shouldValidateZipCodeFormat}/>);
}
Address.displayName = 'Address';
exports.default = Address;
