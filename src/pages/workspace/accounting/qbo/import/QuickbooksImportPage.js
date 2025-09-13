"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const QuickbooksOnline = require("@libs/actions/connections/QuickbooksOnline");
const PolicyUtils = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const utils_1 = require("@pages/workspace/accounting/qbo/utils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksImportPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id ?? '-1';
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    const { syncClasses, syncCustomers, syncLocations, syncTax, pendingFields, errorFields } = qboConfig ?? {};
    // If we previously selected tags but now we have the line items restriction for locations, we need to switch to report fields
    (0, react_1.useEffect)(() => {
        if (!(0, utils_1.shouldSwitchLocationsToReportFields)(qboConfig)) {
            return;
        }
        QuickbooksOnline.updateQuickbooksOnlineSyncLocations(policyID, CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.REPORT_FIELD, qboConfig?.syncLocations);
    }, [qboConfig, policyID]);
    const sections = [
        {
            description: translate('workspace.accounting.accounts'),
            action: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_CHART_OF_ACCOUNTS.getRoute(policyID)),
            title: translate('workspace.accounting.importAsCategory'),
            subscribedSettings: [CONST_1.default.QUICKBOOKS_CONFIG.ENABLE_NEW_CATEGORIES],
        },
        {
            description: translate('workspace.qbo.classes'),
            action: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_CLASSES.getRoute(policyID)),
            title: translate(`workspace.accounting.importTypes.${syncClasses ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE}`),
            subscribedSettings: [CONST_1.default.QUICKBOOKS_CONFIG.SYNC_CLASSES],
        },
        {
            description: translate('workspace.qbo.customers'),
            action: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_CUSTOMERS.getRoute(policyID)),
            title: translate(`workspace.accounting.importTypes.${syncCustomers ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE}`),
            subscribedSettings: [CONST_1.default.QUICKBOOKS_CONFIG.SYNC_CUSTOMERS],
        },
        {
            description: translate('workspace.qbo.locations'),
            action: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_LOCATIONS.getRoute(policyID)),
            title: translate(`workspace.accounting.importTypes.${syncLocations ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE}`),
            subscribedSettings: [CONST_1.default.QUICKBOOKS_CONFIG.SYNC_LOCATIONS],
        },
    ];
    if (policy?.connections?.quickbooksOnline?.data?.country !== CONST_1.default.COUNTRY.US) {
        sections.push({
            description: translate('workspace.accounting.taxes'),
            action: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_TAXES.getRoute(policyID)),
            title: translate(syncTax ? 'workspace.accounting.imported' : 'workspace.accounting.notImported'),
            subscribedSettings: [CONST_1.default.QUICKBOOKS_CONFIG.SYNC_TAX],
        });
    }
    return (<ConnectionLayout_1.default displayName={QuickbooksImportPage.displayName} headerTitle="workspace.accounting.import" title="workspace.qbo.importDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBO}>
            {sections.map((section) => (<OfflineWithFeedback_1.default key={section.description} pendingAction={PolicyUtils.settingsPendingAction(section.subscribedSettings, pendingFields)}>
                    <MenuItemWithTopDescription_1.default title={section.title} description={section.description} shouldShowRightIcon onPress={section.action} brickRoadIndicator={PolicyUtils.areSettingsInErrorFields(section.subscribedSettings, errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                </OfflineWithFeedback_1.default>))}
        </ConnectionLayout_1.default>);
}
QuickbooksImportPage.displayName = 'QuickbooksImportPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksImportPage);
