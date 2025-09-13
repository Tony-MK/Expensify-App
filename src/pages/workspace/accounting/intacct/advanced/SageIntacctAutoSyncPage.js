"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const SageIntacct_1 = require("@libs/actions/connections/SageIntacct");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function SageIntacctAutoSyncPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const config = policy?.connections?.intacct?.config;
    const { autoSync, pendingFields } = config ?? {};
    const accountingMethod = config?.export?.accountingMethod ?? expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.CASH;
    const pendingAction = (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.AUTO_SYNC], pendingFields) ?? (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.ACCOUNTING_METHOD], pendingFields);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_ADVANCED.getRoute(policyID));
    }, [policyID]);
    return (<ConnectionLayout_1.default displayName={SageIntacctAutoSyncPage.displayName} headerTitle="common.settings" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT} onBackButtonPress={goBack}>
            <ToggleSettingsOptionRow_1.default key={translate('workspace.sageIntacct.autoSync')} title={translate('workspace.sageIntacct.autoSync')} subtitle={translate('workspace.sageIntacct.autoSyncDescription')} switchAccessibilityLabel={translate('workspace.sageIntacct.autoSyncDescription')} isActive={!!autoSync?.enabled} wrapperStyle={[styles.pv2, styles.mh5]} shouldPlaceSubtitleBelowSwitch onToggle={() => (0, SageIntacct_1.updateSageIntacctAutoSync)(policyID, !autoSync?.enabled)} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.AUTO_SYNC_ENABLED], pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config ?? {}, CONST_1.default.SAGE_INTACCT_CONFIG.AUTO_SYNC_ENABLED)} onCloseError={() => (0, Policy_1.clearSageIntacctErrorField)(policyID, CONST_1.default.SAGE_INTACCT_CONFIG.AUTO_SYNC_ENABLED)}/>
            {!!autoSync?.enabled && (<OfflineWithFeedback_1.default pendingAction={pendingAction}>
                    <MenuItemWithTopDescription_1.default title={accountingMethod === expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.ACCRUAL
                ? translate(`workspace.sageIntacct.accountingMethods.values.${expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.ACCRUAL}`)
                : translate(`workspace.sageIntacct.accountingMethods.values.${expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.CASH}`)} description={translate('workspace.sageIntacct.accountingMethods.label')} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_ACCOUNTING_METHOD.getRoute(policyID))}/>
                </OfflineWithFeedback_1.default>)}
        </ConnectionLayout_1.default>);
}
SageIntacctAutoSyncPage.displayName = 'SageIntacctAutoSyncPage';
exports.default = (0, withPolicyConnections_1.default)(SageIntacctAutoSyncPage);
