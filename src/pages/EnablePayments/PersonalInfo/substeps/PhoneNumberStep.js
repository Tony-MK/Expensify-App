"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SingleFieldStep_1 = require("@components/SubStepForms/SingleFieldStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useWalletAdditionalDetailsStepFormSubmit_1 = require("@hooks/useWalletAdditionalDetailsStepFormSubmit");
const LoginUtils_1 = require("@libs/LoginUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WalletAdditionalDetailsForm_1 = require("@src/types/form/WalletAdditionalDetailsForm");
const PERSONAL_INFO_STEP_KEY = WalletAdditionalDetailsForm_1.default.PERSONAL_INFO_STEP;
const STEP_FIELDS = [PERSONAL_INFO_STEP_KEY.PHONE_NUMBER];
function PhoneNumberStep({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [walletAdditionalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_ADDITIONAL_DETAILS);
    const defaultPhoneNumber = walletAdditionalDetails?.[PERSONAL_INFO_STEP_KEY.PHONE_NUMBER] ?? '';
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, STEP_FIELDS);
        if (values.phoneNumber) {
            const phoneNumberWithCountryCode = (0, LoginUtils_1.appendCountryCode)(values.phoneNumber);
            const e164FormattedPhoneNumber = (0, LoginUtils_1.formatE164PhoneNumber)(values.phoneNumber);
            if (!(0, ValidationUtils_1.isValidPhoneNumber)(phoneNumberWithCountryCode) || !(0, ValidationUtils_1.isValidUSPhone)(e164FormattedPhoneNumber)) {
                errors.phoneNumber = translate('common.error.phoneNumber');
            }
        }
        return errors;
    }, [translate]);
    const handleSubmit = (0, useWalletAdditionalDetailsStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<SingleFieldStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.WALLET_ADDITIONAL_DETAILS} formTitle={translate('personalInfoStep.whatsYourPhoneNumber')} formDisclaimer={translate('personalInfoStep.weNeedThisToVerify')} validate={validate} onSubmit={(values) => {
            handleSubmit({ ...values, phoneNumber: (0, LoginUtils_1.formatE164PhoneNumber)(values.phoneNumber) ?? '' });
        }} inputId={PERSONAL_INFO_STEP_KEY.PHONE_NUMBER} inputLabel={translate('common.phoneNumber')} inputMode={CONST_1.default.INPUT_MODE.TEL} defaultValue={defaultPhoneNumber} enabledWhenOffline/>);
}
PhoneNumberStep.displayName = 'PhoneNumberStep';
exports.default = PhoneNumberStep;
