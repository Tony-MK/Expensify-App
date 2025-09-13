"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Illustrations = require("@components/Icon/Illustrations");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const variables_1 = require("@styles/variables");
const SageIntacct_1 = require("@userActions/connections/SageIntacct");
const Policy = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function SageIntacctPaymentAccountPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id ?? '-1';
    const { config } = policy?.connections?.intacct ?? {};
    const vendorSelectorOptions = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getSageIntacctBankAccounts)(policy, config?.sync?.reimbursementAccountID), [policy, config?.sync?.reimbursementAccountID]);
    const updateDefaultVendor = (0, react_1.useCallback)(({ value }) => {
        if (value !== config?.sync?.reimbursementAccountID) {
            (0, SageIntacct_1.updateSageIntacctSyncReimbursementAccountID)(policyID, value, config?.sync?.reimbursementAccountID);
        }
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_ADVANCED.getRoute(policyID));
    }, [policyID, config?.sync?.reimbursementAccountID]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.sageIntacct.noAccountsFound')} subtitle={translate('workspace.sageIntacct.noAccountsFoundDescription')}/>), [translate]);
    return (<SelectionScreen_1.default policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={SageIntacctPaymentAccountPage.displayName} sections={vendorSelectorOptions.length ? [{ data: vendorSelectorOptions }] : []} listItem={RadioListItem_1.default} onSelectRow={updateDefaultVendor} initiallyFocusedOptionKey={vendorSelectorOptions.find((mode) => mode.isSelected)?.keyForList} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_ADVANCED.getRoute(policyID))} title="workspace.sageIntacct.paymentAccount" listEmptyContent={listEmptyContent} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.REIMBURSEMENT_ACCOUNT_ID], config?.pendingFields)} errors={ErrorUtils.getLatestErrorField(config ?? {}, CONST_1.default.SAGE_INTACCT_CONFIG.REIMBURSEMENT_ACCOUNT_ID)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => Policy.clearSageIntacctErrorField(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.REIMBURSEMENT_ACCOUNT_ID)}/>);
}
SageIntacctPaymentAccountPage.displayName = 'SageIntacctPaymentAccountPage';
exports.default = (0, withPolicyConnections_1.default)(SageIntacctPaymentAccountPage);
