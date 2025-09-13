"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountingIntegrationData = getAccountingIntegrationData;
exports.getSynchronizationErrorMessage = getSynchronizationErrorMessage;
exports.getQBDReimbursableAccounts = getQBDReimbursableAccounts;
const react_1 = require("react");
const ConnectToNetSuiteFlow_1 = require("@components/ConnectToNetSuiteFlow");
const ConnectToQuickbooksDesktopFlow_1 = require("@components/ConnectToQuickbooksDesktopFlow");
const ConnectToQuickbooksOnlineFlow_1 = require("@components/ConnectToQuickbooksOnlineFlow");
const ConnectToSageIntacctFlow_1 = require("@components/ConnectToSageIntacctFlow");
const ConnectToXeroFlow_1 = require("@components/ConnectToXeroFlow");
const Expensicons = require("@components/Icon/Expensicons");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const connections_1 = require("@libs/actions/connections");
const Policy_1 = require("@libs/actions/Policy/Policy");
const getPlatform_1 = require("@libs/getPlatform");
const Localize_1 = require("@libs/Localize");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const Xero_1 = require("@userActions/connections/Xero");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const utils_1 = require("./netsuite/utils");
const platform = (0, getPlatform_1.default)(true);
const isMobile = [CONST_1.default.PLATFORM.MOBILE_WEB, CONST_1.default.PLATFORM.IOS, CONST_1.default.PLATFORM.ANDROID].some((value) => value === platform);
function getAccountingIntegrationData(connectionName, policyID, translate, policy, key, integrationToDisconnect, shouldDisconnectIntegrationBeforeConnecting, canUseNetSuiteUSATax) {
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    const netsuiteConfig = policy?.connections?.netsuite?.options?.config;
    const netsuiteSelectedSubsidiary = (policy?.connections?.netsuite?.options?.data?.subsidiaryList ?? []).find((subsidiary) => subsidiary.internalID === netsuiteConfig?.subsidiaryID);
    const hasPoliciesConnectedToSageIntacct = !!(0, Policy_1.getAdminPoliciesConnectedToSageIntacct)().length;
    const getBackToAfterWorkspaceUpgradeRouteForIntacct = () => {
        if (integrationToDisconnect) {
            return ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyID, connectionName, integrationToDisconnect, shouldDisconnectIntegrationBeforeConnecting);
        }
        if (hasPoliciesConnectedToSageIntacct) {
            return ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_EXISTING_CONNECTIONS.getRoute(policyID);
        }
        return ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_PREREQUISITES.getRoute(policyID);
    };
    const getBackToAfterWorkspaceUpgradeRouteForQBD = () => {
        if (integrationToDisconnect) {
            return ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyID, connectionName, integrationToDisconnect, shouldDisconnectIntegrationBeforeConnecting);
        }
        if (isMobile) {
            return ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_SETUP_REQUIRED_DEVICE_MODAL.getRoute(policyID);
        }
        return ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_SETUP_MODAL.getRoute(policyID);
    };
    switch (connectionName) {
        case CONST_1.default.POLICY.CONNECTIONS.NAME.QBO:
            return {
                title: translate('workspace.accounting.qbo'),
                icon: Expensicons.QBOSquare,
                setupConnectionFlow: (<ConnectToQuickbooksOnlineFlow_1.default policyID={policyID} key={key}/>),
                onImportPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_IMPORT.getRoute(policyID)),
                subscribedImportSettings: [
                    CONST_1.default.QUICKBOOKS_CONFIG.ENABLE_NEW_CATEGORIES,
                    CONST_1.default.QUICKBOOKS_CONFIG.SYNC_CLASSES,
                    CONST_1.default.QUICKBOOKS_CONFIG.SYNC_CUSTOMERS,
                    CONST_1.default.QUICKBOOKS_CONFIG.SYNC_LOCATIONS,
                    CONST_1.default.QUICKBOOKS_CONFIG.SYNC_TAX,
                ],
                onExportPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT.getRoute(policyID)),
                subscribedExportSettings: [
                    CONST_1.default.QUICKBOOKS_CONFIG.EXPORT,
                    CONST_1.default.QUICKBOOKS_CONFIG.EXPORT_DATE,
                    CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_EXPORT_DESTINATION,
                    CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_ACCOUNT,
                    CONST_1.default.QUICKBOOKS_CONFIG.RECEIVABLE_ACCOUNT,
                    CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_EXPENSES_EXPORT_DESTINATION,
                    CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_EXPENSE_ACCOUNT,
                    ...(qboConfig?.nonReimbursableExpensesExportDestination === CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.VENDOR_BILL
                        ? [CONST_1.default.QUICKBOOKS_CONFIG.AUTO_CREATE_VENDOR]
                        : []),
                    ...(qboConfig?.nonReimbursableExpensesExportDestination === CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.VENDOR_BILL &&
                        policy?.connections?.quickbooksOnline?.config?.autoCreateVendor
                        ? [CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR]
                        : []),
                ],
                onCardReconciliationPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_ACCOUNTING_CARD_RECONCILIATION.getRoute(policyID, CONST_1.default.POLICY.CONNECTIONS.ROUTE.QBO)),
                onAdvancedPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_ADVANCED.getRoute(policyID)),
                subscribedAdvancedSettings: [
                    CONST_1.default.QUICKBOOKS_CONFIG.COLLECTION_ACCOUNT_ID,
                    CONST_1.default.QUICKBOOKS_CONFIG.AUTO_SYNC,
                    CONST_1.default.QUICKBOOKS_CONFIG.SYNC_PEOPLE,
                    CONST_1.default.QUICKBOOKS_CONFIG.AUTO_CREATE_VENDOR,
                    ...(qboConfig?.collectionAccountID ? [CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSEMENT_ACCOUNT_ID, CONST_1.default.QUICKBOOKS_CONFIG.COLLECTION_ACCOUNT_ID] : []),
                ],
                pendingFields: { ...qboConfig?.pendingFields, ...policy?.connections?.quickbooksOnline?.config?.pendingFields },
                errorFields: { ...qboConfig?.errorFields, ...policy?.connections?.quickbooksOnline?.config?.errorFields },
            };
        case CONST_1.default.POLICY.CONNECTIONS.NAME.XERO:
            return {
                title: translate('workspace.accounting.xero'),
                icon: Expensicons.XeroSquare,
                setupConnectionFlow: (<ConnectToXeroFlow_1.default policyID={policyID} key={key}/>),
                onImportPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_IMPORT.getRoute(policyID)),
                subscribedImportSettings: [
                    CONST_1.default.XERO_CONFIG.ENABLE_NEW_CATEGORIES,
                    CONST_1.default.XERO_CONFIG.IMPORT_TRACKING_CATEGORIES,
                    CONST_1.default.XERO_CONFIG.IMPORT_CUSTOMERS,
                    CONST_1.default.XERO_CONFIG.IMPORT_TAX_RATES,
                    ...(0, Xero_1.getTrackingCategories)(policy).map((category) => `${CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX}${category.id}`),
                ],
                onExportPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_EXPORT.getRoute(policyID)),
                subscribedExportSettings: [CONST_1.default.XERO_CONFIG.EXPORTER, CONST_1.default.XERO_CONFIG.BILL_DATE, CONST_1.default.XERO_CONFIG.BILL_STATUS, CONST_1.default.XERO_CONFIG.NON_REIMBURSABLE_ACCOUNT],
                onCardReconciliationPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_ACCOUNTING_CARD_RECONCILIATION.getRoute(policyID, CONST_1.default.POLICY.CONNECTIONS.ROUTE.XERO)),
                onAdvancedPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_ADVANCED.getRoute(policyID)),
                subscribedAdvancedSettings: [
                    CONST_1.default.XERO_CONFIG.ENABLED,
                    CONST_1.default.XERO_CONFIG.SYNC_REIMBURSED_REPORTS,
                    CONST_1.default.XERO_CONFIG.REIMBURSEMENT_ACCOUNT_ID,
                    CONST_1.default.XERO_CONFIG.INVOICE_COLLECTIONS_ACCOUNT_ID,
                ],
                pendingFields: policy?.connections?.xero?.config?.pendingFields,
                errorFields: policy?.connections?.xero?.config?.errorFields,
            };
        case CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE:
            return {
                title: translate('workspace.accounting.netsuite'),
                icon: Expensicons.NetSuiteSquare,
                setupConnectionFlow: (<ConnectToNetSuiteFlow_1.default policyID={policyID} key={key}/>),
                onImportPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_IMPORT.getRoute(policyID)),
                subscribedImportSettings: [
                    ...CONST_1.default.NETSUITE_CONFIG.IMPORT_FIELDS,
                    CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.CUSTOMERS,
                    CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CUSTOMER_MAPPINGS.JOBS,
                    CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.CROSS_SUBSIDIARY_CUSTOMERS,
                    ...((0, PolicyUtils_1.canUseTaxNetSuite)(canUseNetSuiteUSATax, netsuiteSelectedSubsidiary?.country) ? [CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.SYNC_TAX] : []),
                    ...(0, utils_1.getImportCustomFieldsSettings)(CONST_1.default.NETSUITE_CONFIG.IMPORT_CUSTOM_FIELDS.CUSTOM_SEGMENTS, netsuiteConfig),
                    ...(0, utils_1.getImportCustomFieldsSettings)(CONST_1.default.NETSUITE_CONFIG.IMPORT_CUSTOM_FIELDS.CUSTOM_LISTS, netsuiteConfig),
                ],
                onExportPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT.getRoute(policyID)),
                subscribedExportSettings: [
                    CONST_1.default.NETSUITE_CONFIG.EXPORTER,
                    CONST_1.default.NETSUITE_CONFIG.EXPORT_DATE,
                    CONST_1.default.NETSUITE_CONFIG.REIMBURSABLE_EXPENSES_EXPORT_DESTINATION,
                    ...(!(0, utils_1.shouldHideReimbursableDefaultVendor)(true, netsuiteConfig) ? [CONST_1.default.NETSUITE_CONFIG.DEFAULT_VENDOR] : []),
                    ...(!(0, utils_1.shouldHideNonReimbursableJournalPostingAccount)(true, netsuiteConfig) ? [CONST_1.default.NETSUITE_CONFIG.PAYABLE_ACCT] : []),
                    ...(!(0, utils_1.shouldHideReimbursableJournalPostingAccount)(true, netsuiteConfig) ? [CONST_1.default.NETSUITE_CONFIG.REIMBURSABLE_PAYABLE_ACCOUNT] : []),
                    ...(!(0, utils_1.shouldHideJournalPostingPreference)(true, netsuiteConfig) ? [CONST_1.default.NETSUITE_CONFIG.JOURNAL_POSTING_PREFERENCE] : []),
                    CONST_1.default.NETSUITE_CONFIG.NON_REIMBURSABLE_EXPENSES_EXPORT_DESTINATION,
                    ...(!(0, utils_1.shouldHideReimbursableDefaultVendor)(false, netsuiteConfig) ? [CONST_1.default.NETSUITE_CONFIG.DEFAULT_VENDOR] : []),
                    ...(!(0, utils_1.shouldHideNonReimbursableJournalPostingAccount)(false, netsuiteConfig) ? [CONST_1.default.NETSUITE_CONFIG.PAYABLE_ACCT] : []),
                    ...(!(0, utils_1.shouldHideReimbursableJournalPostingAccount)(false, netsuiteConfig) ? [CONST_1.default.NETSUITE_CONFIG.REIMBURSABLE_PAYABLE_ACCOUNT] : []),
                    ...(!(0, utils_1.shouldHideJournalPostingPreference)(false, netsuiteConfig) ? [CONST_1.default.NETSUITE_CONFIG.JOURNAL_POSTING_PREFERENCE] : []),
                    CONST_1.default.NETSUITE_CONFIG.RECEIVABLE_ACCOUNT,
                    CONST_1.default.NETSUITE_CONFIG.INVOICE_ITEM_PREFERENCE,
                    ...((0, utils_1.shouldShowInvoiceItemMenuItem)(netsuiteConfig) ? [CONST_1.default.NETSUITE_CONFIG.INVOICE_ITEM] : []),
                    ...(!(0, utils_1.shouldHideProvincialTaxPostingAccountSelect)(netsuiteSelectedSubsidiary, netsuiteConfig) ? [CONST_1.default.NETSUITE_CONFIG.PROVINCIAL_TAX_POSTING_ACCOUNT] : []),
                    ...(!(0, utils_1.shouldHideTaxPostingAccountSelect)(canUseNetSuiteUSATax, netsuiteSelectedSubsidiary, netsuiteConfig) ? [CONST_1.default.NETSUITE_CONFIG.TAX_POSTING_ACCOUNT] : []),
                    ...(!(0, utils_1.shouldHideExportForeignCurrencyAmount)(netsuiteConfig) ? [CONST_1.default.NETSUITE_CONFIG.ALLOW_FOREIGN_CURRENCY] : []),
                    CONST_1.default.NETSUITE_CONFIG.EXPORT_TO_NEXT_OPEN_PERIOD,
                ],
                onCardReconciliationPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_ACCOUNTING_CARD_RECONCILIATION.getRoute(policyID, CONST_1.default.POLICY.CONNECTIONS.ROUTE.NETSUITE)),
                onAdvancedPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_ADVANCED.getRoute(policyID)),
                subscribedAdvancedSettings: [
                    CONST_1.default.NETSUITE_CONFIG.AUTO_SYNC,
                    CONST_1.default.NETSUITE_CONFIG.ACCOUNTING_METHOD,
                    ...(!(0, utils_1.shouldHideReimbursedReportsSection)(netsuiteConfig)
                        ? [CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.SYNC_REIMBURSED_REPORTS, CONST_1.default.NETSUITE_CONFIG.REIMBURSEMENT_ACCOUNT_ID, CONST_1.default.NETSUITE_CONFIG.COLLECTION_ACCOUNT]
                        : []),
                    CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.SYNC_PEOPLE,
                    CONST_1.default.NETSUITE_CONFIG.AUTO_CREATE_ENTITIES,
                    CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.ENABLE_NEW_CATEGORIES,
                    ...(!(0, utils_1.shouldHideReportsExportTo)(netsuiteConfig) ? [CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.EXPORT_REPORTS_TO] : []),
                    ...(!(0, utils_1.shouldHideExportVendorBillsTo)(netsuiteConfig) ? [CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.EXPORT_VENDOR_BILLS_TO] : []),
                    ...(!(0, utils_1.shouldHideExportJournalsTo)(netsuiteConfig) ? [CONST_1.default.NETSUITE_CONFIG.SYNC_OPTIONS.EXPORT_JOURNALS_TO] : []),
                    CONST_1.default.NETSUITE_CONFIG.APPROVAL_ACCOUNT,
                    CONST_1.default.NETSUITE_CONFIG.CUSTOM_FORM_ID_ENABLED,
                    ...(!(0, utils_1.shouldHideCustomFormIDOptions)(netsuiteConfig)
                        ? [CONST_1.default.NETSUITE_CONFIG.CUSTOM_FORM_ID_TYPE.REIMBURSABLE, CONST_1.default.NETSUITE_CONFIG.CUSTOM_FORM_ID_TYPE.NON_REIMBURSABLE]
                        : []),
                ],
                workspaceUpgradeNavigationDetails: {
                    integrationAlias: CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.netsuite.alias,
                    backToAfterWorkspaceUpgradeRoute: integrationToDisconnect
                        ? ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyID, connectionName, integrationToDisconnect, shouldDisconnectIntegrationBeforeConnecting)
                        : ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_TOKEN_INPUT.getRoute(policyID),
                },
                pendingFields: { ...netsuiteConfig?.pendingFields, ...policy?.connections?.netsuite?.config?.pendingFields, ...policy?.connections?.netsuite?.options?.config?.pendingFields },
                errorFields: { ...netsuiteConfig?.errorFields, ...policy?.connections?.netsuite?.config?.errorFields, ...policy?.connections?.netsuite?.options?.config?.errorFields },
            };
        case CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT:
            return {
                title: translate('workspace.accounting.intacct'),
                icon: Expensicons.IntacctSquare,
                setupConnectionFlow: (<ConnectToSageIntacctFlow_1.default policyID={policyID} key={key}/>),
                onImportPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_IMPORT.getRoute(policyID)),
                subscribedImportSettings: [
                    CONST_1.default.SAGE_INTACCT_CONFIG.SYNC_ITEMS,
                    ...Object.values(CONST_1.default.SAGE_INTACCT_CONFIG.MAPPINGS),
                    CONST_1.default.SAGE_INTACCT_CONFIG.TAX,
                    ...(policy?.connections?.intacct?.config?.mappings?.dimensions ?? []).map((dimension) => `${CONST_1.default.SAGE_INTACCT_CONFIG.DIMENSION_PREFIX}${dimension.dimension}`),
                ],
                onExportPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_EXPORT.getRoute(policyID)),
                subscribedExportSettings: [
                    CONST_1.default.SAGE_INTACCT_CONFIG.EXPORTER,
                    CONST_1.default.SAGE_INTACCT_CONFIG.EXPORT_DATE,
                    CONST_1.default.SAGE_INTACCT_CONFIG.REIMBURSABLE,
                    CONST_1.default.SAGE_INTACCT_CONFIG.REIMBURSABLE_VENDOR,
                    CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE,
                    CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_ACCOUNT,
                    policy?.connections?.intacct?.config?.export?.nonReimbursable === CONST_1.default.SAGE_INTACCT_NON_REIMBURSABLE_EXPENSE_TYPE.VENDOR_BILL
                        ? CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_VENDOR
                        : CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_CREDIT_CARD_VENDOR,
                ],
                onCardReconciliationPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_ACCOUNTING_CARD_RECONCILIATION.getRoute(policyID, CONST_1.default.POLICY.CONNECTIONS.ROUTE.SAGE_INTACCT)),
                onAdvancedPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_ADVANCED.getRoute(policyID)),
                subscribedAdvancedSettings: [
                    CONST_1.default.SAGE_INTACCT_CONFIG.AUTO_SYNC_ENABLED,
                    CONST_1.default.SAGE_INTACCT_CONFIG.IMPORT_EMPLOYEES,
                    CONST_1.default.SAGE_INTACCT_CONFIG.APPROVAL_MODE,
                    CONST_1.default.SAGE_INTACCT_CONFIG.SYNC_REIMBURSED_REPORTS,
                    CONST_1.default.SAGE_INTACCT_CONFIG.REIMBURSEMENT_ACCOUNT_ID,
                ],
                workspaceUpgradeNavigationDetails: {
                    integrationAlias: CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.intacct.alias,
                    backToAfterWorkspaceUpgradeRoute: getBackToAfterWorkspaceUpgradeRouteForIntacct(),
                },
                pendingFields: policy?.connections?.intacct?.config?.pendingFields,
                errorFields: policy?.connections?.intacct?.config?.errorFields,
            };
        case CONST_1.default.POLICY.CONNECTIONS.NAME.QBD:
            return {
                title: translate('workspace.accounting.qbd'),
                icon: Expensicons.QBDSquare,
                setupConnectionFlow: (<ConnectToQuickbooksDesktopFlow_1.default policyID={policyID} key={key}/>),
                onImportPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_IMPORT.getRoute(policyID)),
                onExportPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT.getRoute(policyID)),
                onCardReconciliationPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_ACCOUNTING_CARD_RECONCILIATION.getRoute(policyID, CONST_1.default.POLICY.CONNECTIONS.ROUTE.QBD)),
                onAdvancedPagePress: () => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_ACCOUNTING_QUICKBOOKS_DESKTOP_ADVANCED.getRoute(policyID)),
                subscribedImportSettings: [
                    CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.ENABLE_NEW_CATEGORIES,
                    CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MAPPINGS.CLASSES,
                    CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MAPPINGS.CUSTOMERS,
                    CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.IMPORT_ITEMS,
                ],
                subscribedExportSettings: [
                    CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.EXPORT_DATE,
                    CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.EXPORTER,
                    CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE,
                    CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE_ACCOUNT,
                    CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MARK_CHECKS_TO_BE_PRINTED,
                    CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.NON_REIMBURSABLE,
                    CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.NON_REIMBURSABLE_ACCOUNT,
                    CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR,
                    CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.SHOULD_AUTO_CREATE_VENDOR,
                ],
                subscribedAdvancedSettings: [CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.SHOULD_AUTO_CREATE_VENDOR, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.AUTO_SYNC],
                workspaceUpgradeNavigationDetails: {
                    integrationAlias: CONST_1.default.UPGRADE_FEATURE_INTRO_MAPPING.quickbooksDesktop.alias,
                    backToAfterWorkspaceUpgradeRoute: getBackToAfterWorkspaceUpgradeRouteForQBD(),
                },
            };
        default:
            return undefined;
    }
}
function getSynchronizationErrorMessage(policy, connectionName, isSyncInProgress, translate, styles) {
    if ((0, connections_1.isAuthenticationError)(policy, connectionName)) {
        return (<Text_1.default style={[styles?.formError]}>
                <Text_1.default style={[styles?.formError]}>{translate('workspace.common.authenticationError', { connectionName: CONST_1.default.POLICY.CONNECTIONS.NAME_USER_FRIENDLY[connectionName] })} </Text_1.default>
                {connectionName in CONST_1.default.POLICY.CONNECTIONS.AUTH_HELP_LINKS && (<>
                        <TextLink_1.default style={[styles?.link, styles?.fontSizeLabel]} href={CONST_1.default.POLICY.CONNECTIONS.AUTH_HELP_LINKS[connectionName]}>
                            {translate('workspace.common.learnMore')}
                        </TextLink_1.default>
                        .
                    </>)}
            </Text_1.default>);
    }
    const syncError = (0, Localize_1.translateLocal)('workspace.accounting.syncError', { connectionName });
    const connection = policy?.connections?.[connectionName];
    if (isSyncInProgress || (0, EmptyObject_1.isEmptyObject)(connection?.lastSync) || connection?.lastSync?.isSuccessful !== false || !connection?.lastSync?.errorDate) {
        return;
    }
    return `${syncError} ("${connection?.lastSync?.errorMessage}")`;
}
function getQBDReimbursableAccounts(quickbooksDesktop, reimbursable) {
    const { bankAccounts, journalEntryAccounts, payableAccounts, creditCardAccounts } = quickbooksDesktop?.data ?? {};
    let accounts;
    switch (reimbursable ?? quickbooksDesktop?.config?.export.reimbursable) {
        case CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.CHECK:
            accounts = bankAccounts ?? [];
            break;
        case CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.JOURNAL_ENTRY:
            // Journal entry accounts include payable accounts, other current liabilities, and other current assets
            accounts = [...(payableAccounts ?? []), ...(journalEntryAccounts ?? [])];
            break;
        case CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.VENDOR_BILL:
            accounts = payableAccounts ?? [];
            break;
        case CONST_1.default.QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.CREDIT_CARD:
            accounts = creditCardAccounts ?? [];
            break;
        default:
            accounts = [];
    }
    return accounts;
}
