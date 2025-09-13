"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Illustrations_1 = require("@components/Icon/Illustrations");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const NetSuiteCommands_1 = require("@libs/actions/connections/NetSuiteCommands");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const variables_1 = require("@styles/variables");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function NetSuiteExportExpensesPayableAccountSelectPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const route = (0, native_1.useRoute)();
    const params = route.params;
    const backTo = params.backTo;
    const isReimbursable = params.expenseType === CONST_1.default.NETSUITE_EXPENSE_TYPE.REIMBURSABLE;
    const config = policy?.connections?.netsuite?.options.config;
    const currentSettingName = isReimbursable ? CONST_1.default.NETSUITE_CONFIG.REIMBURSABLE_PAYABLE_ACCOUNT : CONST_1.default.NETSUITE_CONFIG.PAYABLE_ACCT;
    const currentPayableAccountID = config?.[currentSettingName] ?? CONST_1.default.NETSUITE_PAYABLE_ACCOUNT_DEFAULT_VALUE;
    const netsuitePayableAccountOptions = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getNetSuitePayableAccountOptions)(policy ?? undefined, currentPayableAccountID), [currentPayableAccountID, policy]);
    const initiallyFocusedOptionKey = (0, react_1.useMemo)(() => netsuitePayableAccountOptions?.find((mode) => mode.isSelected)?.keyForList, [netsuitePayableAccountOptions]);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES.getRoute(policyID, params.expenseType));
    }, [policyID, params.expenseType, backTo]);
    const updatePayableAccount = (0, react_1.useCallback)(({ value }) => {
        if (currentPayableAccountID !== value && policyID) {
            if (isReimbursable) {
                (0, NetSuiteCommands_1.updateNetSuiteReimbursablePayableAccount)(policyID, value, currentPayableAccountID);
            }
            else {
                (0, NetSuiteCommands_1.updateNetSuitePayableAcct)(policyID, value, currentPayableAccountID);
            }
        }
        goBack();
    }, [currentPayableAccountID, policyID, goBack, isReimbursable]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations_1.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.netsuite.noAccountsFound')} subtitle={translate('workspace.netsuite.noAccountsFoundDescription')} containerStyle={styles.pb10}/>), [translate, styles.pb10]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={NetSuiteExportExpensesPayableAccountSelectPage.displayName} sections={netsuitePayableAccountOptions.length ? [{ data: netsuitePayableAccountOptions }] : []} listItem={RadioListItem_1.default} onSelectRow={updatePayableAccount} initiallyFocusedOptionKey={initiallyFocusedOptionKey} onBackButtonPress={goBack} title={isReimbursable ? 'workspace.netsuite.reimbursableJournalPostingAccount' : 'workspace.netsuite.nonReimbursableJournalPostingAccount'} listEmptyContent={listEmptyContent} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} shouldBeBlocked={isReimbursable
            ? config?.reimbursableExpensesExportDestination !== CONST_1.default.NETSUITE_EXPORT_DESTINATION.JOURNAL_ENTRY
            : config?.nonreimbursableExpensesExportDestination !== CONST_1.default.NETSUITE_EXPORT_DESTINATION.JOURNAL_ENTRY} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([currentSettingName], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config, currentSettingName)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearNetSuiteErrorField)(policyID, currentSettingName)}/>);
}
NetSuiteExportExpensesPayableAccountSelectPage.displayName = 'NetSuiteExportExpensesPayableAccountSelectPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteExportExpensesPayableAccountSelectPage);
