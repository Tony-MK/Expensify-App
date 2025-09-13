"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const Switch_1 = require("@components/Switch");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const variables_1 = require("@styles/variables");
const Xero_1 = require("@userActions/connections/Xero");
const Policy = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
function XeroChartOfAccountsPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id ?? '-1';
    const xeroConfig = policy?.connections?.xero?.config;
    return (<ConnectionLayout_1.default displayName={XeroChartOfAccountsPage.displayName} headerTitle="workspace.accounting.accounts" title="workspace.xero.accountsDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.pb2, styles.ph5]} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.XERO}>
            <react_native_1.View style={[styles.flexRow, styles.mb4, styles.alignItemsCenter, styles.justifyContentBetween]}>
                <react_native_1.View style={styles.flex1}>
                    <Text_1.default fontSize={variables_1.default.fontSizeNormal}>{translate('workspace.accounting.import')}</Text_1.default>
                </react_native_1.View>
                <react_native_1.View style={[styles.flex1, styles.alignItemsEnd, styles.pl3]}>
                    <Switch_1.default accessibilityLabel={translate('workspace.accounting.accounts')} isOn disabled onToggle={() => { }}/>
                </react_native_1.View>
            </react_native_1.View>
            <MenuItemWithTopDescription_1.default interactive={false} title={translate('workspace.common.categories')} description={translate('workspace.common.displayedAs')} wrapperStyle={styles.sectionMenuItemTopDescription}/>
            <Text_1.default style={styles.pv5}>{translate('workspace.xero.accountsSwitchTitle')}</Text_1.default>
            <ToggleSettingsOptionRow_1.default title={translate('workspace.common.enabled')} subtitle={translate('workspace.xero.accountsSwitchDescription')} switchAccessibilityLabel={translate('workspace.xero.accountsSwitchDescription')} shouldPlaceSubtitleBelowSwitch isActive={!!xeroConfig?.enableNewCategories} onToggle={() => (0, Xero_1.updateXeroEnableNewCategories)(policyID, !xeroConfig?.enableNewCategories, xeroConfig?.enableNewCategories)} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.ENABLE_NEW_CATEGORIES], xeroConfig?.pendingFields)} errors={ErrorUtils.getLatestErrorField(xeroConfig ?? {}, CONST_1.default.XERO_CONFIG.ENABLE_NEW_CATEGORIES)} onCloseError={() => Policy.clearXeroErrorField(policyID, CONST_1.default.XERO_CONFIG.ENABLE_NEW_CATEGORIES)}/>
        </ConnectionLayout_1.default>);
}
XeroChartOfAccountsPage.displayName = 'XeroChartOfAccountsPage';
exports.default = (0, withPolicyConnections_1.default)(XeroChartOfAccountsPage);
