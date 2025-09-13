"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextPicker_1 = require("@components/TextPicker");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const DateUtils_1 = require("@libs/DateUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ValidationUtils_1 = require("@libs/ValidationUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const ReportField_1 = require("@userActions/Policy/ReportField");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const WorkspaceReportFieldForm_1 = require("@src/types/form/WorkspaceReportFieldForm");
const InitialListValueSelector_1 = require("./InitialListValueSelector");
const TypeSelector_1 = require("./TypeSelector");
const defaultDate = DateUtils_1.default.extractDate(new Date().toString());
function WorkspaceCreateReportFieldsPage({ policy, route: { params: { policyID }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const formRef = (0, react_1.useRef)(null);
    const [formDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM_DRAFT, { canBeMissing: true });
    const availableListValuesLength = (formDraft?.[WorkspaceReportFieldForm_1.default.DISABLED_LIST_VALUES] ?? []).filter((disabledListValue) => !disabledListValue).length;
    const submitForm = (0, react_1.useCallback)((values) => {
        (0, ReportField_1.createReportField)(policyID, {
            name: values[WorkspaceReportFieldForm_1.default.NAME],
            type: values[WorkspaceReportFieldForm_1.default.TYPE],
            initialValue: !(values[WorkspaceReportFieldForm_1.default.TYPE] === CONST_1.default.REPORT_FIELD_TYPES.LIST && availableListValuesLength === 0) ? values[WorkspaceReportFieldForm_1.default.INITIAL_VALUE] : '',
        });
        Navigation_1.default.goBack();
    }, [availableListValuesLength, policyID]);
    const validateForm = (0, react_1.useCallback)((values) => {
        const { name, type, initialValue: formInitialValue } = values;
        const errors = {};
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(name)) {
            errors[WorkspaceReportFieldForm_1.default.NAME] = translate('workspace.reportFields.reportFieldNameRequiredError');
        }
        else if (Object.values(policy?.fieldList ?? {}).some((reportField) => reportField.name === name)) {
            errors[WorkspaceReportFieldForm_1.default.NAME] = translate('workspace.reportFields.existingReportFieldNameError');
        }
        else if ([...name].length > CONST_1.default.WORKSPACE_REPORT_FIELD_POLICY_MAX_LENGTH) {
            // Uses the spread syntax to count the number of Unicode code points instead of the number of UTF-16 code units.
            (0, ErrorUtils_1.addErrorMessage)(errors, WorkspaceReportFieldForm_1.default.NAME, translate('common.error.characterLimitExceedCounter', { length: [...name].length, limit: CONST_1.default.WORKSPACE_REPORT_FIELD_POLICY_MAX_LENGTH }));
        }
        if (!(0, ValidationUtils_1.isRequiredFulfilled)(type)) {
            errors[WorkspaceReportFieldForm_1.default.TYPE] = translate('workspace.reportFields.reportFieldTypeRequiredError');
        }
        // formInitialValue can be undefined because the InitialValue component is rendered conditionally.
        // If it's not been rendered when the validation is executed, formInitialValue will be undefined.
        if (type === CONST_1.default.REPORT_FIELD_TYPES.TEXT && !!formInitialValue && formInitialValue.length > CONST_1.default.WORKSPACE_REPORT_FIELD_POLICY_MAX_LENGTH) {
            errors[WorkspaceReportFieldForm_1.default.INITIAL_VALUE] = translate('common.error.characterLimitExceedCounter', {
                length: formInitialValue.length,
                limit: CONST_1.default.WORKSPACE_REPORT_FIELD_POLICY_MAX_LENGTH,
            });
        }
        if (type === CONST_1.default.REPORT_FIELD_TYPES.LIST && availableListValuesLength > 0 && !(0, ValidationUtils_1.isRequiredFulfilled)(formInitialValue)) {
            errors[WorkspaceReportFieldForm_1.default.INITIAL_VALUE] = translate('workspace.reportFields.reportFieldInitialValueRequiredError');
        }
        return errors;
    }, [availableListValuesLength, policy?.fieldList, translate]);
    (0, react_1.useEffect)(() => {
        (0, ReportField_1.setInitialCreateReportFieldsForm)();
    }, []);
    const listValues = [...(formDraft?.[WorkspaceReportFieldForm_1.default.LIST_VALUES] ?? [])].sort(localeCompare).join(', ');
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_REPORT_FIELDS_ENABLED} shouldBeBlocked={(0, PolicyUtils_1.hasAccountingConnections)(policy)}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={styles.defaultModalContainer} testID={WorkspaceCreateReportFieldsPage.displayName} shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.reportFields.addField')} onBackButtonPress={Navigation_1.default.goBack}/>
                <FormProvider_1.default ref={formRef} style={[styles.mh5, styles.flex1]} formID={ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM} onSubmit={submitForm} validate={validateForm} submitButtonText={translate('common.save')} enabledWhenOffline shouldValidateOnBlur={false} addBottomSafeAreaPadding>
                    {({ inputValues }) => (<react_native_1.View style={styles.mhn5}>
                            <InputWrapper_1.default InputComponent={TextPicker_1.default} inputID={WorkspaceReportFieldForm_1.default.NAME} label={translate('common.name')} subtitle={translate('workspace.reportFields.nameInputSubtitle')} description={translate('common.name')} rightLabel={translate('common.required')} accessibilityLabel={translate('workspace.editor.nameInputLabel')} maxLength={CONST_1.default.WORKSPACE_REPORT_FIELD_POLICY_MAX_LENGTH} multiline={false} role={CONST_1.default.ROLE.PRESENTATION} required/>
                            <InputWrapper_1.default InputComponent={TypeSelector_1.default} inputID={WorkspaceReportFieldForm_1.default.TYPE} label={translate('common.type')} subtitle={translate('workspace.reportFields.typeInputSubtitle')} rightLabel={translate('common.required')} onTypeSelected={(type) => formRef.current?.resetForm({ ...inputValues, type, initialValue: type === CONST_1.default.REPORT_FIELD_TYPES.DATE ? defaultDate : '' })}/>

                            {inputValues[WorkspaceReportFieldForm_1.default.TYPE] === CONST_1.default.REPORT_FIELD_TYPES.LIST && (<MenuItemWithTopDescription_1.default description={translate('workspace.reportFields.listValues')} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_REPORT_FIELDS_LIST_VALUES.getRoute(policyID))} title={listValues} numberOfLinesTitle={5}/>)}

                            {inputValues[WorkspaceReportFieldForm_1.default.TYPE] === CONST_1.default.REPORT_FIELD_TYPES.TEXT && (<InputWrapper_1.default InputComponent={TextPicker_1.default} inputID={WorkspaceReportFieldForm_1.default.INITIAL_VALUE} label={translate('common.initialValue')} subtitle={translate('workspace.reportFields.initialValueInputSubtitle')} description={translate('common.initialValue')} accessibilityLabel={translate('workspace.editor.initialValueInputLabel')} maxLength={CONST_1.default.WORKSPACE_REPORT_FIELD_POLICY_MAX_LENGTH} multiline={false} role={CONST_1.default.ROLE.PRESENTATION}/>)}

                            {inputValues[WorkspaceReportFieldForm_1.default.TYPE] === CONST_1.default.REPORT_FIELD_TYPES.DATE && (<MenuItemWithTopDescription_1.default title={translate('common.currentDate')} description={translate('common.initialValue')} rightLabel={translate('common.required')} interactive={false}/>)}

                            {inputValues[WorkspaceReportFieldForm_1.default.TYPE] === CONST_1.default.REPORT_FIELD_TYPES.LIST && availableListValuesLength > 0 && (<InputWrapper_1.default InputComponent={InitialListValueSelector_1.default} inputID={WorkspaceReportFieldForm_1.default.INITIAL_VALUE} label={translate('common.initialValue')} subtitle={translate('workspace.reportFields.listValuesInputSubtitle')}/>)}
                        </react_native_1.View>)}
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceCreateReportFieldsPage.displayName = 'WorkspaceCreateReportFieldsPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceCreateReportFieldsPage);
