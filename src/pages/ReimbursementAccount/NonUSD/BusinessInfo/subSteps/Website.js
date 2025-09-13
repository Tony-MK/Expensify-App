"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const SingleFieldStep_1 = require("@components/SubStepForms/SingleFieldStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const BankAccountUtils_1 = require("@libs/BankAccountUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const FormActions_1 = require("@userActions/FormActions");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const { COMPANY_WEBSITE } = ReimbursementAccountForm_1.default.ADDITIONAL_DATA.CORPAY;
const STEP_FIELDS = [COMPANY_WEBSITE];
function Website({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: false });
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: false });
    const policyID = reimbursementAccount?.achData?.policyID;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: false });
    const currency = policy?.outputCurrency ?? '';
    const isWebsiteRequired = currency === CONST_1.default.CURRENCY.USD || CONST_1.default.CURRENCY.CAD;
    const defaultWebsiteExample = (0, react_1.useMemo)(() => (0, BankAccountUtils_1.getDefaultCompanyWebsite)(session, account), [session, account]);
    const defaultCompanyWebsite = reimbursementAccount?.achData?.website ?? defaultWebsiteExample;
    const validate = (0, react_1.useCallback)((values) => {
        const errors = isWebsiteRequired ? (0, ValidationUtils_1.getFieldRequiredErrors)(values, STEP_FIELDS) : {};
        if (values[COMPANY_WEBSITE] && !(0, ValidationUtils_1.isValidWebsite)(expensify_common_1.Str.sanitizeURL(values[COMPANY_WEBSITE], CONST_1.default.COMPANY_WEBSITE_DEFAULT_SCHEME))) {
            errors[COMPANY_WEBSITE] = translate('bankAccount.error.website');
        }
        return errors;
    }, [isWebsiteRequired, translate]);
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext: (values) => {
            const website = expensify_common_1.Str.sanitizeURL(values?.websiteUrl, CONST_1.default.COMPANY_WEBSITE_DEFAULT_SCHEME);
            (0, FormActions_1.setDraftValues)(ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM, { [COMPANY_WEBSITE]: website });
            onNext();
        },
        shouldSaveDraft: true,
    });
    return (<SingleFieldStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('businessInfoStep.enterYourCompanyWebsite')} formDisclaimer={translate('common.websiteExample')} validate={validate} onSubmit={handleSubmit} inputId={COMPANY_WEBSITE} inputLabel={translate('businessInfoStep.companyWebsite')} inputMode={CONST_1.default.INPUT_MODE.URL} defaultValue={defaultCompanyWebsite} shouldShowHelpLinks={false}/>);
}
Website.displayName = 'Website';
exports.default = Website;
