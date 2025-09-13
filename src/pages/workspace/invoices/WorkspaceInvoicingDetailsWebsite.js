"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Url_1 = require("@libs/Url");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const Navigation_1 = require("@navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WorkspaceInvoicesCompanyWebsiteForm_1 = require("@src/types/form/WorkspaceInvoicesCompanyWebsiteForm");
function WorkspaceInvoicingDetailsWebsite({ route }) {
    const { policyID } = route.params;
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`);
    const submit = (values) => {
        const companyWebsite = expensify_common_1.Str.sanitizeURL(values[WorkspaceInvoicesCompanyWebsiteForm_1.default.COMPANY_WEBSITE], CONST_1.default.COMPANY_WEBSITE_DEFAULT_SCHEME);
        (0, Policy_1.updateInvoiceCompanyWebsite)(policyID, companyWebsite);
        Navigation_1.default.goBack();
    };
    const validate = (values) => {
        const errors = (0, ValidationUtils_1.getFieldRequiredErrors)(values, [WorkspaceInvoicesCompanyWebsiteForm_1.default.COMPANY_WEBSITE]);
        if (values.companyWebsite) {
            const companyWebsite = expensify_common_1.Str.sanitizeURL(values.companyWebsite, CONST_1.default.COMPANY_WEBSITE_DEFAULT_SCHEME);
            if (!(0, ValidationUtils_1.isValidWebsite)(companyWebsite)) {
                errors.companyWebsite = translate('bankAccount.error.website');
            }
            else {
                const domain = (0, Url_1.extractUrlDomain)(companyWebsite);
                if (!domain || !expensify_common_1.Str.isValidDomainName(domain)) {
                    errors.companyWebsite = translate('iou.invalidDomainError');
                }
                else if ((0, ValidationUtils_1.isPublicDomain)(domain)) {
                    errors.companyWebsite = translate('iou.publicDomainError');
                }
            }
        }
        return errors;
    };
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_INVOICES_ENABLED}>
            <ScreenWrapper_1.default testID={WorkspaceInvoicingDetailsWebsite.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight enableEdgeToEdgeBottomSafeAreaPadding>
                <HeaderWithBackButton_1.default title={translate('workspace.invoices.companyWebsite')}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_INVOICES_COMPANY_WEBSITE_FORM} submitButtonText={translate('common.save')} onSubmit={submit} style={[styles.flex1, styles.mh5]} enabledWhenOffline validate={validate} shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={WorkspaceInvoicesCompanyWebsiteForm_1.default.COMPANY_WEBSITE} label={translate('workspace.invoices.companyWebsite')} accessibilityLabel={translate('workspace.invoices.companyWebsite')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={policy?.invoice?.companyWebsite} ref={inputCallbackRef} inputMode={CONST_1.default.INPUT_MODE.URL}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceInvoicingDetailsWebsite.displayName = 'WorkspaceInvoicingDetailsWebsite';
exports.default = WorkspaceInvoicingDetailsWebsite;
