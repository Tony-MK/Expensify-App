"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expensify_common_1 = require("expensify-common");
var react_1 = require("react");
var react_native_1 = require("react-native");
var BulletList_1 = require("@components/BulletList");
var FormProvider_1 = require("@components/Form/FormProvider");
var InputWrapper_1 = require("@components/Form/InputWrapper");
var HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
var OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
var RenderHTML_1 = require("@components/RenderHTML");
var ScreenWrapper_1 = require("@components/ScreenWrapper");
var TextInput_1 = require("@components/TextInput");
var useAutoFocusInput_1 = require("@hooks/useAutoFocusInput");
var useBeforeRemove_1 = require("@hooks/useBeforeRemove");
var useLocalize_1 = require("@hooks/useLocalize");
var usePolicy_1 = require("@hooks/usePolicy");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var ErrorUtils_1 = require("@libs/ErrorUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
var Policy_1 = require("@userActions/Policy/Policy");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var ReportsDefaultTitleModalForm_1 = require("@src/types/form/ReportsDefaultTitleModalForm");
function ReportsDefaultTitlePage(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var route = _a.route;
    var policyID = route.params.policyID;
    var policy = (0, usePolicy_1.default)(policyID);
    var translate = (0, useLocalize_1.default)().translate;
    var styles = (0, useThemeStyles_1.default)();
    var inputCallbackRef = (0, useAutoFocusInput_1.default)().inputCallbackRef;
    var RULE_EXAMPLE_BULLET_POINTS = [
        translate('workspace.reports.customNameEmailPhoneExample'),
        translate('workspace.reports.customNameStartDateExample'),
        translate('workspace.reports.customNameWorkspaceNameExample'),
        translate('workspace.reports.customNameReportIDExample'),
        translate('workspace.reports.customNameTotalExample'),
    ];
    var fieldListItem = (_b = policy === null || policy === void 0 ? void 0 : policy.fieldList) === null || _b === void 0 ? void 0 : _b[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE];
    var customNameDefaultValue = expensify_common_1.Str.htmlDecode((_c = fieldListItem === null || fieldListItem === void 0 ? void 0 : fieldListItem.defaultValue) !== null && _c !== void 0 ? _c : '');
    var validateCustomName = (0, react_1.useCallback)(function (_a) {
        var defaultTitle = _a.defaultTitle;
        var errors = {};
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
    var clearTitleFieldError = function () {
        (0, Policy_1.clearPolicyTitleFieldError)(policyID);
    };
    // Get pending action for loading state
    var isLoading = !!((_f = (_e = (_d = policy === null || policy === void 0 ? void 0 : policy.fieldList) === null || _d === void 0 ? void 0 : _d[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE]) === null || _e === void 0 ? void 0 : _e.pendingFields) === null || _f === void 0 ? void 0 : _f.defaultValue);
    // Clear errors when modal is dismissed
    (0, useBeforeRemove_1.default)(function () {
        clearTitleFieldError();
    });
    var submitForm = function (values) {
        (0, Policy_1.setPolicyDefaultReportTitle)(policyID, values.defaultTitle);
        Navigation_1.default.goBack();
    };
    var titleError = (_h = (_g = policy === null || policy === void 0 ? void 0 : policy.errorFields) === null || _g === void 0 ? void 0 : _g.fieldList) === null || _h === void 0 ? void 0 : _h[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE];
    var titleFieldError = (0, ErrorUtils_1.getLatestErrorField)({ errorFields: titleError !== null && titleError !== void 0 ? titleError : {} }, 'defaultValue');
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight testID={ReportsDefaultTitlePage.displayName}>
                <HeaderWithBackButton_1.default title={translate('workspace.reports.customNameTitle')} onBackButtonPress={function () { return Navigation_1.default.goBack(); }}/>
                <react_native_1.View style={[styles.renderHTML, styles.flexRow, styles.ph5, styles.pb4]}>
                    <RenderHTML_1.default html={translate('workspace.reports.customNameDescription')}/>
                </react_native_1.View>
                <FormProvider_1.default style={[styles.flexGrow1, styles.mh5]} formID={ONYXKEYS_1.default.FORMS.REPORTS_DEFAULT_TITLE_MODAL_FORM} validate={validateCustomName} onSubmit={submitForm} submitButtonText={translate('common.save')} enabledWhenOffline shouldHideFixErrorsAlert isLoading={isLoading} addBottomSafeAreaPadding>
                    <OfflineWithFeedback_1.default pendingAction={(_l = (_k = (_j = policy === null || policy === void 0 ? void 0 : policy.fieldList) === null || _j === void 0 ? void 0 : _j[CONST_1.default.POLICY.FIELDS.FIELD_LIST_TITLE]) === null || _k === void 0 ? void 0 : _k.pendingFields) === null || _l === void 0 ? void 0 : _l.defaultValue} errors={titleFieldError} errorRowStyles={styles.mh0} onClose={clearTitleFieldError}>
                        <InputWrapper_1.default InputComponent={TextInput_1.default} inputID={ReportsDefaultTitleModalForm_1.default.DEFAULT_TITLE} defaultValue={customNameDefaultValue} label={translate('workspace.reports.customNameInputLabel')} aria-label={translate('workspace.reports.customNameInputLabel')} ref={inputCallbackRef}/>
                    </OfflineWithFeedback_1.default>
                    <BulletList_1.default items={RULE_EXAMPLE_BULLET_POINTS} header={translate('workspace.reports.reportsCustomTitleExamples')}/>
                </FormProvider_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
ReportsDefaultTitlePage.displayName = 'ReportsDefaultTitlePage';
exports.default = ReportsDefaultTitlePage;
