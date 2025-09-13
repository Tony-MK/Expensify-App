"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const MenuItemList_1 = require("@components/MenuItemList");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const connections_1 = require("@libs/actions/connections");
const Policy_1 = require("@libs/actions/Policy/Policy");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function NetSuiteExistingConnectionsPage({ route }) {
    const { translate, datetimeToRelative } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policiesConnectedToSageNetSuite = (0, Policy_1.getAdminPoliciesConnectedToNetSuite)();
    const policyID = route.params.policyID;
    const menuItems = policiesConnectedToSageNetSuite.map((policy) => {
        const lastSuccessfulSyncDate = policy.connections?.netsuite.lastSyncDate;
        const date = lastSuccessfulSyncDate ? datetimeToRelative(lastSuccessfulSyncDate) : undefined;
        return {
            title: policy.name,
            key: policy.id,
            avatarID: policy.id,
            icon: policy.avatarURL ? policy.avatarURL : (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policy.name),
            iconType: CONST_1.default.ICON_TYPE_WORKSPACE,
            description: date
                ? translate('workspace.common.lastSyncDate', {
                    connectionName: CONST_1.default.POLICY.CONNECTIONS.NAME_USER_FRIENDLY.netsuite,
                    formattedDate: date,
                })
                : translate('workspace.accounting.netsuite'),
            onPress: () => {
                (0, connections_1.copyExistingPolicyConnection)(policy.id, policyID, CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE);
                Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_ACCOUNTING.getRoute(policyID));
            },
        };
    });
    return (<ConnectionLayout_1.default displayName={NetSuiteExistingConnectionsPage.displayName} headerTitle="workspace.common.existingConnections" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.flex1]} titleStyle={styles.ph5} shouldLoadForEmptyConnection connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_ACCOUNTING.getRoute(policyID))}>
            <react_native_1.View style={[styles.flex1]}>
                <MenuItemList_1.default menuItems={menuItems} shouldUseSingleExecution/>
            </react_native_1.View>
        </ConnectionLayout_1.default>);
}
NetSuiteExistingConnectionsPage.displayName = 'NetSuiteExistingConnectionsPage';
exports.default = NetSuiteExistingConnectionsPage;
