"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const QuickbooksOnline_1 = require("@libs/actions/connections/QuickbooksOnline");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksExportDateSelectPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id;
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    const route = (0, native_1.useRoute)();
    const backTo = route.params.backTo;
    const data = Object.values(CONST_1.default.QUICKBOOKS_EXPORT_DATE).map((dateType) => ({
        value: dateType,
        text: translate(`workspace.qbo.exportDate.values.${dateType}.label`),
        alternateText: translate(`workspace.qbo.exportDate.values.${dateType}.description`),
        keyForList: dateType,
        isSelected: qboConfig?.exportDate === dateType,
    }));
    const exportDate = (0, react_1.useMemo)(() => qboConfig?.exportDate, [qboConfig]);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT.getRoute(policyID));
    }, [policyID, backTo]);
    const selectExportDate = (0, react_1.useCallback)((row) => {
        if (row.value !== exportDate && policyID) {
            (0, QuickbooksOnline_1.updateQuickbooksOnlineExportDate)(policyID, row.value, exportDate);
        }
        goBack();
    }, [policyID, exportDate, goBack]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={QuickbooksExportDateSelectPage.displayName} sections={[{ data }]} listItem={RadioListItem_1.default} headerContent={<Text_1.default style={[styles.ph5, styles.pb5]}>{translate('workspace.qbo.exportDate.description')}</Text_1.default>} onBackButtonPress={goBack} onSelectRow={selectExportDate} initiallyFocusedOptionKey={data.find((mode) => mode.isSelected)?.keyForList} title="workspace.qbo.exportDate.label" connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBO} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_CONFIG.EXPORT_DATE], qboConfig?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(qboConfig, CONST_1.default.QUICKBOOKS_CONFIG.EXPORT_DATE)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearQBOErrorField)(policyID, CONST_1.default.QUICKBOOKS_CONFIG.EXPORT_DATE)} shouldSingleExecuteRowSelect/>);
}
QuickbooksExportDateSelectPage.displayName = 'QuickbooksExportDateSelectPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksExportDateSelectPage);
