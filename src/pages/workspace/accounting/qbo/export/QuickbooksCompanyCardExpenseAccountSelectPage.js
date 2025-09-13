"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Illustrations_1 = require("@components/Icon/Illustrations");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const QuickbooksOnline_1 = require("@libs/actions/connections/QuickbooksOnline");
const ConnectionUtils_1 = require("@libs/ConnectionUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const variables_1 = require("@styles/variables");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksCompanyCardExpenseAccountSelectPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id;
    const { creditCards, accountPayable, bankAccounts } = policy?.connections?.quickbooksOnline?.data ?? {};
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    const route = (0, native_1.useRoute)();
    const backTo = route.params?.backTo;
    const data = (0, react_1.useMemo)(() => {
        let accounts;
        switch (qboConfig?.nonReimbursableExpensesExportDestination) {
            case CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.CREDIT_CARD:
                accounts = creditCards ?? [];
                break;
            case CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.DEBIT_CARD:
                accounts = bankAccounts ?? [];
                break;
            case CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.VENDOR_BILL:
                accounts = accountPayable ?? [];
                break;
            default:
                accounts = [];
        }
        return accounts.map((card) => ({
            value: card,
            text: card.name,
            keyForList: card.name,
            isSelected: card.name === qboConfig?.nonReimbursableExpensesAccount?.name,
        }));
    }, [qboConfig?.nonReimbursableExpensesAccount, creditCards, bankAccounts, qboConfig?.nonReimbursableExpensesExportDestination, accountPayable]);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? (policyID && ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT.getRoute(policyID)));
    }, [policyID, backTo]);
    const selectExportAccount = (0, react_1.useCallback)((row) => {
        if (row.value.id !== qboConfig?.nonReimbursableExpensesAccount?.id && policyID) {
            (0, QuickbooksOnline_1.updateQuickbooksOnlineNonReimbursableExpensesAccount)(policyID, row.value, qboConfig?.nonReimbursableExpensesAccount);
        }
        goBack();
    }, [qboConfig?.nonReimbursableExpensesAccount, policyID, goBack]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations_1.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.qbo.noAccountsFound')} subtitle={translate('workspace.qbo.noAccountsFoundDescription')} containerStyle={styles.pb10}/>), [translate, styles.pb10]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={QuickbooksCompanyCardExpenseAccountSelectPage.displayName} headerTitleAlreadyTranslated={(0, ConnectionUtils_1.getQBONonReimbursableExportAccountType)(qboConfig?.nonReimbursableExpensesExportDestination)} headerContent={qboConfig?.nonReimbursableExpensesExportDestination ? (<Text_1.default style={[styles.ph5, styles.pb5]}>{translate(`workspace.qbo.accounts.${qboConfig?.nonReimbursableExpensesExportDestination}AccountDescription`)}</Text_1.default>) : null} sections={data.length ? [{ data }] : []} listItem={RadioListItem_1.default} onSelectRow={selectExportAccount} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={data.find((mode) => mode.isSelected)?.keyForList} listEmptyContent={listEmptyContent} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBO} onBackButtonPress={goBack} errors={(0, ErrorUtils_1.getLatestErrorField)(qboConfig, CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_EXPENSES_ACCOUNT)} errorRowStyles={[styles.ph5, styles.pv3]} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_EXPENSES_ACCOUNT], qboConfig?.pendingFields)} onClose={() => (0, Policy_1.clearQBOErrorField)(policyID, CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_EXPENSES_ACCOUNT)}/>);
}
QuickbooksCompanyCardExpenseAccountSelectPage.displayName = 'QuickbooksCompanyCardExpenseAccountSelectPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksCompanyCardExpenseAccountSelectPage);
