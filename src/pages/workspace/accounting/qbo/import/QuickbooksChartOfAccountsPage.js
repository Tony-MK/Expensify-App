"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const QuickbooksOnline = require("@libs/actions/connections/QuickbooksOnline");
const ErrorUtils = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksChartOfAccountsPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id ?? '-1';
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    return (<ConnectionLayout_1.default policyID={policyID} displayName={QuickbooksChartOfAccountsPage.displayName} headerTitle="workspace.accounting.accounts" title="workspace.qbo.accountsDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.pb2, styles.ph5]} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBO} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_IMPORT.getRoute(policyID))}>
            <ToggleSettingsOptionRow_1.default title={translate('workspace.accounting.import')} switchAccessibilityLabel={translate('workspace.accounting.accounts')} shouldPlaceSubtitleBelowSwitch isActive onToggle={() => { }} disabled showLockIcon/>
            <MenuItemWithTopDescription_1.default interactive={false} title={translate('workspace.common.categories')} description={translate('workspace.common.displayedAs')} wrapperStyle={[styles.sectionMenuItemTopDescription, styles.mt2]}/>
            <Text_1.default style={styles.pv5}>{translate('workspace.qbo.accountsSwitchTitle')}</Text_1.default>
            <ToggleSettingsOptionRow_1.default title={translate('workspace.common.enabled')} subtitle={translate('workspace.qbo.accountsSwitchDescription')} switchAccessibilityLabel={translate('workspace.accounting.accounts')} shouldPlaceSubtitleBelowSwitch isActive={!!qboConfig?.enableNewCategories} onToggle={() => QuickbooksOnline.updateQuickbooksOnlineEnableNewCategories(policyID, !qboConfig?.enableNewCategories)} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_CONFIG.ENABLE_NEW_CATEGORIES], qboConfig?.pendingFields)} errors={ErrorUtils.getLatestErrorField(qboConfig, CONST_1.default.QUICKBOOKS_CONFIG.ENABLE_NEW_CATEGORIES)} onCloseError={() => (0, Policy_1.clearQBOErrorField)(policyID, CONST_1.default.QUICKBOOKS_CONFIG.ENABLE_NEW_CATEGORIES)}/>
        </ConnectionLayout_1.default>);
}
QuickbooksChartOfAccountsPage.displayName = 'QuickbooksChartOfAccountsPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksChartOfAccountsPage);
