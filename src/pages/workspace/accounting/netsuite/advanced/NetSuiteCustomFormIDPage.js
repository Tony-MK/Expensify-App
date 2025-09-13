"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const NetSuiteCommands_1 = require("@userActions/connections/NetSuiteCommands");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function NetSuiteCustomFormIDPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const route = (0, native_1.useRoute)();
    const params = route.params;
    const policyID = params.policyID;
    const isReimbursable = params.expenseType === CONST_1.default.NETSUITE_EXPENSE_TYPE.REIMBURSABLE;
    const config = policy?.connections?.netsuite?.options.config;
    const exportDestination = (isReimbursable ? config?.reimbursableExpensesExportDestination : config?.nonreimbursableExpensesExportDestination) ?? CONST_1.default.NETSUITE_EXPORT_DESTINATION.EXPENSE_REPORT;
    const customFormIDKey = isReimbursable ? CONST_1.default.NETSUITE_CONFIG.CUSTOM_FORM_ID_TYPE.REIMBURSABLE : CONST_1.default.NETSUITE_CONFIG.CUSTOM_FORM_ID_TYPE.NON_REIMBURSABLE;
    const validate = (0, react_1.useCallback)((values) => {
        const errors = {};
        if (values[params.expenseType] && !(0, ValidationUtils_1.isNumeric)(values[params.expenseType])) {
            (0, ErrorUtils_1.addErrorMessage)(errors, params.expenseType, translate('workspace.netsuite.advancedConfig.error.customFormID'));
        }
        return errors;
    }, [params.expenseType, translate]);
    const updateCustomFormID = (0, react_1.useCallback)((formValues) => {
        if (config?.customFormIDOptions?.[customFormIDKey]?.[CONST_1.default.NETSUITE_MAP_EXPORT_DESTINATION[exportDestination]] !== formValues[params.expenseType]) {
            (0, NetSuiteCommands_1.updateNetSuiteCustomFormIDOptions)(policyID, formValues[params.expenseType], isReimbursable, exportDestination, config?.customFormIDOptions);
        }
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_ADVANCED.getRoute(policyID));
    }, [config?.customFormIDOptions, customFormIDKey, exportDestination, isReimbursable, params.expenseType, policyID]);
    return (<ConnectionLayout_1.default displayName={NetSuiteCustomFormIDPage.displayName} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_ADVANCED.getRoute(policyID))} headerTitle={`workspace.netsuite.advancedConfig.${isReimbursable ? 'customFormIDReimbursable' : 'customFormIDNonReimbursable'}`} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.flex1]} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} shouldBeBlocked={!config?.customFormIDOptions?.enabled} shouldUseScrollView={false}>
            <react_native_1.View style={[styles.flexGrow1, styles.ph5]}>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.NETSUITE_CUSTOM_FORM_ID_FORM} style={styles.flexGrow1} validate={validate} onSubmit={updateCustomFormID} submitButtonText={translate('common.confirm')} shouldValidateOnBlur shouldValidateOnChange shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <OfflineWithFeedback_1.default pendingAction={(0, PolicyUtils_1.settingsPendingAction)([customFormIDKey], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config, customFormIDKey)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearNetSuiteErrorField)(policyID, customFormIDKey)}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} ref={inputCallbackRef} inputID={params.expenseType} label={translate(`workspace.netsuite.advancedConfig.${isReimbursable ? 'customFormIDReimbursable' : 'customFormIDNonReimbursable'}`)} aria-label={translate(`workspace.netsuite.advancedConfig.${isReimbursable ? 'customFormIDReimbursable' : 'customFormIDNonReimbursable'}`)} role={CONST_1.default.ROLE.PRESENTATION} spellCheck={false} inputMode={CONST_1.default.INPUT_MODE.NUMERIC} defaultValue={config?.customFormIDOptions?.[customFormIDKey]?.[CONST_1.default.NETSUITE_MAP_EXPORT_DESTINATION[exportDestination]]}/>
                    </OfflineWithFeedback_1.default>
                </FormProvider_1.default>
            </react_native_1.View>
        </ConnectionLayout_1.default>);
}
NetSuiteCustomFormIDPage.displayName = 'NetSuiteCustomFormIDPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteCustomFormIDPage);
