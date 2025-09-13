"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const Accordion_1 = require("@components/Accordion");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
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
function QuickbooksCustomersPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id ?? '-1';
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    const isSwitchOn = !!(qboConfig?.syncCustomers && qboConfig?.syncCustomers !== CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE);
    const isReportFieldsSelected = qboConfig?.syncCustomers === CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.REPORT_FIELD;
    const isAccordionExpanded = (0, react_native_reanimated_1.useSharedValue)(isSwitchOn);
    const shouldAnimateAccordionSection = (0, react_native_reanimated_1.useSharedValue)(false);
    const hasMounted = (0, react_native_reanimated_1.useSharedValue)(false);
    (0, react_1.useEffect)(() => {
        isAccordionExpanded.set(isSwitchOn);
        if (hasMounted.get()) {
            shouldAnimateAccordionSection.set(true);
        }
        else {
            hasMounted.set(true);
        }
    }, [hasMounted, isAccordionExpanded, isSwitchOn, shouldAnimateAccordionSection]);
    return (<ConnectionLayout_1.default displayName={QuickbooksCustomersPage.displayName} headerTitle="workspace.qbo.customers" title="workspace.qbo.customersDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.pb2, styles.ph5]} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBO} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_IMPORT.getRoute(policyID))}>
            <ToggleSettingsOptionRow_1.default title={translate('workspace.accounting.import')} switchAccessibilityLabel={translate('workspace.qbo.customers')} isActive={isSwitchOn} onToggle={() => QuickbooksOnline.updateQuickbooksOnlineSyncCustomers(policyID, isSwitchOn ? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE : CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.TAG, qboConfig?.syncCustomers)} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_CONFIG.SYNC_CUSTOMERS], qboConfig?.pendingFields)} errors={ErrorUtils.getLatestErrorField(qboConfig, CONST_1.default.QUICKBOOKS_CONFIG.SYNC_CUSTOMERS)} onCloseError={() => (0, Policy_1.clearQBOErrorField)(policyID, CONST_1.default.QUICKBOOKS_CONFIG.SYNC_CUSTOMERS)}/>

            <Accordion_1.default isExpanded={isAccordionExpanded} isToggleTriggered={shouldAnimateAccordionSection}>
                <OfflineWithFeedback_1.default pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_CONFIG.SYNC_CUSTOMERS], qboConfig?.pendingFields)}>
                    <MenuItemWithTopDescription_1.default title={isReportFieldsSelected ? translate('workspace.common.reportFields') : translate('workspace.common.tags')} description={translate('workspace.common.displayedAs')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_CUSTOMERS_DISPLAYED_AS.getRoute(policyID))} shouldShowRightIcon wrapperStyle={[styles.sectionMenuItemTopDescription, styles.mt4]} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([CONST_1.default.QUICKBOOKS_CONFIG.SYNC_CUSTOMERS], qboConfig?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                </OfflineWithFeedback_1.default>
            </Accordion_1.default>
        </ConnectionLayout_1.default>);
}
QuickbooksCustomersPage.displayName = 'QuickbooksCustomersPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksCustomersPage);
