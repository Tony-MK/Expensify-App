"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const BlockingView_1 = require("@components/BlockingViews/BlockingView");
const Illustrations = require("@components/Icon/Illustrations");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const QuickbooksOnline = require("@libs/actions/connections/QuickbooksOnline");
const ErrorUtils = require("@libs/ErrorUtils");
const PolicyUtils = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const variables_1 = require("@styles/variables");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksNonReimbursableDefaultVendorSelectPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const { vendors } = policy?.connections?.quickbooksOnline?.data ?? {};
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    const policyID = policy?.id ?? '-1';
    const sections = (0, react_1.useMemo)(() => {
        const data = vendors?.map((vendor) => ({
            value: vendor.id,
            text: vendor.name,
            keyForList: vendor.name,
            isSelected: vendor.id === qboConfig?.nonReimbursableBillDefaultVendor,
        })) ?? [];
        return data.length ? [{ data }] : [];
    }, [qboConfig?.nonReimbursableBillDefaultVendor, vendors]);
    const selectVendor = (0, react_1.useCallback)((row) => {
        if (row.value !== qboConfig?.nonReimbursableBillDefaultVendor) {
            QuickbooksOnline.updateQuickbooksOnlineNonReimbursableBillDefaultVendor(policyID, row.value, qboConfig?.nonReimbursableBillDefaultVendor);
        }
        Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT.getRoute(policyID));
    }, [qboConfig?.nonReimbursableBillDefaultVendor, policyID]);
    const listEmptyContent = (0, react_1.useMemo)(() => (<BlockingView_1.default icon={Illustrations.TeleScope} iconWidth={variables_1.default.emptyListIconWidth} iconHeight={variables_1.default.emptyListIconHeight} title={translate('workspace.qbo.noAccountsFound')} subtitle={translate('workspace.qbo.noAccountsFoundDescription')} containerStyle={styles.pb10}/>), [translate, styles.pb10]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={QuickbooksNonReimbursableDefaultVendorSelectPage.displayName} title="workspace.accounting.defaultVendor" sections={sections} listItem={RadioListItem_1.default} onSelectRow={selectVendor} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={sections.at(0)?.data.find((mode) => mode.isSelected)?.keyForList} listEmptyContent={listEmptyContent} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBO} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT.getRoute(policyID))} pendingAction={PolicyUtils.settingsPendingAction([CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR], qboConfig?.pendingFields)} errors={ErrorUtils.getLatestErrorField(qboConfig, CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR)} errorRowStyles={[styles.ph5, styles.pv3]} onClose={() => (0, Policy_1.clearQBOErrorField)(policyID, CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR)}/>);
}
QuickbooksNonReimbursableDefaultVendorSelectPage.displayName = 'QuickbooksNonReimbursableDefaultVendorSelectPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksNonReimbursableDefaultVendorSelectPage);
