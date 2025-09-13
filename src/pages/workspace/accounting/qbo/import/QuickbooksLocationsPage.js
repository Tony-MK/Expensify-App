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
const QuickbooksOnline = require("@libs/actions/connections/QuickbooksOnline");
const ErrorUtils = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils = require("@libs/PolicyUtils");
const utils_1 = require("@pages/workspace/accounting/qbo/utils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksLocationsPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id ?? '-1';
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    const isSwitchOn = !!(qboConfig?.syncLocations && qboConfig?.syncLocations !== CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE);
    const isTagsSelected = qboConfig?.syncLocations === CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.TAG;
    const shouldShowLineItemsRestriction = (0, utils_1.shouldShowLocationsLineItemsRestriction)(qboConfig);
    const { isAccordionExpanded, shouldAnimateAccordionSection } = (0, useAccordionAnimation_1.default)(isSwitchOn);
    const updateQuickbooksOnlineSyncLocations = (0, react_1.useCallback)((settingValue) => {
        if (settingValue === CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.REPORT_FIELD && !PolicyUtils.isControlPolicy(policy)) {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policyID, CONST_1.default.REPORT_FIELDS_FEATURE.qbo.locations, ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_LOCATIONS.getRoute(policyID)));
            return;
        }
        QuickbooksOnline.updateQuickbooksOnlineSyncLocations(policyID, settingValue, qboConfig?.syncLocations);
    }, [policy, policyID, qboConfig?.syncLocations]);
    // If we previously selected tags but now we have the line items restriction, we need to switch to report fields
    (0, react_1.useEffect)(() => {
        if (!(0, utils_1.shouldSwitchLocationsToReportFields)(qboConfig)) {
            return;
        }
        updateQuickbooksOnlineSyncLocations(CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.REPORT_FIELD);
    }, [qboConfig, updateQuickbooksOnlineSyncLocations]);
    return (<ConnectionLayout_1.default displayName={QuickbooksLocationsPage.displayName} headerTitle="workspace.qbo.locations" title="workspace.qbo.locationsDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[[styles.pb2, styles.ph5]]} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBO} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_IMPORT.getRoute(policyID))}>
            <ToggleSettingsOptionRow_1.default title={translate('workspace.accounting.import')} switchAccessibilityLabel={translate('workspace.qbo.locations')} isActive={isSwitchOn} onToggle={() => updateQuickbooksOnlineSyncLocations(
        // eslint-disable-next-line no-nested-ternary
        isSwitchOn
            ? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE
            : shouldShowLineItemsRestriction
                ? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.REPORT_FIELD
                : CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.TAG)} errors={ErrorUtils.getLatestErrorField(qboConfig, CONST_1.default.QUICKBOOKS_CONFIG.SYNC_LOCATIONS)} onCloseError={() => (0, Policy_1.clearQBOErrorField)(policyID, CONST_1.default.QUICKBOOKS_CONFIG.SYNC_LOCATIONS)} pendingAction={PolicyUtils.settingsPendingAction([CONST_1.default.QUICKBOOKS_CONFIG.SYNC_LOCATIONS], qboConfig?.pendingFields)}/>
            <Accordion_1.default isExpanded={isAccordionExpanded} isToggleTriggered={shouldAnimateAccordionSection}>
                <OfflineWithFeedback_1.default pendingAction={PolicyUtils.settingsPendingAction([CONST_1.default.QUICKBOOKS_CONFIG.SYNC_LOCATIONS], qboConfig?.pendingFields)}>
                    <MenuItemWithTopDescription_1.default interactive={!shouldShowLineItemsRestriction} title={!isTagsSelected ? translate('workspace.common.reportFields') : translate('workspace.common.tags')} description={translate('workspace.common.displayedAs')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_LOCATIONS_DISPLAYED_AS.getRoute(policyID))} shouldShowRightIcon={!shouldShowLineItemsRestriction} wrapperStyle={[styles.sectionMenuItemTopDescription, styles.mt4]} brickRoadIndicator={PolicyUtils.areSettingsInErrorFields([CONST_1.default.QUICKBOOKS_CONFIG.SYNC_LOCATIONS], qboConfig?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} hintText={translate('workspace.qbo.locationsLineItemsRestrictionDescription')}/>
                </OfflineWithFeedback_1.default>
            </Accordion_1.default>
        </ConnectionLayout_1.default>);
}
QuickbooksLocationsPage.displayName = 'QuickbooksLocationsPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksLocationsPage);
