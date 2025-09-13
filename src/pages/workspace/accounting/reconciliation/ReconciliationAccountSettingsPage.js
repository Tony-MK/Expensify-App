"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConnectionLayout_1 = require("@components/ConnectionLayout");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useDefaultFundID_1 = require("@hooks/useDefaultFundID");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const AccountingUtils_1 = require("@libs/AccountingUtils");
const BankAccountUtils_1 = require("@libs/BankAccountUtils");
const CardUtils_1 = require("@libs/CardUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const Card_1 = require("@userActions/Card");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
function ReconciliationAccountSettingsPage({ route }) {
    const { policyID, connection } = route.params;
    const { backTo } = route.params;
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const connectionName = (0, AccountingUtils_1.getConnectionNameFromRouteParam)(connection);
    const defaultFundID = (0, useDefaultFundID_1.default)(policyID);
    const [bankAccountList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true });
    const [cardSettings] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${defaultFundID}`, { canBeMissing: true });
    const paymentBankAccountID = cardSettings?.paymentBankAccountID;
    const selectedBankAccount = (0, react_1.useMemo)(() => bankAccountList?.[paymentBankAccountID?.toString() ?? ''], [paymentBankAccountID, bankAccountList]);
    const bankAccountNumber = (0, react_1.useMemo)(() => selectedBankAccount?.accountData?.accountNumber ?? '', [selectedBankAccount]);
    const settlementAccountEnding = (0, BankAccountUtils_1.getLastFourDigits)(bankAccountNumber);
    const domainName = cardSettings?.domainName ?? (0, PolicyUtils_1.getDomainNameForPolicy)(policyID);
    const sections = (0, react_1.useMemo)(() => {
        if (!bankAccountList || (0, EmptyObject_1.isEmptyObject)(bankAccountList)) {
            return [];
        }
        const eligibleBankAccounts = (0, CardUtils_1.getEligibleBankAccountsForCard)(bankAccountList);
        const data = eligibleBankAccounts.map((bankAccount) => ({
            text: bankAccount.title,
            value: bankAccount.accountData?.bankAccountID,
            keyForList: bankAccount.accountData?.bankAccountID?.toString(),
            isSelected: bankAccount.accountData?.bankAccountID === paymentBankAccountID,
        }));
        return [{ data }];
    }, [bankAccountList, paymentBankAccountID]);
    const goBack = (0, react_1.useCallback)(() => {
        Navigation_1.default.goBack(backTo ?? ROUTES_1.default.WORKSPACE_ACCOUNTING_CARD_RECONCILIATION.getRoute(policyID, connection));
    }, [policyID, backTo, connection]);
    const selectBankAccount = (newBankAccountID) => {
        (0, Card_1.updateSettlementAccount)(domainName, defaultFundID, policyID, newBankAccountID, paymentBankAccountID);
        goBack();
    };
    return (<ConnectionLayout_1.default displayName={ReconciliationAccountSettingsPage.displayName} headerTitle="workspace.accounting.reconciliationAccount" accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_CONNECTIONS_ENABLED} contentContainerStyle={[styles.flex1, styles.pb2]} connectionName={connectionName} shouldUseScrollView={false} onBackButtonPress={goBack}>
            <Text_1.default style={[styles.textNormal, styles.mb5, styles.ph5]}>{translate('workspace.accounting.chooseReconciliationAccount.chooseBankAccount')}</Text_1.default>
            <Text_1.default style={[styles.textNormal, styles.mb6, styles.ph5]}>
                {translate('workspace.accounting.chooseReconciliationAccount.accountMatches')}
                <TextLink_1.default onPress={() => Navigation_1.default.navigate(ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_SETTINGS_ACCOUNT.getRoute(policyID, Navigation_1.default.getActiveRoute()))}>
                    {translate('workspace.accounting.chooseReconciliationAccount.settlementAccount')}
                </TextLink_1.default>
                {translate('workspace.accounting.chooseReconciliationAccount.reconciliationWorks', { lastFourPAN: settlementAccountEnding })}
            </Text_1.default>

            <SelectionList_1.default sections={sections} onSelectRow={({ value }) => selectBankAccount(value)} ListItem={RadioListItem_1.default} initiallyFocusedOptionKey={paymentBankAccountID?.toString()}/>
        </ConnectionLayout_1.default>);
}
ReconciliationAccountSettingsPage.displayName = 'ReconciliationAccountSettingsPage';
exports.default = ReconciliationAccountSettingsPage;
