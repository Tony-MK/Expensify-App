"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const HeaderWithBackButton_1 = require("@components/HeaderWithBackButton");
const ScreenWrapper_1 = require("@components/ScreenWrapper");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const ConnectedVerifiedBankAccount_1 = require("@pages/ReimbursementAccount/ConnectedVerifiedBankAccount");
const Report_1 = require("@userActions/Report");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const BankAccountValidationForm_1 = require("./components/BankAccountValidationForm");
const FinishChatCard_1 = require("./components/FinishChatCard");
function ConnectBankAccount({ onBackButtonPress, setShouldShowConnectedVerifiedBankAccount, setUSDBankAccountStep }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [reimbursementAccount] = (0, useOnyx_1.default)(ONYXKEYS_1.default.REIMBURSEMENT_ACCOUNT, { canBeMissing: true });
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${reimbursementAccount?.achData?.policyID}}`, { canBeMissing: true });
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const handleNavigateToConciergeChat = () => (0, Report_1.navigateToConciergeChat)(true);
    const bankAccountState = reimbursementAccount?.achData?.state ?? '';
    // If a user tries to navigate directly to the validate page we'll show them the EnableStep
    if (bankAccountState === CONST_1.default.BANK_ACCOUNT.STATE.OPEN) {
        return (<ConnectedVerifiedBankAccount_1.default reimbursementAccount={reimbursementAccount} onBackButtonPress={onBackButtonPress} setShouldShowConnectedVerifiedBankAccount={setShouldShowConnectedVerifiedBankAccount} setUSDBankAccountStep={setUSDBankAccountStep} isNonUSDWorkspace={false}/>);
    }
    const maxAttemptsReached = reimbursementAccount?.maxAttemptsReached ?? false;
    const isBankAccountVerifying = !maxAttemptsReached && bankAccountState === CONST_1.default.BANK_ACCOUNT.STATE.VERIFYING;
    const isBankAccountPending = bankAccountState === CONST_1.default.BANK_ACCOUNT.STATE.PENDING;
    const requiresTwoFactorAuth = account?.requiresTwoFactorAuth ?? false;
    return (<ScreenWrapper_1.default testID={ConnectBankAccount.displayName} includeSafeAreaPaddingBottom={false} shouldEnablePickerAvoiding={false} shouldEnableMaxHeight>
            <HeaderWithBackButton_1.default title={isBankAccountPending ? translate('connectBankAccountStep.validateYourBankAccount') : translate('bankAccount.addBankAccount')} onBackButtonPress={onBackButtonPress}/>
            {maxAttemptsReached && (<react_native_1.View style={[styles.m5, styles.flex1]}>
                    <Text_1.default>
                        {translate('connectBankAccountStep.maxAttemptsReached')} {translate('common.please')}{' '}
                        <TextLink_1.default onPress={handleNavigateToConciergeChat}>{translate('common.contactUs')}</TextLink_1.default>.
                    </Text_1.default>
                </react_native_1.View>)}
            {!maxAttemptsReached && isBankAccountPending && (<BankAccountValidationForm_1.default requiresTwoFactorAuth={requiresTwoFactorAuth} reimbursementAccount={reimbursementAccount} policy={policy}/>)}
            {isBankAccountVerifying && (<FinishChatCard_1.default requiresTwoFactorAuth={requiresTwoFactorAuth} reimbursementAccount={reimbursementAccount} setUSDBankAccountStep={setUSDBankAccountStep}/>)}
        </ScreenWrapper_1.default>);
}
ConnectBankAccount.displayName = 'ConnectBankAccount';
exports.default = ConnectBankAccount;
