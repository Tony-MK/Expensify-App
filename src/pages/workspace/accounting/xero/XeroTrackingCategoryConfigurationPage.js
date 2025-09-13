"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Accordion_1 = require("@components/Accordion");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const useAccordionAnimation_1 = require("@hooks/useAccordionAnimation");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Xero = require("@libs/actions/connections/Xero");
const ErrorUtils = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const StringUtils_1 = require("@libs/StringUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const ToggleSettingsOptionRow_1 = require("@pages/workspace/workflows/ToggleSettingsOptionRow");
const Policy = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function XeroTrackingCategoryConfigurationPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id ?? '-1';
    const xeroConfig = policy?.connections?.xero?.config;
    const isSwitchOn = !!xeroConfig?.importTrackingCategories;
    const { isAccordionExpanded, shouldAnimateAccordionSection } = (0, useAccordionAnimation_1.default)(!!xeroConfig?.importTrackingCategories);
    const menuItems = (0, react_1.useMemo)(() => {
        const trackingCategories = Xero.getTrackingCategories(policy);
        return trackingCategories.map((category) => ({
            id: category.id,
            description: translate('workspace.xero.mapTrackingCategoryTo', { categoryName: category.name }),
            onPress: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_TRACKING_CATEGORIES_MAP.getRoute(policyID, category.id, category.name)),
            title: translate(`workspace.xero.trackingCategoriesOptions.${!StringUtils_1.default.isEmptyString(category.value) ? category.value.toUpperCase() : CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_OPTIONS.DEFAULT}`),
        }));
    }, [translate, policy, policyID]);
    return (<ConnectionLayout_1.default displayName={XeroTrackingCategoryConfigurationPage.displayName} headerTitle="workspace.xero.trackingCategories" title="workspace.xero.trackingCategoriesDescription" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.pb2, styles.ph5]} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.XERO}>
            <ToggleSettingsOptionRow_1.default title={translate('workspace.accounting.import')} switchAccessibilityLabel={translate('workspace.xero.trackingCategories')} isActive={isSwitchOn} wrapperStyle={styles.mv3} onToggle={() => Xero.updateXeroImportTrackingCategories(policyID, !xeroConfig?.importTrackingCategories, xeroConfig?.importTrackingCategories)} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.XERO_CONFIG.IMPORT_TRACKING_CATEGORIES], xeroConfig?.pendingFields)} errors={ErrorUtils.getLatestErrorField(xeroConfig ?? {}, CONST_1.default.XERO_CONFIG.IMPORT_TRACKING_CATEGORIES)} onCloseError={() => Policy.clearXeroErrorField(policyID, CONST_1.default.XERO_CONFIG.IMPORT_TRACKING_CATEGORIES)}/>
            <Accordion_1.default isExpanded={isAccordionExpanded} isToggleTriggered={shouldAnimateAccordionSection}>
                <react_native_1.View>
                    {menuItems.map((menuItem) => (<OfflineWithFeedback_1.default key={menuItem.id} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([`${CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX}${menuItem.id}`], xeroConfig?.pendingFields)}>
                            <MenuItemWithTopDescription_1.default title={menuItem.title} description={menuItem.description} shouldShowRightIcon onPress={menuItem.onPress} wrapperStyle={styles.sectionMenuItemTopDescription} brickRoadIndicator={(0, PolicyUtils_1.areSettingsInErrorFields)([`${CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX}${menuItem.id}`], xeroConfig?.errorFields) ? 'error' : undefined}/>
                        </OfflineWithFeedback_1.default>))}
                </react_native_1.View>
            </Accordion_1.default>
        </ConnectionLayout_1.default>);
}
XeroTrackingCategoryConfigurationPage.displayName = 'XeroTrackCategoriesPage';
exports.default = (0, withPolicyConnections_1.default)(XeroTrackingCategoryConfigurationPage);
