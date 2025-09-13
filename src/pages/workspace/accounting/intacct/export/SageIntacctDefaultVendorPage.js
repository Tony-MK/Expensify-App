"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const react_native_1 = require("react-native");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Illustrations_1 = require("@components/Icon/Illustrations");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const usePolicy_1 = require("@hooks/usePolicy");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Policy_1 = require("@libs/actions/Policy/Policy");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const variables_1 = require("@styles/variables");
const SageIntacct_1 = require("@userActions/connections/SageIntacct");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function SageIntacctDefaultVendorPage() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const route = (0, native_1.useRoute)();
    const policyID = route.params.policyID;
    const policy = (0, usePolicy_1.default)(policyID);
    const { config } = policy?.connections?.intacct ?? {};
    const { export: exportConfig } = policy?.connections?.intacct?.config ?? {};
    const backTo = route.params.backTo;
    const isReimbursable = route.params.reimbursable === CONST_1.default.SAGE_INTACCT_CONFIG.REIMBURSABLE;
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ??
            (isReimbursable
                ? ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_REIMBURSABLE_EXPENSES.getRoute(policyID)
                : ROUTES_1.default.POLICY_ACCOUNTING_SAGE_INTACCT_NON_REIMBURSABLE_EXPENSES.getRoute(policyID)));
    }, [backTo, policyID, isReimbursable]);
    let defaultVendor;
    let settingName;
    if (!isReimbursable) {
        const { nonReimbursable } = exportConfig ?? {};
        defaultVendor = (0, PolicyUtils_1.getSageIntacctNonReimbursableActiveDefaultVendor)(policy);
        settingName =
            nonReimbursable === CONST_1.default.SAGE_INTACCT_NON_REIMBURSABLE_EXPENSE_TYPE.CREDIT_CARD_CHARGE
                ? CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_CREDIT_CARD_VENDOR
                : CONST_1.default.SAGE_INTACCT_CONFIG.NON_REIMBURSABLE_VENDOR;
    }
    else {
        const { reimbursableExpenseReportDefaultVendor } = exportConfig ?? {};
        defaultVendor = reimbursableExpenseReportDefaultVendor;
        settingName = CONST_1.default.SAGE_INTACCT_CONFIG.REIMBURSABLE_VENDOR;
    }
    const vendorSelectorOptions = (0, react_1.useMemo)(() => (0, PolicyUtils_1.getSageIntacctVendors)(policy, defaultVendor), [defaultVendor, policy]);
    const listHeaderComponent = (0, react_1.useMemo)(() => (<react_native_1.View style={[styles.pb2, styles.ph5]}>
                <Text_1.default style={[styles.pb5, styles.textNormal]}>{translate('workspace.sageIntacct.defaultVendorDescription', { isReimbursable })}</Text_1.default>
            </react_native_1.View>), [translate, styles.pb2, styles.ph5, styles.pb5, styles.textNormal, isReimbursable]);
    const updateDefaultVendor = (0, react_1.useCallback)(({ value }) => {
        if (value !== defaultVendor) {
            (0, SageIntacct_1.updateSageIntacctDefaultVendor)(policyID, settingName, value, defaultVendor);
        }
        goBack();
    }, [defaultVendor, policyID, settingName, goBack]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations_1.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.sageIntacct.noAccountsFound')} subtitle={translate('workspace.sageIntacct.noAccountsFoundDescription')} containerStyle={styles.pb10}/>), [translate, styles.pb10]);
    return (<SelectionScreen_1.default policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={SageIntacctDefaultVendorPage.displayName} sections={vendorSelectorOptions.length ? [{ data: vendorSelectorOptions }] : []} listItem={RadioListItem_1.default} onSelectRow={updateDefaultVendor} initiallyFocusedOptionKey={vendorSelectorOptions.find((mode) => mode.isSelected)?.keyForList} headerContent={listHeaderComponent} onBackButtonPress={goBack} title="workspace.sageIntacct.defaultVendor" listEmptyContent={listEmptyContent} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.SAGE_INTACCT} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([settingName], config?.pendingFields)} errors={(0, ErrorUtils_1.getLatestErrorField)(config, settingName)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearSageIntacctErrorField)(policyID, settingName)}/>);
}
SageIntacctDefaultVendorPage.displayName = 'SageIntacctDefaultVendorPage';
exports.default = SageIntacctDefaultVendorPage;
