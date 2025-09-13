"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Illustrations = require("@components/Icon/Illustrations");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Xero = require("@libs/actions/connections/Xero");
const ErrorUtils = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicy_1 = require("@pages/workspace/withPolicy");
const variables_1 = require("@styles/variables");
const Policy = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function XeroOrganizationConfigurationPage({ policy, route: { params: { organizationID }, }, }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const tenants = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getXeroTenants)(policy ?? undefined), [policy]);
    const xeroConfig = policy?.connections?.xero?.config;
    const currentXeroOrganization = (0, PolicyUtils_1.findCurrentXeroOrganization)(tenants, xeroConfig?.tenantID);
    const policyID = policy?.id ?? '-1';
    const sections = policy?.connections?.xero?.data?.tenants.map((tenant) => ({
        value: tenant.id,
        text: tenant.name,
        keyForList: tenant.id,
        isSelected: tenant.id === organizationID,
    })) ?? [];
    const listHeaderComponent = (0, react_1.useMemo)(() => (<react_native_1.View style={[styles.pb2, styles.ph5]}>
                <Text_1.default style={[styles.pb5, styles.textNormal]}>{translate('workspace.xero.organizationDescription')}</Text_1.default>
            </react_native_1.View>), [translate, styles.pb2, styles.ph5, styles.pb5, styles.textNormal]);
    const saveSelection = ({ keyForList }) => {
        if (!keyForList) {
            return;
        }
        Xero.updateXeroTenantID(policyID, keyForList, xeroConfig?.tenantID);
        Navigation_1.default.goBack();
    };
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.xero.noAccountsFound')} subtitle={translate('workspace.xero.noAccountsFoundDescription')} containerStyle={styles.pb10}/>), [translate, styles.pb10]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={XeroOrganizationConfigurationPage.displayName} sections={sections.length ? [{ data: sections }] : []} listItem={RadioListItem_1.default} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.XERO} onSelectRow={saveSelection} initiallyFocusedOptionKey={currentXeroOrganization?.id} headerContent={listHeaderComponent} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING.getRoute(policyID))} title="workspace.xero.organization" listEmptyContent={listEmptyContent} pendingAction={xeroConfig?.pendingFields?.tenantID} errors={ErrorUtils.getLatestErrorField(xeroConfig ?? {}, CONST_1.default.XERO_CONFIG.TENANT_ID)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => Policy.clearXeroErrorField(policyID, CONST_1.default.XERO_CONFIG.TENANT_ID)} shouldSingleExecuteRowSelect/>);
}
XeroOrganizationConfigurationPage.displayName = 'PolicyXeroOrganizationConfigurationPage';
exports.default = (0, withPolicy_1.default)(XeroOrganizationConfigurationPage);
