"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const ValidationUtils_1 = require("@libs/ValidationUtils");
const Navigation_1 = require("@navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WorkspaceInvoicesCompanyNameForm_1 = require("@src/types/form/WorkspaceInvoicesCompanyNameForm");
function WorkspaceInvoicingDetailsName({ route }) {
    const { policyID } = route.params;
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`);
    const submit = (values) => {
        (0, Policy_1.updateInvoiceCompanyName)(policyID, values[WorkspaceInvoicesCompanyNameForm_1.default.COMPANY_NAME]);
        Navigation_1.default.goBack();
    };
    const validate = (values) => (0, ValidationUtils_1.getFieldRequiredErrors)(values, [WorkspaceInvoicesCompanyNameForm_1.default.COMPANY_NAME]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_INVOICES_ENABLED}>
            <ScreenWrapper_1.default testID={WorkspaceInvoicingDetailsName.displayName} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight enableEdgeToEdgeBottomSafeAreaPadding>
                <HeaderWithBackButton_1.default title={translate('workspace.invoices.companyName')}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_INVOICES_COMPANY_NAME_FORM} submitButtonText={translate('common.save')} onSubmit={submit} style={[styles.flex1, styles.mh5]} enabledWhenOffline validate={validate} shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={WorkspaceInvoicesCompanyNameForm_1.default.COMPANY_NAME} label={translate('workspace.invoices.companyName')} accessibilityLabel={translate('workspace.invoices.companyName')} role={CONST_1.default.ROLE.PRESENTATION} defaultValue={policy?.invoice?.companyName} ref={inputCallbackRef}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceInvoicingDetailsName.displayName = 'WorkspaceInvoicingDetailsName';
exports.default = WorkspaceInvoicingDetailsName;
