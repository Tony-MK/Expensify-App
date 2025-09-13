"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openPlaidBankAccountSelector = openPlaidBankAccountSelector;
exports.openPlaidBankLogin = openPlaidBankLogin;
exports.openPlaidCompanyCardLogin = openPlaidCompanyCardLogin;
exports.importPlaidAccounts = importPlaidAccounts;
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const getPlaidLinkTokenParameters_1 = require("@libs/getPlaidLinkTokenParameters");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
/**
 * Gets the Plaid Link token used to initialize the Plaid SDK
 */
function openPlaidBankLogin(allowDebit, bankAccountID) {
    // redirect_uri needs to be in kebab case convention because that's how it's passed to the backend
    const { redirectURI, androidPackage } = (0, getPlaidLinkTokenParameters_1.default)();
    const params = {
        redirectURI,
        androidPackage,
        allowDebit,
        bankAccountID,
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.PLAID_DATA,
            value: { ...CONST_1.default.PLAID.DEFAULT_DATA, isLoading: true },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.PLAID_LINK_TOKEN,
            value: '',
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT,
            value: {
                plaidAccountID: '',
            },
        },
    ];
    API.read(types_1.READ_COMMANDS.OPEN_PLAID_BANK_LOGIN, params, { optimisticData });
}
/**
 * Gets the Plaid Link token used to initialize the Plaid SDK for Company card
 */
function openPlaidCompanyCardLogin(country, domain, feed) {
    const { redirectURI, androidPackage } = (0, getPlaidLinkTokenParameters_1.default)();
    const params = {
        redirectURI,
        androidPackage,
        country,
        domain,
        feed,
    };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.PLAID_DATA,
            value: { ...CONST_1.default.PLAID.DEFAULT_DATA, isLoading: true },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.SET,
            key: ONYXKEYS_1.default.PLAID_LINK_TOKEN,
            value: '',
        },
    ];
    API.read(types_1.READ_COMMANDS.OPEN_PLAID_CARDS_BANK_LOGIN, params, { optimisticData });
}
function openPlaidBankAccountSelector(publicToken, bankName, allowDebit, bankAccountID) {
    const parameters = {
        publicToken,
        allowDebit,
        bank: bankName,
        bankAccountID,
    };
    API.read(types_1.READ_COMMANDS.OPEN_PLAID_BANK_ACCOUNT_SELECTOR, parameters, {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PLAID_DATA,
                value: {
                    isLoading: true,
                    errors: null,
                    bankName,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PLAID_DATA,
                value: {
                    isLoading: false,
                    errors: null,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.PLAID_DATA,
                value: {
                    isLoading: false,
                },
            },
        ],
    });
}
function importPlaidAccounts(publicToken, feed, feedName, country, domainName, plaidAccounts, statementPeriodEnd, statementPeriodEndDay) {
    const parameters = {
        publicToken,
        feed,
        feedName,
        country,
        domainName,
        plaidAccounts,
        statementPeriodEnd,
        statementPeriodEndDay,
    };
    API.write(types_1.WRITE_COMMANDS.IMPORT_PLAID_ACCOUNTS, parameters);
}
