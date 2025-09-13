"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var AddressStep_1 = require("@components/SubStepForms/AddressStep");
var useEnterSignerInfoStepFormSubmit_1 = require("@hooks/useEnterSignerInfoStepFormSubmit");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var EnterSignerInfoForm_1 = require("@src/types/form/EnterSignerInfoForm");
function Address(_a) {
    var _b, _c, _d, _e, _f;
    var onNext = _a.onNext, isEditing = _a.isEditing, onMove = _a.onMove;
    var translate = (0, useLocalize_1.default)().translate;
    var enterSignerInfoFormDraft = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM_DRAFT, { canBeMissing: false })[0];
    var inputKeys = {
        street: EnterSignerInfoForm_1.default.SIGNER_STREET,
        city: EnterSignerInfoForm_1.default.SIGNER_CITY,
        state: EnterSignerInfoForm_1.default.SIGNER_STATE,
        zipCode: EnterSignerInfoForm_1.default.SIGNER_ZIP_CODE,
        country: EnterSignerInfoForm_1.default.SIGNER_COUNTRY,
    };
    var defaultValues = {
        street: String((_b = enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[inputKeys.street]) !== null && _b !== void 0 ? _b : ''),
        city: String((_c = enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[inputKeys.city]) !== null && _c !== void 0 ? _c : ''),
        state: String((_d = enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[inputKeys.state]) !== null && _d !== void 0 ? _d : ''),
        zipCode: String((_e = enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[inputKeys.zipCode]) !== null && _e !== void 0 ? _e : ''),
        country: ((_f = enterSignerInfoFormDraft === null || enterSignerInfoFormDraft === void 0 ? void 0 : enterSignerInfoFormDraft[inputKeys.country]) !== null && _f !== void 0 ? _f : ''),
    };
    var formTitle = translate('ownershipInfoStep.whatsYourAddress');
    // Has to be stored in state and updated on country change due to the fact that we can't relay on onyxValues when user is editing the form (draft values are not being saved in that case)
    var _g = (0, react_1.useState)(defaultValues.country === CONST_1.default.COUNTRY.US || defaultValues.country === CONST_1.default.COUNTRY.CA || defaultValues.country === ''), shouldDisplayStateSelector = _g[0], setShouldDisplayStateSelector = _g[1];
    var _h = (0, react_1.useState)(defaultValues.country === CONST_1.default.COUNTRY.US), shouldValidateZipCodeFormat = _h[0], setShouldValidateZipCodeFormat = _h[1];
    var stepFieldsWithState = (0, react_1.useMemo)(function () { return [inputKeys.street, inputKeys.city, inputKeys.state, inputKeys.zipCode, inputKeys.country]; }, [inputKeys.country, inputKeys.city, inputKeys.state, inputKeys.street, inputKeys.zipCode]);
    var stepFieldsWithoutState = (0, react_1.useMemo)(function () { return [inputKeys.street, inputKeys.city, inputKeys.zipCode, inputKeys.country]; }, [inputKeys.country, inputKeys.city, inputKeys.street, inputKeys.zipCode]);
    var stepFields = shouldDisplayStateSelector ? stepFieldsWithState : stepFieldsWithoutState;
    var handleCountryChange = function (country) {
        if (typeof country !== 'string' || country === '') {
            return;
        }
        setShouldDisplayStateSelector(country === CONST_1.default.COUNTRY.US || country === CONST_1.default.COUNTRY.CA);
        setShouldValidateZipCodeFormat(country === CONST_1.default.COUNTRY.US);
    };
    var handleSubmit = (0, useEnterSignerInfoStepFormSubmit_1.default)({
        fieldIds: stepFields,
        onNext: onNext,
        shouldSaveDraft: isEditing,
    });
    return (<AddressStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.ENTER_SINGER_INFO_FORM} formTitle={formTitle} formPOBoxDisclaimer={translate('common.noPO')} onSubmit={handleSubmit} stepFields={stepFields} inputFieldsIDs={inputKeys} defaultValues={defaultValues} onCountryChange={handleCountryChange} shouldDisplayStateSelector={shouldDisplayStateSelector} shouldDisplayCountrySelector shouldValidateZipCodeFormat={shouldValidateZipCodeFormat}/>);
}
Address.displayName = 'Address';
exports.default = Address;
