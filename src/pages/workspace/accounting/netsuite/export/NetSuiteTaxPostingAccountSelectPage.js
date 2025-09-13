"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Illustrations = require("@components/Icon/Illustrations");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const useLocalize_1 = require("@hooks/useLocalize");
const usePermissions_1 = require("@hooks/usePermissions");
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
function NetSuiteTaxPostingAccountSelectPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const policyID = policy?.id;
    const config = policy?.connections?.netsuite?.options.config;
    const { subsidiaryList } = policy?.connections?.netsuite?.options?.data ?? {};
    const selectedSubsidiary = (0, react_1.useMemo)(() => (subsidiaryList ?? []).find((subsidiary) => subsidiary.internalID === config?.subsidiaryID), [subsidiaryList, config?.subsidiaryID]);
    const netsuiteTaxAccountOptions = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getNetSuiteTaxAccountOptions)(policy ?? undefined, selectedSubsidiary?.country, config?.taxPostingAccount), [config?.taxPostingAccount, policy, selectedSubsidiary?.country]);
    const initiallyFocusedOptionKey = (0, react_1.useMemo)(() => netsuiteTaxAccountOptions?.find((mode) => mode.isSelected)?.keyForList, [netsuiteTaxAccountOptions]);
    const updateTaxAccount = (0, react_1.useCallback)(({ value }) => {
        if (config?.taxPostingAccount !== value && policyID) {
            (0, NetSuiteCommands_1.updateNetSuiteTaxPostingAccount)(policyID, value, config?.taxPostingAccount);
        }
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT.getRoute(policyID));
    }, [policyID, config?.taxPostingAccount]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.netsuite.noAccountsFound')} subtitle={translate('workspace.netsuite.noAccountsFoundDescription')} containerStyle={styles.pb10}/>), [translate, styles.pb10]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={NetSuiteTaxPostingAccountSelectPage.displayName} sections={netsuiteTaxAccountOptions.length ? [{ data: netsuiteTaxAccountOptions }] : []} listItem={RadioListItem_1.default} onSelectRow={updateTaxAccount} initiallyFocusedOptionKey={initiallyFocusedOptionKey} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT.getRoute(policyID))} title="workspace.netsuite.journalEntriesTaxPostingAccount" listEmptyContent={listEmptyContent} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} shouldBeBlocked={!!config?.suiteTaxEnabled || !config?.syncOptions.syncTax || !(0, PolicyUtils_1.canUseTaxNetSuite)(isBetaEnabled(CONST_1.default.BETAS.NETSUITE_USA_TAX), selectedSubsidiary?.country)} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.TAX_POSTING_ACCOUNT], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config, CONST_1.default.NETSUITE_CONFIG.TAX_POSTING_ACCOUNT)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.TAX_POSTING_ACCOUNT)}/>);
}
NetSuiteTaxPostingAccountSelectPage.displayName = 'NetSuiteTaxPostingAccountSelectPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteTaxPostingAccountSelectPage);
