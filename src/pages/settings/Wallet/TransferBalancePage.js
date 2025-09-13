"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullPageNotFoundView_1 = require("@components/BlockingViews/FullPageNotFoundView");
const ConfirmationPage_1 = require("@components/ConfirmationPage");
const CurrentWalletBalance_1 = require("@components/CurrentWalletBalance");
const FormAlertWithSubmitButton_1 = require("@components/FormAlertWithSubmitButton");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const Expensicons = require("@components/Icon/Expensicons");
const MenuItem_1 = require("@components/MenuItem");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const ScrollView_1 = require("@components/ScrollView");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useNetwork_1 = require("@hooks/useNetwork");
const useOnyx_1 = require("@hooks/useOnyx");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const PaymentMethods_1 = require("@libs/actions/PaymentMethods");
const CurrencyUtils_1 = require("@libs/CurrencyUtils");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const Navigation_1 = require("@libs/Navigation/Navigation");
const PaymentUtils_1 = require("@libs/PaymentUtils");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const EmptyObject_1 = require("@src/types/utils/EmptyObject");
const TRANSFER_TIER_NAMES = [CONST_1.default.WALLET.TIER_NAME.GOLD, CONST_1.default.WALLET.TIER_NAME.PLATINUM];
function TransferBalancePage() {
    const styles = (0, useThemeStyles_1.default)();
    const { numberFormat, translate } = (0, useLocalize_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { paddingBottom } = (0, useSafeAreaPaddings_1.default)();
    const [userWallet] = (0, useOnyx_1.default)(ONYXKEYS_1.default.USER_WALLET, { canBeMissing: true });
    const [walletTransfer] = (0, useOnyx_1.default)(ONYXKEYS_1.default.WALLET_TRANSFER, { canBeMissing: true });
    const [bankAccountList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.BANK_ACCOUNT_LIST, { canBeMissing: true });
    const [fundList] = (0, useOnyx_1.default)(ONYXKEYS_1.default.FUND_LIST, { canBeMissing: true });
    const paymentCardList = fundList ?? {};
    const paymentTypes = [
        {
            key: CONST_1.default.WALLET.TRANSFER_METHOD_TYPE.INSTANT,
            title: translate('transferAmountPage.instant'),
            description: translate('transferAmountPage.instantSummary', {
                rate: numberFormat(CONST_1.default.WALLET.TRANSFER_METHOD_TYPE_FEE.INSTANT.RATE),
                minAmount: (0, CurrencyUtils_1.convertToDisplayString)(CONST_1.default.WALLET.TRANSFER_METHOD_TYPE_FEE.INSTANT.MINIMUM_FEE),
            }),
            icon: Expensicons.Bolt,
            type: CONST_1.default.PAYMENT_METHODS.DEBIT_CARD,
        },
        {
            key: CONST_1.default.WALLET.TRANSFER_METHOD_TYPE.ACH,
            title: translate('transferAmountPage.ach'),
            description: translate('transferAmountPage.achSummary'),
            icon: Expensicons.Bank,
            type: CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT,
        },
    ];
    /**
     * Get the selected/default payment method account for wallet transfer
     */
    function getSelectedPaymentMethodAccount() {
        const paymentMethods = (0, PaymentUtils_1.formatPaymentMethods)(bankAccountList ?? {}, paymentCardList, styles);
        const defaultAccount = paymentMethods.find((method) => method.isDefault);
        const selectedAccount = paymentMethods.find((method) => method.accountType === walletTransfer?.selectedAccountType && method.methodID?.toString() === walletTransfer?.selectedAccountID?.toString());
        return selectedAccount ?? defaultAccount;
    }
    function navigateToChooseTransferAccount(filterPaymentMethodType) {
        (0, PaymentMethods_1.saveWalletTransferMethodType)(filterPaymentMethodType);
        // If we only have a single option for the given paymentMethodType do not force the user to make a selection
        const combinedPaymentMethods = (0, PaymentUtils_1.formatPaymentMethods)(bankAccountList ?? {}, paymentCardList, styles);
        const filteredMethods = combinedPaymentMethods.filter((paymentMethod) => paymentMethod.accountType === filterPaymentMethodType);
        if (filteredMethods.length === 1) {
            const account = filteredMethods.at(0);
            (0, PaymentMethods_1.saveWalletTransferAccountTypeAndID)(filterPaymentMethodType, account?.methodID?.toString());
            return;
        }
        Navigation_1.default.navigate(ROUTES_1.default.SETTINGS_WALLET_CHOOSE_TRANSFER_ACCOUNT);
    }
    (0, react_1.useEffect)(() => {
        // Reset to the default account when the page is opened
        (0, PaymentMethods_1.resetWalletTransferData)();
        const selectedAccount = getSelectedPaymentMethodAccount();
        if (!selectedAccount) {
            return;
        }
        (0, PaymentMethods_1.saveWalletTransferAccountTypeAndID)(selectedAccount?.accountType, selectedAccount?.methodID?.toString());
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps -- we only want this effect to run on initial render
    }, []);
    if (walletTransfer?.shouldShowSuccess && !walletTransfer?.loading) {
        return (<ScreenWrapper_1.default testID={TransferBalancePage.displayName}>
                <HeaderWithBackButton_1.default title={translate('common.transferBalance')} onBackButtonPress={PaymentMethods_1.dismissSuccessfulTransferBalancePage}/>
                <ConfirmationPage_1.default heading={translate('transferAmountPage.transferSuccess')} description={walletTransfer.paymentMethodType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT
                ? translate('transferAmountPage.transferDetailBankAccount')
                : translate('transferAmountPage.transferDetailDebitCard')} shouldShowButton buttonText={translate('common.done')} onButtonPress={PaymentMethods_1.dismissSuccessfulTransferBalancePage} containerStyle={styles.flex1}/>
            </ScreenWrapper_1.default>);
    }
    const selectedAccount = getSelectedPaymentMethodAccount();
    const selectedPaymentType = selectedAccount && selectedAccount.accountType === CONST_1.default.PAYMENT_METHODS.PERSONAL_BANK_ACCOUNT ? CONST_1.default.WALLET.TRANSFER_METHOD_TYPE.ACH : CONST_1.default.WALLET.TRANSFER_METHOD_TYPE.INSTANT;
    const calculatedFee = (0, PaymentUtils_1.calculateWalletTransferBalanceFee)(userWallet?.currentBalance ?? 0, selectedPaymentType);
    const transferAmount = userWallet?.currentBalance ?? 0 - calculatedFee;
    const isTransferable = transferAmount > 0;
    const isButtonDisabled = !isTransferable || !selectedAccount;
    const errorMessage = (0, ErrorUtils_1.getLatestErrorMessage)(walletTransfer);
    const shouldShowTransferView = (0, PaymentUtils_1.hasExpensifyPaymentMethod)(paymentCardList, bankAccountList ?? {}) && TRANSFER_TIER_NAMES.includes(userWallet?.tierName ?? '');
    return (<ScreenWrapper_1.default testID={TransferBalancePage.displayName}>
            <FullPageNotFoundView_1.default shouldShow={!shouldShowTransferView} titleKey="notFound.pageNotFound" subtitleKey="transferAmountPage.notHereSubTitle" linkTranslationKey="transferAmountPage.goToWallet" onLinkPress={() => Navigation_1.default.goBack(ROUTES_1.default.SETTINGS_WALLET)}>
                <HeaderWithBackButton_1.default title={translate('common.transferBalance')} shouldShowBackButton/>
                <react_native_1.View style={[styles.flexGrow1, styles.flexShrink1, styles.flexBasisAuto, styles.justifyContentCenter]}>
                    <CurrentWalletBalance_1.default balanceStyles={[styles.transferBalanceBalance]}/>
                </react_native_1.View>
                <ScrollView_1.default style={styles.flexGrow0} contentContainerStyle={styles.pv5}>
                    <react_native_1.View style={styles.ph5}>
                        {paymentTypes.map((paymentType) => (<MenuItem_1.default key={paymentType.key} title={paymentType.title} description={paymentType.description} iconWidth={variables_1.default.iconSizeXLarge} iconHeight={variables_1.default.iconSizeXLarge} icon={paymentType.icon} success={selectedPaymentType === paymentType.key} wrapperStyle={{
                ...styles.mt3,
                ...styles.pv4,
                ...styles.transferBalancePayment,
                ...(selectedPaymentType === paymentType.key && styles.transferBalanceSelectedPayment),
            }} onPress={() => navigateToChooseTransferAccount(paymentType.type)}/>))}
                    </react_native_1.View>
                    <Text_1.default style={[styles.pt8, styles.ph5, styles.pb1, styles.textLabelSupporting, styles.justifyContentStart]}>{translate('transferAmountPage.whichAccount')}</Text_1.default>
                    {!!selectedAccount && (<MenuItem_1.default title={selectedAccount?.title} description={selectedAccount?.description} shouldShowRightIcon iconStyles={selectedAccount?.iconStyles} iconWidth={selectedAccount?.iconSize} iconHeight={selectedAccount?.iconSize} icon={selectedAccount?.icon} onPress={() => navigateToChooseTransferAccount(selectedAccount?.accountType ?? CONST_1.default.PAYMENT_METHODS.DEBIT_CARD)} displayInDefaultIconColor/>)}
                    <react_native_1.View style={styles.ph5}>
                        <Text_1.default style={[styles.mt5, styles.mb3, styles.textLabelSupporting, styles.justifyContentStart]}>{translate('transferAmountPage.fee')}</Text_1.default>
                        <Text_1.default style={[styles.justifyContentStart]}>{(0, CurrencyUtils_1.convertToDisplayString)(calculatedFee)}</Text_1.default>
                    </react_native_1.View>
                </ScrollView_1.default>
                <react_native_1.View>
                    <FormAlertWithSubmitButton_1.default buttonText={translate('transferAmountPage.transfer', {
            amount: isTransferable ? (0, CurrencyUtils_1.convertToDisplayString)(transferAmount) : '',
        })} isLoading={walletTransfer?.loading} onSubmit={() => selectedAccount && (0, PaymentMethods_1.transferWalletBalance)(selectedAccount)} isDisabled={isButtonDisabled || isOffline} message={errorMessage} isAlertVisible={!(0, EmptyObject_1.isEmptyObject)(errorMessage)} containerStyles={[styles.ph5, !paddingBottom ? styles.pb5 : null]}/>
                </react_native_1.View>
            </FullPageNotFoundView_1.default>
        </ScreenWrapper_1.default>);
}
TransferBalancePage.displayName = 'TransferBalancePage';
exports.default = TransferBalancePage;
