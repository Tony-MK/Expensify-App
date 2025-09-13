"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Xero_1 = require("@libs/actions/connections/Xero");
const Policy_1 = require("@libs/actions/Policy/Policy");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function XeroMapTrackingCategoryConfigurationPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const route = (0, native_1.useRoute)();
    const params = route.params;
    const styles = (0, useThemeStyles_1.default)();
    const categoryId = params?.categoryId ?? '';
    const categoryName = decodeURIComponent(params?.categoryName ?? '');
    const policyID = policy?.id;
    const { config } = policy?.connections?.xero ?? {};
    const { trackingCategories } = policy?.connections?.xero?.data ?? {};
    const { mappings } = policy?.connections?.xero?.config ?? {};
    const currentTrackingCategory = trackingCategories?.find((category) => category.id === categoryId);
    const currentTrackingCategoryValue = currentTrackingCategory ? (mappings?.[`${CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX}${currentTrackingCategory.id}`] ?? '') : '';
    const reportFieldTrackingCategories = Object.entries(mappings ?? {}).filter(([key, value]) => key.startsWith(CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX) && value === CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_OPTIONS.REPORT_FIELD);
    const optionsList = (0, react_1.useMemo)(() => Object.values(CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_OPTIONS).map((option) => ({
        value: option,
        text: translate(`workspace.xero.trackingCategoriesOptions.${option.toUpperCase()}`),
        keyForList: option,
        isSelected: option === currentTrackingCategoryValue,
    })), [translate, currentTrackingCategoryValue]);
    const listHeaderComponent = (0, react_1.useMemo)(() => (<react_native_1.View style={[styles.pb2, styles.ph5]}>
                <Text_1.default style={[styles.pb5, styles.textNormal]}>{translate('workspace.xero.mapTrackingCategoryToDescription', { categoryName })}</Text_1.default>
            </react_native_1.View>), [translate, styles.pb2, styles.ph5, styles.pb5, styles.textNormal, categoryName]);
    const updateMapping = (0, react_1.useCallback)((option) => {
        if (option.value !== currentTrackingCategoryValue) {
            if (option.value === CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_OPTIONS.REPORT_FIELD && !(0, PolicyUtils_1.isControlPolicy)(policy)) {
                const backToRoute = ROUTES_1.default.WORKSPACE_UPGRADE.getRoute(policyID, `${CONST_1.default.REPORT_FIELDS_FEATURE.xero.mapping}`, ROUTES_1.default.POLICY_ACCOUNTING_XERO_TRACKING_CATEGORIES.getRoute(policyID));
                Navigation_1.default.navigate(`${backToRoute}&categoryId=${categoryId}`);
                return;
            }
            if (!policyID) {
                return;
            }
            (0, Xero_1.updateXeroMappings)(policyID, categoryId ? { [`${CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX}${categoryId}`]: option.value } : {}, categoryId ? { [`${CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX}${categoryId}`]: currentTrackingCategoryValue } : {});
            if (!reportFieldTrackingCategories.length && option.value === CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_OPTIONS.REPORT_FIELD) {
                (0, Policy_1.enablePolicyReportFields)(policyID, true);
            }
            if (reportFieldTrackingCategories.length === 1 && currentTrackingCategoryValue === CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_OPTIONS.REPORT_FIELD) {
                (0, Policy_1.enablePolicyReportFields)(policyID, false);
            }
        }
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_XERO_TRACKING_CATEGORIES.getRoute(policyID));
    }, [categoryId, currentTrackingCategoryValue, reportFieldTrackingCategories, policy, policyID]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={XeroMapTrackingCategoryConfigurationPage.displayName} sections={optionsList.length ? [{ data: optionsList }] : []} listItem={RadioListItem_1.default} onSelectRow={updateMapping} initiallyFocusedOptionKey={optionsList.find((option) => option.isSelected)?.keyForList} headerContent={listHeaderComponent} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_XERO_TRACKING_CATEGORIES.getRoute(policyID))} headerTitleAlreadyTranslated={translate('workspace.xero.mapTrackingCategoryTo', { categoryName })} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.XERO} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([`${CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX}${categoryId}`], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config ?? {}, `${CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX}${categoryId}`)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearXeroErrorField)(policyID, `${CONST_1.default.XERO_CONFIG.TRACKING_CATEGORY_PREFIX}${categoryId}`)} shouldSingleExecuteRowSelect/>);
}
XeroMapTrackingCategoryConfigurationPage.displayName = 'XeroMapTrackingCategoryConfigurationPage';
exports.default = (0, withPolicyConnections_1.default)(XeroMapTrackingCategoryConfigurationPage);
