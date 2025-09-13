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
const QuickbooksOnline_1 = require("@libs/actions/connections/QuickbooksOnline");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const variables_1 = require("@styles/variables");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksExportInvoiceAccountSelectPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { accountsReceivable } = policy?.connections?.quickbooksOnline?.data ?? {};
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    const route = (0, native_1.useRoute)();
    const backTo = route.params?.backTo;
    const policyID = policy?.id;
    const data = (0, react_1.useMemo)(() => accountsReceivable?.map((account) => ({
        value: account,
        text: account.name,
        keyForList: account.name,
        isSelected: account.id === qboConfig?.receivableAccount?.id,
    })) ?? [], [qboConfig?.receivableAccount, accountsReceivable]);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT.getRoute(policyID));
    }, [policyID, backTo]);
    const selectExportInvoice = (0, react_1.useCallback)((row) => {
        if (row.value.id !== qboConfig?.receivableAccount?.id) {
            (0, QuickbooksOnline_1.updateQuickbooksOnlineReceivableAccount)(policyID, row.value, qboConfig?.receivableAccount);
        }
        goBack();
    }, [qboConfig?.receivableAccount, policyID, goBack]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.qbo.noAccountsFound')} subtitle={translate('workspace.qbo.noAccountsFoundDescription')} containerStyle={styles.pb10}/>), [translate, styles.pb10]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={QuickbooksExportInvoiceAccountSelectPage.displayName} sections={data.length ? [{ data }] : []} listItem={RadioListItem_1.default} headerContent={<Text_1.default style={[styles.ph5, styles.pb5]}>{translate('workspace.qbo.exportInvoicesDescription')}</Text_1.default>} onBackButtonPress={goBack} onSelectRow={selectExportInvoice} initiallyFocusedOptionKey={data.find((mode) => mode.isSelected)?.keyForList} title="workspace.qbo.exportInvoices" connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBO} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_CONFIG.RECEIVABLE_ACCOUNT], qboConfig?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(qboConfig, CONST_1.default.QUICKBOOKS_CONFIG.RECEIVABLE_ACCOUNT)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearQBOErrorField)(policyID, CONST_1.default.QUICKBOOKS_CONFIG.RECEIVABLE_ACCOUNT)} listEmptyContent={listEmptyContent} shouldSingleExecuteRowSelect/>);
}
QuickbooksExportInvoiceAccountSelectPage.displayName = 'QuickbooksExportInvoiceAccountSelectPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksExportInvoiceAccountSelectPage);
