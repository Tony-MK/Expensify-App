"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const NetSuiteCommands_1 = require("@libs/actions/connections/NetSuiteCommands");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function NetSuiteVendorBillApprovalLevelSelectPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const styles = (0, useThemeStyles_1.default)();
    const config = policy?.connections?.netsuite?.options.config;
    const data = Object.values(CONST_1.default.NETSUITE_VENDOR_BILLS_APPROVAL_LEVEL).map((approvalType) => ({
        value: approvalType,
        text: translate(`workspace.netsuite.advancedConfig.exportVendorBillsTo.values.${approvalType}`),
        keyForList: approvalType,
        isSelected: config?.syncOptions.exportVendorBillsTo === approvalType,
    }));
    const headerContent = (0, react_1.useMemo)(() => (<react_native_1.View>
                <Text_1.default style={[styles.ph5, styles.pb5]}>{translate('workspace.netsuite.advancedConfig.exportVendorBillsTo.description')}</Text_1.default>
            </react_native_1.View>), [translate, styles.pb5, styles.ph5]);
    const selectVendorBillApprovalLevel = (0, react_1.useCallback)((row) => {
        if (row.value !== config?.syncOptions.exportVendorBillsTo && policyID) {
            (0, NetSuiteCommands_1.updateNetSuiteExportVendorBillsTo)(policyID, row.value, config?.syncOptions.exportVendorBillsTo ?? CONST_1.default.NETSUITE_VENDOR_BILLS_APPROVAL_LEVEL.VENDOR_BILLS_APPROVED_NONE);
        }
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_ADVANCED.getRoute(policyID));
    }, [config?.syncOptions.exportVendorBillsTo, policyID]);
    return (<SelectionScreen_1.default displayName={NetSuiteVendorBillApprovalLevelSelectPage.displayName} title="workspace.netsuite.advancedConfig.exportVendorBillsTo.label" headerContent={headerContent} sections={[{ data }]} listItem={RadioListItem_1.default} onSelectRow={(selection) => selectVendorBillApprovalLevel(selection)} initiallyFocusedOptionKey={data.find((mode) => mode.isSelected)?.keyForList} policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_ADVANCED.getRoute(policyID))} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} shouldBeBlocked={config?.reimbursableExpensesExportDestination !== CONST_1.default.NETSUITE_EXPORT_DESTINATION.VENDOR_BILL &&
            config?.nonreimbursableExpensesExportDestination !== CONST_1.default.NETSUITE_EXPORT_DESTINATION.VENDOR_BILL} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.EXPORT_VENDOR_BILLS_TO], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.EXPORT_VENDOR_BILLS_TO)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.EXPORT_VENDOR_BILLS_TO)}/>);
}
NetSuiteVendorBillApprovalLevelSelectPage.displayName = 'NetSuiteVendorBillApprovalLevelSelectPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteVendorBillApprovalLevelSelectPage);
