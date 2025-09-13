"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Accordion_1 = require("@components/Accordion");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useAccordionAnimation_1 = require("@hooks/useAccordionAnimation");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const QuickbooksDesktop = require("@libs/actions/connections/QuickbooksDesktop");
const ErrorUtils = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksDesktopCustomersPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id ?? '-1';
    const qbdConfig = policy?.connections?.quickbooksDesktop?.config;
    const isSwitchOn = !!(qbdConfig?.mappings?.customers && qbdConfig.mappings.customers !== CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE);
    const isReportFieldsSelected = qbdConfig?.mappings?.customers === CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.REPORT_FIELD;
    const { isAccordionExpanded, shouldAnimateAccordionSection } = (0, useAccordionAnimation_1.default)(isSwitchOn);
    return (<ConnectionLayout_1.default displayName={QuickbooksDesktopCustomersPage.displayName} headerTitle="workspace.qbd.customers" title="workspace.qbd.customersDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.pb2, styles.ph5]} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBD} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_IMPORT.getRoute(policyID))}>
            <ToggleSettingsOptionRow_1.default title={translate('workspace.accounting.import')} switchAccessibilityLabel={translate('workspace.qbd.customers')} isActive={isSwitchOn} onToggle={() => QuickbooksDesktop.updateQuickbooksDesktopSyncCustomers(policyID, isSwitchOn ? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE : CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.TAG, qbdConfig?.mappings?.classes)} pendingAction={PolicyUtils.settingsPendingAction([CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MAPPINGS.CUSTOMERS], qbdConfig?.pendingFields)} errors={ErrorUtils.getLatestErrorField(qbdConfig, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MAPPINGS.CUSTOMERS)} onCloseError={() => (0, Policy_1.clearQBDErrorField)(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MAPPINGS.CUSTOMERS)}/>
            <Accordion_1.default isExpanded={isAccordionExpanded} isToggleTriggered={shouldAnimateAccordionSection}>
                <OfflineWithFeedback_1.default pendingAction={PolicyUtils.settingsPendingAction([CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MAPPINGS.CUSTOMERS], qbdConfig?.pendingFields)}>
                    <MenuItemWithTopDescription_1.default title={isReportFieldsSelected ? translate('workspace.common.reportFields') : translate('workspace.common.tags')} description={translate('workspace.common.displayedAs')} wrapperStyle={[styles.sectionMenuItemTopDescription, styles.mt4]} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_CUSTOMERS_DISPLAYED_AS.getRoute(policyID))} brickRoadIndicator={PolicyUtils.areSettingsInErrorFields([CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MAPPINGS.CUSTOMERS], qbdConfig?.errorFields)
            ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR
            : undefined}/>
                </OfflineWithFeedback_1.default>
            </Accordion_1.default>
        </ConnectionLayout_1.default>);
}
QuickbooksDesktopCustomersPage.displayName = 'QuickbooksDesktopCustomersPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksDesktopCustomersPage);
