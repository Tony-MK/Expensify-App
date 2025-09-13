"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const QuickbooksDesktop_1 = require("@libs/actions/connections/QuickbooksDesktop");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksDesktopAdvancedPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const qbdConfig = policy?.connections?.quickbooksDesktop?.config;
    const route = (0, native_1.useRoute)();
    const qbdToggleSettingItems = [
        {
            title: translate('workspace.accounting.autoSync'),
            subtitle: translate('workspace.qbd.advancedConfig.autoSyncDescription'),
            switchAccessibilityLabel: translate('workspace.qbd.advancedConfig.autoSyncDescription'),
            isActive: !!qbdConfig?.autoSync?.enabled,
            onToggle: (isOn) => {
                if (!policyID) {
                    return;
                }
                (0, QuickbooksDesktop_1.updateQuickbooksDesktopAutoSync)(policyID, isOn);
            },
            subscribedSetting: CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.AUTO_SYNC,
            errors: (0, ErrorUtils_1.getLatestErrorField)(qbdConfig, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.AUTO_SYNC),
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.AUTO_SYNC], qbdConfig?.pendingFields),
        },
        {
            title: translate('workspace.qbd.advancedConfig.createEntities'),
            subtitle: translate('workspace.qbd.advancedConfig.createEntitiesDescription'),
            switchAccessibilityLabel: translate('workspace.qbd.advancedConfig.createEntitiesDescription'),
            isActive: !!qbdConfig?.shouldAutoCreateVendor,
            onToggle: (isOn) => {
                (0, QuickbooksDesktop_1.updateQuickbooksDesktopShouldAutoCreateVendor)(policyID, isOn);
            },
            subscribedSetting: CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.SHOULD_AUTO_CREATE_VENDOR,
            errors: (0, ErrorUtils_1.getLatestErrorField)(qbdConfig, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.SHOULD_AUTO_CREATE_VENDOR),
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.SHOULD_AUTO_CREATE_VENDOR], qbdConfig?.pendingFields),
        },
    ];
    return (<ConnectionLayout_1.default displayName={QuickbooksDesktopAdvancedPage.displayName} headerTitle="workspace.accounting.advanced" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.pb2, styles.ph5]} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBD} onBackButtonPress={() => Navigation_1.default.goBack(route.params?.backTo ?? ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyID))}>
            {qbdToggleSettingItems.map((item) => (<ToggleSettingsOptionRow_1.default key={item.title} title={item.title} subtitle={item.subtitle} switchAccessibilityLabel={item.switchAccessibilityLabel} shouldPlaceSubtitleBelowSwitch wrapperStyle={styles.mv3} isActive={item.isActive} onToggle={item.onToggle} pendingAction={item.pendingAction} errors={item.errors} onCloseError={() => (0, Policy_1.clearQBDErrorField)(policyID, item.subscribedSetting)}/>))}
        </ConnectionLayout_1.default>);
}
QuickbooksDesktopAdvancedPage.displayName = 'QuickbooksDesktopAdvancedPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksDesktopAdvancedPage);
