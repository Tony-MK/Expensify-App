"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils = require("@libs/ErrorUtils");
const PolicyUtils = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Xero_1 = require("@userActions/connections/Xero");
const Policy = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
function XeroCustomerConfigurationPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id ?? '-1';
    const xeroConfig = policy?.connections?.xero?.config;
    const isSwitchOn = !!xeroConfig?.importCustomers;
    return (<ConnectionLayout_1.default displayName={XeroCustomerConfigurationPage.displayName} headerTitle="workspace.xero.customers" title="workspace.xero.customersDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[[styles.pb2, styles.ph5]]} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.XERO}>
            <ToggleSettingsOptionRow_1.default title={translate('workspace.accounting.import')} switchAccessibilityLabel={translate('workspace.xero.customers')} accordionStyle={styles.overflowHidden} subMenuItems={<MenuItemWithTopDescription_1.default interactive={false} title={translate('workspace.common.tags')} description={translate('workspace.common.displayedAs')} wrapperStyle={styles.sectionMenuItemTopDescription}/>} isActive={isSwitchOn} onToggle={() => (0, Xero_1.updateXeroImportCustomers)(policyID, !xeroConfig?.importCustomers, xeroConfig?.importCustomers)} errors={ErrorUtils.getLatestErrorField(xeroConfig ?? {}, CONST_1.default.XERO_CONFIG.IMPORT_CUSTOMERS)} onCloseError={() => Policy.clearXeroErrorField(policyID, CONST_1.default.XERO_CONFIG.IMPORT_CUSTOMERS)} pendingAction={PolicyUtils.settingsPendingAction([CONST_1.default.XERO_CONFIG.IMPORT_CUSTOMERS], xeroConfig?.pendingFields)}/>
        </ConnectionLayout_1.default>);
}
XeroCustomerConfigurationPage.displayName = 'XeroCustomerConfigurationPage';
exports.default = (0, withPolicyConnections_1.default)(XeroCustomerConfigurationPage);
