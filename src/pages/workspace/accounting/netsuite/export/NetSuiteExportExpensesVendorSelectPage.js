"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Illustrations_1 = require("@components/Icon/Illustrations");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const NetSuiteCommands_1 = require("@libs/actions/connections/NetSuiteCommands");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const variables_1 = require("@styles/variables");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function NetSuiteExportExpensesVendorSelectPage({ policy }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const policyID = policy?.id;
    const route = (0, native_1.useRoute)();
    const params = route.params;
    const backTo = params.backTo;
    const isReimbursable = params.expenseType === CONST_1.default.NETSUITE_EXPENSE_TYPE.REIMBURSABLE;
    const config = policy?.connections?.netsuite?.options.config;
    const netsuiteVendorOptions = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getNetSuiteVendorOptions)(policy ?? undefined, config?.defaultVendor), [config?.defaultVendor, policy]);
    const initiallyFocusedOptionKey = (0, react_1.useMemo)(() => netsuiteVendorOptions?.find((mode) => mode.isSelected)?.keyForList, [netsuiteVendorOptions]);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? ROUTES_1.default.POLICY_ACCOUNTING_NETSUITE_EXPORT_EXPENSES.getRoute(policyID, params.expenseType));
    }, [backTo, policyID, params.expenseType]);
    const updateDefaultVendor = (0, react_1.useCallback)(({ value }) => {
        if (config?.defaultVendor !== value && policyID) {
            (0, NetSuiteCommands_1.updateNetSuiteDefaultVendor)(policyID, value, config?.defaultVendor);
        }
        goBack();
    }, [config?.defaultVendor, policyID, goBack]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations_1.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.netsuite.noVendorsFound')} subtitle={translate('workspace.netsuite.noVendorsFoundDescription')} containerStyle={styles.pb10}/>), [translate, styles.pb10]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.CONTROL]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={NetSuiteExportExpensesVendorSelectPage.displayName} sections={netsuiteVendorOptions.length ? [{ data: netsuiteVendorOptions }] : []} listItem={RadioListItem_1.default} onSelectRow={updateDefaultVendor} initiallyFocusedOptionKey={initiallyFocusedOptionKey} onBackButtonPress={goBack} title="workspace.accounting.defaultVendor" listEmptyContent={listEmptyContent} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.NETSUITE} shouldBeBlocked={isReimbursable || config?.nonreimbursableExpensesExportDestination !== CONST_1.default.NETSUITE_EXPORT_DESTINATION.VENDOR_BILL} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.NETSUITE_CONFIG.DEFAULT_VENDOR], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config, CONST_1.default.NETSUITE_CONFIG.DEFAULT_VENDOR)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearNetSuiteErrorField)(policyID, CONST_1.default.NETSUITE_CONFIG.DEFAULT_VENDOR)}/>);
}
NetSuiteExportExpensesVendorSelectPage.displayName = 'NetSuiteExportExpensesVendorSelectPage';
exports.default = (0, withPolicyConnections_1.default)(NetSuiteExportExpensesVendorSelectPage);
