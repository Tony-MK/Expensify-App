"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemWithTopDescription_1 = require("@components/MenuItemWithTopDescription");
const OfflineWithFeedback_1 = require("@components/OfflineWithFeedback");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const PolicyUtils = require("@libs/PolicyUtils");
const withPolicy_1 = require("@pages/workspace/withPolicy");
const Xero_1 = require("@userActions/connections/Xero");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function XeroImportPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id ?? '-1';
    const { importCustomers, importTaxRates, importTrackingCategories, pendingFields, errorFields } = policy?.connections?.xero?.config ?? {};
    const currentXeroOrganizationName = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getCurrentXeroOrganizationName)(policy ?? undefined), [policy]);
    const sections = (0, react_1.useMemo)(() => [
        {
            description: translate('workspace.accounting.accounts'),
            action: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_CHART_OF_ACCOUNTS.getRoute(policyID)),
            title: translate('workspace.accounting.importAsCategory'),
            subscribedSettings: [CONST_1.default.XERO_CONFIG.ENABLE_NEW_CATEGORIES],
        },
        {
            description: translate('workspace.xero.trackingCategories'),
            action: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_TRACKING_CATEGORIES.getRoute(policyID)),
            title: importTrackingCategories ? translate('workspace.accounting.imported') : translate('workspace.xero.notImported'),
            subscribedSettings: [
                CONST_1.default.XERO_CONFIG.IMPORT_TRACKING_CATEGORIES,
                ...(0, Xero_1.getTrackingCategories)(policy).map((category) => `${CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX}${category.id}`),
            ],
        },
        {
            description: translate('workspace.xero.customers'),
            action: () => {
                Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_CUSTOMER.getRoute(policyID));
            },
            title: importCustomers ? translate('workspace.accounting.importTypes.TAG') : translate('workspace.xero.notImported'),
            subscribedSettings: [CONST_1.default.XERO_CONFIG.IMPORT_CUSTOMERS],
        },
        {
            description: translate('workspace.accounting.taxes'),
            action: () => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_XERO_TAXES.getRoute(policyID)),
            title: importTaxRates ? translate('workspace.accounting.imported') : translate('workspace.xero.notImported'),
            subscribedSettings: [CONST_1.default.XERO_CONFIG.IMPORT_TAX_RATES],
        },
    ], [translate, policy, importTrackingCategories, importCustomers, importTaxRates, policyID]);
    return (<ConnectionLayout_1.default displayName={XeroImportPage.displayName} headerTitle="workspace.accounting.import" headerSubtitle={currentXeroOrganizationName} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={styles.pb2} titleStyle={styles.ph5} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.XERO}>
            <Text_1.default style={[styles.ph5, styles.pb5]}>{translate('workspace.xero.importDescription')}</Text_1.default>

            {sections.map((section) => (<OfflineWithFeedback_1.default key={section.description} pendingAction={PolicyUtils.settingsPendingAction(section.subscribedSettings, pendingFields)}>
                    <MenuItemWithTopDescription_1.default title={section.title} description={section.description} shouldShowRightIcon onPress={section.action} brickRoadIndicator={PolicyUtils.areSettingsInErrorFields(section.subscribedSettings, errorFields) ? CONST_1.default.BRICK_ROAD_INDICATOR_STATUS.ERROR : undefined}/>
                </OfflineWithFeedback_1.default>))}
        </ConnectionLayout_1.default>);
}
XeroImportPage.displayName = 'PolicyXeroImportPage';
exports.default = (0, withPolicy_1.default)(XeroImportPage);
