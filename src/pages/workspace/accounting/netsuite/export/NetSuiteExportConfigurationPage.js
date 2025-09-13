"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
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
const goBackFromExportConnection_1 = require("@navigation/helpers/goBackFromExportConnection");
const utils_1 = require("@pages/workspace/accounting/netsuite/utils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function NetSuiteExportConfigurationPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const route = (0, native_1.useRoute)();
    const backTo = route?.params?.backTo;
    const policyID = policy?.id;
    const policyOwner = policy?.owner ?? '';
    const { isBetaEnabled } = (0, usePermissions_1.default)();
    const config = policy?.connections?.netsuite?.options.config;
    const shouldGoBackToSpecificRoute = 
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    config?.reimbursableExpensesExportDestination === CONST_1.default.NETSUITE_EXPORT_DESTINATION.EXPENSE_REPORT ||
        config?.nonreimbursableExpensesExportDestination === CONST_1.default.NETSUITE_EXPORT_DESTINATION.EXPENSE_REPORT;
    const goBack = (0, react_1.useCallback)(() => {
        return (0, goBackFromExportConnection_1.default)(shouldGoBackToSpecificRoute, backTo);
    }, [backTo, shouldGoBackToSpecificRoute]);
    const { subsidiaryList, receivableList, taxAccountsList, items } = policy?.connections?.netsuite?.options?.data ?? {};
    const selectedSubsidiary = (0, react_1.useMemo)(() => (subsidiaryList ?? []).find((subsidiary) => subsidiary.internalID === config?.subsidiaryID), [subsidiaryList, config?.subsidiaryID]);
    const selectedReceivable = (0, react_1.useMemo)(() => (0, PolicyUtils_1.findSelectedBankAccountWithDefaultSelect)(receivableList, config?.receivableAccount), [receivableList, config?.receivableAccount]);
    const selectedItem = (0, react_1.useMemo)(() => (0, PolicyUtils_1.findSelectedInvoiceItemWithDefaultSelect)(items, config?.invoiceItem), [items, config?.invoiceItem]);
    const invoiceItemValue = (0, react_1.useMemo)(() => {
        if (!config?.invoiceItemPreference) {
            return translate('workspace.netsuite.invoiceItem.values.create.label');
        }
        if (config.invoiceItemPreference === CONST_1.default.NETSUITE_INVOICE_ITEM_PREFERENCE.CREATE) {
            return translate('workspace.netsuite.invoiceItem.values.create.label');
        }
        if (!selectedItem) {
            return translate('workspace.netsuite.invoiceItem.values.select.label');
        }
        return selectedItem.name;
    }, [config?.invoiceItemPreference, selectedItem, translate]);
    const selectedTaxPostingAccount = (0, react_1.useMemo)(() => (0, PolicyUtils_1.findSelectedTaxAccountWithDefaultSelect)(taxAccountsList, config?.taxPostingAccount), [taxAccountsList, config?.taxPostingAccount]);
    const selectedProvTaxPostingAccount = (0, react_1.useMemo)(() => (0, PolicyUtils_1.findSelectedTaxAccountWithDefaultSelect)(taxAccountsList, config?.provincialTaxPostingAccount), [taxAccountsList, config?.provincialTaxPostingAccount]);
    const menuItems = [
        {
            type: 'menuitem',
            title: config?.exporter ?? policyOwner,
            description: translate('workspace.accounting.preferredExporter'),
            onPress: !policyID
                ? undefined
                : () => {
                    Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_PREFERRED_EXPORTER_SELECT.getRoute(policyID, Navigation_1.default.getActiveRoute()));
                },
            subscribedSettings: [CONST_1.default.NETSUITE_CONFIG.EXPORTER],
        },
        {
            type: 'divider',
            key: 'divider1',
        },
        {
            type: 'menuitem',
            title: config?.exportDate
                ? translate(`workspace.netsuite.exportDate.values.${config.exportDate}.label`)
                : translate(`workspace.netsuite.exportDate.values.${CONST_1.default.NETSUITE_EXPORT_DATE.LAST_EXPENSE}.label`),
            description: translate('workspace.accounting.exportDate'),
            onPress: () => (!policyID ? undefined : Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_DATE_SELECT.getRoute(policyID, Navigation_1.default.getActiveRoute()))),
            subscribedSettings: [CONST_1.default.NETSUITE_CONFIG.EXPORT_DATE],
        },
        {
            type: 'menuitem',
            title: config?.reimbursableExpensesExportDestination ? translate(`workspace.netsuite.exportDestination.values.${config.reimbursableExpensesExportDestination}.label`) : undefined,
            description: translate('workspace.accounting.exportOutOfPocket'),
            onPress: !policyID
                ? undefined
                : () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES.getRoute(policyID, CONST_1.default.NETSUITE_EXPENSE_TYPE.REIMBURSABLE, Navigation_1.default.getActiveRoute())),
            subscribedSettings: [
                CONST_1.default.NETSUITE_CONFIG.REIMBURSABLE_EXPENSES_EXPORT_DESTINATION,
                ...(!(0, utils_1.shouldHideReimbursableDefaultVendor)(true, config) ? [CONST_1.default.NETSUITE_CONFIG.DEFAULT_VENDOR] : []),
                ...(!(0, utils_1.shouldHideNonReimbursableJournalPostingAccount)(true, config) ? [CONST_1.default.NETSUITE_CONFIG.PAYABLE_ACCT] : []),
                ...(!(0, utils_1.shouldHideReimbursableJournalPostingAccount)(true, config) ? [CONST_1.default.NETSUITE_CONFIG.REIMBURSABLE_PAYABLE_ACCOUNT] : []),
                ...(!(0, utils_1.shouldHideJournalPostingPreference)(true, config) ? [CONST_1.default.NETSUITE_CONFIG.JOURNAL_POSTING_PREFERENCE] : []),
            ],
        },
        {
            type: 'menuitem',
            title: config?.nonreimbursableExpensesExportDestination
                ? translate(`workspace.netsuite.exportDestination.values.${config.nonreimbursableExpensesExportDestination}.label`)
                : undefined,
            description: translate('workspace.accounting.exportCompanyCard'),
            onPress: !policyID
                ? undefined
                : () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES.getRoute(policyID, CONST_1.default.NETSUITE_EXPENSE_TYPE.NON_REIMBURSABLE, Navigation_1.default.getActiveRoute())),
            subscribedSettings: [
                CONST_1.default.NETSUITE_CONFIG.NON_REIMBURSABLE_EXPENSES_EXPORT_DESTINATION,
                ...(!(0, utils_1.shouldHideReimbursableDefaultVendor)(false, config) ? [CONST_1.default.NETSUITE_CONFIG.DEFAULT_VENDOR] : []),
                ...(!(0, utils_1.shouldHideNonReimbursableJournalPostingAccount)(false, config) ? [CONST_1.default.NETSUITE_CONFIG.PAYABLE_ACCT] : []),
                ...(!(0, utils_1.shouldHideReimbursableJournalPostingAccount)(false, config) ? [CONST_1.default.NETSUITE_CONFIG.REIMBURSABLE_PAYABLE_ACCOUNT] : []),
                ...(!(0, utils_1.shouldHideJournalPostingPreference)(false, config) ? [CONST_1.default.NETSUITE_CONFIG.JOURNAL_POSTING_PREFERENCE] : []),
            ],
        },
        {
            type: 'divider',
            key: 'divider2',
        },
        {
            type: 'menuitem',
            title: selectedReceivable ? selectedReceivable.name : undefined,
            description: translate('workspace.netsuite.exportInvoices'),
            onPress: !policyID ? undefined : () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_RECEIVABLE_ACCOUNT_SELECT.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            subscribedSettings: [CONST_1.default.NETSUITE_CONFIG.RECEIVABLE_ACCOUNT],
        },
        {
            type: 'menuitem',
            title: invoiceItemValue,
            description: translate('workspace.netsuite.invoiceItem.label'),
            onPress: !policyID ? undefined : () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_INVOICE_ITEM_PREFERENCE_SELECT.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            subscribedSettings: [CONST_1.default.NETSUITE_CONFIG.INVOICE_ITEM_PREFERENCE, ...((0, utils_1.shouldShowInvoiceItemMenuItem)(config) ? [CONST_1.default.NETSUITE_CONFIG.INVOICE_ITEM] : [])],
        },
        {
            type: 'divider',
            key: 'divider3',
        },
        {
            type: 'menuitem',
            title: selectedProvTaxPostingAccount ? selectedProvTaxPostingAccount.name : undefined,
            description: translate('workspace.netsuite.journalEntriesProvTaxPostingAccount'),
            onPress: !policyID ? undefined : () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_PROVINCIAL_TAX_POSTING_ACCOUNT_SELECT.getRoute(policyID)),
            subscribedSettings: [CONST_1.default.NETSUITE_CONFIG.PROVINCIAL_TAX_POSTING_ACCOUNT],
            shouldHide: (0, utils_1.shouldHideProvincialTaxPostingAccountSelect)(selectedSubsidiary, config),
        },
        {
            type: 'menuitem',
            title: selectedTaxPostingAccount ? selectedTaxPostingAccount.name : undefined,
            description: translate('workspace.netsuite.journalEntriesTaxPostingAccount'),
            onPress: !policyID ? undefined : () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_TAX_POSTING_ACCOUNT_SELECT.getRoute(policyID)),
            subscribedSettings: [CONST_1.default.NETSUITE_CONFIG.TAX_POSTING_ACCOUNT],
            shouldHide: (0, utils_1.shouldHideTaxPostingAccountSelect)(isBetaEnabled(CONST_1.default.BETAS.NETSUITE_USA_TAX), selectedSubsidiary, config),
        },
        {
            type: 'toggle',
            title: translate('workspace.netsuite.foreignCurrencyAmount'),
            isActive: !!config?.allowForeignCurrency,
            switchAccessibilityLabel: translate('workspace.netsuite.foreignCurrencyAmount'),
            onToggle: () => (!policyID ? null : (0, NetSuiteCommands_1.updateNetSuiteAllowForeignCurrency)(policyID, !config?.allowForeignCurrency, config?.allowForeignCurrency)),
            onCloseError: !policyID ? undefined : () => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.ALLOW_FOREIGN_CURRENCY),
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.ALLOW_FOREIGN_CURRENCY], config?.pendingFields),
            errors: (0, ErrorUtils_1.getLatestErrorField)(config, CONST_1.default.NETSUITE_CONFIG.ALLOW_FOREIGN_CURRENCY),
            shouldHide: (0, utils_1.shouldHideExportForeignCurrencyAmount)(config),
        },
        {
            type: 'toggle',
            title: translate('workspace.netsuite.exportToNextOpenPeriod'),
            isActive: !!config?.exportToNextOpenPeriod,
            switchAccessibilityLabel: translate('workspace.netsuite.exportToNextOpenPeriod'),
            onCloseError: !policyID ? undefined : () => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.EXPORT_TO_NEXT_OPEN_PERIOD),
            onToggle: () => (!policyID ? null : (0, NetSuiteCommands_1.updateNetSuiteExportToNextOpenPeriod)(policyID, !config?.exportToNextOpenPeriod, config?.exportToNextOpenPeriod ?? false)),
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.EXPORT_TO_NEXT_OPEN_PERIOD], config?.pendingFields),
            errors: (0, ErrorUtils_1.getLatestErrorField)(config, CONST_1.default.NETSUITE_CONFIG.EXPORT_TO_NEXT_OPEN_PERIOD),
        },
    ];
    return (<ConnectionLayout_1.default displayName={NetSuiteExportConfigurationPage.displayName} headerTitle="workspace.accounting.export" headerSubtitle={config?.subsidiary ?? ''} title="workspace.netsuite.exportDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} policyID={policyID} onBackButtonPress={goBack} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE}>
            {menuItems
            .filter((item) => !item.shouldHide)
            .map((item) => {
            switch (item.type) {
                case 'divider':
                    return (<react_native_1.View key={item.key} style={styles.dividerLine}/>);
                case 'toggle':
                    // eslint-disable-next-line no-case-declarations
                    const { type, shouldHide, ...rest } = item;
                    return (<ToggleSettingsOptionRow_1.default key={rest.title} 
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...rest} wrapperStyle={[styles.mv3, styles.ph5]}/>);
                default:
                    return (<OfflineWithFeedback_1.default key={item.description} pendingAction={(0, PolicyUtils_1.settingsPendingAction)(item.subscribedSettings, config?.pendingFields)}>
                                    <MenuItemWithTopDescription_1.default title={item.title} description={item.description} shouldShowRightIcon onPress={item?.onPress} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)(item.subscribedSettings, config?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                                </OfflineWithFeedback_1.default>);
            }
        })}
        </ConnectionLayout_1.default>);
}
NetSuiteExportConfigurationPage.displayName = 'NetSuiteExportConfigurationPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteExportConfigurationPage);
