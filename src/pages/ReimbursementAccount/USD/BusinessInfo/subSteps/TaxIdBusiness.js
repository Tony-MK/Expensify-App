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
const COMPANY_TAX_ID_KEY = ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP.COMPANY_TAX_ID;
const STEP_FIELDS = [COMPANY_TAX_ID_KEY];
function TaxIdBusiness({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount, reimbursementAccountResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const isLoadingReimbursementAccount = (0, isLoadingOnyxValue_1.default)(reimbursementAccountResult);
    // This is default value for the input to be display
    /* eslint-disable-next-line rulesdir/no-default-id-values */
    const defaultCompanyTaxID = reimbursementAccount?.achData?.companyTaxID ?? '';
    const bankAccountID = reimbursementAccount?.achData?.bankAccountID;
    const bankAccountState = reimbursementAccount?.achData?.state ?? '';
    const shouldDisableCompanyTaxID = !!(bankAccountID &&
        defaultCompanyTaxID &&
        bankAccountState !== CONST_1.default.BANK_ACCOUNT.STATE.SETUP &&
        bankAccountState !== CONST_1.default.BANK_ACCOUNT.STATE.VERIFYING);
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, STEP_FIELDS);
        if (values.companyTaxID && !(0, ValidationUtils_1.isValidTaxID)(values.companyTaxID)) {
            errors.companyTaxID = translate('bankAccount.error.taxID');
        }
        return errors;
    }, [translate]);
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });
    if (isLoadingReimbursementAccount) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<SingleFieldStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('businessInfoStep.enterYourCompanyTaxIdNumber')} validate={validate} onSubmit={handleSubmit} inputId={COMPANY_TAX_ID_KEY} inputLabel={translate('businessInfoStep.taxIDNumber')} defaultValue={defaultCompanyTaxID} shouldUseDefaultValue={shouldDisableCompanyTaxID} disabled={shouldDisableCompanyTaxID} shouldShowHelpLinks={false} placeholder={translate('businessInfoStep.taxIDNumberPlaceholder')} inputMode={CONST_1.default.INPUT_MODE.NUMERIC}/>);
}
TaxIdBusiness.displayName = 'TaxIdBusiness';
exports.default = TaxIdBusiness;
