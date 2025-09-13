"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const WorkspaceReportFieldUtils_1 = require("@libs/WorkspaceReportFieldUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const ReportField_1 = require("@userActions/Policy/ReportField");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WorkspaceReportFieldForm_1 = require("@src/types/form/WorkspaceReportFieldForm");
function ReportFieldsAddListValuePage({ policy, route: { params: { policyID, reportFieldID }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const [formDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM_DRAFT, { canBeMissing: true });
    const listValues = (0, react_1.useMemo)(() => {
        let reportFieldListValues;
        if (reportFieldID) {
            const reportFieldKey = (0, ReportUtils_1.getReportFieldKey)(reportFieldID);
            reportFieldListValues = Object.values(policy?.fieldList?.[reportFieldKey]?.values ?? {});
        }
        else {
            reportFieldListValues = formDraft?.[WorkspaceReportFieldForm_1.default.LIST_VALUES] ?? [];
        }
        return reportFieldListValues;
    }, [formDraft, policy?.fieldList, reportFieldID]);
    const validate = (0, react_1.useCallback)((values) => (0, WorkspaceReportFieldUtils_1.validateReportFieldListValueName)(values[WorkspaceReportFieldForm_1.default.VALUE_NAME].trim(), '', listValues, WorkspaceReportFieldForm_1.default.VALUE_NAME), [listValues]);
    const createValue = (0, react_1.useCallback)((values) => {
        if (reportFieldID) {
            (0, ReportField_1.addReportFieldListValue)(policyID, reportFieldID, values[WorkspaceReportFieldForm_1.default.VALUE_NAME]);
        }
        else {
            (0, ReportField_1.createReportFieldsListValue)(values[WorkspaceReportFieldForm_1.default.VALUE_NAME]);
        }
        react_native_1.Keyboard.dismiss();
        Navigation_1.default.goBack();
    }, [policyID, reportFieldID]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_REPORT_FIELDS_ENABLED} shouldBeBlocked={(0, PolicyUtils_1.hasAccountingConnections)(policy)}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={styles.defaultModalContainer} testID={ReportFieldsAddListValuePage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.reportFields.addValue')} onBackButtonPress={Navigation_1.default.goBack}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM} onSubmit={createValue} submitButtonText={translate('common.save')} validate={validate} style={[styles.mh5, styles.flex1]} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} label={translate('common.value')} accessibilityLabel={translate('common.value')} inputID={WorkspaceReportFieldForm_1.default.VALUE_NAME} role={CONST_1.default.ROLE.PRESENTATION} ref={inputCallbackRef}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
ReportFieldsAddListValuePage.displayName = 'ReportFieldsAddListValuePage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(ReportFieldsAddListValuePage);
