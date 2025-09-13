"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Illustrations = require("@components/Icon/Illustrations");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const QuickbooksDesktop_1 = require("@libs/actions/connections/QuickbooksDesktop");
const ConnectionUtils_1 = require("@libs/ConnectionUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const utils_1 = require("@pages/workspace/accounting/utils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const variables_1 = require("@styles/variables");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksDesktopCompanyCardExpenseAccountSelectPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id;
    const qbdConfig = policy?.connections?.quickbooksDesktop?.config;
    const nonReimbursable = qbdConfig?.export?.nonReimbursable;
    const nonReimbursableAccount = qbdConfig?.export?.nonReimbursableAccount;
    const route = (0, native_1.useRoute)();
    const backTo = route.params?.backTo;
    const data = (0, react_1.useMemo)(() => {
        const accounts = (0, utils_1.getQBDReimbursableAccounts)(policy?.connections?.quickbooksDesktop, nonReimbursable);
        return accounts.map((card) => ({
            value: card,
            text: card.name,
            keyForList: card.name,
            // We use the logical OR (||) here instead of ?? because `nonReimbursableAccount` can be an empty string
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            isSelected: card.id === (nonReimbursableAccount || accounts.at(0)?.id),
        }));
    }, [policy?.connections?.quickbooksDesktop, nonReimbursable, nonReimbursableAccount]);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? (policyID && ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_ACCOUNT.getRoute(policyID)));
    }, [policyID, backTo]);
    const selectExportAccount = (0, react_1.useCallback)((row) => {
        if (row.value.id !== nonReimbursableAccount && policyID) {
            (0, QuickbooksDesktop_1.updateQuickbooksDesktopNonReimbursableExpensesAccount)(policyID, row.value.id, nonReimbursableAccount);
        }
        goBack();
    }, [nonReimbursableAccount, policyID, goBack]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.qbd.noAccountsFound')} subtitle={translate('workspace.qbd.noAccountsFoundDescription')} containerStyle={styles.pb10}/>), [translate, styles.pb10]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={QuickbooksDesktopCompanyCardExpenseAccountSelectPage.displayName} headerTitleAlreadyTranslated={(0, ConnectionUtils_1.getQBDNonReimbursableExportAccountType)(nonReimbursable)} headerContent={nonReimbursable ? <Text_1.default style={[styles.ph5, styles.pb5]}>{translate(`workspace.qbd.accounts.${nonReimbursable}AccountDescription`)}</Text_1.default> : null} sections={data.length ? [{ data }] : []} listItem={RadioListItem_1.default} onSelectRow={selectExportAccount} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={data.find((mode) => mode.isSelected)?.keyForList} listEmptyContent={listEmptyContent} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBD} onBackButtonPress={goBack} errors={(0, ErrorUtils_1.getLatestErrorField)(qbdConfig, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.NON_REIMBURSABLE_ACCOUNT)} errorRowStyles={[styles.ph5, styles.pv3]} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.NON_REIMBURSABLE_ACCOUNT], qbdConfig?.pendingFields)} onClose={() => (0, Policy_1.clearQBDErrorField)(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.NON_REIMBURSABLE_ACCOUNT)}/>);
}
QuickbooksDesktopCompanyCardExpenseAccountSelectPage.displayName = 'QuickbooksDesktopCompanyCardExpenseAccountSelectPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksDesktopCompanyCardExpenseAccountSelectPage);
