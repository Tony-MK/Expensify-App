"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const PolicyUtils = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksDesktopImportPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id ?? '-1';
    const { mappings, pendingFields, errorFields } = policy?.connections?.quickbooksDesktop?.config ?? {};
    const sections = [
        {
            description: translate('workspace.accounting.accounts'),
            action: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_CHART_OF_ACCOUNTS.getRoute(policyID)),
            title: translate('workspace.accounting.importAsCategory'),
            subscribedSettings: [CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.ENABLE_NEW_CATEGORIES],
        },
        {
            description: translate('workspace.qbd.classes'),
            action: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_CLASSES.getRoute(policyID)),
            title: translate(`workspace.accounting.importTypes.${mappings?.classes ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE}`),
            subscribedSettings: [CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MAPPINGS.CLASSES],
        },
        {
            description: translate('workspace.qbd.customers'),
            action: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_CUSTOMERS.getRoute(policyID)),
            title: translate(`workspace.accounting.importTypes.${mappings?.customers ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE}`),
            subscribedSettings: [CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MAPPINGS.CUSTOMERS],
        },
        {
            description: translate('workspace.qbd.items'),
            action: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_ITEMS.getRoute(policyID)),
            subscribedSettings: [CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.IMPORT_ITEMS],
        },
    ];
    return (<ConnectionLayout_1.default displayName={QuickbooksDesktopImportPage.displayName} headerTitle="workspace.accounting.import" title="workspace.qbd.importDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBD} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyID))}>
            {sections.map((section) => (<OfflineWithFeedback_1.default key={section.description} pendingAction={PolicyUtils.settingsPendingAction(section.subscribedSettings, pendingFields)}>
                    <MenuItemWithTopDescription_1.default title={section.title} description={section.description} shouldShowRightIcon onPress={section.action} brickRoadIndicator={PolicyUtils.areSettingsInErrorFields(section.subscribedSettings, errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                </OfflineWithFeedback_1.default>))}
        </ConnectionLayout_1.default>);
}
QuickbooksDesktopImportPage.displayName = 'PolicyQuickbooksDesktopImportPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksDesktopImportPage);
