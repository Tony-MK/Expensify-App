"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const AddressStep_1 = require("@components/SubStepForms/AddressStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useWalletAdditionalDetailsStepFormSubmit_1 = require("@hooks/useWalletAdditionalDetailsStepFormSubmit");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WalletAdditionalDetailsForm_1 = require("@src/types/form/WalletAdditionalDetailsForm");
const PERSONAL_INFO_STEP_KEY = WalletAdditionalDetailsForm_1.default.PERSONAL_INFO_STEP;
const INPUT_KEYS = {
    street: PERSONAL_INFO_STEP_KEY.STREET,
    city: PERSONAL_INFO_STEP_KEY.CITY,
    state: PERSONAL_INFO_STEP_KEY.STATE,
    zipCode: PERSONAL_INFO_STEP_KEY.ZIP_CODE,
};
const STEP_FIELDS = [PERSONAL_INFO_STEP_KEY.STREET, PERSONAL_INFO_STEP_KEY.CITY, PERSONAL_INFO_STEP_KEY.STATE, PERSONAL_INFO_STEP_KEY.ZIP_CODE];
function AddressStep({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [walletAdditionalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_ADDITIONAL_DETAILS);
    const defaultValues = {
        street: walletAdditionalDetails?.[PERSONAL_INFO_STEP_KEY.STREET] ?? '',
        city: walletAdditionalDetails?.[PERSONAL_INFO_STEP_KEY.CITY] ?? '',
        state: walletAdditionalDetails?.[PERSONAL_INFO_STEP_KEY.STATE] ?? '',
        zipCode: walletAdditionalDetails?.[PERSONAL_INFO_STEP_KEY.ZIP_CODE] ?? '',
    };
    const handleSubmit = (0, useWalletAdditionalDetailsStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<AddressStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.WALLET_ADDITIONAL_DETAILS} formTitle={translate('personalInfoStep.whatsYourAddress')} formPOBoxDisclaimer={translate('common.noPO')} onSubmit={handleSubmit} stepFields={STEP_FIELDS} inputFieldsIDs={INPUT_KEYS} defaultValues={defaultValues}/>);
}
AddressStep.displayName = 'AddressStep';
exports.default = AddressStep;
