"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const Accordion_1 = require("@components/Accordion");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const useAccordionAnimation_1 = require("@hooks/useAccordionAnimation");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const NetSuiteCommands_1 = require("@libs/actions/connections/NetSuiteCommands");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function NetSuiteAutoSyncPage({ policy, route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const config = policy?.connections?.netsuite?.options?.config;
    const autoSyncConfig = policy?.connections?.netsuite?.config;
    const policyID = route.params.policyID;
    const { backTo } = route.params;
    const accountingMethod = policy?.connections?.netsuite?.options?.config?.accountingMethod;
    const pendingAction = (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.AUTO_SYNC], autoSyncConfig?.pendingFields) ?? (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.ACCOUNTING_METHOD], config?.pendingFields);
    const { isAccordionExpanded, shouldAnimateAccordionSection } = (0, useAccordionAnimation_1.default)(!!autoSyncConfig?.autoSync?.enabled);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_ADVANCED.getRoute(policyID));
    }, [policyID, backTo]);
    return (<AccessOrNotFoundWrapper_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CATEGORIES_ENABLED}>
            <ScreenWrapper_1.default style={[styles.defaultModalContainer]} testID={NetSuiteAutoSyncPage.displayName} offlineIndicatorStyle={styles.mtAuto}>
                <HeaderWithBackButton_1.default title={translate('common.settings')} onBackButtonPress={goBack}/>
                <ToggleSettingsOptionRow_1.default title={translate('workspace.accounting.autoSync')} 
    // wil be converted to translate and spanish translation too
    subtitle={translate('workspace.accounting.autoSyncDescription')} isActive={!!autoSyncConfig?.autoSync?.enabled} wrapperStyle={[styles.pv2, styles.mh5]} switchAccessibilityLabel={translate('workspace.netsuite.advancedConfig.autoSyncDescription')} shouldPlaceSubtitleBelowSwitch onCloseError={() => (0, Policy_1.clearNetSuiteAutoSyncErrorField)(policyID)} onToggle={(isEnabled) => (0, NetSuiteCommands_1.updateNetSuiteAutoSync)(policyID, isEnabled)} pendingAction={pendingAction} errors={(0, ErrorUtils_1.getLatestErrorField)(autoSyncConfig, CONST_1.default.NETSUITE_CONFIG.AUTO_SYNC)}/>

                <Accordion_1.default isExpanded={isAccordionExpanded} isToggleTriggered={shouldAnimateAccordionSection}>
                    <OfflineWithFeedback_1.default pendingAction={pendingAction}>
                        <MenuItemWithTopDescription_1.default title={accountingMethod === expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.ACCRUAL
            ? translate(`workspace.netsuite.advancedConfig.accountingMethods.values.${expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.ACCRUAL}`)
            : translate(`workspace.netsuite.advancedConfig.accountingMethods.values.${expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.CASH}`)} description={translate('workspace.netsuite.advancedConfig.accountingMethods.label')} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_ACCOUNTING_METHOD.getRoute(policyID, backTo))}/>
                    </OfflineWithFeedback_1.default>
                </Accordion_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
NetSuiteAutoSyncPage.displayName = 'NetSuiteAutoSyncPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteAutoSyncPage);
