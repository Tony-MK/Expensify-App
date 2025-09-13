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
const NetSuiteCommands_1 = require("@libs/actions/connections/NetSuiteCommands");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const variables_1 = require("@styles/variables");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function NetSuiteReimbursementAccountSelectPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const config = policy?.connections?.netsuite?.options.config;
    const netsuiteReimbursableAccountOptions = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getNetSuiteReimbursableAccountOptions)(policy ?? undefined, config?.reimbursementAccountID), [config?.reimbursementAccountID, policy]);
    const initiallyFocusedOptionKey = (0, react_1.useMemo)(() => netsuiteReimbursableAccountOptions?.find((mode) => mode.isSelected)?.keyForList, [netsuiteReimbursableAccountOptions]);
    const updateReimbursementAccount = (0, react_1.useCallback)(({ value }) => {
        if (config?.reimbursementAccountID !== value && policyID) {
            (0, NetSuiteCommands_1.updateNetSuiteReimbursementAccountID)(policyID, value, config?.reimbursementAccountID);
        }
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_ADVANCED.getRoute(policyID));
    }, [policyID, config?.reimbursementAccountID]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.netsuite.noAccountsFound')} subtitle={translate('workspace.netsuite.noAccountsFoundDescription')} containerStyle={styles.pb10}/>), [translate, styles.pb10]);
    const headerContent = (0, react_1.useMemo)(() => (<react_native_1.View>
                <Text_1.default style={[styles.ph5, styles.pb5]}>{translate('workspace.netsuite.advancedConfig.reimbursementsAccountDescription')}</Text_1.default>
            </react_native_1.View>), [translate, styles.pb5, styles.ph5]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={NetSuiteReimbursementAccountSelectPage.displayName} headerContent={headerContent} sections={netsuiteReimbursableAccountOptions.length ? [{ data: netsuiteReimbursableAccountOptions }] : []} listItem={RadioListItem_1.default} onSelectRow={updateReimbursementAccount} initiallyFocusedOptionKey={initiallyFocusedOptionKey} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_ADVANCED.getRoute(policyID))} title="workspace.netsuite.advancedConfig.reimbursementsAccount" listEmptyContent={listEmptyContent} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} shouldBeBlocked={config?.reimbursableExpensesExportDestination === CONST_1.default.NETSUITE_EXPORT_DESTINATION.JOURNAL_ENTRY} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.REIMBURSEMENT_ACCOUNT_ID], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config, CONST_1.default.NETSUITE_CONFIG.REIMBURSEMENT_ACCOUNT_ID)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.REIMBURSEMENT_ACCOUNT_ID)}/>);
}
NetSuiteReimbursementAccountSelectPage.displayName = 'NetSuiteReimbursementAccountSelectPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteReimbursementAccountSelectPage);
