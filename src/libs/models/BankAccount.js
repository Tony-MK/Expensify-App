"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const CONST_1 = require("@src/CONST");
class BankAccount {
    constructor(accountJSON) {
        this.json = accountJSON;
    }
    /**
     * Return the ID of the reimbursement account
     */
    getID() {
        return this.json.methodID;
    }
    /**
     * Return the account number, which has been obfuscated by the back end
     * example "XXXXXX3956"
     */
    getMaskedAccountNumber() {
        return this.json.accountData?.accountNumber;
    }
    /**
     * Used as the display name for the account...
     */
    getAddressName() {
        return this.json.accountData?.addressName;
    }
    getProcessor() {
        return this.json.accountData?.processor;
    }
    getRoutingNumber() {
        return this.json.accountData?.routingNumber;
    }
    /**
     * Get all user emails that have access to this bank account
     */
    getSharees() {
        return this.json.accountData?.sharees;
    }
    getState() {
        return this.json.accountData?.state;
    }
    isOpen() {
        return this.getState() === CONST_1.default.BANK_ACCOUNT.STATE.OPEN;
    }
    /**
     * @deprecated Use !isPending instead.
     */
    isVerified() {
        return !this.isPending();
    }
    /**
     * If the user still needs to enter the 3 micro deposit amounts.
     */
    isPending() {
        return this.getState() === CONST_1.default.BANK_ACCOUNT.STATE.PENDING;
    }
    /**
     * If success team is currently verifying the bank account data provided by the user.
     */
    isVerifying() {
        return this.getState() === CONST_1.default.BANK_ACCOUNT.STATE.VERIFYING;
    }
    /**
     * If the user didn't finish entering all their info.
     */
    isInSetup() {
        return this.getState() === CONST_1.default.BANK_ACCOUNT.STATE.SETUP;
    }
    isLocked() {
        return this.getState() === CONST_1.default.BANK_ACCOUNT.STATE.LOCKED;
    }
    /**
     * Is it the account to use by default to receive money?
     */
    isDefaultCredit() {
        return this.json.accountData?.defaultCredit === true;
    }
    /**
     * Can we use this account to pay other people?
     */
    isWithdrawal() {
        return this.json.accountData?.allowDebit === true;
    }
    getType() {
        return this.json.accountData?.type;
    }
    /**
     * Return the client ID of this bank account
     *
     * @NOTE WARNING KEEP IN SYNC WITH THE PHP
     */
    getClientID() {
        // eslint-disable-next-line max-len
        return `${expensify_common_1.Str.makeID(this.getMaskedAccountNumber() ?? '')}${expensify_common_1.Str.makeID(this.getAddressName() ?? '')}${expensify_common_1.Str.makeID(this.getRoutingNumber() ?? '')}${this.getTransactionType()}`;
    }
    getTransactionType() {
        return this.isWithdrawal() ? 'withdrawal' : 'direct-deposit';
    }
    /**
     * Return the internal json data structure used by auth
     */
    getJSON() {
        return this.json;
    }
    /**
     * Return whether this bank account has been risk checked
     */
    isRiskChecked() {
        return !!this.json.accountData?.riskChecked;
    }
    /**
     * Return when the 3 micro amounts for validation were supposed to reach the bank account.
     */
    getValidateCodeExpectedDate() {
        return this.json.validateCodeExpectedDate ?? '';
    }
    /**
     * In which country is the bank account?
     */
    getCountry() {
        return this.json.accountData?.additionalData?.country ?? CONST_1.default.COUNTRY.US;
    }
    /**
     * In which currency is the bank account?
     */
    getCurrency() {
        return this.json.accountData?.additionalData?.currency ?? 'USD';
    }
    /**
     * In which bank is the bank account?
     */
    getBankName() {
        return this.json.accountData?.additionalData?.bankName ?? '';
    }
    /**
     * Did we get bank account details for local transfer or international wire?
     */
    hasInternationalWireDetails() {
        return (this.json.accountData?.additionalData?.fieldsType ?? 'local') === 'international';
    }
    /**
     * Get the additional data of a bankAccount
     */
    getAdditionalData() {
        return this.json.accountData?.additionalData ?? {};
    }
    /**
     * Get the pending action of the bank account
     */
    getPendingAction() {
        return this.json.pendingAction ?? '';
    }
    /**
     * Return a map needed to set up a withdrawal account
     */
    toACHData() {
        return {
            routingNumber: this.getRoutingNumber(),
            accountNumber: this.getMaskedAccountNumber(),
            addressName: this.getAddressName(),
            isSavings: this.json.isSavings,
            bankAccountID: this.getID(),
            state: this.getState(),
            validateCodeExpectedDate: this.getValidateCodeExpectedDate(),
            needsToUpgrade: this.needsToUpgrade(),
            ...this.getAdditionalData(),
        };
    }
    /**
     * Check if user hasn't upgraded their bank account yet.
     */
    needsToUpgrade() {
        return !this.isInSetup() && this.json.accountData?.additionalData?.beneficialOwners === undefined;
    }
}
exports.default = BankAccount;
