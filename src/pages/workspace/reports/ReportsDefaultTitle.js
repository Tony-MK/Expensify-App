"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const BulletList_1 = require("@components/BulletList");
const FormProvider_1 = require("@components/Form/FormProvider");
const InputWrapper_1 = require("@components/Form/InputWrapper");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const TextInput_1 = require("@components/TextInput");
const useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
const useBeforeRemove_1 = require("@hooks/useBeforeRemove");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ReportsDefaultTitleModalForm_1 = require("@src/types/form/ReportsDefaultTitleModalForm");
function ReportsDefaultTitlePage({ route }) {
    const policyID = route.params.policyID;
    const policy = (0, usePolicy_1.default)(policyID);
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { inputCallbackRef } = (0, useAutoFocusInput_1.default)();
    const RULE_EXAMPLE_BULLET_POINTS = [
        translate('workspace.reports.customNameEmailPhoneExample'),
        translate('workspace.reports.customNameStartDateExample'),
        translate('workspace.reports.customNameWorkspaceNameExample'),
        translate('workspace.reports.customNameReportIDExample'),
        translate('workspace.reports.customNameTotalExample'),
    ];
    const fieldListItem = policy?.fieldList?.[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE];
    const customNameDefaultValue = expensify_common_1.Str.htmlDecode(fieldListItem?.defaultValue ?? '');
    const validateCustomName = (0, react_1.useCallback)(({ defaultTitle }) => {
        const errors = {};
        if (!defaultTitle) {
            errors[ReportsDefaultTitleModalForm_1.default.DEFAULT_TITLE] = translate('common.error.fieldRequired');
        }
        else if (defaultTitle.length > CONST_1.default.WORKSPACE_NAME_CHARACTER_LIMIT) {
            errors[ReportsDefaultTitleModalForm_1.default.DEFAULT_TITLE] = translate('common.error.characterLimitExceedCounter', {
                length: defaultTitle.length,
                limit: CONST_1.default.WORKSPACE_NAME_CHARACTER_LIMIT,
            });
        }
        return errors;
    }, [translate]);
    const clearTitleFieldError = () => {
        (0, Policy_1.clearPolicyTitleFieldError)(policyID);
    };
    // Get pending action for loading state
    const isLoading = !!policy?.fieldList?.[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE]?.pendingFields?.defaultValue;
    // Clear errors when modal is dismissed
    (0, useBeforeRemove_1.default)(() => {
        clearTitleFieldError();
    });
    const submitForm = (values) => {
        (0, Policy_1.setPolicyDefaultReportTitle)(policyID, values.defaultTitle);
        Navigation_1.default.goBack();
    };
    const titleError = policy?.errorFields?.fieldList?.[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE];
    const titleFieldError = (0, ErrorUtils_1.getLatestErrorField)({ errorFields: titleError ?? {} }, 'defaultValue');
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={ReportsDefaultTitlePage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.reports.customNameTitle')} onBackButtonPress={() => Navigation_1.default.goBack()}/>
                <react_native_1.View style={[styles.renderHTML, styles.flexRow, styles.ph5, styles.pb4]}>
                    <RenderHTML_1.default html={translate('workspace.reports.customNameDescription')}/>
                </react_native_1.View>
                <FormProvider_1.default style={[styles.flexGrow1, styles.mh5]} formID={ONYXKEYS_1.default.FORMS.REPORTS_DEFAULT_TITLE_MODAL_FORM} validate={validateCustomName} onSubmit={submitForm} submitButtonText={translate('common.save')} enabledWhenOffline shouldHideFixErrorsAlert isLoading={isLoading} addBottomSafeAreaPadding>
                    <OfflineWithFeedback_1.default pendingAction={policy?.fieldList?.[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE]?.pendingFields?.defaultValue} errors={titleFieldError} errorRowStyles={styles.mh0} onClose={clearTitleFieldError}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={ReportsDefaultTitleModalForm_1.default.DEFAULT_TITLE} defaultValue={customNameDefaultValue} label={translate('workspace.reports.customNameInputLabel')} aria-label={translate('workspace.reports.customNameInputLabel')} ref={inputCallbackRef}/>
                    </OfflineWithFeedback_1.default>
                    <BulletList_1.default items={RULE_EXAMPLE_BULLET_POINTS} header={translate('workspace.reports.reportsCustomTitleExamples')}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
ReportsDefaultTitlePage.displayName = 'ReportsDefaultTitlePage';
exports.default = ReportsDefaultTitlePage;
