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
const Policy_1 = require("@libs/actions/Policy/Policy");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const variables_1 = require("@styles/variables");
const SageIntacct_1 = require("@userActions/connections/SageIntacct");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function SageIntacctNonReimbursableCreditCardAccountPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const { config } = policy?.connections?.intacct ?? {};
    const { export: exportConfig } = policy?.connections?.intacct?.config ?? {};
    const route = (0, native_1.useRoute)();
    const backTo = route.params.backTo;
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? (policyID && ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_NON_REIMBURSABLE_EXPENSES.getRoute(policyID)));
    }, [backTo, policyID]);
    const creditCardSelectorOptions = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getSageIntacctCreditCards)(policy, exportConfig?.nonReimbursableAccount), [exportConfig?.nonReimbursableAccount, policy]);
    const updateCreditCardAccount = (0, react_1.useCallback)(({ value }) => {
        if (value !== exportConfig?.nonReimbursableAccount && policyID) {
            (0, SageIntacct_1.updateSageIntacctNonreimbursableExpensesExportAccount)(policyID, value, exportConfig?.nonReimbursableAccount);
        }
        goBack();
    }, [policyID, exportConfig?.nonReimbursableAccount, goBack]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations_1.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.sageIntacct.noAccountsFound')} subtitle={translate('workspace.sageIntacct.noAccountsFoundDescription')} containerStyle={styles.pb10}/>), [translate, styles.pb10]);
    return (<SelectionScreen_1.default policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={SageIntacctNonReimbursableCreditCardAccountPage.displayName} sections={creditCardSelectorOptions.length ? [{ data: creditCardSelectorOptions }] : []} listItem={RadioListItem_1.default} onSelectRow={updateCreditCardAccount} initiallyFocusedOptionKey={creditCardSelectorOptions.find((mode) => mode.isSelected)?.keyForList} onBackButtonPress={goBack} title="workspace.sageIntacct.creditCardAccount" listEmptyContent={listEmptyContent} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_ACCOUNT], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config ?? {}, CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_ACCOUNT)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearSageIntacctErrorField)(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_ACCOUNT)}/>);
}
SageIntacctNonReimbursableCreditCardAccountPage.displayName = 'SageIntacctNonReimbursableCreditCardAccountPage';
exports.default = (0, withPolicyConnections_1.default)(SageIntacctNonReimbursableCreditCardAccountPage);
