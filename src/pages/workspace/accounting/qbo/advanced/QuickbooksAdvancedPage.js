"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const Accordion_1 = require("@components/Accordion");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useAccordionAnimation_1 = require("@hooks/useAccordionAnimation");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWaitForNavigation_1 = require("@hooks/useWaitForNavigation");
const QuickbooksOnline_1 = require("@libs/actions/connections/QuickbooksOnline");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const reimbursementOrCollectionAccountIDs = [CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSEMENT_ACCOUNT_ID, CONST_1.default.QUICKBOOKS_CONFIG.COLLECTION_ACCOUNT_ID];
const collectionAccountIDs = [CONST_1.default.QUICKBOOKS_CONFIG.COLLECTION_ACCOUNT_ID];
function QuickbooksAdvancedPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const waitForNavigate = (0, useWaitForNavigation_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    const accountingMethod = policy?.connections?.quickbooksOnline?.config?.accountingMethod;
    const { bankAccounts, creditCards, otherCurrentAssetAccounts, vendors } = policy?.connections?.quickbooksOnline?.data ?? {};
    const nonReimbursableBillDefaultVendorObject = vendors?.find((vendor) => vendor.id === qboConfig?.nonReimbursableBillDefaultVendor);
    const qboAccountOptions = (0, react_1.useMemo)(() => [...(bankAccounts ?? []), ...(creditCards ?? [])], [bankAccounts, creditCards]);
    const invoiceAccountCollectionOptions = (0, react_1.useMemo)(() => [...(bankAccounts ?? []), ...(otherCurrentAssetAccounts ?? [])], [bankAccounts, otherCurrentAssetAccounts]);
    const isSyncReimbursedSwitchOn = !!qboConfig?.collectionAccountID;
    const reimbursementAccountID = qboConfig?.reimbursementAccountID;
    const selectedQboAccountName = (0, react_1.useMemo)(() => qboAccountOptions?.find(({ id }) => id === reimbursementAccountID)?.name, [qboAccountOptions, reimbursementAccountID]);
    const collectionAccountID = qboConfig?.collectionAccountID;
    const selectedInvoiceCollectionAccountName = (0, react_1.useMemo)(() => invoiceAccountCollectionOptions?.find(({ id }) => id === collectionAccountID)?.name, [invoiceAccountCollectionOptions, collectionAccountID]);
    const autoCreateVendorConst = CONST_1.default.QUICKBOOKS_CONFIG.AUTO_CREATE_VENDOR;
    const defaultVendorConst = CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR;
    const { isAccordionExpanded, shouldAnimateAccordionSection } = (0, useAccordionAnimation_1.default)(isSyncReimbursedSwitchOn);
    const AccordionMenuItems = [
        {
            key: 'qboBillPaymentAccount',
            title: selectedQboAccountName,
            description: translate('workspace.qbo.advancedConfig.qboBillPaymentAccount'),
            onPress: waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_ACCOUNT_SELECTOR.getRoute(policyID))),
            subscribedSettings: reimbursementOrCollectionAccountIDs,
            brickRoadIndicator: (0, PolicyUtils_1.areSettingsInErrorFields)(reimbursementOrCollectionAccountIDs, qboConfig?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)(reimbursementOrCollectionAccountIDs, qboConfig?.pendingFields),
        },
        {
            key: 'qboInvoiceCollectionAccount',
            title: selectedInvoiceCollectionAccountName,
            description: translate('workspace.qbo.advancedConfig.qboInvoiceCollectionAccount'),
            onPress: waitForNavigate(() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_INVOICE_ACCOUNT_SELECTOR.getRoute(policyID))),
            subscribedSettings: collectionAccountIDs,
            brickRoadIndicator: (0, PolicyUtils_1.areSettingsInErrorFields)(collectionAccountIDs, qboConfig?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)(collectionAccountIDs, qboConfig?.pendingFields),
        },
    ];
    const syncReimbursedSubMenuItems = () => (<react_native_1.View style={[styles.mt3]}>
            {AccordionMenuItems.map((item) => (<OfflineWithFeedback_1.default key={item.key} pendingAction={item.pendingAction}>
                    <MenuItemWithTopDescription_1.default shouldShowRightIcon title={item.title} description={item.description} wrapperStyle={[styles.sectionMenuItemTopDescription]} onPress={item.onPress} brickRoadIndicator={item.brickRoadIndicator}/>
                </OfflineWithFeedback_1.default>))}
        </react_native_1.View>);
    const qboToggleSettingItems = [
        {
            title: translate('workspace.qbo.advancedConfig.inviteEmployees'),
            subtitle: translate('workspace.qbo.advancedConfig.inviteEmployeesDescription'),
            switchAccessibilityLabel: translate('workspace.qbo.advancedConfig.inviteEmployeesDescription'),
            isActive: !!qboConfig?.syncPeople,
            onToggle: () => (0, QuickbooksOnline_1.updateQuickbooksOnlineSyncPeople)(policyID, !qboConfig?.syncPeople),
            subscribedSetting: CONST_1.default.QUICKBOOKS_CONFIG.SYNC_PEOPLE,
            errors: (0, ErrorUtils_1.getLatestErrorField)(qboConfig, CONST_1.default.QUICKBOOKS_CONFIG.SYNC_PEOPLE),
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_CONFIG.SYNC_PEOPLE], qboConfig?.pendingFields),
        },
        {
            title: translate('workspace.qbo.advancedConfig.createEntities'),
            subtitle: translate('workspace.qbo.advancedConfig.createEntitiesDescription'),
            switchAccessibilityLabel: translate('workspace.qbo.advancedConfig.createEntitiesDescription'),
            isActive: !!qboConfig?.autoCreateVendor,
            onToggle: (isOn) => {
                const nonReimbursableVendorUpdateValue = isOn
                    ? (policy?.connections?.quickbooksOnline?.data?.vendors?.[0]?.id ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE)
                    : CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE;
                const nonReimbursableVendorCurrentValue = nonReimbursableBillDefaultVendorObject?.id ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE;
                (0, QuickbooksOnline_1.updateQuickbooksOnlineAutoCreateVendor)(policyID, {
                    [autoCreateVendorConst]: isOn,
                    [defaultVendorConst]: nonReimbursableVendorUpdateValue,
                }, {
                    [autoCreateVendorConst]: !!qboConfig?.autoCreateVendor,
                    [defaultVendorConst]: nonReimbursableVendorCurrentValue,
                });
            },
            subscribedSetting: CONST_1.default.QUICKBOOKS_CONFIG.AUTO_CREATE_VENDOR,
            errors: (0, ErrorUtils_1.getLatestErrorField)(qboConfig, CONST_1.default.QUICKBOOKS_CONFIG.AUTO_CREATE_VENDOR),
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_CONFIG.AUTO_CREATE_VENDOR], qboConfig?.pendingFields),
        },
        {
            title: translate('workspace.accounting.reimbursedReports'),
            subtitle: translate('workspace.qbo.advancedConfig.reimbursedReportsDescription'),
            switchAccessibilityLabel: translate('workspace.qbo.advancedConfig.reimbursedReportsDescription'),
            isActive: isSyncReimbursedSwitchOn,
            onToggle: () => (0, QuickbooksOnline_1.updateQuickbooksOnlineCollectionAccountID)(policyID, isSyncReimbursedSwitchOn ? '' : [...qboAccountOptions, ...invoiceAccountCollectionOptions].at(0)?.id, qboConfig?.collectionAccountID),
            subscribedSetting: CONST_1.default.QUICKBOOKS_CONFIG.COLLECTION_ACCOUNT_ID,
            errors: (0, ErrorUtils_1.getLatestErrorField)(qboConfig, CONST_1.default.QUICKBOOKS_CONFIG.COLLECTION_ACCOUNT_ID),
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_CONFIG.COLLECTION_ACCOUNT_ID], qboConfig?.pendingFields),
        },
    ];
    return (<ConnectionLayout_1.default displayName={QuickbooksAdvancedPage.displayName} headerTitle="workspace.accounting.advanced" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.pb2, styles.ph5]} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBO}>
            <OfflineWithFeedback_1.default pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_CONFIG.AUTO_SYNC, CONST_1.default.QUICKBOOKS_CONFIG.ACCOUNTING_METHOD], qboConfig?.pendingFields)}>
                <MenuItemWithTopDescription_1.default title={qboConfig?.autoSync?.enabled ? translate('common.enabled') : translate('common.disabled')} description={translate('workspace.accounting.autoSync')} shouldShowRightIcon wrapperStyle={[styles.sectionMenuItemTopDescription]} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_AUTO_SYNC.getRoute(policyID))} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([CONST_1.default.QUICKBOOKS_CONFIG.AUTO_SYNC, CONST_1.default.QUICKBOOKS_CONFIG.ACCOUNTING_METHOD], qboConfig?.errorFields)
            ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR
            : undefined} hintText={(() => {
            if (!qboConfig?.autoSync?.enabled) {
                return undefined;
            }
            return translate(`workspace.qbo.accountingMethods.alternateText.${accountingMethod ?? expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.CASH}`);
        })()}/>
            </OfflineWithFeedback_1.default>
            {qboToggleSettingItems.map((item) => (<ToggleSettingsOptionRow_1.default key={item.title} title={item.title} subtitle={item.subtitle} switchAccessibilityLabel={item.switchAccessibilityLabel} shouldPlaceSubtitleBelowSwitch wrapperStyle={styles.mv3} isActive={item.isActive} onToggle={item.onToggle} pendingAction={item.pendingAction} errors={item.errors} onCloseError={() => (0, Policy_1.clearQBOErrorField)(policyID, item.subscribedSetting)}/>))}
            <Accordion_1.default isExpanded={isAccordionExpanded} isToggleTriggered={shouldAnimateAccordionSection}>
                {syncReimbursedSubMenuItems()}
            </Accordion_1.default>
        </ConnectionLayout_1.default>);
}
QuickbooksAdvancedPage.displayName = 'QuickbooksAdvancedPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksAdvancedPage);
