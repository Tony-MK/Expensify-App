"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const Accordion_1 = require("@components/Accordion");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useAccordionAnimation_1 = require("@hooks/useAccordionAnimation");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Xero_1 = require("@userActions/connections/Xero");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function XeroAdvancedPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const xeroConfig = policy?.connections?.xero?.config;
    const { pendingFields, errorFields, sync } = xeroConfig ?? {};
    const { bankAccounts } = policy?.connections?.xero?.data ?? {};
    const { invoiceCollectionsAccountID, reimbursementAccountID } = sync ?? {};
    const accountingMethod = xeroConfig?.export?.accountingMethod ?? expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.CASH;
    const getSelectedAccountName = (0, react_1.useMemo)(() => (accountID) => {
        if (!accountID) {
            return;
        }
        const selectedAccount = (bankAccounts ?? []).find((bank) => bank.id === accountID);
        return selectedAccount?.name;
    }, [bankAccounts]);
    const selectedBankAccountName = getSelectedAccountName(invoiceCollectionsAccountID);
    const selectedBillPaymentAccountName = getSelectedAccountName(reimbursementAccountID);
    const currentXeroOrganizationName = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getCurrentXeroOrganizationName)(policy ?? undefined), [policy]);
    const { isAccordionExpanded, shouldAnimateAccordionSection } = (0, useAccordionAnimation_1.default)(!!sync?.syncReimbursedReports);
    return (<ConnectionLayout_1.default displayName={XeroAdvancedPage.displayName} headerTitle="workspace.accounting.advanced" headerSubtitle={currentXeroOrganizationName} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.pb2, styles.ph5]} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.XERO}>
            <OfflineWithFeedback_1.default pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.AUTO_SYNC, CONST_1.default.XERO_CONFIG.ACCOUNTING_METHOD], xeroConfig?.pendingFields)}>
                <MenuItemWithTopDescription_1.default title={xeroConfig?.autoSync?.enabled ? translate('common.enabled') : translate('common.disabled')} description={translate('workspace.accounting.autoSync')} shouldShowRightIcon wrapperStyle={[styles.sectionMenuItemTopDescription]} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_AUTO_SYNC.getRoute(policyID))} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([CONST_1.default.XERO_CONFIG.AUTO_SYNC, CONST_1.default.XERO_CONFIG.ACCOUNTING_METHOD], xeroConfig?.errorFields)
            ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR
            : undefined} hintText={(() => {
            if (!xeroConfig?.autoSync?.enabled) {
                return undefined;
            }
            return translate(`workspace.xero.accountingMethods.alternateText.${accountingMethod}`);
        })()}/>
            </OfflineWithFeedback_1.default>
            <ToggleSettingsOptionRow_1.default key={translate('workspace.accounting.reimbursedReports')} title={translate('workspace.accounting.reimbursedReports')} subtitle={translate('workspace.xero.advancedConfig.reimbursedReportsDescription')} switchAccessibilityLabel={translate('workspace.xero.advancedConfig.reimbursedReportsDescription')} shouldPlaceSubtitleBelowSwitch wrapperStyle={styles.mv3} isActive={!!sync?.syncReimbursedReports} onToggle={() => (0, Xero_1.updateXeroSyncSyncReimbursedReports)(policyID, !sync?.syncReimbursedReports, sync?.syncReimbursedReports)} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.SYNC_REIMBURSED_REPORTS], pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(xeroConfig ?? {}, CONST_1.default.XERO_CONFIG.SYNC_REIMBURSED_REPORTS)} onCloseError={() => (0, Policy_1.clearXeroErrorField)(policyID, CONST_1.default.XERO_CONFIG.SYNC_REIMBURSED_REPORTS)}/>
            <Accordion_1.default isExpanded={isAccordionExpanded} isToggleTriggered={shouldAnimateAccordionSection}>
                <>
                    <OfflineWithFeedback_1.default pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.REIMBURSEMENT_ACCOUNT_ID], pendingFields)}>
                        <MenuItemWithTopDescription_1.default shouldShowRightIcon title={selectedBillPaymentAccountName ? String(selectedBillPaymentAccountName) : undefined} description={translate('workspace.xero.advancedConfig.xeroBillPaymentAccount')} key={translate('workspace.xero.advancedConfig.xeroBillPaymentAccount')} wrapperStyle={[styles.sectionMenuItemTopDescription]} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_BILL_PAYMENT_ACCOUNT_SELECTOR.getRoute(policyID))} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([CONST_1.default.XERO_CONFIG.REIMBURSEMENT_ACCOUNT_ID], errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                    </OfflineWithFeedback_1.default>
                    <OfflineWithFeedback_1.default pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.INVOICE_COLLECTIONS_ACCOUNT_ID], pendingFields)}>
                        <MenuItemWithTopDescription_1.default shouldShowRightIcon title={selectedBankAccountName ? String(selectedBankAccountName) : undefined} description={translate('workspace.xero.advancedConfig.xeroInvoiceCollectionAccount')} key={translate('workspace.xero.advancedConfig.xeroInvoiceCollectionAccount')} wrapperStyle={[styles.sectionMenuItemTopDescription]} onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_INVOICE_SELECTOR.getRoute(policyID))} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([CONST_1.default.XERO_CONFIG.INVOICE_COLLECTIONS_ACCOUNT_ID], errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                    </OfflineWithFeedback_1.default>
                </>
            </Accordion_1.default>
        </ConnectionLayout_1.default>);
}
XeroAdvancedPage.displayName = 'XeroAdvancedPage';
exports.default = (0, withPolicyConnections_1.default)(XeroAdvancedPage);
