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
function NetSuiteCollectionAccountSelectPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const config = policy?.connections?.netsuite?.options.config;
    const netsuiteCollectionAccountOptions = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getNetSuiteCollectionAccountOptions)(policy ?? undefined, config?.collectionAccount), [config?.collectionAccount, policy]);
    const initiallyFocusedOptionKey = (0, react_1.useMemo)(() => netsuiteCollectionAccountOptions?.find((mode) => mode.isSelected)?.keyForList, [netsuiteCollectionAccountOptions]);
    const updateCollectionAccount = (0, react_1.useCallback)(({ value }) => {
        if (config?.collectionAccount !== value && policyID) {
            (0, NetSuiteCommands_1.updateNetSuiteCollectionAccount)(policyID, value, config?.collectionAccount);
        }
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_ADVANCED.getRoute(policyID));
    }, [policyID, config?.collectionAccount]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.netsuite.noAccountsFound')} subtitle={translate('workspace.netsuite.noAccountsFoundDescription')} containerStyle={styles.pb10}/>), [translate, styles.pb10]);
    const headerContent = (0, react_1.useMemo)(() => (<react_native_1.View>
                <Text_1.default style={[styles.ph5, styles.pb5]}>{translate('workspace.netsuite.advancedConfig.collectionsAccountDescription')}</Text_1.default>
            </react_native_1.View>), [translate, styles.pb5, styles.ph5]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={NetSuiteCollectionAccountSelectPage.displayName} headerContent={headerContent} sections={netsuiteCollectionAccountOptions.length ? [{ data: netsuiteCollectionAccountOptions }] : []} listItem={RadioListItem_1.default} onSelectRow={updateCollectionAccount} initiallyFocusedOptionKey={initiallyFocusedOptionKey} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_ADVANCED.getRoute(policyID))} title="workspace.netsuite.advancedConfig.collectionsAccount" listEmptyContent={listEmptyContent} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} shouldBeBlocked={config?.reimbursableExpensesExportDestination === CONST_1.default.NETSUITE_EXPORT_DESTINATION.JOURNAL_ENTRY} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.COLLECTION_ACCOUNT], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config, CONST_1.default.NETSUITE_CONFIG.COLLECTION_ACCOUNT)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.COLLECTION_ACCOUNT)}/>);
}
NetSuiteCollectionAccountSelectPage.displayName = 'NetSuiteCollectionAccountSelectPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteCollectionAccountSelectPage);
