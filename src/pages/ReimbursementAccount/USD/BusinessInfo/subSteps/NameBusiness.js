"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SingleFieldStep_1 = require("@components/SubStepForms/SingleFieldStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const COMPANY_NAME_KEY = ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP.COMPANY_NAME;
const STEP_FIELDS = [COMPANY_NAME_KEY];
function NameBusiness({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const defaultCompanyName = reimbursementAccount?.achData?.companyName ?? '';
    const bankAccountID = reimbursementAccount?.achData?.bankAccountID;
    const bankAccountState = reimbursementAccount?.achData?.state ?? '';
    const shouldDisableCompanyName = !!(bankAccountID &&
        defaultCompanyName &&
        bankAccountState !== CONST_1.default.BANK_ACCOUNT.STATE.SETUP &&
        bankAccountState !== CONST_1.default.BANK_ACCOUNT.STATE.VERIFYING);
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, STEP_FIELDS);
        if (values.companyName && !(0, ValidationUtils_1.isValidCompanyName)(values.companyName)) {
            errors.companyName = translate('bankAccount.error.companyName');
        }
        return errors;
    }, [translate]);
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<SingleFieldStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('businessInfoStep.enterTheNameOfYourBusiness')} validate={validate} onSubmit={handleSubmit} inputId={COMPANY_NAME_KEY} inputLabel={translate('businessInfoStep.businessName')} defaultValue={defaultCompanyName} shouldUseDefaultValue={shouldDisableCompanyName} disabled={shouldDisableCompanyName} shouldShowHelpLinks={false}/>);
}
NameBusiness.displayName = 'NameBusiness';
exports.default = NameBusiness;
