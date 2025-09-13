"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const RenderHTML_1 = require("@components/RenderHTML");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const QuickbooksOnline_1 = require("@libs/actions/connections/QuickbooksOnline");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const goBackFromExportConnection_1 = require("@navigation/helpers/goBackFromExportConnection");
const Navigation_1 = require("@navigation/Navigation");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksExportConfigurationPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const route = (0, native_1.useRoute)();
    const backTo = route?.params?.backTo;
    const policyID = policy?.id;
    const policyOwner = policy?.owner ?? '';
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    const errorFields = qboConfig?.errorFields;
    const shouldShowVendorMenuItems = (0, react_1.useMemo)(() => qboConfig?.nonReimbursableExpensesExportDestination === CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.VENDOR_BILL, [qboConfig?.nonReimbursableExpensesExportDestination]);
    const goBack = (0, react_1.useCallback)(() => {
        return (0, goBackFromExportConnection_1.default)(shouldShowVendorMenuItems, backTo);
    }, [backTo, shouldShowVendorMenuItems]);
    const menuItems = [
        {
            description: translate('workspace.accounting.preferredExporter'),
            onPress: !policyID ? undefined : () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_PREFERRED_EXPORTER.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            title: qboConfig?.export?.exporter ?? policyOwner,
            subscribedSettings: [CONST_1.default.QUICKBOOKS_CONFIG.EXPORT],
        },
        {
            description: translate('workspace.qbo.date'),
            onPress: !policyID ? undefined : () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT_DATE_SELECT.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            title: qboConfig?.exportDate ? translate(`workspace.qbo.exportDate.values.${qboConfig?.exportDate}.label`) : undefined,
            subscribedSettings: [CONST_1.default.QUICKBOOKS_CONFIG.EXPORT_DATE],
        },
        {
            description: translate('workspace.accounting.exportOutOfPocket'),
            onPress: !policyID
                ? undefined
                : () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            title: qboConfig?.reimbursableExpensesExportDestination ? translate(`workspace.qbo.accounts.${qboConfig?.reimbursableExpensesExportDestination}`) : undefined,
            subscribedSettings: [CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_EXPORT_DESTINATION, CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_ACCOUNT],
        },
        {
            description: translate('workspace.qbo.exportInvoices'),
            onPress: !policyID ? undefined : () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_INVOICE_ACCOUNT_SELECT.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            title: qboConfig?.receivableAccount?.name,
            subscribedSettings: [CONST_1.default.QUICKBOOKS_CONFIG.RECEIVABLE_ACCOUNT],
        },
        {
            description: translate('workspace.accounting.exportCompanyCard'),
            onPress: !policyID
                ? undefined
                : () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            brickRoadIndicator: qboConfig?.errorFields?.exportCompanyCard ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
            title: qboConfig?.nonReimbursableExpensesExportDestination ? translate(`workspace.qbo.accounts.${qboConfig?.nonReimbursableExpensesExportDestination}`) : undefined,
            subscribedSettings: [
                CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_EXPENSES_EXPORT_DESTINATION,
                CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_EXPENSE_ACCOUNT,
                ...(shouldShowVendorMenuItems ? [CONST_1.default.QUICKBOOKS_CONFIG.AUTO_CREATE_VENDOR] : []),
                ...(shouldShowVendorMenuItems && qboConfig?.autoCreateVendor ? [CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR] : []),
            ],
        },
        {
            description: translate('workspace.qbo.exportExpensifyCard'),
            title: translate('workspace.qbo.accounts.credit_card'),
            shouldShowRightIcon: false,
            interactive: false,
        },
    ];
    return (<ConnectionLayout_1.default displayName={QuickbooksExportConfigurationPage.displayName} headerTitle="workspace.accounting.export" title="workspace.qbo.exportDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} policyID={policyID} onBackButtonPress={goBack} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBO}>
            {menuItems.map((menuItem) => (<OfflineWithFeedback_1.default key={menuItem.description} pendingAction={(0, PolicyUtils_1.settingsPendingAction)(menuItem?.subscribedSettings, qboConfig?.pendingFields)}>
                    <MenuItemWithTopDescription_1.default title={menuItem.title} interactive={menuItem?.interactive ?? true} description={menuItem.description} shouldShowRightIcon={menuItem?.shouldShowRightIcon ?? true} onPress={menuItem?.onPress} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)(menuItem?.subscribedSettings, errorFields) ||
                (menuItem.subscribedSettings?.some((setting) => setting === CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_EXPORT_DESTINATION) &&
                    (0, QuickbooksOnline_1.shouldShowQBOReimbursableExportDestinationAccountError)(policy))
                ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR
                : undefined}/>
                </OfflineWithFeedback_1.default>))}
            <react_native_1.View style={[styles.renderHTML, styles.ph5, styles.pb5, styles.mt2]}>
                <RenderHTML_1.default html={translate('workspace.common.deepDiveExpensifyCard')}/>
            </react_native_1.View>
        </ConnectionLayout_1.default>);
}
QuickbooksExportConfigurationPage.displayName = 'QuickbooksExportConfigurationPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksExportConfigurationPage);
