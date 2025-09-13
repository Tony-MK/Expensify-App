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
const PolicyUtils_1 = require("@libs/PolicyUtils");
const goBackFromExportConnection_1 = require("@navigation/helpers/goBackFromExportConnection");
const Navigation_1 = require("@navigation/Navigation");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksDesktopExportPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id;
    const policyOwner = policy?.owner ?? '';
    const qbdConfig = policy?.connections?.quickbooksDesktop?.config;
    const errorFields = qbdConfig?.errorFields;
    const route = (0, native_1.useRoute)();
    const backTo = route?.params?.backTo;
    const shouldShowVendorMenuItems = (0, react_1.useMemo)(() => qbdConfig?.export?.nonReimbursable === CONST_1.default.QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.VENDOR_BILL, [qbdConfig?.export?.nonReimbursable]);
    const shouldGoBackToSpecificRoute = (0, react_1.useMemo)(() => qbdConfig?.export?.nonReimbursable === CONST_1.default.QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.CHECK || shouldShowVendorMenuItems, [qbdConfig?.export?.nonReimbursable, shouldShowVendorMenuItems]);
    const goBack = (0, react_1.useCallback)(() => {
        return (0, goBackFromExportConnection_1.default)(shouldGoBackToSpecificRoute, backTo);
    }, [backTo, shouldGoBackToSpecificRoute]);
    const menuItems = [
        {
            description: translate('workspace.accounting.preferredExporter'),
            onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_PREFERRED_EXPORTER.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            // We use the logical OR (||) here instead of ?? because `exporter` could be an empty string
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            title: qbdConfig?.export?.exporter || policyOwner,
            subscribedSettings: [CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.EXPORTER],
        },
        {
            description: translate('workspace.qbd.date'),
            onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT_DATE_SELECT.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            title: qbdConfig?.export?.exportDate ? translate(`workspace.qbd.exportDate.values.${qbdConfig?.export.exportDate}.label`) : undefined,
            subscribedSettings: [CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.EXPORT_DATE],
        },
        {
            description: translate('workspace.accounting.exportOutOfPocket'),
            onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_EXPORT_OUT_OF_POCKET_EXPENSES.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            title: qbdConfig?.export.reimbursable ? translate(`workspace.qbd.accounts.${qbdConfig?.export.reimbursable}`) : undefined,
            subscribedSettings: [
                CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE,
                CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.REIMBURSABLE_ACCOUNT,
                CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.MARK_CHECKS_TO_BE_PRINTED,
            ],
        },
        {
            description: translate('workspace.accounting.exportCompanyCard'),
            onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_DESKTOP_COMPANY_CARD_EXPENSE_ACCOUNT.getRoute(policyID, Navigation_1.default.getActiveRoute())),
            brickRoadIndicator: qbdConfig?.errorFields?.exportCompanyCard ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined,
            title: qbdConfig?.export?.nonReimbursable ? translate(`workspace.qbd.accounts.${qbdConfig?.export?.nonReimbursable}`) : undefined,
            subscribedSettings: [
                CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.NON_REIMBURSABLE,
                CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.NON_REIMBURSABLE_ACCOUNT,
                ...(shouldShowVendorMenuItems ? [CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.SHOULD_AUTO_CREATE_VENDOR] : []),
                ...(shouldShowVendorMenuItems && qbdConfig?.shouldAutoCreateVendor ? [CONST_1.default.QUICKBOOKS_DESKTOP_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR] : []),
            ],
        },
        {
            description: translate('workspace.qbd.exportExpensifyCard'),
            title: translate(`workspace.qbd.accounts.${CONST_1.default.QUICKBOOKS_DESKTOP_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.CREDIT_CARD}`),
            shouldShowRightIcon: false,
            interactive: false,
        },
    ];
    return (<ConnectionLayout_1.default displayName={QuickbooksDesktopExportPage.displayName} headerTitle="workspace.accounting.export" title="workspace.qbd.exportDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBD} onBackButtonPress={goBack}>
            {menuItems.map((menuItem) => (<OfflineWithFeedback_1.default key={menuItem.description} pendingAction={(0, PolicyUtils_1.settingsPendingAction)(menuItem?.subscribedSettings, qbdConfig?.pendingFields)}>
                    <MenuItemWithTopDescription_1.default title={menuItem.title} interactive={menuItem?.interactive ?? true} description={menuItem.description} shouldShowRightIcon={menuItem?.shouldShowRightIcon ?? true} onPress={menuItem?.onPress} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)(menuItem?.subscribedSettings, errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                </OfflineWithFeedback_1.default>))}
            <react_native_1.View style={[styles.renderHTML, styles.ph5, styles.pb5, styles.mt2]}>
                <RenderHTML_1.default html={translate('workspace.common.deepDiveExpensifyCard')}/>
            </react_native_1.View>
        </ConnectionLayout_1.default>);
}
QuickbooksDesktopExportPage.displayName = 'QuickbooksDesktopExportPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksDesktopExportPage);
