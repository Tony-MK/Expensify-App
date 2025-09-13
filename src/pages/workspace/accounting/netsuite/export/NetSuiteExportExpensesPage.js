"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Policy_1 = require("@libs/actions/Policy/Policy");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const utils_1 = require("@pages/workspace/accounting/netsuite/utils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function NetSuiteExportExpensesPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id;
    const route = (0, native_1.useRoute)();
    const params = route.params;
    const isReimbursable = params.expenseType === CONST_1.default.NETSUITE_EXPENSE_TYPE.REIMBURSABLE;
    const config = policy?.connections?.netsuite?.options.config;
    const exportDestinationSettingName = (0, utils_1.exportExpensesDestinationSettingName)(isReimbursable);
    const exportDestination = config?.[exportDestinationSettingName];
    const helperTextType = isReimbursable ? 'reimbursableDescription' : 'nonReimbursableDescription';
    const { vendors, payableList } = policy?.connections?.netsuite?.options?.data ?? {};
    const defaultVendor = (0, react_1.useMemo)(() => (0, PolicyUtils_1.findSelectedVendorWithDefaultSelect)(vendors, config?.defaultVendor), [vendors, config?.defaultVendor]);
    const selectedPayableAccount = (0, react_1.useMemo)(() => (0, PolicyUtils_1.findSelectedBankAccountWithDefaultSelect)(payableList, config?.payableAcct), [payableList, config?.payableAcct]);
    const selectedReimbursablePayableAccount = (0, react_1.useMemo)(() => (0, PolicyUtils_1.findSelectedBankAccountWithDefaultSelect)(payableList, config?.reimbursablePayableAccount), [payableList, config?.reimbursablePayableAccount]);
    const menuItems = [
        {
            description: translate('workspace.accounting.exportAs'),
            onPress: () => {
                if (!policyID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES_DESTINATION_SELECT.getRoute(policyID, params.expenseType, Navigation_1.default.getActiveRoute()));
            },
            title: exportDestination ? translate(`workspace.netsuite.exportDestination.values.${exportDestination}.label`) : undefined,
            subscribedSettings: [exportDestinationSettingName],
            onCloseError: () => (0, Policy_1.clearNetSuiteErrorField)(policyID, exportDestinationSettingName),
            helperText: exportDestination ? translate(`workspace.netsuite.exportDestination.values.${exportDestination}.${helperTextType}`) : undefined,
            shouldParseHelperText: true,
        },
        {
            description: translate('workspace.accounting.defaultVendor'),
            onPress: () => {
                if (!policyID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES_VENDOR_SELECT.getRoute(policyID, params.expenseType, Navigation_1.default.getActiveRoute()));
            },
            title: defaultVendor ? defaultVendor.name : undefined,
            subscribedSettings: [CONST_1.default.NETSUITE_CONFIG.DEFAULT_VENDOR],
            onCloseError: () => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.DEFAULT_VENDOR),
            shouldHide: (0, utils_1.shouldHideReimbursableDefaultVendor)(isReimbursable, config),
        },
        {
            description: translate('workspace.netsuite.nonReimbursableJournalPostingAccount'),
            onPress: () => {
                if (!policyID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES_PAYABLE_ACCOUNT_SELECT.getRoute(policyID, params.expenseType, Navigation_1.default.getActiveRoute()));
            },
            title: selectedPayableAccount ? selectedPayableAccount.name : undefined,
            subscribedSettings: [CONST_1.default.NETSUITE_CONFIG.PAYABLE_ACCT],
            onCloseError: () => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.PAYABLE_ACCT),
            shouldHide: (0, utils_1.shouldHideNonReimbursableJournalPostingAccount)(isReimbursable, config),
        },
        {
            description: translate('workspace.netsuite.reimbursableJournalPostingAccount'),
            onPress: () => {
                if (!policyID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES_PAYABLE_ACCOUNT_SELECT.getRoute(policyID, params.expenseType, Navigation_1.default.getActiveRoute()));
            },
            title: selectedReimbursablePayableAccount ? selectedReimbursablePayableAccount.name : undefined,
            subscribedSettings: [CONST_1.default.NETSUITE_CONFIG.REIMBURSABLE_PAYABLE_ACCOUNT],
            onCloseError: () => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.REIMBURSABLE_PAYABLE_ACCOUNT),
            shouldHide: (0, utils_1.shouldHideReimbursableJournalPostingAccount)(isReimbursable, config),
        },
        {
            description: translate('workspace.netsuite.journalPostingPreference.label'),
            onPress: () => {
                if (!policyID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES_JOURNAL_POSTING_PREFERENCE_SELECT.getRoute(policyID, params.expenseType, Navigation_1.default.getActiveRoute()));
            },
            title: config?.journalPostingPreference
                ? translate(`workspace.netsuite.journalPostingPreference.values.${config.journalPostingPreference}`)
                : translate(`workspace.netsuite.journalPostingPreference.values.${CONST_1.default.NETSUITE_JOURNAL_POSTING_PREFERENCE.JOURNALS_POSTING_INDIVIDUAL_LINE}`),
            subscribedSettings: [CONST_1.default.NETSUITE_CONFIG.JOURNAL_POSTING_PREFERENCE],
            onCloseError: () => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.JOURNAL_POSTING_PREFERENCE),
            shouldHide: (0, utils_1.shouldHideJournalPostingPreference)(isReimbursable, config),
        },
    ];
    return (<ConnectionLayout_1.default displayName={NetSuiteExportExpensesPage.displayName} onBackButtonPress={() => Navigation_1.default.goBack(params.backTo ?? (policyID && ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT.getRoute(policyID)))} headerTitle={`workspace.accounting.${isReimbursable ? 'exportOutOfPocket' : 'exportCompanyCard'}`} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE}>
            {menuItems
            .filter((item) => !item.shouldHide)
            .map((item) => (<OfflineWithFeedback_1.default key={item.description} pendingAction={(0, PolicyUtils_1.settingsPendingAction)(item.subscribedSettings, config?.pendingFields)}>
                        <MenuItemWithTopDescription_1.default title={item.title} description={item.description} shouldShowRightIcon onPress={item?.onPress} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)(item.subscribedSettings, config?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} helperText={item?.helperText} shouldParseHelperText={item.shouldParseHelperText ?? false}/>
                    </OfflineWithFeedback_1.default>))}
        </ConnectionLayout_1.default>);
}
NetSuiteExportExpensesPage.displayName = 'NetSuiteExportExpensesPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteExportExpensesPage);
