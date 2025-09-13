"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const SelectionScreen_1 = require("@components/SelectionScreen");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const connections_1 = require("@libs/actions/connections");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const withPolicyConnections_1 = require("@pages/workspace/withPolicyConnections");
const Policy_1 = require("@userActions/Policy/Policy");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
function QuickbooksCompanyCardExpenseAccountSelectCardPage({ policy }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const policyID = policy?.id;
    const qboConfig = policy?.connections?.quickbooksOnline?.config;
    const { creditCards, bankAccounts, accountPayable, vendors } = policy?.connections?.quickbooksOnline?.data ?? {};
    const isLocationEnabled = !!(qboConfig?.syncLocations && qboConfig?.syncLocations !== CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE);
    const route = (0, native_1.useRoute)();
    const backTo = route.params?.backTo;
    const sections = (0, react_1.useMemo)(() => {
        const options = [
            {
                text: translate(`workspace.qbo.accounts.credit_card`),
                value: CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.CREDIT_CARD,
                keyForList: CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.CREDIT_CARD,
                isSelected: CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.CREDIT_CARD === qboConfig?.nonReimbursableExpensesExportDestination,
                accounts: creditCards ?? [],
                defaultVendor: CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE,
            },
            {
                text: translate(`workspace.qbo.accounts.debit_card`),
                value: CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.DEBIT_CARD,
                keyForList: CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.DEBIT_CARD,
                isSelected: CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.DEBIT_CARD === qboConfig?.nonReimbursableExpensesExportDestination,
                accounts: bankAccounts ?? [],
                defaultVendor: CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE,
            },
        ];
        if (!isLocationEnabled) {
            options.push({
                text: translate(`workspace.qbo.accounts.bill`),
                value: CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.VENDOR_BILL,
                keyForList: CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.VENDOR_BILL,
                isSelected: CONST_1.default.QUICKBOOKS_NON_REIMBURSABLE_EXPORT_ACCOUNT_TYPE.VENDOR_BILL === qboConfig?.nonReimbursableExpensesExportDestination,
                accounts: accountPayable ?? [],
                defaultVendor: vendors?.[0]?.id ?? CONST_1.default.INTEGRATION_ENTITY_MAP_TYPES.NONE,
            });
        }
        return [{ data: options }];
    }, [translate, qboConfig?.nonReimbursableExpensesExportDestination, isLocationEnabled, accountPayable, bankAccounts, creditCards, vendors]);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? (policyID && ROUTES_1.default.POLICY_ACCOUNTING_QUICKBOOKS_ONLINE_COMPANY_CARD_EXPENSE_ACCOUNT.getRoute(policyID)));
    }, [backTo, policyID]);
    const selectExportCompanyCard = (0, react_1.useCallback)((row) => {
        if (row.value !== qboConfig?.nonReimbursableExpensesExportDestination) {
            (0, connections_1.updateManyPolicyConnectionConfigs)(policyID, CONST_1.default.POLICY.CONNECTIONS.NAME.QBO, {
                [CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_EXPENSES_EXPORT_DESTINATION]: row.value,
                [CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_EXPENSES_ACCOUNT]: row.accounts.at(0),
                [CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR]: row.defaultVendor,
            }, {
                [CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_EXPENSES_EXPORT_DESTINATION]: qboConfig?.nonReimbursableExpensesExportDestination,
                [CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_EXPENSES_ACCOUNT]: qboConfig?.nonReimbursableExpensesAccount,
                [CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_BILL_DEFAULT_VENDOR]: qboConfig?.nonReimbursableBillDefaultVendor,
            });
        }
        goBack();
    }, [qboConfig?.nonReimbursableExpensesExportDestination, policyID, qboConfig?.nonReimbursableExpensesAccount, qboConfig?.nonReimbursableBillDefaultVendor, goBack]);
    return (<SelectionScreen_1.default policyID={policyID} accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN]} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} displayName={QuickbooksCompanyCardExpenseAccountSelectCardPage.displayName} title="workspace.accounting.exportAs" sections={sections} listItem={RadioListItem_1.default} onSelectRow={(selection) => selectExportCompanyCard(selection)} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={sections.at(0)?.data.find((mode) => mode.isSelected)?.keyForList} connectionName={CONST_1.default.POLICY.CONNECTIONS.NAME.QBO} onBackButtonPress={goBack} listFooterContent={isLocationEnabled ? <Text_1.default style={[styles.mutedNormalTextLabel, styles.ph5, styles.pv3]}>{translate('workspace.qbo.companyCardsLocationEnabledDescription')}</Text_1.default> : undefined} errors={(0, ErrorUtils_1.getLatestErrorField)(qboConfig, CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_EXPENSES_EXPORT_DESTINATION)} errorRowStyles={[styles.ph5, styles.pv3]} pendingAction={(0, PolicyUtils_1.settingsPendingAction)([CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_EXPENSES_EXPORT_DESTINATION], qboConfig?.pendingFields)} onClose={() => (0, Policy_1.clearQBOErrorField)(policyID, CONST_1.default.QUICKBOOKS_CONFIG.NON_REIMBURSABLE_EXPENSES_EXPORT_DESTINATION)}/>);
}
QuickbooksCompanyCardExpenseAccountSelectCardPage.displayName = 'QuickbooksCompanyCardExpenseAccountSelectCardPage';
exports.default = (0, withPolicyConnections_1.default)(QuickbooksCompanyCardExpenseAccountSelectCardPage);
