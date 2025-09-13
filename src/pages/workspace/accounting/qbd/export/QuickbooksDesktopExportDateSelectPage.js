"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const QuickbooksDesktop_1 = require("@libs/actions/connections/QuickbooksDesktop");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksDesktopExportDateSelectPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id;
    const qbdConfig = policy?.connections?.quickbooksDesktop?.config;
    const exportDate = qbdConfig?.export?.exportDate;
    const route = (0, native_1.useRoute)();
    const backTo = route.params.backTo;
    const data = (0, react_1.useMemo)(() => Object.values(CONST_1.default.QUICKBOOKS_EXPORT_DATE).map((dateType) => ({
        value: dateType,
        text: translate(`workspace.qbd.exportDate.values.${dateType}.label`),
        alternateText: translate(`workspace.qbd.exportDate.values.${dateType}.description`),
        keyForList: dateType,
        isSelected: exportDate === dateType,
    })), [exportDate, translate]);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT.getRoute(policyID));
    }, [policyID, backTo]);
    const selectExportDate = (0, react_1.useCallback)((row) => {
        if (!policyID) {
            return;
        }
        if (row.value !== exportDate) {
            (0, QuickbooksDesktop_1.updateQuickbooksDesktopExportDate)(policyID, row.value, exportDate);
        }
        goBack();
    }, [policyID, exportDate, goBack]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={QuickbooksDesktopExportDateSelectPage.displayName} sections={[{ data }]} listItem={RadioListItem_1.default} headerContent={<Text_1.default style={[styles.ph5, styles.pb5]}>{translate('workspace.qbd.exportDate.description')}</Text_1.default>} onBackButtonPress={goBack} onSelectRow={selectExportDate} initiallyFocusedOptionKey={data.find((mode) => mode.isSelected)?.keyForList} title="workspace.qbd.exportDate.label" connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBD} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.EXPORT_DATE], qbdConfig?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(qbdConfig, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.EXPORT_DATE)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => {
            if (!policyID) {
                return;
            }
            (0, Policy_1.clearQBDErrorField)(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.EXPORT_DATE);
        }} shouldSingleExecuteRowSelect/>);
}
QuickbooksDesktopExportDateSelectPage.displayName = 'QuickbooksDesktopExportDateSelectPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksDesktopExportDateSelectPage);
