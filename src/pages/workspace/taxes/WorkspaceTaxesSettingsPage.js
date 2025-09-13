"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const withPolicyAndFullscreenLoading_1 = require("@pages/workspace/withPolicyAndFullscreenLoading");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceTaxesSettingsPage({ route: { params: { policyID }, }, policy, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const menuItems = (0, react_1.useMemo)(() => [
        {
            title: policy?.taxRates?.name,
            description: translate('workspace.taxes.customTaxName'),
            action: () => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_TAXES_SETTINGS_CUSTOM_TAX_NAME.getRoute(policyID)),
            pendingAction: policy?.taxRates?.pendingFields?.name,
        },
        {
            title: policy?.taxRates?.taxes?.[policy?.taxRates?.defaultExternalID]?.name,
            description: translate('workspace.taxes.workspaceDefault'),
            action: () => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_TAXES_SETTINGS_WORKSPACE_CURRENCY_DEFAULT.getRoute(policyID)),
            pendingAction: policy?.taxRates?.pendingFields?.defaultExternalID,
        },
        {
            title: policy?.taxRates?.taxes?.[policy?.taxRates?.foreignTaxDefault]?.name,
            description: translate('workspace.taxes.foreignDefault'),
            action: () => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_TAXES_SETTINGS_FOREIGN_CURRENCY_DEFAULT.getRoute(policyID)),
            pendingAction: policy?.taxRates?.pendingFields?.foreignTaxDefault,
        },
    ], [policy?.taxRates, policyID, translate]);
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_TAXES_ENABLED}>
            <ScreenWrapper_1.default testID={WorkspaceTaxesSettingsPage.displayName} style={styles.defaultModalContainer} enableEdgeToEdgeBottomSafeAreaPadding>
                <ScrollView_1.default contentContainerStyle={styles.flexGrow1} addBottomSafeAreaPadding>
                    <HeaderWithBackButton_1.default title={translate('common.settings')}/>
                    <react_native_1.View style={styles.flex1}>
                        {menuItems.map((item) => (<OfflineWithFeedback_1.default key={item.description} pendingAction={item.pendingAction}>
                                <MenuItemWithTopDescription_1.default shouldShowRightIcon title={item.title} description={item.description} style={[styles.moneyRequestMenuItem]} titleStyle={styles.flex1} onPress={item.action}/>
                            </OfflineWithFeedback_1.default>))}
                    </react_native_1.View>
                </ScrollView_1.default>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceTaxesSettingsPage.displayName = 'WorkspaceTaxesSettingsPage';
exports.default = (0, withPolicyAndFullscreenLoading_1.default)(WorkspaceTaxesSettingsPage);
