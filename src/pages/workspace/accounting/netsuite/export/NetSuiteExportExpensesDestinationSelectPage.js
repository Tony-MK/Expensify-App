"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const NetSuiteCommands_1 = require("@libs/actions/connections/NetSuiteCommands");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const utils_1 = require("@pages/workspace/accounting/netsuite/utils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function NetSuiteExportExpensesDestinationSelectPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id;
    const config = policy?.connections?.netsuite?.options.config;
    const route = (0, native_1.useRoute)();
    const params = route.params;
    const backTo = params.backTo;
    const isReimbursable = params.expenseType === CONST_1.default.NETSUITE_EXPENSE_TYPE.REIMBURSABLE;
    const currentSettingName = (0, utils_1.exportExpensesDestinationSettingName)(isReimbursable);
    const currentDestination = config?.[currentSettingName];
    const data = Object.values(CONST_1.default.NETSUITE_EXPORT_DESTINATION).map((dateType) => ({
        value: dateType,
        text: translate(`workspace.netsuite.exportDestination.values.${dateType}.label`),
        keyForList: dateType,
        isSelected: currentDestination === dateType,
    }));
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES.getRoute(policyID, params.expenseType));
    }, [backTo, policyID, params.expenseType]);
    const selectDestination = (0, react_1.useCallback)((row) => {
        if (row.value !== currentDestination && policyID) {
            if (isReimbursable) {
                (0, NetSuiteCommands_1.updateNetSuiteReimbursableExpensesExportDestination)(policyID, row.value, currentDestination ?? CONST_1.default.NETSUITE_EXPORT_DESTINATION.EXPENSE_REPORT);
            }
            else {
                (0, NetSuiteCommands_1.updateNetSuiteNonReimbursableExpensesExportDestination)(policyID, row.value, currentDestination ?? CONST_1.default.NETSUITE_EXPORT_DESTINATION.VENDOR_BILL);
            }
        }
        goBack();
    }, [currentDestination, isReimbursable, policyID, goBack]);
    return (<SelectionScreen_1.default displayName={NetSuiteExportExpensesDestinationSelectPage.displayName} title="workspace.accounting.exportAs" sections={[{ data }]} listItem={RadioListItem_1.default} onSelectRow={(selection) => selectDestination(selection)} initiallyFocusedOptionKey={data.find((mode) => mode.isSelected)?.keyForList} policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} onBackButtonPress={goBack} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([currentSettingName], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config, currentSettingName)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearNetSuiteErrorField)(policyID, currentSettingName)}/>);
}
NetSuiteExportExpensesDestinationSelectPage.displayName = 'NetSuiteExportExpensesDestinationSelectPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteExportExpensesDestinationSelectPage);
