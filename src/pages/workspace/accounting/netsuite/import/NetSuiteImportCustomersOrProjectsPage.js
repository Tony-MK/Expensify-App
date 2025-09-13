"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Accordion_1 = require("@components/Accordion");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const RenderHTML_1 = require("@components/RenderHTML");
const useAccordionAnimation_1 = require("@hooks/useAccordionAnimation");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const NetSuiteCommands_1 = require("@libs/actions/connections/NetSuiteCommands");
const ErrorUtils = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Parser_1 = require("@libs/Parser");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Policy = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function NetSuiteImportCustomersOrProjectsPage({ policy }) {
    const policyID = policy?.id ?? '-1';
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const config = policy?.connections?.netsuite?.options?.config;
    const importMappings = config?.syncOptions?.mapping;
    const importCustomer = importMappings?.customers ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT;
    const importJobs = importMappings?.jobs ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT;
    const importedValue = importMappings?.customers !== CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT ? importCustomer : importJobs;
    const { isAccordionExpanded, shouldAnimateAccordionSection } = (0, useAccordionAnimation_1.default)(importedValue !== CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT);
    const updateMapping = (0, react_1.useCallback)((importField, isEnabled) => {
        let newValue;
        if (!isEnabled) {
            // if the import is off, then we send default as the value for mapping
            newValue = CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT;
        }
        else {
            // when we enable any field, and if the other one already has a value set, we should set that,
            const otherFieldValue = importField === CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.JOBS ? importCustomer : importJobs;
            if (otherFieldValue === CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT) {
                // fallback to Tag
                newValue = CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.TAG;
            }
            else {
                newValue = otherFieldValue;
            }
        }
        if (newValue) {
            (0, NetSuiteCommands_1.updateNetSuiteImportMapping)(policyID, importField, newValue, config?.syncOptions?.mapping?.[importField] ?? null);
        }
    }, [config?.syncOptions?.mapping, policyID, importCustomer, importJobs]);
    return (<ConnectionLayout_1.default displayName={NetSuiteImportCustomersOrProjectsPage.displayName} headerTitle="workspace.netsuite.import.customersOrJobs.title" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT.getRoute(policyID))}>
            <react_native_1.View style={[styles.ph5, styles.flexRow, styles.pb5]}>
                <RenderHTML_1.default html={`<comment>${Parser_1.default.replace(translate(`workspace.netsuite.import.customersOrJobs.subtitle`))}</comment>`}/>
            </react_native_1.View>

            <ToggleSettingsOptionRow_1.default wrapperStyle={[styles.mv3, styles.ph5]} title={translate('workspace.netsuite.import.customersOrJobs.importCustomers')} isActive={(config?.syncOptions?.mapping?.customers ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT) !== CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT} switchAccessibilityLabel={translate('workspace.netsuite.import.customersOrJobs.importCustomers')} onToggle={(isEnabled) => {
            updateMapping(CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.CUSTOMERS, isEnabled);
        }} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.CUSTOMERS], config?.pendingFields)} errors={ErrorUtils.getLatestErrorField(config ?? {}, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.CUSTOMERS)} onCloseError={() => Policy.clearNetSuiteErrorField(policyID, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.CUSTOMERS)}/>
            <ToggleSettingsOptionRow_1.default wrapperStyle={[styles.mv3, styles.ph5]} title={translate('workspace.netsuite.import.customersOrJobs.importJobs')} isActive={(config?.syncOptions?.mapping?.jobs ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT) !== CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT} switchAccessibilityLabel={translate('workspace.netsuite.import.customersOrJobs.importJobs')} onToggle={(isEnabled) => {
            updateMapping(CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.JOBS, isEnabled);
        }} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.JOBS], config?.pendingFields)} errors={ErrorUtils.getLatestErrorField(config ?? {}, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.JOBS)} onCloseError={() => Policy.clearNetSuiteErrorField(policyID, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.JOBS)}/>
            <Accordion_1.default isExpanded={isAccordionExpanded} isToggleTriggered={shouldAnimateAccordionSection}>
                <ToggleSettingsOptionRow_1.default wrapperStyle={[styles.mv3, styles.ph5]} title={translate('workspace.netsuite.import.crossSubsidiaryCustomers')} isActive={config?.syncOptions?.crossSubsidiaryCustomers ?? false} switchAccessibilityLabel={translate('workspace.netsuite.import.crossSubsidiaryCustomers')} onToggle={(isEnabled) => {
            (0, NetSuiteCommands_1.updateNetSuiteCrossSubsidiaryCustomersConfiguration)(policyID, isEnabled);
        }} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CROSS_SUBSIDIARY_CUSTOMERS], config?.pendingFields)} errors={ErrorUtils.getLatestErrorField(config ?? {}, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CROSS_SUBSIDIARY_CUSTOMERS)} onCloseError={() => Policy.clearNetSuiteErrorField(policyID, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CROSS_SUBSIDIARY_CUSTOMERS)}/>

                <OfflineWithFeedback_1.default pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.CUSTOMERS, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.JOBS], config?.pendingFields)}>
                    <MenuItemWithTopDescription_1.default description={translate('workspace.common.displayedAs')} title={translate(`workspace.netsuite.import.importTypes.${importedValue}.label`)} shouldShowRightIcon onPress={() => {
            Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOMERS_OR_PROJECTS_SELECT.getRoute(policyID));
        }} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.CUSTOMERS, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.JOBS], config?.errorFields)
            ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR
            : undefined}/>
                </OfflineWithFeedback_1.default>
            </Accordion_1.default>
        </ConnectionLayout_1.default>);
}
NetSuiteImportCustomersOrProjectsPage.displayName = 'NetSuiteImportCustomersOrProjectsPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteImportCustomersOrProjectsPage);
