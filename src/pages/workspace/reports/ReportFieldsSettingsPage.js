"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const WorkspaceReportFieldUtils_1 = require("@libs/WorkspaceReportFieldUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const ReportField_1 = require("@userActions/Policy/ReportField");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function ReportFieldsSettingsPage({ policy, route: { params: { policyID, reportFieldID }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const [isDeleteModalVisible, setIsDeleteModalVisible] = (0, react_1.useState)(false);
    const hasAccountingConnections = (0, PolicyUtils_1.hasAccountingConnections)(policy);
    const reportFieldKey = (0, ReportUtils_1.getReportFieldKey)(reportFieldID);
    const reportField = policy?.fieldList?.[reportFieldKey] ?? null;
    if (!reportField) {
        return <NotFoundPage_1.default />;
    }
    const isDateFieldType = reportField.type === CONST_1.default.REPORT_FIELD_TYPES.DATE;
    const isListFieldType = reportField.type === CONST_1.default.REPORT_FIELD_TYPES.LIST;
    const isListFieldEmpty = isListFieldType && reportField.disabledOptions.filter((disabledListValue) => !disabledListValue).length <= 0;
    const listValues = Object.values(policy?.fieldList?.[reportFieldKey]?.values ?? {})?.sort(localeCompare);
    const deleteReportFieldAndHideModal = () => {
        (0, ReportField_1.deleteReportFields)(policyID, [reportFieldKey]);
        setIsDeleteModalVisible(false);
        Navigation_1.default.goBack();
    };
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_REPORT_FIELDS_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={[styles.defaultModalContainer]} testID={ReportFieldsSettingsPage.displayName}>
                <HeaderWithBackButton_1.default title={reportField.name} shouldSetModalVisibility={false}/>
                <ConfirmModal_1.default title={translate('workspace.reportFields.delete')} isVisible={isDeleteModalVisible && !hasAccountingConnections} onConfirm={deleteReportFieldAndHideModal} onCancel={() => setIsDeleteModalVisible(false)} shouldSetModalVisibility={false} prompt={translate('workspace.reportFields.deleteConfirmation')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
                <react_native_1.View style={styles.flexGrow1}>
                    <MenuItemWithTopDescription_1.default style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} title={reportField.name} description={translate('common.name')} interactive={false}/>
                    <MenuItemWithTopDescription_1.default style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} title={expensify_common_1.Str.recapitalize(translate((0, WorkspaceReportFieldUtils_1.getReportFieldTypeTranslationKey)(reportField.type)))} description={translate('common.type')} interactive={false}/>
                    {isListFieldType && (<MenuItemWithTopDescription_1.default style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} description={translate('workspace.reportFields.listValues')} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_REPORT_FIELDS_LIST_VALUES.getRoute(policyID, reportFieldID))} title={listValues.join(', ')} numberOfLinesTitle={5}/>)}
                    {!isListFieldEmpty && (<MenuItemWithTopDescription_1.default style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} title={(0, WorkspaceReportFieldUtils_1.getReportFieldInitialValue)(reportField)} description={translate('common.initialValue')} shouldShowRightIcon={!isDateFieldType && !hasAccountingConnections} interactive={!isDateFieldType && !hasAccountingConnections} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_EDIT_REPORT_FIELDS_INITIAL_VALUE.getRoute(policyID, reportFieldID))}/>)}
                    {!hasAccountingConnections && (<react_native_1.View style={styles.flexGrow1}>
                            <MenuItem_1.default icon={Expensicons.Trashcan} title={translate('common.delete')} onPress={() => setIsDeleteModalVisible(true)}/>
                        </react_native_1.View>)}
                </react_native_1.View>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
ReportFieldsSettingsPage.displayName = 'ReportFieldsSettingsPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(ReportFieldsSettingsPage);
