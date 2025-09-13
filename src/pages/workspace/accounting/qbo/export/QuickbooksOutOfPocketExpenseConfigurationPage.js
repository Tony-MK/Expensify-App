"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const QuickbooksOnline_1 = require("@libs/actions/connections/QuickbooksOnline");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const account = [CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_ACCOUNT];
const accountOrExportDestination = [CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_EXPORT_DESTINATION, CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_ACCOUNT];
function QuickbooksOutOfPocketExpenseConfigurationPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id;
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    const isLocationEnabled = !!(qboConfig?.syncLocations && qboConfig?.syncLocations !== CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE);
    const isTaxesEnabled = !!qboConfig?.syncTax;
    const route = (0, native_1.useRoute)();
    const backTo = route.params?.backTo;
    const [exportHintText, accountDescription] = (0, react_1.useMemo)(() => {
        let hintText;
        let description;
        switch (qboConfig?.reimbursableExpensesExportDestination) {
            case CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.CHECK:
                hintText = isLocationEnabled ? undefined : translate('workspace.qbo.exportCheckDescription');
                description = translate('workspace.qbo.bankAccount');
                break;
            case CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.JOURNAL_ENTRY:
                hintText = isTaxesEnabled ? undefined : translate('workspace.qbo.exportJournalEntryDescription');
                description = translate('workspace.qbo.account');
                break;
            case CONST_1.default.QUICKBOOKS_REIMBURSABLE_ACCOUNT_TYPE.VENDOR_BILL:
                hintText = isLocationEnabled ? undefined : translate('workspace.qbo.exportVendorBillDescription');
                description = translate('workspace.qbo.accountsPayable');
                break;
            default:
                break;
        }
        return [hintText, description];
    }, [translate, qboConfig?.reimbursableExpensesExportDestination, isLocationEnabled, isTaxesEnabled]);
    const sections = [
        {
            title: qboConfig?.reimbursableExpensesExportDestination ? translate(`workspace.qbo.accounts.${qboConfig?.reimbursableExpensesExportDestination}`) : undefined,
            description: translate('workspace.accounting.exportAs'),
            onPress: () => {
                if (!policyID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES_SELECT.getRoute(policyID, Navigation_1.default.getActiveRoute()));
            },
            hintText: exportHintText,
            subscribedSettings: accountOrExportDestination,
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)(accountOrExportDestination, qboConfig?.pendingFields),
            brickRoadIndicator: (0, PolicyUtils_1.areSettingsInErrorFields)(accountOrExportDestination, qboConfig?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
        },
        {
            title: qboConfig?.reimbursableExpensesAccount?.name,
            description: accountDescription,
            onPress: () => {
                if (!policyID) {
                    return;
                }
                Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES_ACCOUNT_SELECT.getRoute(policyID, Navigation_1.default.getActiveRoute()));
            },
            subscribedSettings: account,
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)(account, qboConfig?.pendingFields),
            brickRoadIndicator: (0, PolicyUtils_1.areSettingsInErrorFields)(account, qboConfig?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
            errors: (0, QuickbooksOnline_1.shouldShowQBOReimbursableExportDestinationAccountError)(policy) && qboConfig?.reimbursableExpensesExportDestination
                ? {
                    [CONST_1.default.QUICKBOOKS_CONFIG.REIMBURSABLE_EXPENSES_EXPORT_DESTINATION]: translate(`workspace.qbo.exportDestinationAccountsMisconfigurationError.${qboConfig.reimbursableExpensesExportDestination}`),
                }
                : undefined,
        },
    ];
    return (<ConnectionLayout_1.default displayName={QuickbooksOutOfPocketExpenseConfigurationPage.displayName} headerTitle="workspace.accounting.exportOutOfPocket" title="workspace.qbo.exportOutOfPocketExpensesDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBO} onBackButtonPress={() => Navigation_1.default.goBack(backTo ?? ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT.getRoute(policyID))}>
            {sections.map((section, index) => (<OfflineWithFeedback_1.default pendingAction={section.pendingAction} 
        // eslint-disable-next-line react/no-array-index-key
        key={index} errors={section.errors} errorRowStyles={[styles.ph5]} canDismissError={false}>
                    <MenuItemWithTopDescription_1.default title={section.title} description={section.description} onPress={section.onPress} shouldShowRightIcon brickRoadIndicator={section.brickRoadIndicator} hintText={section.hintText}/>
                </OfflineWithFeedback_1.default>))}
        </ConnectionLayout_1.default>);
}
QuickbooksOutOfPocketExpenseConfigurationPage.displayName = 'QuickbooksExportOutOfPocketExpensesPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksOutOfPocketExpenseConfigurationPage);
