"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Illustrations = require("@components/Icon/Illustrations");
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
function NetSuiteInvoiceItemSelectPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const config = policy?.connections?.netsuite?.options.config;
    const netsuiteInvoiceItemOptions = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getNetSuiteInvoiceItemOptions)(policy ?? undefined, config?.invoiceItem), [config?.invoiceItem, policy]);
    const initiallyFocusedOptionKey = (0, react_1.useMemo)(() => netsuiteInvoiceItemOptions?.find((mode) => mode.isSelected)?.keyForList, [netsuiteInvoiceItemOptions]);
    const updateInvoiceItem = (0, react_1.useCallback)(({ value }) => {
        if (config?.invoiceItem !== value && policyID) {
            (0, NetSuiteCommands_1.updateNetSuiteInvoiceItem)(policyID, value, config?.invoiceItem);
        }
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_INVOICE_ITEM_PREFERENCE_SELECT.getRoute(policyID));
    }, [policyID, config?.invoiceItem]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.netsuite.noItemsFound')} subtitle={translate('workspace.netsuite.noItemsFoundDescription')} containerStyle={styles.pb10}/>), [translate, styles.pb10]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={NetSuiteInvoiceItemSelectPage.displayName} sections={netsuiteInvoiceItemOptions.length ? [{ data: netsuiteInvoiceItemOptions }] : []} listItem={RadioListItem_1.default} onSelectRow={updateInvoiceItem} initiallyFocusedOptionKey={initiallyFocusedOptionKey} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_INVOICE_ITEM_PREFERENCE_SELECT.getRoute(policyID))} title="workspace.netsuite.invoiceItem.label" listEmptyContent={listEmptyContent} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} shouldBeBlocked={config?.invoiceItemPreference !== CONST_1.default.NETSUITE_INVOICE_ITEM_PREFERENCE.SELECT} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.INVOICE_ITEM], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config, CONST_1.default.NETSUITE_CONFIG.INVOICE_ITEM)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.INVOICE_ITEM)}/>);
}
NetSuiteInvoiceItemSelectPage.displayName = 'NetSuiteInvoiceItemSelectPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteInvoiceItemSelectPage);
