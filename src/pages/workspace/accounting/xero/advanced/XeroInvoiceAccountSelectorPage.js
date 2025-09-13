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
const ErrorUtils = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const variables_1 = require("@styles/variables");
const Xero_1 = require("@userActions/connections/Xero");
const Policy = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function XeroInvoiceAccountSelectorPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id ?? '-1';
    const { config } = policy?.connections?.xero ?? {};
    const { invoiceCollectionsAccountID, syncReimbursedReports } = policy?.connections?.xero?.config.sync ?? {};
    const xeroSelectorOptions = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getXeroBankAccounts)(policy ?? undefined, invoiceCollectionsAccountID), [invoiceCollectionsAccountID, policy]);
    const listHeaderComponent = (0, react_1.useMemo)(() => (<react_native_1.View style={[styles.pb2, styles.ph5]}>
                <Text_1.default style={[styles.pb5, styles.textNormal]}>{translate('workspace.xero.advancedConfig.invoiceAccountSelectorDescription')}</Text_1.default>
            </react_native_1.View>), [translate, styles.pb2, styles.ph5, styles.pb5, styles.textNormal]);
    const initiallyFocusedOptionKey = (0, react_1.useMemo)(() => xeroSelectorOptions?.find((mode) => mode.isSelected)?.keyForList, [xeroSelectorOptions]);
    const updateAccount = (0, react_1.useCallback)(({ value }) => {
        (0, Xero_1.updateXeroSyncInvoiceCollectionsAccountID)(policyID, value, invoiceCollectionsAccountID);
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_XERO_ADVANCED.getRoute(policyID));
    }, [policyID, invoiceCollectionsAccountID]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.xero.noAccountsFound')} subtitle={translate('workspace.xero.noAccountsFoundDescription')} containerStyle={styles.pb10}/>), [translate, styles.pb10]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={XeroInvoiceAccountSelectorPage.displayName} sections={xeroSelectorOptions.length ? [{ data: xeroSelectorOptions }] : []} listItem={RadioListItem_1.default} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.XERO} shouldBeBlocked={!syncReimbursedReports} onSelectRow={updateAccount} initiallyFocusedOptionKey={initiallyFocusedOptionKey} headerContent={listHeaderComponent} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_XERO_ADVANCED.getRoute(policyID))} title="workspace.xero.advancedConfig.xeroInvoiceCollectionAccount" listEmptyContent={listEmptyContent} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.INVOICE_COLLECTIONS_ACCOUNT_ID], config?.pendingFields)} errors={ErrorUtils.getLatestErrorField(config ?? {}, CONST_1.default.XERO_CONFIG.INVOICE_COLLECTIONS_ACCOUNT_ID)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => Policy.clearXeroErrorField(policyID, CONST_1.default.XERO_CONFIG.INVOICE_COLLECTIONS_ACCOUNT_ID)}/>);
}
XeroInvoiceAccountSelectorPage.displayName = 'XeroInvoiceAccountSelectorPage';
exports.default = (0, withPolicyConnections_1.default)(XeroInvoiceAccountSelectorPage);
