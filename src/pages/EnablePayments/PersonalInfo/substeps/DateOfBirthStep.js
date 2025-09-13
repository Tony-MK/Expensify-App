"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const DateOfBirthStep_1 = require("@components/SubStepForms/DateOfBirthStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useWalletAdditionalDetailsStepFormSubmit_1 = require("@hooks/useWalletAdditionalDetailsStepFormSubmit");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WalletAdditionalDetailsForm_1 = require("@src/types/form/WalletAdditionalDetailsForm");
const PERSONAL_INFO_DOB_KEY = WalletAdditionalDetailsForm_1.default.PERSONAL_INFO_STEP.DOB;
const STEP_FIELDS = [PERSONAL_INFO_DOB_KEY];
function DateOfBirthStep({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [walletAdditionalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_ADDITIONAL_DETAILS);
    const dobDefaultValue = walletAdditionalDetails?.[PERSONAL_INFO_DOB_KEY] ?? walletAdditionalDetails?.[PERSONAL_INFO_DOB_KEY] ?? '';
    const handleSubmit = (0, useWalletAdditionalDetailsStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<DateOfBirthStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.WALLET_ADDITIONAL_DETAILS} formTitle={translate('personalInfoStep.whatsYourDOB')} onSubmit={handleSubmit} stepFields={STEP_FIELDS} dobInputID={PERSONAL_INFO_DOB_KEY} dobDefaultValue={dobDefaultValue}/>);
}
DateOfBirthStep.displayName = 'DateOfBirthStep';
exports.default = DateOfBirthStep;
