"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasCreditBankAccount = hasCreditBankAccount;
var BankAccount_1 = require("@libs/models/BankAccount");
function hasCreditBankAccount(bankAccountList) {
    if (!bankAccountList) {
        return false;
    }
    return Object.values(bankAccountList).some(function (bankAccountJSON) {
        var bankAccount = new BankAccount_1.default(bankAccountJSON);
        return bankAccount.isDefaultCredit();
    });
}
exports.default = { hasCreditBankAccount: hasCreditBankAccount };
