"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const QuickbooksDesktop_1 = require("@libs/actions/connections/QuickbooksDesktop");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const utils_1 = require("@pages/workspace/accounting/utils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksDesktopOutOfPocketExpenseEntitySelectPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const qbdConfig = policy?.connections?.quickbooksDesktop?.config;
    const reimbursable = qbdConfig?.export.reimbursable;
    const hasErrors = !!qbdConfig?.errorFields?.reimbursable;
    const policyID = policy?.id;
    const route = (0, native_1.useRoute)();
    const backTo = route.params?.backTo;
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? (policyID && ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES.getRoute(policyID)));
    }, [policyID, backTo]);
    const data = (0, react_1.useMemo)(() => [
        {
            value: CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.CHECK,
            text: translate(`workspace.qbd.accounts.${CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.CHECK}`),
            keyForList: CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.CHECK,
            isSelected: reimbursable === CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.CHECK,
            isShown: true,
            accounts: (0, utils_1.getQBDReimbursableAccounts)(policy?.connections?.quickbooksDesktop, CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.CHECK),
        },
        {
            value: CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.JOURNAL_ENTRY,
            text: translate(`workspace.qbd.accounts.${CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.JOURNAL_ENTRY}`),
            keyForList: CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.JOURNAL_ENTRY,
            isSelected: reimbursable === CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.JOURNAL_ENTRY,
            isShown: true,
            accounts: (0, utils_1.getQBDReimbursableAccounts)(policy?.connections?.quickbooksDesktop, CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.JOURNAL_ENTRY),
        },
        {
            value: CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.VENDOR_BILL,
            text: translate(`workspace.qbd.accounts.${CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.VENDOR_BILL}`),
            keyForList: CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.VENDOR_BILL,
            isSelected: reimbursable === CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.VENDOR_BILL,
            isShown: true,
            accounts: (0, utils_1.getQBDReimbursableAccounts)(policy?.connections?.quickbooksDesktop, CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.VENDOR_BILL),
        },
    ], [translate, reimbursable, policy?.connections?.quickbooksDesktop]);
    const sections = (0, react_1.useMemo)(() => [{ data: data.filter((item) => item.isShown) }], [data]);
    const selectExportEntity = (0, react_1.useCallback)((row) => {
        const account = row?.accounts?.at(0)?.id;
        if (row.value !== reimbursable && policyID) {
            (0, QuickbooksDesktop_1.updateQuickbooksDesktopExpensesExportDestination)(policyID, {
                [CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE]: row.value,
                [CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE_ACCOUNT]: account,
            }, {
                [CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE]: reimbursable,
                [CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE_ACCOUNT]: qbdConfig?.export?.reimbursableAccount,
            });
        }
        goBack();
    }, [reimbursable, policyID, qbdConfig?.export?.reimbursableAccount, goBack]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={QuickbooksDesktopOutOfPocketExpenseEntitySelectPage.displayName} sections={sections} listItem={RadioListItem_1.default} onBackButtonPress={goBack} onSelectRow={(selection) => selectExportEntity(selection)} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={data.find((mode) => mode.isSelected)?.keyForList} title="workspace.accounting.exportAs" connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBD} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE_ACCOUNT], qbdConfig?.pendingFields)} errors={hasErrors && reimbursable
            ? {
                [CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE]: translate(`workspace.qbd.accounts.${reimbursable}Error`),
            }
            : (0, ErrorUtils_1.getLatestErrorField)(qbdConfig, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearQBDErrorField)(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE)}/>);
}
QuickbooksDesktopOutOfPocketExpenseEntitySelectPage.displayName = 'QuickbooksDesktopOutOfPocketExpenseEntitySelectPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksDesktopOutOfPocketExpenseEntitySelectPage);
