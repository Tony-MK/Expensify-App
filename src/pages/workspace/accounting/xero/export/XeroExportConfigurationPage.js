"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const goBackFromExportConnection_1 = require("@navigation/helpers/goBackFromExportConnection");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function XeroExportConfigurationPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id;
    const route = (0, native_1.useRoute)();
    const backTo = route?.params?.backTo;
    const policyOwner = policy?.owner ?? '';
    const { export: exportConfiguration, errorFields, pendingFields } = policy?.connections?.xero?.config ?? {};
    const shouldGoBackToSpecificRoute = !exportConfiguration?.nonReimbursableAccount;
    const goBack = (0, react_1.useCallback)(() => {
        return (0, goBackFromExportConnection_1.default)(shouldGoBackToSpecificRoute, backTo);
    }, [backTo, shouldGoBackToSpecificRoute]);
    const { bankAccounts } = policy?.connections?.xero?.data ?? {};
    const selectedBankAccountName = (0, react_1.useMemo)(() => {
        const selectedAccount = (bankAccounts ?? []).find((bank) => bank.id === exportConfiguration?.nonReimbursableAccount);
        return selectedAccount?.name ?? bankAccounts?.[0]?.name ?? '';
    }, [bankAccounts, exportConfiguration?.nonReimbursableAccount]);
    const currentXeroOrganizationName = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getCurrentXeroOrganizationName)(policy ?? undefined), [policy]);
    const menuItems = [
        {
            description: translate('workspace.accounting.preferredExporter'),
            onPress: !policyID
                ? undefined
                : () => {
                    Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_PREFERRED_EXPORTER_SELECT.getRoute(policyID, Navigation_1.default.getActiveRoute()));
                },
            title: exportConfiguration?.exporter ?? policyOwner,
            subscribedSettings: [CONST_1.default.XERO_CONFIG.EXPORTER],
        },
        {
            description: translate('workspace.accounting.exportOutOfPocket'),
            title: translate('workspace.xero.purchaseBill'),
            interactive: false,
            shouldShowRightIcon: false,
            helperText: translate('workspace.xero.exportExpensesDescription'),
        },
        {
            description: translate('workspace.xero.purchaseBillDate'),
            onPress: !policyID ? undefined : () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_EXPORT_PURCHASE_BILL_DATE_SELECT.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            title: exportConfiguration?.billDate ? translate(`workspace.xero.exportDate.values.${exportConfiguration.billDate}.label`) : undefined,
            subscribedSettings: [CONST_1.default.XERO_CONFIG.BILL_DATE],
        },
        {
            description: translate('workspace.xero.advancedConfig.purchaseBillStatusTitle'),
            onPress: !policyID ? undefined : () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_BILL_STATUS_SELECTOR.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            title: exportConfiguration?.billStatus?.purchase ? translate(`workspace.xero.invoiceStatus.values.${exportConfiguration.billStatus.purchase}`) : undefined,
            subscribedSettings: [CONST_1.default.XERO_CONFIG.BILL_STATUS],
        },
        {
            description: translate('workspace.xero.exportInvoices'),
            title: translate('workspace.xero.salesInvoice'),
            interactive: false,
            shouldShowRightIcon: false,
            helperText: translate('workspace.xero.exportInvoicesDescription'),
        },
        {
            description: translate('workspace.accounting.exportCompanyCard'),
            title: translate('workspace.xero.bankTransactions'),
            shouldShowRightIcon: false,
            interactive: false,
            helperText: translate('workspace.xero.exportDeepDiveCompanyCard'),
        },
        {
            description: translate('workspace.xero.xeroBankAccount'),
            onPress: () => (!policyID ? undefined : Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_EXPORT_BANK_ACCOUNT_SELECT.getRoute(policyID, Navigation_1.default.getActiveRoute()))),
            title: selectedBankAccountName,
            subscribedSettings: [CONST_1.default.XERO_CONFIG.NON_REIMBURSABLE_ACCOUNT],
        },
    ];
    return (<ConnectionLayout_1.default displayName={XeroExportConfigurationPage.displayName} headerTitle="workspace.accounting.export" headerSubtitle={currentXeroOrganizationName} title="workspace.xero.exportDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} policyID={policyID} onBackButtonPress={goBack} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.XERO}>
            {menuItems.map((menuItem) => (<OfflineWithFeedback_1.default key={menuItem.description} pendingAction={(0, PolicyUtils_1.settingsPendingAction)(menuItem?.subscribedSettings ?? [], pendingFields)}>
                    <MenuItemWithTopDescription_1.default title={menuItem.title} interactive={menuItem?.interactive ?? true} description={menuItem.description} shouldShowRightIcon={menuItem?.shouldShowRightIcon ?? true} onPress={menuItem?.onPress} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)(menuItem?.subscribedSettings ?? [], errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} helperText={menuItem?.helperText}/>
                </OfflineWithFeedback_1.default>))}
        </ConnectionLayout_1.default>);
}
XeroExportConfigurationPage.displayName = 'XeroExportConfigurationPage';
exports.default = (0, withPolicyConnections_1.default)(XeroExportConfigurationPage);
