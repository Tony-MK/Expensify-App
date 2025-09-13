"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var expensify_common_1 = require("expensify-common");
var react_1 = require("react");
var Accordion_1 = require("@components/Accordion");
var ConnectionLayout_1 = require("@components/ConnectionLayout");
var MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
var OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
var useAccordionAnimation_1 = require("@hooks/useAccordionAnimation");
var useLocalize_1 = require("@hooks/useLocalize");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var ErrorUtils_1 = require("@libs/ErrorUtils");
var Navigation_1 = require("@libs/Navigation/Navigation");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
var ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
var Xero_1 = require("@userActions/connections/Xero");
var Policy_1 = require("@userActions/Policy/Policy");
var CONST_1 = require("@src/CONST");
var ROUTES_1 = require("@src/ROUTES");
function XeroAdvancedPage(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j;
    var policy = _a.policy;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var policyID = policy === null || policy === void 0 ? void 0 : policy.id;
    var xeroConfig = (_c = (_b = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _b === void 0 ? void 0 : _b.xero) === null || _c === void 0 ? void 0 : _c.config;
    var _k = xeroConfig !== null && xeroConfig !== void 0 ? xeroConfig : {}, pendingFields = _k.pendingFields, errorFields = _k.errorFields, sync = _k.sync;
    var bankAccounts = ((_f = (_e = (_d = policy === null || policy === void 0 ? void 0 : policy.connections) === null || _d === void 0 ? void 0 : _d.xero) === null || _e === void 0 ? void 0 : _e.data) !== null && _f !== void 0 ? _f : {}).bankAccounts;
    var _l = sync !== null && sync !== void 0 ? sync : {}, invoiceCollectionsAccountID = _l.invoiceCollectionsAccountID, reimbursementAccountID = _l.reimbursementAccountID;
    var accountingMethod = (_h = (_g = xeroConfig === null || xeroConfig === void 0 ? void 0 : xeroConfig.export) === null || _g === void 0 ? void 0 : _g.accountingMethod) !== null && _h !== void 0 ? _h : expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.CASH;
    var getSelectedAccountName = (0, react_1.useMemo)(function () { return function (accountID) {
        if (!accountID) {
            return;
        }
        var selectedAccount = (bankAccounts !== null && bankAccounts !== void 0 ? bankAccounts : []).find(function (bank) { return bank.id === accountID; });
        return selectedAccount === null || selectedAccount === void 0 ? void 0 : selectedAccount.name;
    }; }, [bankAccounts]);
    var selectedBankAccountName = getSelectedAccountName(invoiceCollectionsAccountID);
    var selectedBillPaymentAccountName = getSelectedAccountName(reimbursementAccountID);
    var currentXeroOrganizationName = (0, react_1.useMemo)(function () { return (0, PolicyUtils_1.getCurrentXeroOrganizationName)(policy !== null && policy !== void 0 ? policy : undefined); }, [policy]);
    var _m = (0, useAccordionAnimation_1.default)(!!(sync === null || sync === void 0 ? void 0 : sync.syncReimbursedReports)), isAccordionExpanded = _m.isAccordionExpanded, shouldAnimateAccordionSection = _m.shouldAnimateAccordionSection;
    return (<ConnectionLayout_1.default displayName={XeroAdvancedPage.displayName} headerTitle="workspace.accounting.advanced" headerSubtitle={currentXeroOrganizationName} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.pb2, styles.ph5]} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.XERO}>
            <OfflineWithFeedback_1.default pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.AUTO_SYNC, CONST_1.default.XERO_CONFIG.ACCOUNTING_METHOD], xeroConfig === null || xeroConfig === void 0 ? void 0 : xeroConfig.pendingFields)}>
                <MenuItemWithTopDescription_1.default title={((_j = xeroConfig === null || xeroConfig === void 0 ? void 0 : xeroConfig.autoSync) === null || _j === void 0 ? void 0 : _j.enabled) ? translate('common.enabled') : translate('common.disabled')} description={translate('workspace.accounting.autoSync')} shouldShowRightIcon wrapperStyle={[styles.sectionMenuItemTopDescription]} onPress={function () { return Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_AUTO_SYNC.getRoute(policyID)); }} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([CONST_1.default.XERO_CONFIG.AUTO_SYNC, CONST_1.default.XERO_CONFIG.ACCOUNTING_METHOD], xeroConfig === null || xeroConfig === void 0 ? void 0 : xeroConfig.errorFields)
            ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR
            : undefined} hintText={(function () {
            var _a;
            if (!((_a = xeroConfig === null || xeroConfig === void 0 ? void 0 : xeroConfig.autoSync) === null || _a === void 0 ? void 0 : _a.enabled)) {
                return undefined;
            }
            return translate("workspace.xero.accountingMethods.alternateText.".concat(accountingMethod));
        })()}/>
            </OfflineWithFeedback_1.default>
            <ToggleSettingsOptionRow_1.default key={translate('workspace.accounting.reimbursedReports')} title={translate('workspace.accounting.reimbursedReports')} subtitle={translate('workspace.xero.advancedConfig.reimbursedReportsDescription')} switchAccessibilityLabel={translate('workspace.xero.advancedConfig.reimbursedReportsDescription')} shouldPlaceSubtitleBelowSwitch wrapperStyle={styles.mv3} isActive={!!(sync === null || sync === void 0 ? void 0 : sync.syncReimbursedReports)} onToggle={function () { return (0, Xero_1.updateXeroSyncSyncReimbursedReports)(policyID, !(sync === null || sync === void 0 ? void 0 : sync.syncReimbursedReports), sync === null || sync === void 0 ? void 0 : sync.syncReimbursedReports); }} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.SYNC_REIMBURSED_REPORTS], pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(xeroConfig !== null && xeroConfig !== void 0 ? xeroConfig : {}, CONST_1.default.XERO_CONFIG.SYNC_REIMBURSED_REPORTS)} onCloseError={function () { return (0, Policy_1.clearXeroErrorField)(policyID, CONST_1.default.XERO_CONFIG.SYNC_REIMBURSED_REPORTS); }}/>
            <Accordion_1.default isExpanded={isAccordionExpanded} isToggleTriggered={shouldAnimateAccordionSection}>
                <>
                    <OfflineWithFeedback_1.default pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.REIMBURSEMENT_ACCOUNT_ID], pendingFields)}>
                        <MenuItemWithTopDescription_1.default shouldShowRightIcon title={selectedBillPaymentAccountName ? String(selectedBillPaymentAccountName) : undefined} description={translate('workspace.xero.advancedConfig.xeroBillPaymentAccount')} key={translate('workspace.xero.advancedConfig.xeroBillPaymentAccount')} wrapperStyle={[styles.sectionMenuItemTopDescription]} onPress={function () { return Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_BILL_PAYMENT_ACCOUNT_SELECTOR.getRoute(policyID)); }} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([CONST_1.default.XERO_CONFIG.REIMBURSEMENT_ACCOUNT_ID], errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                    </OfflineWithFeedback_1.default>
                    <OfflineWithFeedback_1.default pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.INVOICE_COLLECTIONS_ACCOUNT_ID], pendingFields)}>
                        <MenuItemWithTopDescription_1.default shouldShowRightIcon title={selectedBankAccountName ? String(selectedBankAccountName) : undefined} description={translate('workspace.xero.advancedConfig.xeroInvoiceCollectionAccount')} key={translate('workspace.xero.advancedConfig.xeroInvoiceCollectionAccount')} wrapperStyle={[styles.sectionMenuItemTopDescription]} onPress={function () { return Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_INVOICE_SELECTOR.getRoute(policyID)); }} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([CONST_1.default.XERO_CONFIG.INVOICE_COLLECTIONS_ACCOUNT_ID], errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                    </OfflineWithFeedback_1.default>
                </>
            </Accordion_1.default>
        </ConnectionLayout_1.default>);
}
XeroAdvancedPage.displayName = 'XeroAdvancedPage';
exports.default = (0, withPolicyConnections_1.default)(XeroAdvancedPage);
