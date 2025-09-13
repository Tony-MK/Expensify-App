"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ConfirmModal_1 = require("@components/ConfirmModal");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const BankAccounts_1 = require("@userActions/BankAccounts");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function WorkspaceResetBankAccountModal({ reimbursementAccount, setShouldShowConnectedVerifiedBankAccount, setUSDBankAccountStep, setNonUSDBankAccountStep, isNonUSDWorkspace, setShouldShowContinueSetupButton, }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false });
    const policyID = reimbursementAccount?.achData?.policyID;
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${policyID}`, { canBeMissing: true });
    const achData = reimbursementAccount?.achData;
    const isInOpenState = achData?.state === CONST_1.default.BANK_ACCOUNT.STATE.OPEN;
    const bankAccountID = achData?.bankAccountID;
    const bankShortName = `${achData?.addressName ?? ''} ${(achData?.accountNumber ?? '').slice(-4)}`;
    const [lastPaymentMethod] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD, {
        canBeMissing: true,
        selector: (paymentMethods) => (policyID ? paymentMethods?.[policyID] : undefined),
    });
    const handleConfirm = () => {
        if (isNonUSDWorkspace) {
            (0, BankAccounts_1.resetNonUSDBankAccount)(policyID, policy?.achAccount, !achData?.bankAccountID);
            if (setShouldShowConnectedVerifiedBankAccount) {
                setShouldShowConnectedVerifiedBankAccount(false);
            }
            if (setShouldShowContinueSetupButton) {
                setShouldShowContinueSetupButton(false);
            }
            if (setNonUSDBankAccountStep) {
                setNonUSDBankAccountStep(null);
            }
        }
        else {
            (0, BankAccounts_1.resetUSDBankAccount)(bankAccountID, session, policyID, policy?.achAccount, lastPaymentMethod);
            if (setShouldShowContinueSetupButton) {
                setShouldShowContinueSetupButton(false);
            }
            if (setShouldShowConnectedVerifiedBankAccount) {
                setShouldShowConnectedVerifiedBankAccount(false);
            }
            if (setUSDBankAccountStep) {
                setUSDBankAccountStep(null);
            }
        }
    };
    return (<ConfirmModal_1.default title={translate('workspace.bankAccount.areYouSure')} confirmText={isInOpenState ? translate('workspace.bankAccount.yesDisconnectMyBankAccount') : translate('workspace.bankAccount.yesStartOver')} cancelText={translate('common.cancel')} prompt={isInOpenState ? (<Text_1.default>
                        <Text_1.default>{translate('workspace.bankAccount.disconnectYour')}</Text_1.default>
                        <Text_1.default style={styles.textStrong}>{bankShortName}</Text_1.default>
                        <Text_1.default>{translate('workspace.bankAccount.bankAccountAnyTransactions')}</Text_1.default>
                    </Text_1.default>) : (translate('workspace.bankAccount.clearProgress'))} danger onCancel={BankAccounts_1.cancelResetBankAccount} onConfirm={handleConfirm} shouldShowCancelButton isVisible/>);
}
WorkspaceResetBankAccountModal.displayName = 'WorkspaceResetBankAccountModal';
exports.default = WorkspaceResetBankAccountModal;
