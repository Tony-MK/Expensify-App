"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Xero = require("@libs/actions/connections/Xero");
const ErrorUtils = require("@libs/ErrorUtils");
const PolicyUtils = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Policy = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
function XeroTaxesConfigurationPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id ?? '-1';
    const xeroConfig = policy?.connections?.xero?.config;
    const isSwitchOn = !!xeroConfig?.importTaxRates;
    return (<ConnectionLayout_1.default displayName={XeroTaxesConfigurationPage.displayName} headerTitle="workspace.accounting.taxes" title="workspace.xero.taxesDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.pb2, styles.ph5]} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.XERO}>
            <ToggleSettingsOptionRow_1.default title={translate('workspace.accounting.import')} switchAccessibilityLabel={translate('workspace.xero.customers')} isActive={isSwitchOn} onToggle={() => Xero.updateXeroImportTaxRates(policyID, !xeroConfig?.importTaxRates, xeroConfig?.importTaxRates)} errors={ErrorUtils.getLatestErrorField(xeroConfig ?? {}, CONST_1.default.XERO_CONFIG.IMPORT_TAX_RATES)} onCloseError={() => Policy.clearXeroErrorField(policyID, CONST_1.default.XERO_CONFIG.IMPORT_TAX_RATES)} pendingAction={PolicyUtils.settingsPendingAction([CONST_1.default.XERO_CONFIG.IMPORT_TAX_RATES], xeroConfig?.pendingFields)}/>
        </ConnectionLayout_1.default>);
}
XeroTaxesConfigurationPage.displayName = 'XeroTaxesConfigurationPage';
exports.default = (0, withPolicyConnections_1.default)(XeroTaxesConfigurationPage);
