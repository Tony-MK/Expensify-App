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
const QuickbooksDesktop_1 = require("@libs/actions/connections/QuickbooksDesktop");
const ConnectionUtils_1 = require("@libs/ConnectionUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const utils_1 = require("@pages/workspace/accounting/utils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksDesktopCompanyCardExpenseAccountPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id;
    const qbdConfig = policy?.connections?.quickbooksDesktop?.config;
    const { vendors } = policy?.connections?.quickbooksDesktop?.data ?? {};
    const nonReimbursableBillDefaultVendorObject = vendors?.find((vendor) => vendor.id === qbdConfig?.export?.nonReimbursableBillDefaultVendor);
    const nonReimbursable = qbdConfig?.export?.nonReimbursable;
    const nonReimbursableAccount = qbdConfig?.export?.nonReimbursableAccount;
    const route = (0, native_1.useRoute)();
    const backTo = route.params?.backTo;
    const accountName = (0, react_1.useMemo)(() => {
        const qbdReimbursableAccounts = (0, utils_1.getQBDReimbursableAccounts)(policy?.connections?.quickbooksDesktop, nonReimbursable);
        // We use the logical OR (||) here instead of ?? because `nonReimbursableAccount` can be an empty string
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return qbdReimbursableAccounts.find(({ id }) => nonReimbursableAccount === id)?.name || qbdReimbursableAccounts.at(0)?.name;
    }, [policy?.connections?.quickbooksDesktop, nonReimbursable, nonReimbursableAccount]);
    const { isAccordionExpanded, shouldAnimateAccordionSection } = (0, useAccordionAnimation_1.default)(!!qbdConfig?.shouldAutoCreateVendor);
    const sections = [
        {
            title: nonReimbursable ? translate(`workspace.qbd.accounts.${nonReimbursable}`) : undefined,
            description: translate('workspace.accounting.exportAs'),
            onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_SELECT.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            hintText: nonReimbursable ? translate(`workspace.qbd.accounts.${nonReimbursable}Description`) : undefined,
            subscribedSettings: [CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.NON_REIMBURSABLE],
            keyForList: translate('workspace.accounting.exportAs'),
        },
        {
            title: accountName,
            description: (0, ConnectionUtils_1.getQBDNonReimbursableExportAccountType)(nonReimbursable),
            onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_ACCOUNT_SELECT.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            subscribedSettings: [CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.NON_REIMBURSABLE_ACCOUNT],
            keyForList: (0, ConnectionUtils_1.getQBDNonReimbursableExportAccountType)(nonReimbursable),
        },
    ];
    return (<ConnectionLayout_1.default policyID={policyID} displayName={QuickbooksDesktopCompanyCardExpenseAccountPage.displayName} headerTitle="workspace.accounting.exportCompanyCard" title="workspace.qbd.exportCompanyCardsDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBD} onBackButtonPress={() => Navigation_1.default.goBack(backTo ?? ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT.getRoute(policyID))}>
            {sections.map((section) => (<OfflineWithFeedback_1.default key={section.keyForList} pendingAction={(0, PolicyUtils_1.settingsPendingAction)(section.subscribedSettings, qbdConfig?.pendingFields)}>
                    <MenuItemWithTopDescription_1.default title={section.title} description={section.description} onPress={section.onPress} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)(section.subscribedSettings, qbdConfig?.errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined} shouldShowRightIcon hintText={section.hintText}/>
                </OfflineWithFeedback_1.default>))}
            {nonReimbursable === CONST_1.default.QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.VENDOR_BILL && (<>
                    <ToggleSettingsOptionRow_1.default title={translate('workspace.accounting.defaultVendor')} subtitle={translate('workspace.qbd.defaultVendorDescription')} switchAccessibilityLabel={translate('workspace.qbd.defaultVendorDescription')} shouldPlaceSubtitleBelowSwitch wrapperStyle={[styles.ph5, styles.mb3, styles.mt1]} isActive={!!qbdConfig?.shouldAutoCreateVendor} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.SHOULD_AUTO_CREATE_VENDOR, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.NON_REIMBURSABLE], qbdConfig?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(qbdConfig, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.SHOULD_AUTO_CREATE_VENDOR)} onToggle={(isOn) => {
                if (!policyID) {
                    return;
                }
                (0, QuickbooksDesktop_1.updateQuickbooksDesktopShouldAutoCreateVendor)(policyID, isOn);
            }} onCloseError={() => {
                if (!policyID) {
                    return;
                }
                (0, Policy_1.clearQBDErrorField)(policyID, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.SHOULD_AUTO_CREATE_VENDOR);
            }}/>

                    <Accordion_1.default isExpanded={isAccordionExpanded} isToggleTriggered={shouldAnimateAccordionSection}>
                        <OfflineWithFeedback_1.default pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR, CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.SHOULD_AUTO_CREATE_VENDOR], qbdConfig?.pendingFields)}>
                            <MenuItemWithTopDescription_1.default title={nonReimbursableBillDefaultVendorObject?.name} description={translate('workspace.accounting.defaultVendor')} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_DEFAULT_VENDOR_SELECT.getRoute(policyID))} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR], qbdConfig?.errorFields)
                ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR
                : undefined} shouldShowRightIcon/>
                        </OfflineWithFeedback_1.default>
                    </Accordion_1.default>
                </>)}
        </ConnectionLayout_1.default>);
}
QuickbooksDesktopCompanyCardExpenseAccountPage.displayName = 'QuickbooksDesktopCompanyCardExpenseAccountPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksDesktopCompanyCardExpenseAccountPage);
