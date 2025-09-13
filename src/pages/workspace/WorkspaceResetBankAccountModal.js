"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var ConfirmModal_1 = require("@components/ConfirmModal");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var BankAccounts_1 = require("@userActions/BankAccounts");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function WorkspaceResetBankAccountModal(_a) {
    var _b, _c, _d;
    var reimbursementAccount = _a.reimbursementAccount, setShouldShowConnectedVerifiedBankAccount = _a.setShouldShowConnectedVerifiedBankAccount, setUSDBankAccountStep = _a.setUSDBankAccountStep, setNonUSDBankAccountStep = _a.setNonUSDBankAccountStep, isNonUSDWorkspace = _a.isNonUSDWorkspace, setShouldShowContinueSetupButton = _a.setShouldShowContinueSetupButton;
    var styles = (0, useThemeStyles_1.default)();
    var translate = (0, useLocalize_1.default)().translate;
    var session = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION, { canBeMissing: false })[0];
    var policyID = (_b = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.achData) === null || _b === void 0 ? void 0 : _b.policyID;
    var policy = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(policyID), { canBeMissing: true })[0];
    var achData = reimbursementAccount === null || reimbursementAccount === void 0 ? void 0 : reimbursementAccount.achData;
    var isInOpenState = (achData === null || achData === void 0 ? void 0 : achData.state) === CONST_1.default.BANK_ACCOUNT.STATE.OPEN;
    var bankAccountID = achData === null || achData === void 0 ? void 0 : achData.bankAccountID;
    var bankShortName = "".concat((_c = achData === null || achData === void 0 ? void 0 : achData.addressName) !== null && _c !== void 0 ? _c : '', " ").concat(((_d = achData === null || achData === void 0 ? void 0 : achData.accountNumber) !== null && _d !== void 0 ? _d : '').slice(-4));
    var lastPaymentMethod = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_LAST_PAYMENT_METHOD, {
        canBeMissing: true,
        selector: function (paymentMethods) { return (policyID ? paymentMethods === null || paymentMethods === void 0 ? void 0 : paymentMethods[policyID] : undefined); },
    })[0];
    var handleConfirm = function () {
        if (isNonUSDWorkspace) {
            (0, BankAccounts_1.resetNonUSDBankAccount)(policyID, policy === null || policy === void 0 ? void 0 : policy.achAccount, !(achData === null || achData === void 0 ? void 0 : achData.bankAccountID));
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
            (0, BankAccounts_1.resetUSDBankAccount)(bankAccountID, session, policyID, policy === null || policy === void 0 ? void 0 : policy.achAccount, lastPaymentMethod);
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
