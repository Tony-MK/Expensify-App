"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Illustrations = require("@components/Icon/Illustrations");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const QuickbooksOnline = require("@libs/actions/connections/QuickbooksOnline");
const ErrorUtils = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const variables_1 = require("@styles/variables");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksAccountSelectPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id ?? '-1';
    const { bankAccounts, creditCards } = policy?.connections?.quickbooksOnline?.data ?? {};
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    const accountOptions = (0, react_1.useMemo)(() => [...(bankAccounts ?? []), ...(creditCards ?? [])], [bankAccounts, creditCards]);
    const qboOnlineSelectorOptions = (0, react_1.useMemo)(() => accountOptions?.map(({ id, name }) => ({
        value: id,
        text: name,
        keyForList: id,
        isSelected: qboConfig?.reimbursementAccountID === id,
    })), [qboConfig?.reimbursementAccountID, accountOptions]);
    const listHeaderComponent = (0, react_1.useMemo)(() => (<react_native_1.View style={[styles.pb2, styles.ph5]}>
                <Text_1.default style={[styles.pb5, styles.textNormal]}>{translate('workspace.qbo.advancedConfig.accountSelectDescription')}</Text_1.default>
            </react_native_1.View>), [translate, styles.pb2, styles.ph5, styles.pb5, styles.textNormal]);
    const initiallyFocusedOptionKey = (0, react_1.useMemo)(() => qboOnlineSelectorOptions?.find((mode) => mode.isSelected)?.keyForList, [qboOnlineSelectorOptions]);
    const saveSelection = (0, react_1.useCallback)(({ value }) => {
        QuickbooksOnline.updateQuickbooksOnlineReimbursementAccountID(policyID, value, qboConfig?.reimbursementAccountID);
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_ADVANCED.getRoute(policyID));
    }, [policyID, qboConfig?.reimbursementAccountID]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.qbo.noAccountsFound')} subtitle={translate('workspace.qbo.noAccountsFoundDescription')} containerStyle={styles.pb10}/>), [translate, styles.pb10]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={QuickbooksAccountSelectPage.displayName} sections={qboOnlineSelectorOptions.length ? [{ data: qboOnlineSelectorOptions }] : []} listItem={RadioListItem_1.default} headerContent={listHeaderComponent} onSelectRow={saveSelection} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={initiallyFocusedOptionKey} listEmptyContent={listEmptyContent} title="workspace.qbo.advancedConfig.qboBillPaymentAccount" connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBO} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_ADVANCED.getRoute(policyID))} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSEMENT_ACCOUNT_ID], qboConfig?.pendingFields)} errors={ErrorUtils.getLatestErrorField(qboConfig, CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSEMENT_ACCOUNT_ID)} errorRowStyles={[styles.ph5, styles.mv3]} onClose={() => (0, Policy_1.clearQBOErrorField)(policyID, CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSEMENT_ACCOUNT_ID)}/>);
}
QuickbooksAccountSelectPage.displayName = 'QuickbooksAccountSelectPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksAccountSelectPage);
