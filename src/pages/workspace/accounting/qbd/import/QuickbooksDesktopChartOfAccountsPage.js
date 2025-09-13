"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const QuickbooksDesktop = require("@libs/actions/connections/QuickbooksDesktop");
const ErrorUtils = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksDesktopChartOfAccountsPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id ?? '-1';
    const qbdConfig = policy?.connections?.quickbooksDesktop?.config;
    return (<ConnectionLayout_1.default policyID={policyID} displayName={QuickbooksDesktopChartOfAccountsPage.displayName} headerTitle="workspace.accounting.accounts" title="workspace.qbd.accountsDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.pb2, styles.ph5]} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBD} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_IMPORT.getRoute(policyID))}>
            <ToggleSettingsOptionRow_1.default title={translate('workspace.accounting.import')} switchAccessibilityLabel={translate('workspace.accounting.accounts')} shouldPlaceSubtitleBelowSwitch isActive onToggle={() => { }} disabled showLockIcon/>
            <MenuItemWithTopDescription_1.default interactive={false} title={translate('workspace.common.categories')} description={translate('workspace.common.displayedAs')} wrapperStyle={[styles.sectionMenuItemTopDescription, styles.mt2]}/>
            <Text_1.default style={styles.pv5}>{translate('workspace.qbd.accountsSwitchTitle')}</Text_1.default>
            <ToggleSettingsOptionRow_1.default title={translate('workspace.common.enabled')} subtitle={translate('workspace.qbd.accountsSwitchDescription')} switchAccessibilityLabel={translate('workspace.accounting.accounts')} shouldPlaceSubtitleBelowSwitch isActive={!!qbdConfig?.enableNewCategories} onToggle={() => QuickbooksDesktop.updateQuickbooksDesktopEnableNewCategories(policyID, !qbdConfig?.enableNewCategories)} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.ENABLE_NEW_CATEGORIES], qbdConfig?.pendingFields)} errors={ErrorUtils.getLatestErrorField(qbdConfig, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.ENABLE_NEW_CATEGORIES)} onCloseError={() => (0, Policy_1.clearQBDErrorField)(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.ENABLE_NEW_CATEGORIES)}/>
        </ConnectionLayout_1.default>);
}
QuickbooksDesktopChartOfAccountsPage.displayName = 'QuickbooksDesktopChartOfAccountsPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksDesktopChartOfAccountsPage);
