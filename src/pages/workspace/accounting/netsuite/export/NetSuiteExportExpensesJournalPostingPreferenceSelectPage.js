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
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function NetSuiteExportExpensesJournalPostingPreferenceSelectPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id;
    const config = policy?.connections?.netsuite?.options.config;
    const route = (0, native_1.useRoute)();
    const params = route.params;
    const backTo = params.backTo;
    const isReimbursable = params.expenseType === CONST_1.default.NETSUITE_EXPENSE_TYPE.REIMBURSABLE;
    const selectedValue = Object.values(CONST_1.default.NETSUITE_JOURNAL_POSTING_PREFERENCE).find((value) => value === config?.journalPostingPreference) ??
        CONST_1.default.NETSUITE_JOURNAL_POSTING_PREFERENCE.JOURNALS_POSTING_INDIVIDUAL_LINE;
    const data = Object.values(CONST_1.default.NETSUITE_JOURNAL_POSTING_PREFERENCE).map((postingPreference) => ({
        value: postingPreference,
        text: translate(`workspace.netsuite.journalPostingPreference.values.${postingPreference}`),
        keyForList: postingPreference,
        isSelected: selectedValue === postingPreference,
    }));
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES.getRoute(policyID, params.expenseType));
    }, [policyID, params.expenseType, backTo]);
    const selectPostingPreference = (0, react_1.useCallback)((row) => {
        if (row.value !== config?.journalPostingPreference && policyID) {
            (0, NetSuiteCommands_1.updateNetSuiteJournalPostingPreference)(policyID, row.value, config?.journalPostingPreference);
        }
        goBack();
    }, [config?.journalPostingPreference, goBack, policyID]);
    return (<SelectionScreen_1.default displayName={NetSuiteExportExpensesJournalPostingPreferenceSelectPage.displayName} title="workspace.netsuite.journalPostingPreference.label" sections={[{ data }]} listItem={RadioListItem_1.default} onSelectRow={(selection) => selectPostingPreference(selection)} initiallyFocusedOptionKey={data.find((mode) => mode.isSelected)?.keyForList} policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} onBackButtonPress={goBack} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} shouldBeBlocked={isReimbursable
            ? config?.reimbursableExpensesExportDestination !== CONST_1.default.NETSUITE_EXPORT_DESTINATION.JOURNAL_ENTRY
            : config?.nonreimbursableExpensesExportDestination !== CONST_1.default.NETSUITE_EXPORT_DESTINATION.JOURNAL_ENTRY} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.JOURNAL_POSTING_PREFERENCE], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config, CONST_1.default.NETSUITE_CONFIG.JOURNAL_POSTING_PREFERENCE)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.JOURNAL_POSTING_PREFERENCE)}/>);
}
NetSuiteExportExpensesJournalPostingPreferenceSelectPage.displayName = 'NetSuiteExportExpensesJournalPostingPreferenceSelectPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteExportExpensesJournalPostingPreferenceSelectPage);
