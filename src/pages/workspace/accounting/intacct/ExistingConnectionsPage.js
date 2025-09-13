"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons_1 = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const MenuItemList_1 = require("@components/MenuItemList");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const connections_1 = require("@libs/actions/connections");
const Policy_1 = require("@libs/actions/Policy/Policy");
const Navigation_1 = require("@libs/Navigation/Navigation");
const ReportUtils_1 = require("@libs/ReportUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function ExistingConnectionsPage({ route }) {
    const { translate, datetimeToRelative } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policiesConnectedToSageIntacct = (0, Policy_1.getAdminPoliciesConnectedToSageIntacct)();
    const policyID = route.params.policyID;
    const menuItems = policiesConnectedToSageIntacct.map((policy) => {
        const lastSuccessfulSyncDate = policy.connections?.intacct.lastSync?.successfulDate;
        const date = lastSuccessfulSyncDate ? datetimeToRelative(lastSuccessfulSyncDate) : undefined;
        return {
            title: policy.name,
            key: policy.id,
            avatarID: policy.id,
            icon: policy.avatarURL ? policy.avatarURL : (0, ReportUtils_1.getDefaultWorkspaceAvatar)(policy.name),
            iconType: CONST_1.default.ICON_TYPE_WORKSPACE,
            shouldShowRightIcon: true,
            description: date
                ? translate('workspace.common.lastSyncDate', {
                    connectionName: CONST_1.default.POLICY.CONNECTIONS.NAME_USER_FRIENDLY.intacct,
                    formattedDate: date,
                })
                : translate('workspace.accounting.intacct'),
            onPress: () => {
                (0, connections_1.copyExistingPolicyConnection)(policy.id, policyID, CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT);
                Navigation_1.default.dismissModal();
            },
        };
    });
    return (<ScreenWrapper_1.default shouldEnablePickerAvoiding={false} shouldShowOfflineIndicatorInWideScreen testID={ExistingConnectionsPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('workspace.common.connectTo', { connectionName: CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT })} shouldShowBackButton onBackButtonPress={() => Navigation_1.default.goBack()}/>
            <ScrollView_1.default style={[styles.flex1]}>
                <Text_1.default style={[styles.mh5, styles.mb4]}>{translate('workspace.common.existingConnectionsDescription', { connectionName: CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT })}</Text_1.default>
                <MenuItem_1.default title={translate('workspace.common.createNewConnection')} icon={Expensicons_1.LinkCopy} iconStyles={{ borderRadius: variables_1.default.componentBorderRadiusNormal }} shouldShowRightIcon onPress={() => Navigation_1.default.navigate(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_PREREQUISITES.getRoute(policyID, Navigation_1.default.getActiveRoute()))}/>
                <Text_1.default style={[styles.sectionTitle, styles.pl5, styles.pr5, styles.pb2, styles.mt3]}>{translate('workspace.common.existingConnections')}</Text_1.default>
                <MenuItemList_1.default menuItems={menuItems} shouldUseSingleExecution/>
            </ScrollView_1.default>
        </ScreenWrapper_1.default>);
}
ExistingConnectionsPage.displayName = 'ExistingConnectionsPage';
exports.default = ExistingConnectionsPage;
