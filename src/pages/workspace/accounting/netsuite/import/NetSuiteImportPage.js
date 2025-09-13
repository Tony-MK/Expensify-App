"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useLocalize_1 = require("@hooks/useLocalize");
const usePermissions_1 = require("@hooks/usePermissions");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const NetSuiteCommands_1 = require("@libs/actions/connections/NetSuiteCommands");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const utils_1 = require("@pages/workspace/accounting/netsuite/utils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function NetSuiteImportPage({ policy }) {
    const { translate, localeCompare } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const policyID = policy?.id;
    const config = policy?.connections?.netsuite?.options?.config;
    const { subsidiaryList } = policy?.connections?.netsuite?.options?.data ?? {};
    const selectedSubsidiary = (0, react_1.useMemo)(() => (subsidiaryList ?? []).find((subsidiary) => subsidiary.internalID === config?.subsidiaryID), [subsidiaryList, config?.subsidiaryID]);
    return (<ConnectionLayout_1.default displayName={NetSuiteImportPage.displayName} headerTitle="workspace.accounting.import" headerSubtitle={config?.subsidiary ?? ''} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.pb2]} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE}>
            <ToggleSettingsOptionRow_1.default wrapperStyle={[styles.mv3, styles.ph5]} title={translate('workspace.netsuite.import.expenseCategories')} subtitle={translate('workspace.netsuite.import.expenseCategoriesDescription')} shouldPlaceSubtitleBelowSwitch isActive disabled switchAccessibilityLabel={translate('workspace.netsuite.import.expenseCategories')} onToggle={() => { }}/>
            {CONST_1.default.NETSUITE_CONFIG.IMPORT_FIELDS.map((importField) => (<OfflineWithFeedback_1.default key={importField} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([importField], config?.pendingFields)}>
                    <MenuItemWithTopDescription_1.default description={translate(`workspace.netsuite.import.importFields.${importField}.title`)} title={translate(`workspace.accounting.importTypes.${config?.syncOptions?.mapping?.[importField] ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NETSUITE_DEFAULT}`)} shouldShowRightIcon onPress={() => {
                if (!policyID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_MAPPING.getRoute(policyID, importField));
            }} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([importField], config?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                </OfflineWithFeedback_1.default>))}
            <OfflineWithFeedback_1.default pendingAction={(0, PolicyUtils_1.settingsPendingAction)([
            CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.CUSTOMERS,
            CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.JOBS,
            CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CROSS_SUBSIDIARY_CUSTOMERS,
        ], config?.pendingFields)}>
                <MenuItemWithTopDescription_1.default description={translate(`workspace.netsuite.import.customersOrJobs.title`)} title={(0, PolicyUtils_1.getCustomersOrJobsLabelNetSuite)(policy, translate)} shouldShowRightIcon numberOfLinesTitle={2} onPress={() => {
            if (!policyID) {
                return;
            }
            Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOMERS_OR_PROJECTS.getRoute(policyID));
        }} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([
            CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.CUSTOMERS,
            CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.JOBS,
            CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CROSS_SUBSIDIARY_CUSTOMERS,
        ], config?.errorFields)
            ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR
            : undefined}/>
            </OfflineWithFeedback_1.default>
            {(0, PolicyUtils_1.canUseTaxNetSuite)(isBetaEnabled(CONST_1.default.BETAS.NETSUITE_USA_TAX), selectedSubsidiary?.country) && (<ToggleSettingsOptionRow_1.default wrapperStyle={[styles.mv3, styles.ph5]} title={translate('common.tax')} subtitle={translate('workspace.netsuite.import.importTaxDescription')} shouldPlaceSubtitleBelowSwitch isActive={config?.syncOptions?.syncTax ?? false} switchAccessibilityLabel={translate('common.tax')} onToggle={(isEnabled) => {
                if (!policyID) {
                    return;
                }
                (0, NetSuiteCommands_1.updateNetSuiteSyncTaxConfiguration)(policyID, isEnabled);
            }} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.SYNC_TAX], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config ?? {}, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.SYNC_TAX)} onCloseError={() => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.SYNC_TAX)}/>)}
            {Object.values(CONST_1.default.NETSUITE_CONFIG.IMPORT_CUSTOM_FIELDS).map((importField) => {
            const settings = (0, utils_1.getImportCustomFieldsSettings)(importField, config);
            return (<OfflineWithFeedback_1.default key={importField} pendingAction={(0, PolicyUtils_1.settingsPendingAction)(settings, config?.pendingFields)} shouldDisableStrikeThrough>
                        <MenuItemWithTopDescription_1.default title={(0, PolicyUtils_1.getNetSuiteImportCustomFieldLabel)(policy, importField, translate, localeCompare)} description={translate(`workspace.netsuite.import.importCustomFields.${importField}.title`)} shouldShowRightIcon onPress={() => {
                    if (!policyID) {
                        return;
                    }
                    Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT_CUSTOM_FIELD_MAPPING.getRoute(policyID, importField));
                }} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)(settings, config?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                    </OfflineWithFeedback_1.default>);
        })}
        </ConnectionLayout_1.default>);
}
NetSuiteImportPage.displayName = 'NetSuiteImportPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteImportPage);
