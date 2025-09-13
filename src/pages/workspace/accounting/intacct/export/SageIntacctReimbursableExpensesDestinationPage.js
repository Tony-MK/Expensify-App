"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Policy_1 = require("@libs/actions/Policy/Policy");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const SageIntacct_1 = require("@userActions/connections/SageIntacct");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function SageIntacctReimbursableExpensesDestinationPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id;
    const { config } = policy?.connections?.intacct ?? {};
    const route = (0, native_1.useRoute)();
    const backTo = route.params.backTo;
    const data = Object.values(CONST_1.default.SAGE_INTACCT_REIMBURSABLE_EXPENSE_TYPE).map((expenseType) => ({
        value: expenseType,
        text: translate(`workspace.sageIntacct.reimbursableExpenses.values.${expenseType}`),
        keyForList: expenseType,
        isSelected: config?.export.reimbursable === expenseType,
    }));
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? (policyID && ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_REIMBURSABLE_EXPENSES.getRoute(policyID)));
    }, [backTo, policyID]);
    const selectDestination = (0, react_1.useCallback)((row) => {
        if (row.value !== config?.export.reimbursable && policyID) {
            (0, SageIntacct_1.updateSageIntacctReimbursableExpensesExportDestination)(policyID, row.value, config?.export.reimbursable);
            if (row.value === CONST_1.default.SAGE_INTACCT_REIMBURSABLE_EXPENSE_TYPE.VENDOR_BILL) {
                // Employee default mapping value is not allowed when expense type is VENDOR_BILL, so we have to change mapping value to Tag
                (0, SageIntacct_1.changeMappingsValueFromDefaultToTag)(policyID, config?.mappings);
            }
        }
        goBack();
    }, [config?.export.reimbursable, config?.mappings, policyID, goBack]);
    return (<SelectionScreen_1.default displayName={SageIntacctReimbursableExpensesDestinationPage.displayName} title="workspace.accounting.exportAs" sections={[{ data }]} listItem={RadioListItem_1.default} onSelectRow={(selection) => selectDestination(selection)} initiallyFocusedOptionKey={data.find((mode) => mode.isSelected)?.keyForList} policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} onBackButtonPress={goBack} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.REIMBURSABLE], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config, CONST_1.default.SAGE_INTACCT_CONFIG.REIMBURSABLE)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearSageIntacctErrorField)(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.REIMBURSABLE)}/>);
}
SageIntacctReimbursableExpensesDestinationPage.displayName = 'SageIntacctReimbursableExpensesDestinationPage';
exports.default = (0, withPolicyConnections_1.default)(SageIntacctReimbursableExpensesDestinationPage);
