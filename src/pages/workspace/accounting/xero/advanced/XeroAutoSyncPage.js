"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Xero_1 = require("@libs/actions/connections/Xero");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function XeroAutoSyncPage({ policy, route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const config = policy?.connections?.xero?.config;
    const { autoSync, pendingFields } = config ?? {};
    const { backTo } = route.params;
    const accountingMethod = config?.export?.accountingMethod ?? expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.CASH;
    const pendingAction = (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.AUTO_SYNC], pendingFields) ?? (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.ACCOUNTING_METHOD], pendingFields);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? ROUTES_1.default.POLICY_ACCOUNTING_XERO_ADVANCED.getRoute(policyID));
    }, [policyID, backTo]);
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED}>
            <ScreenWrapper_1.default includeSafeAreaPaddingBottom={false} style={[styles.defaultModalContainer]} testID={XeroAutoSyncPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding>
                <HeaderWithBackButton_1.default title={translate('common.settings')} onBackButtonPress={goBack}/>
                <ToggleSettingsOptionRow_1.default key={translate('workspace.accounting.autoSync')} title={translate('workspace.accounting.autoSync')} subtitle={translate('workspace.xero.advancedConfig.autoSyncDescription')} switchAccessibilityLabel={translate('workspace.xero.advancedConfig.autoSyncDescription')} isActive={!!autoSync?.enabled} wrapperStyle={[styles.pv2, styles.mh5]} shouldPlaceSubtitleBelowSwitch onToggle={() => (0, Xero_1.updateXeroAutoSync)(policyID, {
            enabled: !autoSync?.enabled,
        }, { enabled: autoSync?.enabled ?? undefined })} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.ENABLED], pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config ?? {}, CONST_1.default.XERO_CONFIG.ENABLED)} onCloseError={() => (0, Policy_1.clearXeroErrorField)(policyID, CONST_1.default.XERO_CONFIG.ENABLED)}/>
                {!!autoSync?.enabled && (<OfflineWithFeedback_1.default pendingAction={pendingAction}>
                        <MenuItemWithTopDescription_1.default title={accountingMethod === expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.ACCRUAL
                ? translate(`workspace.xero.accountingMethods.values.${expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.ACCRUAL}`)
                : translate(`workspace.xero.accountingMethods.values.${expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.CASH}`)} description={translate('workspace.xero.accountingMethods.label')} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_ACCOUNTING_METHOD.getRoute(policyID, backTo))}/>
                    </OfflineWithFeedback_1.default>)}
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
XeroAutoSyncPage.displayName = 'XeroAutoSyncPage';
exports.default = (0, withPolicyConnections_1.default)(XeroAutoSyncPage);
