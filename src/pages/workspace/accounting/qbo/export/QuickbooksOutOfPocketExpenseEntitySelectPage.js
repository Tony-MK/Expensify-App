"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const connections_1 = require("@libs/actions/connections");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function Footer({ isTaxEnabled }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    if (!isTaxEnabled) {
        return null;
    }
    return (<react_native_1.View style={[styles.gap2, styles.mt2, styles.ph5]}>
            {isTaxEnabled && <Text_1.default style={styles.mutedNormalTextLabel}>{translate('workspace.qbo.outOfPocketTaxEnabledDescription')}</Text_1.default>}
        </react_native_1.View>);
}
function QuickbooksOutOfPocketExpenseEntitySelectPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    const { bankAccounts, accountPayable, journalEntryAccounts } = policy?.connections?.quickbooksOnline?.data ?? {};
    const isTaxesEnabled = !!qboConfig?.syncTax;
    const shouldShowTaxError = isTaxesEnabled && qboConfig?.reimbursableExpensesExportDestination === CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.JOURNAL_ENTRY;
    const hasErrors = !!qboConfig?.errorFields?.reimbursableExpensesExportDestination && shouldShowTaxError;
    const policyID = policy?.id;
    const route = (0, native_1.useRoute)();
    const backTo = route.params?.backTo;
    const [selectedExportDestinationError, setSelectedExportDestinationError] = (0, react_1.useState)(null);
    const data = (0, react_1.useMemo)(() => [
        {
            value: CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.CHECK,
            text: translate(`workspace.qbo.accounts.check`),
            keyForList: CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.CHECK,
            isSelected: qboConfig?.reimbursableExpensesExportDestination === CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.CHECK,
            isShown: qboConfig?.syncLocations !== CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.TAG,
            accounts: bankAccounts ?? [],
        },
        {
            value: CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.JOURNAL_ENTRY,
            text: translate(`workspace.qbo.accounts.journal_entry`),
            keyForList: CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.JOURNAL_ENTRY,
            isSelected: qboConfig?.reimbursableExpensesExportDestination === CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.JOURNAL_ENTRY,
            isShown: !isTaxesEnabled,
            accounts: journalEntryAccounts ?? [],
        },
        {
            value: CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.VENDOR_BILL,
            text: translate(`workspace.qbo.accounts.bill`),
            keyForList: CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.VENDOR_BILL,
            isSelected: qboConfig?.reimbursableExpensesExportDestination === CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.VENDOR_BILL,
            isShown: qboConfig?.syncLocations !== CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.TAG,
            accounts: accountPayable ?? [],
        },
    ], [qboConfig?.reimbursableExpensesExportDestination, qboConfig?.syncLocations, translate, bankAccounts, accountPayable, journalEntryAccounts, isTaxesEnabled]);
    const sections = (0, react_1.useMemo)(() => [{ data: data.filter((item) => item.isShown) }], [data]);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? (policyID && ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES.getRoute(policyID)));
    }, [policyID, backTo]);
    const selectExportEntity = (0, react_1.useCallback)((row) => {
        if (!row.accounts.at(0)) {
            setSelectedExportDestinationError({
                [CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_EXPORT_DESTINATION]: translate(`workspace.qbo.exportDestinationSetupAccountsInfo.${row.value}`),
            });
            return;
        }
        if (row.value !== qboConfig?.reimbursableExpensesExportDestination) {
            setSelectedExportDestinationError(null);
            (0, connections_1.updateManyPolicyConnectionConfigs)(policyID, CONST_1.default.POLICY.CONNECTIONS.NAME.QBO, {
                [CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_EXPORT_DESTINATION]: row.value,
                [CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_ACCOUNT]: row.accounts.at(0),
            }, {
                [CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_EXPORT_DESTINATION]: qboConfig?.reimbursableExpensesExportDestination,
                [CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_ACCOUNT]: qboConfig?.reimbursableExpensesAccount,
            });
        }
        goBack();
    }, [qboConfig?.reimbursableExpensesExportDestination, policyID, qboConfig?.reimbursableExpensesAccount, goBack, translate]);
    const errors = hasErrors && qboConfig?.reimbursableExpensesExportDestination
        ? { [CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_EXPORT_DESTINATION]: translate(`workspace.qbo.accounts.${qboConfig?.reimbursableExpensesExportDestination}Error`) }
        : (0, ErrorUtils_1.getLatestErrorField)(qboConfig, CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_EXPORT_DESTINATION);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={QuickbooksOutOfPocketExpenseEntitySelectPage.displayName} sections={sections} listItem={RadioListItem_1.default} onBackButtonPress={goBack} onSelectRow={(selection) => selectExportEntity(selection)} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={data.find((mode) => mode.isSelected)?.keyForList} title="workspace.accounting.exportAs" connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBO} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_EXPORT_DESTINATION, CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_ACCOUNT], qboConfig?.pendingFields)} errors={selectedExportDestinationError ?? errors} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => {
            setSelectedExportDestinationError(null);
            (0, Policy_1.clearQBOErrorField)(policyID, CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_EXPORT_DESTINATION);
        }} listFooterContent={<Footer isTaxEnabled={isTaxesEnabled}/>}/>);
}
QuickbooksOutOfPocketExpenseEntitySelectPage.displayName = 'QuickbooksOutOfPocketExpenseEntitySelectPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksOutOfPocketExpenseEntitySelectPage);
