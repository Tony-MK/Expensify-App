"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const Accordion_1 = require("@components/Accordion");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useAccordionAnimation_1 = require("@hooks/useAccordionAnimation");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const connections_1 = require("@libs/actions/connections");
const ConnectionUtils_1 = require("@libs/ConnectionUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksCompanyCardExpenseAccountPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id;
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    const { vendors } = policy?.connections?.quickbooksOnline?.data ?? {};
    const nonReimbursableBillDefaultVendorObject = vendors?.find((vendor) => vendor.id === qboConfig?.nonReimbursableBillDefaultVendor);
    const route = (0, native_1.useRoute)();
    const backTo = route.params?.backTo;
    const { isAccordionExpanded, shouldAnimateAccordionSection } = (0, useAccordionAnimation_1.default)(!!qboConfig?.autoCreateVendor);
    const sections = [
        {
            title: qboConfig?.nonReimbursableExpensesExportDestination ? translate(`workspace.qbo.accounts.${qboConfig?.nonReimbursableExpensesExportDestination}`) : undefined,
            description: translate('workspace.accounting.exportAs'),
            onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_SELECT.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            hintText: qboConfig?.nonReimbursableExpensesExportDestination ? translate(`workspace.qbo.accounts.${qboConfig?.nonReimbursableExpensesExportDestination}Description`) : undefined,
            subscribedSettings: [CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_EXPENSE_EXPORT_DESTINATION],
        },
        {
            title: qboConfig?.nonReimbursableExpensesAccount?.name,
            description: (0, ConnectionUtils_1.getQBONonReimbursableExportAccountType)(qboConfig?.nonReimbursableExpensesExportDestination),
            onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT_SELECT.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            subscribedSettings: [CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_EXPENSE_ACCOUNT],
        },
    ];
    return (<ConnectionLayout_1.default policyID={policyID} displayName={QuickbooksCompanyCardExpenseAccountPage.displayName} headerTitle="workspace.accounting.exportCompanyCard" title="workspace.qbo.exportCompanyCardsDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBO} onBackButtonPress={() => Navigation_1.default.goBack(backTo ?? ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT.getRoute(policyID))}>
            {sections.map((section) => (<OfflineWithFeedback_1.default key={section.title} pendingAction={(0, PolicyUtils_1.settingsPendingAction)(section.subscribedSettings, qboConfig?.pendingFields)}>
                    <MenuItemWithTopDescription_1.default title={section.title} description={section.description} onPress={section.onPress} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)(section.subscribedSettings, qboConfig?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} shouldShowRightIcon hintText={section.hintText}/>
                </OfflineWithFeedback_1.default>))}
            {qboConfig?.nonReimbursableExpensesExportDestination === CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.VENDOR_BILL && (<>
                    <ToggleSettingsOptionRow_1.default title={translate('workspace.accounting.defaultVendor')} subtitle={translate('workspace.qbo.defaultVendorDescription')} switchAccessibilityLabel={translate('workspace.qbo.defaultVendorDescription')} wrapperStyle={[styles.ph5, styles.mb3, styles.mt1]} isActive={!!qboConfig?.autoCreateVendor} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_CONFIG.AUTO_CREATE_VENDOR], qboConfig?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(qboConfig, CONST_1.default.QUICKBOOKS_CONFIG.AUTO_CREATE_VENDOR)} onToggle={(isOn) => (0, connections_1.updateManyPolicyConnectionConfigs)(policyID, CONST_1.default.POLICY.CONNECTIONS.NAME.QBO, {
                [CONST_1.default.QUICKBOOKS_CONFIG.AUTO_CREATE_VENDOR]: isOn,
                [CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR]: isOn
                    ? (policy?.connections?.quickbooksOnline?.data?.vendors?.[0]?.id ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE)
                    : CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE,
            }, {
                [CONST_1.default.QUICKBOOKS_CONFIG.AUTO_CREATE_VENDOR]: qboConfig?.autoCreateVendor,
                [CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR]: nonReimbursableBillDefaultVendorObject?.id ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE,
            })} onCloseError={() => (0, Policy_1.clearQBOErrorField)(policyID, CONST_1.default.QUICKBOOKS_CONFIG.AUTO_CREATE_VENDOR)} shouldPlaceSubtitleBelowSwitch/>
                    <Accordion_1.default isExpanded={isAccordionExpanded} isToggleTriggered={shouldAnimateAccordionSection}>
                        <OfflineWithFeedback_1.default pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR], qboConfig?.pendingFields)}>
                            <MenuItemWithTopDescription_1.default title={nonReimbursableBillDefaultVendorObject?.name} description={translate('workspace.accounting.defaultVendor')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_NON_REIMBURSABLE_DEFAULT_VENDOR_SELECT.getRoute(policyID))} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR], qboConfig?.errorFields)
                ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR
                : undefined} shouldShowRightIcon/>
                        </OfflineWithFeedback_1.default>
                    </Accordion_1.default>
                </>)}
        </ConnectionLayout_1.default>);
}
QuickbooksCompanyCardExpenseAccountPage.displayName = 'QuickbooksCompanyCardExpenseAccountPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksCompanyCardExpenseAccountPage);
