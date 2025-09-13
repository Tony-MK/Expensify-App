"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullscreenLoadingIndicator_1 = require("@components/FullscreenLoadingIndicator");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Icon_1 = require("@components/Icon");
const BankIcons_1 = require("@components/Icon/BankIcons");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const SelectionList_1 = require("@components/SelectionList");
const RadioListItem_1 = require("@components/SelectionList/RadioListItem");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const BankAccountUtils_1 = require("@libs/BankAccountUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const BankAccounts_1 = require("@userActions/BankAccounts");
const PaymentMethods_1 = require("@userActions/PaymentMethods");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const isLoadingOnyxValue_1 = require("@src/types/utils/isLoadingOnyxValue");
function ChooseTransferAccountPage() {
    const [walletTransfer, walletTransferResult] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_TRANSFER, { canBeMissing: true });
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    /**
     * Go back to transfer balance screen with the selected bank account set
     * @param event Click event object
     * @param accountType of the selected account type
     * @param account of the selected account data
     */
    const selectAccountAndNavigateBack = (accountType, account) => {
        (0, PaymentMethods_1.saveWalletTransferAccountTypeAndID)(accountType ?? '', (accountType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT ? account?.bankAccountID?.toString() : account?.fundID?.toString()) ?? '');
        Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_WALLET_TRANSFER_BALANCE);
    };
    const navigateToAddPaymentMethodPage = () => {
        if (walletTransfer?.filterPaymentMethodType === CONST_1.default.PAYMENT_METHODS.DEBIT_CARD) {
            Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_ADD_DEBIT_CARD);
            return;
        }
        (0, BankAccounts_1.openPersonalBankAccountSetupView)({});
    };
    const [bankAccountsList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true });
    const selectedAccountID = walletTransfer?.selectedAccountID;
    const data = (0, react_1.useMemo)(() => {
        const options = Object.values(bankAccountsList ?? {}).map((bankAccount) => {
            const bankName = (bankAccount.accountData?.additionalData?.bankName ?? '');
            const bankAccountNumber = bankAccount.accountData?.accountNumber ?? '';
            const bankAccountID = bankAccount.accountData?.bankAccountID ?? bankAccount.methodID;
            const { icon, iconSize, iconStyles } = (0, BankIcons_1.default)({ bankName, styles });
            return {
                value: bankAccountID,
                text: bankAccount.title,
                leftElement: icon ? (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.mr3]}>
                        <Icon_1.default src={icon} width={iconSize} height={iconSize} additionalStyles={iconStyles}/>
                    </react_native_1.View>) : null,
                alternateText: `${translate('workspace.expensifyCard.accountEndingIn')} ${(0, BankAccountUtils_1.getLastFourDigits)(bankAccountNumber)}`,
                keyForList: bankAccountID?.toString(),
                isSelected: bankAccountID?.toString() === selectedAccountID,
                bankAccount,
            };
        });
        return options;
    }, [bankAccountsList, selectedAccountID, styles, translate]);
    if ((0, isLoadingOnyxValue_1.default)(walletTransferResult)) {
        return <FullscreenLoadingIndicator_1.default />;
    }
    return (<ScreenWrapper_1.default testID={ChooseTransferAccountPage.displayName}>
            <HeaderWithBackButton_1.default title={translate('chooseTransferAccountPage.chooseAccount')} onBackButtonPress={() => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_WALLET_TRANSFER_BALANCE)}/>

            <SelectionList_1.default sections={[{ data }]} ListItem={RadioListItem_1.default} onSelectRow={(value) => {
            const accountType = value?.bankAccount?.accountType;
            const accountData = value?.bankAccount?.accountData;
            selectAccountAndNavigateBack(accountType, accountData);
        }} shouldSingleExecuteRowSelect shouldUpdateFocusedIndex initiallyFocusedOptionKey={walletTransfer?.selectedAccountID?.toString()} listFooterContent={<MenuItem_1.default onPress={navigateToAddPaymentMethodPage} title={walletTransfer?.filterPaymentMethodType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT
                ? translate('paymentMethodList.addNewBankAccount')
                : translate('paymentMethodList.addNewDebitCard')} icon={Expensicons.Plus}/>}/>
        </ScreenWrapper_1.default>);
}
ChooseTransferAccountPage.displayName = 'ChooseTransferAccountPage';
exports.default = ChooseTransferAccountPage;
