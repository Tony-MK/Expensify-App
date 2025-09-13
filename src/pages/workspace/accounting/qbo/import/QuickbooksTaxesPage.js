"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
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
function QuickbooksTaxesPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id ?? '-1';
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    const isJournalExportEntity = qboConfig?.reimbursableExpensesExportDestination === CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.JOURNAL_ENTRY;
    return (<ConnectionLayout_1.default displayName={QuickbooksTaxesPage.displayName} headerTitle="workspace.accounting.taxes" title="workspace.qbo.taxesDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[[styles.pb2, styles.ph5]]} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBO} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_IMPORT.getRoute(policyID))}>
            <ToggleSettingsOptionRow_1.default title={translate('workspace.accounting.import')} switchAccessibilityLabel={translate('workspace.accounting.taxes')} isActive={!!qboConfig?.syncTax} onToggle={() => QuickbooksOnline.updateQuickbooksOnlineSyncTax(policyID, !qboConfig?.syncTax)} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_CONFIG.SYNC_TAX], qboConfig?.pendingFields)} errors={ErrorUtils.getLatestErrorField(qboConfig, CONST_1.default.QUICKBOOKS_CONFIG.SYNC_TAX)} onCloseError={() => (0, Policy_1.clearQBOErrorField)(policyID, CONST_1.default.QUICKBOOKS_CONFIG.SYNC_TAX)}/>
            {!qboConfig?.syncTax && isJournalExportEntity && <Text_1.default style={[styles.mutedNormalTextLabel, styles.pt2]}>{translate('workspace.qbo.taxesJournalEntrySwitchNote')}</Text_1.default>}
        </ConnectionLayout_1.default>);
}
QuickbooksTaxesPage.displayName = 'QuickbooksTaxesPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksTaxesPage);
