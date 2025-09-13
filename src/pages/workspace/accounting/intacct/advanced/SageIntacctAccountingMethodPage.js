"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const react_native_1 = require("react-native");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const SageIntacct_1 = require("@libs/actions/connections/SageIntacct");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function SageIntacctAccountingMethodPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const styles = (0, useThemeStyles_1.default)();
    const config = policy?.connections?.intacct?.config;
    const accountingMethod = config?.export?.accountingMethod ?? expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD.CASH;
    const data = Object.values(expensify_common_1.CONST.INTEGRATIONS.ACCOUNTING_METHOD).map((accountingMethodType) => ({
        value: accountingMethodType,
        text: translate(`workspace.sageIntacct.accountingMethods.values.${accountingMethodType}`),
        alternateText: translate(`workspace.sageIntacct.accountingMethods.alternateText.${accountingMethodType}`),
        keyForList: accountingMethodType,
        isSelected: accountingMethod === accountingMethodType,
    }));
    const pendingAction = (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.AUTO_SYNC], config?.pendingFields) ?? (0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.SAGE_INTACCT_CONFIG.ACCOUNTING_METHOD], config?.pendingFields);
    const headerContent = (0, react_1.useMemo)(() => (<react_native_1.View>
                <Text_1.default style={[styles.ph5, styles.pb5]}>{translate('workspace.sageIntacct.accountingMethods.description')}</Text_1.default>
            </react_native_1.View>), [translate, styles.pb5, styles.ph5]);
    const selectExpenseReportApprovalLevel = (0, react_1.useCallback)((row) => {
        if (row.value !== accountingMethod) {
            (0, SageIntacct_1.updateSageIntacctAccountingMethod)(policyID, row.value, accountingMethod);
        }
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_AUTO_SYNC.getRoute(policyID));
    }, [accountingMethod, policyID]);
    return (<SelectionScreen_1.default displayName={SageIntacctAccountingMethodPage.displayName} headerTitleAlreadyTranslated={translate('workspace.sageIntacct.accountingMethods.label')} headerContent={headerContent} sections={[{ data }]} listItem={RadioListItem_1.default} onSelectRow={(selection) => selectExpenseReportApprovalLevel(selection)} initiallyFocusedOptionKey={data.find((mode) => mode.isSelected)?.keyForList} policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_AUTO_SYNC.getRoute(policyID))} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT} pendingAction={pendingAction} shouldBeBlocked={!config?.autoSync?.enabled}/>);
}
SageIntacctAccountingMethodPage.displayName = 'SageIntacctAccountingMethodPage';
exports.default = (0, withPolicyConnections_1.default)(SageIntacctAccountingMethodPage);
