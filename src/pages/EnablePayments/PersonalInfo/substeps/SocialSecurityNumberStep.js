"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SingleFieldStep_1 = require("@components/SubStepForms/SingleFieldStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useWalletAdditionalDetailsStepFormSubmit_1 = require("@hooks/useWalletAdditionalDetailsStepFormSubmit");
const ValidationUtils = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WalletAdditionalDetailsForm_1 = require("@src/types/form/WalletAdditionalDetailsForm");
const PERSONAL_INFO_STEP_KEY = WalletAdditionalDetailsForm_1.default.PERSONAL_INFO_STEP;
const STEP_FIELDS = [PERSONAL_INFO_STEP_KEY.SSN_LAST_4];
function SocialSecurityNumberStep({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [walletAdditionalDetails] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_ADDITIONAL_DETAILS);
    const shouldAskForFullSSN = walletAdditionalDetails?.errorCode === CONST_1.default.WALLET.ERROR.SSN;
    const defaultSsnLast4 = walletAdditionalDetails?.[PERSONAL_INFO_STEP_KEY.SSN_LAST_4] ?? '';
    const validate = (0, react_1.useCallback)((values) => {
        const errors = ValidationUtils.getFieldRequiredErrors(values, STEP_FIELDS);
        if (shouldAskForFullSSN) {
            if (values.ssn && !ValidationUtils.isValidSSNFullNine(values.ssn)) {
                errors.ssn = translate('additionalDetailsStep.ssnFull9Error');
            }
        }
        else if (values.ssn && !ValidationUtils.isValidSSNLastFour(values.ssn)) {
            errors.ssn = translate('bankAccount.error.ssnLast4');
        }
        return errors;
    }, [translate, shouldAskForFullSSN]);
    const handleSubmit = (0, useWalletAdditionalDetailsStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<SingleFieldStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.WALLET_ADDITIONAL_DETAILS} formTitle={translate('personalInfoStep.whatsYourSSN')} formDisclaimer={translate('personalInfoStep.noPersonalChecks')} validate={validate} onSubmit={handleSubmit} inputId={PERSONAL_INFO_STEP_KEY.SSN_LAST_4} inputLabel={translate(shouldAskForFullSSN ? 'common.ssnFull9' : 'personalInfoStep.last4SSN')} inputMode={CONST_1.default.INPUT_MODE.NUMERIC} defaultValue={defaultSsnLast4} maxLength={shouldAskForFullSSN ? CONST_1.default.BANK_ACCOUNT.MAX_LENGTH.FULL_SSN : CONST_1.default.BANK_ACCOUNT.MAX_LENGTH.SSN}/>);
}
SocialSecurityNumberStep.displayName = 'SocialSecurityNumberStep';
exports.default = SocialSecurityNumberStep;
