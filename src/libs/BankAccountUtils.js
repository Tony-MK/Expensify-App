"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultCompanyWebsite = getDefaultCompanyWebsite;
exports.getLastFourDigits = getLastFourDigits;
const expensify_common_1 = require("expensify-common");
function getDefaultCompanyWebsite(session, account) {
    return account?.isFromPublicDomain ? '' : `https://www.${expensify_common_1.Str.extractEmailDomain(session?.email ?? '')}`;
}
function getLastFourDigits(bankAccountNumber) {
    return bankAccountNumber ? bankAccountNumber.slice(-4) : '';
}
