"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const SingleFieldStep_1 = require("@components/SubStepForms/SingleFieldStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const COMPANY_PHONE_NUMBER_KEY = ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP.COMPANY_PHONE;
const STEP_FIELDS = [COMPANY_PHONE_NUMBER_KEY];
function PhoneNumberBusiness({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount, reimbursementAccountResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT);
    const isLoadingReimbursementAccount = (0, isLoadingOnyxValue_1.default)(reimbursementAccountResult);
    const defaultCompanyPhoneNumber = reimbursementAccount?.achData?.companyPhone ?? '';
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, STEP_FIELDS);
        if (values.companyPhone && !(0, ValidationUtils_1.isValidUSPhone)(values.companyPhone, true)) {
            errors.companyPhone = translate('bankAccount.error.phoneNumber');
        }
        return errors;
    }, [translate]);
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        // During draft saving, the phone number is sanitized (i.e. leading and trailing whitespace is removed)
        shouldSaveDraft: true,
    });
    if (isLoadingReimbursementAccount) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<SingleFieldStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('businessInfoStep.enterYourCompanyPhoneNumber')} validate={validate} onSubmit={handleSubmit} inputId={COMPANY_PHONE_NUMBER_KEY} inputMode={CONST_1.default.INPUT_MODE.TEL} inputLabel={translate('common.phoneNumber')} defaultValue={defaultCompanyPhoneNumber} shouldShowHelpLinks={false} placeholder={translate('common.phoneNumberPlaceholder')}/>);
}
PhoneNumberBusiness.displayName = 'PhoneNumberBusiness';
exports.default = PhoneNumberBusiness;
