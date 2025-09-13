"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const BankIcons_1 = require("@components/Icon/BankIcons");
const RenderHTML_1 = require("@components/RenderHTML");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const Text_1 = require("@components/Text");
const useDefaultFundID_1 = require("@hooks/useDefaultFundID");
const useEnvironment_1 = require("@hooks/useEnvironment");
const useExpensifyCardUkEuSupported_1 = require("@hooks/useExpensifyCardUkEuSupported");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const AccountingUtils_1 = require("@libs/AccountingUtils");
const PolicyConnections_1 = require("@libs/actions/PolicyConnections");
const BankAccountUtils_1 = require("@libs/BankAccountUtils");
const CardUtils_1 = require("@libs/CardUtils");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const Navigation_1 = require("@navigation/Navigation");
const AccessOrNotFoundWrapper_1 = require("@pages/workspace/AccessOrNotFoundWrapper");
const Card_1 = require("@userActions/Card");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
function WorkspaceSettlementAccountPage({ route }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const { environmentURL } = (0, useEnvironment_1.default)();
    const policyID = route.params?.policyID;
    const defaultFundID = (0, useDefaultFundID_1.default)(policyID);
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true });
    const [bankAccountsList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true });
    const [cardSettings] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.PRIVATE_EXPENSIFY_CARD_SETTINGS}${defaultFundID}`, { canBeMissing: true });
    const [isUsingContinuousReconciliation] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.EXPENSIFY_CARD_USE_CONTINUOUS_RECONCILIATION}${defaultFundID}`, { canBeMissing: true });
    const [reconciliationConnection] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.EXPENSIFY_CARD_CONTINUOUS_RECONCILIATION_CONNECTION}${defaultFundID}`, { canBeMissing: true });
    const isUkEuCurrencySupported = (0, useExpensifyCardUkEuSupported_1.default)(policyID);
    const connectionName = reconciliationConnection ?? '';
    const connectionParam = (0, AccountingUtils_1.getRouteParamForConnection)(connectionName);
    const paymentBankAccountID = cardSettings?.paymentBankAccountID;
    const paymentBankAccountNumberFromCardSettings = cardSettings?.paymentBankAccountNumber;
    const paymentBankAccountAddressName = cardSettings?.paymentBankAccountAddressName;
    const paymentBankAccountNumber = bankAccountsList?.[paymentBankAccountID?.toString() ?? '']?.accountData?.accountNumber ?? paymentBankAccountNumberFromCardSettings ?? '';
    const eligibleBankAccounts = isUkEuCurrencySupported ? (0, CardUtils_1.getEligibleBankAccountsForUkEuCard)(bankAccountsList, policy?.outputCurrency) : (0, CardUtils_1.getEligibleBankAccountsForCard)(bankAccountsList);
    const domainName = cardSettings?.domainName ?? (0, PolicyUtils_1.getDomainNameForPolicy)(policyID);
    const hasActiveAccountingConnection = !!(policy?.connections && Object.keys(policy.connections).length > 0);
    const fetchPolicyAccountingData = (0, react_1.useCallback)(() => {
        if (!policyID) {
            return;
        }
        (0, PolicyConnections_1.openPolicyAccountingPage)(policyID);
    }, [policyID]);
    (0, react_1.useEffect)(() => {
        if (!cardSettings || !hasActiveAccountingConnection || isUsingContinuousReconciliation !== undefined || reconciliationConnection !== undefined) {
            return;
        }
        fetchPolicyAccountingData();
    }, [cardSettings, hasActiveAccountingConnection, isUsingContinuousReconciliation, reconciliationConnection, fetchPolicyAccountingData]);
    const data = (0, react_1.useMemo)(() => {
        const options = eligibleBankAccounts.map((bankAccount) => {
            const bankName = (bankAccount.accountData?.addressName ?? '');
            const bankAccountNumber = bankAccount.accountData?.accountNumber ?? '';
            const bankAccountID = bankAccount.accountData?.bankAccountID ?? bankAccount.methodID;
            const { icon, iconSize, iconStyles } = (0, BankIcons_1.default)({ bankName, styles });
            return {
                value: bankAccountID,
                text: bankAccount.title,
                leftElement: !!icon && (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mr3]}>
                        <Icon_1.default src={icon} width={iconSize} height={iconSize} additionalStyles={iconStyles}/>
                    </react_native_1.View>),
                alternateText: `${translate('workspace.expensifyCard.accountEndingIn')} ${(0, BankAccountUtils_1.getLastFourDigits)(bankAccountNumber)}`,
                keyForList: bankAccountID?.toString(),
                isSelected: bankAccountID === paymentBankAccountID,
            };
        });
        if (options.length === 0) {
            const bankName = (paymentBankAccountAddressName ?? '');
            const bankAccountNumber = paymentBankAccountNumberFromCardSettings ?? '';
            const { icon, iconSize, iconStyles } = (0, BankIcons_1.default)({ bankName, styles });
            options.push({
                value: paymentBankAccountID,
                text: paymentBankAccountAddressName,
                leftElement: (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mr3]}>
                        <Icon_1.default src={icon} width={iconSize} height={iconSize} additionalStyles={iconStyles}/>
                    </react_native_1.View>),
                alternateText: `${translate('workspace.expensifyCard.accountEndingIn')} ${(0, BankAccountUtils_1.getLastFourDigits)(bankAccountNumber)}`,
                keyForList: paymentBankAccountID?.toString(),
                isSelected: true,
            });
        }
        return options;
    }, [eligibleBankAccounts, paymentBankAccountAddressName, paymentBankAccountID, paymentBankAccountNumberFromCardSettings, styles, translate]);
    const updateSettlementAccount = (value) => {
        (0, Card_1.updateSettlementAccount)(domainName, defaultFundID, policyID, value, paymentBankAccountID);
        Navigation_1.default.goBack();
    };
    return (<AccessOrNotFoundWrapper_1.default accessVariants={[CONST_1.default.POLICY.ACCESS_VARIANTS.ADMIN, CONST_1.default.POLICY.ACCESS_VARIANTS.PAID]} policyID={policyID} featureName={CONST_1.default.POLICY.MORE_FEATURES.ARE_EXPENSIFY_CARDS_ENABLED}>
            <ScreenWrapper_1.default testID={WorkspaceSettlementAccountPage.displayName} enableEdgeToEdgeBottomSafeAreaPadding shouldEnableMaxHeight>
                <HeaderWithBackButton_1.default title={translate('workspace.expensifyCard.settlementAccount')} onBackButtonPress={() => {
            if (route.params?.backTo) {
                Navigation_1.default.goBack(route.params.backTo);
                return;
            }
            Navigation_1.default.goBack(ROUTES_1.default.WORKSPACE_EXPENSIFY_CARD_SETTINGS.getRoute(policyID));
        }}/>
                <SelectionList_1.default addBottomSafeAreaPadding sections={[{ data }]} ListItem={RadioListItem_1.default} onSelectRow={({ value }) => updateSettlementAccount(value ?? 0)} shouldSingleExecuteRowSelect initiallyFocusedOptionKey={paymentBankAccountID?.toString()} listHeaderContent={<>
                            <Text_1.default style={[styles.mh5, styles.mv4]}>{translate('workspace.expensifyCard.settlementAccountDescription')}</Text_1.default>
                            {!!isUsingContinuousReconciliation && !!connectionParam && hasActiveAccountingConnection && (<react_native_1.View style={[styles.renderHTML, styles.mh5, styles.mb6]}>
                                    <RenderHTML_1.default html={translate('workspace.expensifyCard.settlementAccountInfo', {
                    reconciliationAccountSettingsLink: `${environmentURL}/${ROUTES_1.default.WORKSPACE_ACCOUNTING_RECONCILIATION_ACCOUNT_SETTINGS.getRoute(policyID, connectionParam, Navigation_1.default.getActiveRoute())}`,
                    accountNumber: `${CONST_1.default.MASKED_PAN_PREFIX}${(0, BankAccountUtils_1.getLastFourDigits)(paymentBankAccountNumber)}`,
                })}/>
                                </react_native_1.View>)}
                        </>}/>
            </ScreenWrapper_1.default>
        </AccessOrNotFoundWrapper_1.default>);
}
WorkspaceSettlementAccountPage.displayName = 'WorkspaceSettlementAccountPage';
exports.default = WorkspaceSettlementAccountPage;
