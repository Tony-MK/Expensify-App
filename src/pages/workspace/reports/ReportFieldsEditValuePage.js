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
const WorkspaceReportFieldUtils_1 = require("@libs/WorkspaceReportFieldUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const ReportField_1 = require("@userActions/Policy/ReportField");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const WorkspaceReportFieldForm_1 = require("@src/types/form/WorkspaceReportFieldForm");
function ReportFieldsEditValuePage({ policy, route: { params: { policyID, valueIndex }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const [formDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM_DRAFT, { canBeMissing: true });
    const currentValueName = formDraft?.listValues?.[valueIndex] ?? '';
    const validate = (0, react_1.useCallback)((values) => (0, WorkspaceReportFieldUtils_1.validateReportFieldListValueName)(values[WorkspaceReportFieldForm_1.default.NEW_VALUE_NAME].trim(), currentValueName, formDraft?.[WorkspaceReportFieldForm_1.default.LIST_VALUES] ?? [], WorkspaceReportFieldForm_1.default.NEW_VALUE_NAME), [currentValueName, formDraft]);
    const editValue = (0, react_1.useCallback)((values) => {
        const valueName = values[WorkspaceReportFieldForm_1.default.NEW_VALUE_NAME]?.trim();
        if (currentValueName !== valueName) {
            (0, ReportField_1.renameReportFieldsListValue)(valueIndex, valueName);
        }
        react_native_1.Keyboard.dismiss();
        Navigation_1.default.goBack();
    }, [currentValueName, valueIndex]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_REPORT_FIELDS_ENABLED} shouldBeBlocked={(0, PolicyUtils_1.hasAccountingConnections)(policy)}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={styles.defaultModalContainer} testID={ReportFieldsEditValuePage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.reportFields.editValue')} onBackButtonPress={Navigation_1.default.goBack}/>
                <FormProvider_1.default formID={ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM} onSubmit={editValue} submitButtonText={translate('common.save')} validate={validate} style={[styles.mh5, styles.flex1]} enabledWhenOffline shouldHideFixErrorsAlert addBottomSafeAreaPadding>
                    <InputWrapper_1.default InputComponent={TextInput_1.default} defaultValue={currentValueName} label={translate('common.value')} accessibilityLabel={translate('common.value')} inputID={WorkspaceReportFieldForm_1.default.NEW_VALUE_NAME} role={CONST_1.default.ROLE.PRESENTATION} ref={inputCallbackRef}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
ReportFieldsEditValuePage.displayName = 'ReportFieldsEditValuePage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(ReportFieldsEditValuePage);
