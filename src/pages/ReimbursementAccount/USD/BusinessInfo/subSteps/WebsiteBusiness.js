"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const SingleFieldStep_1 = require("@components/SubStepForms/SingleFieldStep");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useReimbursementAccountStepFormSubmit_1 = require("@hooks/useReimbursementAccountStepFormSubmit");
const BankAccountUtils_1 = require("@libs/BankAccountUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const BankAccounts_1 = require("@userActions/BankAccounts");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReimbursementAccountForm_1 = require("@src/types/form/ReimbursementAccountForm");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
const COMPANY_WEBSITE_KEY = ReimbursementAccountForm_1.default.BUSINESS_INFO_STEP.COMPANY_WEBSITE;
const STEP_FIELDS = [COMPANY_WEBSITE_KEY];
function WebsiteBusiness({ onNext, onMove, isEditing }) {
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount, reimbursementAccountResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: true });
    const isLoadingReimbursementAccount = (0, isLoadingOnyxValue_1.default)(reimbursementAccountResult);
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: true });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const defaultWebsiteExample = (0, react_1.useMemo)(() => (0, BankAccountUtils_1.getDefaultCompanyWebsite)(session, account), [session, account]);
    const defaultCompanyWebsite = reimbursementAccount?.achData?.website ?? defaultWebsiteExample;
    const validate = (0, react_1.useCallback)((values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, STEP_FIELDS);
        if (values.website && !(0, ValidationUtils_1.isValidWebsite)(expensify_common_1.Str.sanitizeURL(values.website, CONST_1.default.COMPANY_WEBSITE_DEFAULT_SCHEME))) {
            errors.website = translate('bankAccount.error.website');
        }
        return errors;
    }, [translate]);
    const handleSubmit = (0, useReimbursementAccountStepFormSubmit_1.default)({
        fieldIds: STEP_FIELDS,
        onNext: (values) => {
            const website = expensify_common_1.Str.sanitizeURL(values?.website, CONST_1.default.COMPANY_WEBSITE_DEFAULT_SCHEME);
            (0, BankAccounts_1.addBusinessWebsiteForDraft)(website);
            onNext();
        },
        shouldSaveDraft: true,
    });
    if (isLoadingReimbursementAccount) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<SingleFieldStep_1.default isEditing={isEditing} onNext={onNext} onMove={onMove} formID={ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM} formTitle={translate('businessInfoStep.enterYourCompanyWebsite')} formDisclaimer={translate('common.websiteExample')} validate={validate} onSubmit={handleSubmit} inputId={COMPANY_WEBSITE_KEY} inputLabel={translate('businessInfoStep.companyWebsite')} defaultValue={defaultCompanyWebsite} inputMode={CONST_1.default.INPUT_MODE.URL} shouldShowHelpLinks={false}/>);
}
WebsiteBusiness.displayName = 'WebsiteBusiness';
exports.default = WebsiteBusiness;
