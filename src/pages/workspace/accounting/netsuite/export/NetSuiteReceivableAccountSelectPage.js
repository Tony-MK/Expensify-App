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
const Policy_1 = require("@libs/actions/Policy/Policy");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function NetSuiteReceivableAccountSelectPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const route = (0, native_1.useRoute)();
    const config = policy?.connections?.netsuite?.options.config;
    const netsuiteReceivableAccountOptions = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getNetSuiteReceivableAccountOptions)(policy ?? undefined, config?.receivableAccount), [config?.receivableAccount, policy]);
    const initiallyFocusedOptionKey = (0, react_1.useMemo)(() => netsuiteReceivableAccountOptions?.find((mode) => mode.isSelected)?.keyForList, [netsuiteReceivableAccountOptions]);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(route.params.backTo ?? (policyID && ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT.getRoute(policyID)));
    }, [policyID, route.params.backTo]);
    const updateReceivableAccount = (0, react_1.useCallback)(({ value }) => {
        if (config?.receivableAccount !== value && policyID) {
            (0, NetSuiteCommands_1.updateNetSuiteReceivableAccount)(policyID, value, config?.receivableAccount);
        }
        goBack();
    }, [policyID, config?.receivableAccount, goBack]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations_1.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.netsuite.noAccountsFound')} subtitle={translate('workspace.netsuite.noAccountsFoundDescription')} containerStyle={styles.pb10}/>), [translate, styles.pb10]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={NetSuiteReceivableAccountSelectPage.displayName} sections={netsuiteReceivableAccountOptions.length ? [{ data: netsuiteReceivableAccountOptions }] : []} listItem={RadioListItem_1.default} onSelectRow={updateReceivableAccount} initiallyFocusedOptionKey={initiallyFocusedOptionKey} onBackButtonPress={goBack} title="workspace.netsuite.exportInvoices" listEmptyContent={listEmptyContent} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.RECEIVABLE_ACCOUNT], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config, CONST_1.default.NETSUITE_CONFIG.RECEIVABLE_ACCOUNT)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.RECEIVABLE_ACCOUNT)}/>);
}
NetSuiteReceivableAccountSelectPage.displayName = 'NetSuiteReceivableAccountSelectPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteReceivableAccountSelectPage);
