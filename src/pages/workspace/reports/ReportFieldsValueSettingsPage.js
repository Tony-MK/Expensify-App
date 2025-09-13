"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConfirmModal_1 = require("@components/ConfirmModal");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ReportField_1 = require("@libs/actions/Policy/ReportField");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const ReportUtils_1 = require("@libs/ReportUtils");
const NotFoundPage_1 = require("@pages/ErrorPage/NotFoundPage");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function ReportFieldsValueSettingsPage({ policy, route: { params: { policyID, valueIndex, reportFieldID }, }, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [formDraft] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FORMS.WORKSPACE_REPORT_FIELDS_FORM_DRAFT, { canBeMissing: true });
    const [isDeleteTagModalOpen, setIsDeleteTagModalOpen] = (0, react_1.useState)(false);
    const [currentValueName, currentValueDisabled] = (0, react_1.useMemo)(() => {
        let reportFieldValue;
        let reportFieldDisabledValue;
        if (reportFieldID) {
            const reportFieldKey = (0, ReportUtils_1.getReportFieldKey)(reportFieldID);
            reportFieldValue = Object.values(policy?.fieldList?.[reportFieldKey]?.values ?? {})?.at(valueIndex) ?? '';
            reportFieldDisabledValue = Object.values(policy?.fieldList?.[reportFieldKey]?.disabledOptions ?? {})?.at(valueIndex) ?? false;
        }
        else {
            reportFieldValue = formDraft?.listValues?.[valueIndex] ?? '';
            reportFieldDisabledValue = formDraft?.disabledListValues?.[valueIndex] ?? false;
        }
        return [reportFieldValue, reportFieldDisabledValue];
    }, [formDraft?.disabledListValues, formDraft?.listValues, policy?.fieldList, reportFieldID, valueIndex]);
    const hasAccountingConnections = (0, PolicyUtils_1.hasAccountingConnections)(policy);
    const oldValueName = (0, usePrevious_1.default)(currentValueName);
    if ((!currentValueName && !oldValueName) || hasAccountingConnections) {
        return <NotFoundPage_1.default />;
    }
    const deleteListValueAndHideModal = () => {
        if (reportFieldID) {
            (0, ReportField_1.removeReportFieldListValue)(policyID, reportFieldID, [valueIndex]);
        }
        else {
            (0, ReportField_1.deleteReportFieldsListValue)([valueIndex]);
        }
        setIsDeleteTagModalOpen(false);
        Navigation_1.default.goBack();
    };
    const updateListValueEnabled = (value) => {
        if (reportFieldID) {
            (0, ReportField_1.updateReportFieldListValueEnabled)(policyID, reportFieldID, [Number(valueIndex)], value);
            return;
        }
        (0, ReportField_1.setReportFieldsListValueEnabled)([valueIndex], value);
    };
    const navigateToEditValue = () => {
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_REPORT_FIELDS_EDIT_VALUE.getRoute(policyID, valueIndex));
    };
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_REPORT_FIELDS_ENABLED}>
            <ScreenWrapper_1.default enableEdgeToEdgeBottomSafeAreaPadding style={styles.defaultModalContainer} testID={ReportFieldsValueSettingsPage.displayName}>
                <HeaderWithBackButton_1.default title={currentValueName ?? oldValueName} shouldSetModalVisibility={false}/>
                <ConfirmModal_1.default title={translate('workspace.reportFields.deleteValue')} isVisible={isDeleteTagModalOpen} onConfirm={deleteListValueAndHideModal} onCancel={() => setIsDeleteTagModalOpen(false)} shouldSetModalVisibility={false} prompt={translate('workspace.reportFields.deleteValuePrompt')} confirmText={translate('common.delete')} cancelText={translate('common.cancel')} danger/>
                <react_native_1.View style={styles.flexGrow1}>
                    <react_native_1.View style={[styles.mt2, styles.mh5]}>
                        <react_native_1.View style={[styles.flexRow, styles.mb5, styles.mr2, styles.alignItemsCenter, styles.justifyContentBetween]}>
                            <Text_1.default>{translate('workspace.reportFields.enableValue')}</Text_1.default>
                            <Switch_1.default isOn={!currentValueDisabled} accessibilityLabel={translate('workspace.reportFields.enableValue')} onToggle={updateListValueEnabled}/>
                        </react_native_1.View>
                    </react_native_1.View>
                    <MenuItemWithTopDescription_1.default title={currentValueName ?? oldValueName} description={translate('common.value')} shouldShowRightIcon={!reportFieldID} interactive={!reportFieldID} onPress={navigateToEditValue}/>
                    <MenuItem_1.default icon={Expensicons.Trashcan} title={translate('common.delete')} onPress={() => setIsDeleteTagModalOpen(true)}/>
                </react_native_1.View>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
ReportFieldsValueSettingsPage.displayName = 'ReportFieldsValueSettingsPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(ReportFieldsValueSettingsPage);
