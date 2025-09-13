"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyCardPlaidConnection = getCompanyCardPlaidConnection;
exports.getCompanyCardBankConnection = getCompanyCardBankConnection;
const ApiUtils_1 = require("@libs/ApiUtils");
const NetworkStore = require("@libs/Network/NetworkStore");
const PolicyUtils = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
function getCompanyCardBankConnection(policyID, bankName) {
    const bankConnection = Object.keys(CONST_1.default.COMPANY_CARDS.BANKS).find((key) => CONST_1.default.COMPANY_CARDS.BANKS[key] === bankName);
    if (!bankName || !bankConnection || !policyID) {
        return null;
    }
    const authToken = NetworkStore.getAuthToken();
    const params = {
        authToken: authToken ?? '',
        isNewDot: 'true',
        domainName: PolicyUtils.getDomainNameForPolicy(policyID),
        isCorporate: 'true',
        scrapeMinDate: '',
    };
    const bank = CONST_1.default.COMPANY_CARDS.BANK_CONNECTIONS[bankConnection];
    // The Amex connection whitelists only our production servers, so we need to always use the production API for American Express
    const forceProductionAPI = bank === CONST_1.default.COMPANY_CARDS.BANK_CONNECTIONS.AMEX;
    const commandURL = (0, ApiUtils_1.getApiRoot)({
        shouldSkipWebProxy: true,
        command: '',
    }, forceProductionAPI);
    return `${commandURL}partners/banks/${bank}/oauth_callback.php?${new URLSearchParams(params).toString()}`;
}
function getCompanyCardPlaidConnection(policyID, publicToken, feed, feedName, country, plaidAccounts) {
    if (!policyID || !publicToken || !feed || !feedName || !country || !plaidAccounts?.length) {
        return null;
    }
    const authToken = NetworkStore.getAuthToken();
    const params = {
        authToken: authToken ?? '',
        feed,
        feedName,
        publicToken,
        country,
        domainName: PolicyUtils.getDomainNameForPolicy(policyID),
        plaidAccounts: JSON.stringify(plaidAccounts),
    };
    const commandURL = (0, ApiUtils_1.getApiRoot)({
        shouldSkipWebProxy: true,
        command: '',
    });
    return `${commandURL}partners/banks/plaid/oauth_callback.php?${new URLSearchParams(params).toString()}`;
}
