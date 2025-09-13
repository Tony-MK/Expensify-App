"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const WorkspaceReportFieldUtils_1 = require("@libs/WorkspaceReportFieldUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const ReportField_1 = require("@userActions/Policy/ReportField");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WorkspaceReportFieldForm_1 = require("@src/types/form/WorkspaceReportFieldForm");
const ReportFieldsInitialListValuePicker_1 = require("./InitialListValueSelector/ReportFieldsInitialListValuePicker");
function ReportFieldsInitialValuePage({ policy, route: { params: { policyID, reportFieldID }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const hasAccountingConnections = (0, PolicyUtils_1.hasAccountingConnections)(policy);
    const reportField = policy?.fieldList?.[(0, ReportUtils_1.getReportFieldKey)(reportFieldID)] ?? null;
    const availableListValuesLength = (reportField?.disabledOptions ?? []).filter((disabledListValue) => !disabledListValue).length;
    const currentInitialValue = (0, WorkspaceReportFieldUtils_1.getReportFieldInitialValue)(reportField);
    const [initialValue, setInitialValue] = (0, react_1.useState)(currentInitialValue);
    const submitForm = (0, react_1.useCallback)((values) => {
        if (currentInitialValue !== values.initialValue) {
            (0, ReportField_1.updateReportFieldInitialValue)(policyID, reportFieldID, values.initialValue);
        }
        Navigation_1.default.goBack();
    }, [policyID, reportFieldID, currentInitialValue]);
    const submitListValueUpdate = (value) => {
        (0, ReportField_1.updateReportFieldInitialValue)(policyID, reportFieldID, currentInitialValue === value ? '' : value);
        Navigation_1.default.goBack();
    };
    const validateForm = (0, react_1.useCallback)((values) => {
        const { initialValue: formInitialValue } = values;
        const errors = {};
        if (reportField?.type === CONST_1.default.REPORT_FIELD_TYPES.TEXT && formInitialValue.length > CONST_1.default.WORKSPACE_REPORT_FIELD_POLICY_MAX_LENGTH) {
            errors[WorkspaceReportFieldForm_1.default.INITIAL_VALUE] = translate('common.error.characterLimitExceedCounter', {
                length: formInitialValue.length,
                limit: CONST_1.default.WORKSPACE_REPORT_FIELD_POLICY_MAX_LENGTH,
            });
        }
        if (reportField?.type === CONST_1.default.REPORT_FIELD_TYPES.LIST && availableListValuesLength > 0 && !(0, ValidationUtils_1.isRequiredFulfilled)(formInitialValue)) {
            errors[WorkspaceReportFieldForm_1.default.INITIAL_VALUE] = translate('workspace.reportFields.reportFieldInitialValueRequiredError');
        }
        return errors;
    }, [availableListValuesLength, reportField?.type, translate]);
    if (!reportField || hasAccountingConnections) {
        return <NotFoundPage_1.default />;
    }
    const isTextFieldType = reportField.type === CONST_1.default.REPORT_FIELD_TYPES.TEXT;
    const isListFieldType = reportField.type === CONST_1.default.REPORT_FIELD_TYPES.LIST;
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_REPORT_FIELDS_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={styles.defaultModalContainer} testID={ReportFieldsInitialValuePage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('common.initialValue')} onBackButtonPress={Navigation_1.default.goBack}/>
                {isListFieldType && (<react_native_1.View style={[styles.ph5, styles.pb4]}>
                        <Text_1.default style={[styles.sidebarLinkText, styles.optionAlternateText]}>{translate('workspace.reportFields.listValuesInputSubtitle')}</Text_1.default>
                    </react_native_1.View>)}

                {isTextFieldType && (<FormProvider_1.default addBottomSafeAreaPadding formID={ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM} onSubmit={submitForm} submitButtonText={translate('common.save')} validate={validateForm} style={styles.flex1} enabledWhenOffline isSubmitButtonVisible={isTextFieldType} submitButtonStyles={styles.mh5} shouldHideFixErrorsAlert>
                        <InputWrapper_1.default containerStyles={styles.mh5} InputComponent={TextInput_1.default} inputID={WorkspaceReportFieldForm_1.default.INITIAL_VALUE} label={translate('common.initialValue')} accessibilityLabel={translate('workspace.editor.initialValueInputLabel')} multiline={false} value={initialValue} role={CONST_1.default.ROLE.PRESENTATION} ref={inputCallbackRef} onChangeText={setInitialValue}/>
                    </FormProvider_1.default>)}
                {isListFieldType && (<ReportFieldsInitialListValuePicker_1.default listValues={reportField.values} disabledOptions={reportField.disabledOptions} value={initialValue} onValueChange={submitListValueUpdate}/>)}
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
ReportFieldsInitialValuePage.displayName = 'ReportFieldsInitialValuePage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(ReportFieldsInitialValuePage);
