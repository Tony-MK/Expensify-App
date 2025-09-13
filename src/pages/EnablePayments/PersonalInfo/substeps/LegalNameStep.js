"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullNameStep_1 = require("@components/SubStepForms/FullNameStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useWalletAdditionalDetailsStepFormSubmit_1 = require("@hooks/useWalletAdditionalDetailsStepFormSubmit");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WalletAdditionalDetailsForm_1 = require("@src/types/form/WalletAdditionalDetailsForm");
const PERSONAL_INFO_STEP_KEY = WalletAdditionalDetailsForm_1.default.PERSONAL_INFO_STEP;
const STEP_FIELDS = [PERSONAL_INFO_STEP_KEY.FIRST_NAME, PERSONAL_INFO_STEP_KEY.LAST_NAME];
function LegalNameStep({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [walletAdditionalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_ADDITIONAL_DETAILS);
    const defaultValues = {
        firstName: walletAdditionalDetails?.[PERSONAL_INFO_STEP_KEY.FIRST_NAME] ?? '',
        lastName: walletAdditionalDetails?.[PERSONAL_INFO_STEP_KEY.LAST_NAME] ?? '',
    };
    const handleSubmit = (0, useWalletAdditionalDetailsStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<FullNameStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.WALLET_ADDITIONAL_DETAILS} formTitle={translate('personalInfoStep.whatsYourLegalName')} onSubmit={handleSubmit} stepFields={STEP_FIELDS} firstNameInputID={PERSONAL_INFO_STEP_KEY.FIRST_NAME} lastNameInputID={PERSONAL_INFO_STEP_KEY.LAST_NAME} defaultValues={defaultValues}/>);
}
LegalNameStep.displayName = 'LegalNameStep';
exports.default = LegalNameStep;
