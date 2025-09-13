"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const QuickbooksDesktop_1 = require("@libs/actions/connections/QuickbooksDesktop");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const utils_1 = require("@pages/workspace/accounting/utils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const account = [CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE_ACCOUNT];
const accountOrExportDestination = [CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE_ACCOUNT];
const markChecksToBePrintedOrExportDestination = [CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MARK_CHECKS_TO_BE_PRINTED];
function QuickbooksDesktopOutOfPocketExpenseConfigurationPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id;
    const qbdConfig = policy?.connections?.quickbooksDesktop?.config;
    const reimbursable = qbdConfig?.export.reimbursable;
    const route = (0, native_1.useRoute)();
    const backTo = route.params?.backTo;
    const [exportHintText, accountDescription, accountsList] = (0, react_1.useMemo)(() => {
        let hintText;
        let description;
        const accounts = (0, utils_1.getQBDReimbursableAccounts)(policy?.connections?.quickbooksDesktop);
        switch (reimbursable) {
            case CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.CHECK:
                hintText = translate('workspace.qbd.exportCheckDescription');
                description = translate('workspace.qbd.bankAccount');
                break;
            case CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.JOURNAL_ENTRY:
                hintText = translate('workspace.qbd.exportJournalEntryDescription');
                description = translate('workspace.qbd.account');
                break;
            case CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.VENDOR_BILL:
                hintText = translate('workspace.qbd.exportVendorBillDescription');
                description = translate('workspace.qbd.accountsPayable');
                break;
            default:
                break;
        }
        return [hintText, description, accounts];
    }, [policy?.connections?.quickbooksDesktop, reimbursable, translate]);
    const sections = [
        {
            title: reimbursable ? translate(`workspace.qbd.accounts.${reimbursable}`) : undefined,
            description: translate('workspace.accounting.exportAs'),
            onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES_SELECT.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            hintText: exportHintText,
            subscribedSettings: accountOrExportDestination,
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)(accountOrExportDestination, qbdConfig?.pendingFields),
            brickRoadIndicator: (0, PolicyUtils_1.areSettingsInErrorFields)(accountOrExportDestination, qbdConfig?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
        },
        {
            // We use the logical OR (||) here instead of ?? because `reimbursableAccount` can be an empty string
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            title: accountsList.find(({ id }) => qbdConfig?.export.reimbursableAccount === id)?.name || accountsList.at(0)?.name,
            description: accountDescription,
            onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES_ACCOUNT_SELECT.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            subscribedSettings: account,
            pendingAction: (0, PolicyUtils_1.settingsPendingAction)(account, qbdConfig?.pendingFields),
            brickRoadIndicator: (0, PolicyUtils_1.areSettingsInErrorFields)(account, qbdConfig?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
        },
    ];
    return (<ConnectionLayout_1.default displayName={QuickbooksDesktopOutOfPocketExpenseConfigurationPage.displayName} headerTitle="workspace.accounting.exportOutOfPocket" title="workspace.qbd.exportOutOfPocketExpensesDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBD} onBackButtonPress={() => Navigation_1.default.goBack(backTo ?? ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT.getRoute(policyID))}>
            {sections.map((section, index) => (<OfflineWithFeedback_1.default pendingAction={section.pendingAction} 
        // eslint-disable-next-line react/no-array-index-key
        key={index}>
                    <MenuItemWithTopDescription_1.default title={section.title} description={section.description} onPress={section.onPress} shouldShowRightIcon brickRoadIndicator={section.brickRoadIndicator} hintText={section.hintText}/>
                </OfflineWithFeedback_1.default>))}
            {reimbursable === CONST_1.default.QUICKBOOKS_DESKTOP_REIMBURSABLE_ACCOUNT_TYPE.CHECK && (<ToggleSettingsOptionRow_1.default key={translate('workspace.qbd.exportOutOfPocketExpensesCheckToggle')} title={translate('workspace.qbd.exportOutOfPocketExpensesCheckToggle')} switchAccessibilityLabel={translate('workspace.qbd.exportOutOfPocketExpensesCheckToggle')} shouldPlaceSubtitleBelowSwitch wrapperStyle={[styles.mv3, styles.ph5]} isActive={!!qbdConfig?.markChecksToBePrinted} onToggle={() => {
                if (!policyID) {
                    return;
                }
                (0, QuickbooksDesktop_1.updateQuickbooksDesktopMarkChecksToBePrinted)(policyID, !qbdConfig?.markChecksToBePrinted);
            }} errors={(0, ErrorUtils_1.getLatestErrorField)(qbdConfig, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MARK_CHECKS_TO_BE_PRINTED)} pendingAction={(0, PolicyUtils_1.settingsPendingAction)(markChecksToBePrintedOrExportDestination, qbdConfig?.pendingFields)} onCloseError={() => {
                if (!policyID) {
                    return;
                }
                (0, Policy_1.clearQBDErrorField)(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MARK_CHECKS_TO_BE_PRINTED);
            }}/>)}
        </ConnectionLayout_1.default>);
}
QuickbooksDesktopOutOfPocketExpenseConfigurationPage.displayName = 'QuickbooksDesktopOutOfPocketExpenseConfigurationPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksDesktopOutOfPocketExpenseConfigurationPage);
