"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SingleFieldStep_1 = require("@components/SubStepForms/SingleFieldStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const { TAX_ID_EIN_NUMBER, COMPANY_COUNTRY_CODE } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
const STEP_FIELDS = [TAX_ID_EIN_NUMBER];
function TaxIDEINNumber({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const [reimbursementAccountDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT, { canBeMissing: false });
    const defaultValue = reimbursementAccount?.achData?.corpay?.[TAX_ID_EIN_NUMBER] ?? '';
    const businessStepCountryValue = reimbursementAccount?.achData?.corpay?.[COMPANY_COUNTRY_CODE] ?? reimbursementAccountDraft?.[COMPANY_COUNTRY_CODE] ?? '';
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, STEP_FIELDS);
        if (values[TAX_ID_EIN_NUMBER] && !(0, ValidationUtils_1.isValidTaxIDEINNumber)(values[TAX_ID_EIN_NUMBER], businessStepCountryValue)) {
            errors[TAX_ID_EIN_NUMBER] = translate('businessInfoStep.error.taxIDEIN', { country: businessStepCountryValue });
        }
        return errors;
    }, [businessStepCountryValue, translate]);
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    return (<SingleFieldStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('businessInfoStep.whatsTheBusinessTaxIDEIN', { country: businessStepCountryValue })} validate={validate} onSubmit={handleSubmit} inputId={TAX_ID_EIN_NUMBER} inputLabel={translate('businessInfoStep.taxIDEIN', { country: businessStepCountryValue })} defaultValue={defaultValue} shouldShowHelpLinks={false}/>);
}
TaxIDEINNumber.displayName = 'TaxIDEINNumber';
exports.default = TaxIDEINNumber;
