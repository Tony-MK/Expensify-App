"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionWithOptionalSearchFields = void 0;
const CONST_1 = require("@src/CONST");
const transaction = {
    amount: -769900,
    bank: '',
    billable: false,
    cardID: 0,
    cardName: 'Cash Expense',
    cardNumber: '',
    category: 'CARS',
    comment: {
        comment: '',
    },
    created: '2025-02-18',
    currency: 'PLN',
    filename: '',
    hasEReceipt: false,
    inserted: '2025-02-18 14:23:29',
    managedCard: false,
    mcc: '',
    merchant: "Mario's",
    modifiedAmount: 0,
    modifiedCreated: '',
    modifiedCurrency: '',
    modifiedMCC: '',
    modifiedMerchant: '',
    originalAmount: 0,
    originalCurrency: '',
    parentTransactionID: '',
    posted: '',
    receipt: {},
    reimbursable: false,
    reportID: '0',
    status: 'Posted',
    tag: 'private',
    transactionID: '1564303948126109676',
};
const transactionWithOptionalSearchFields = {
    ...transaction,
    from: {
        accountID: 1,
        avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_7.png',
        displayName: 'johnDoe@example.com User',
        login: 'johnDoe@example.com',
    },
    to: {
        accountID: 1,
        avatar: 'https://d2k5nsl2zxldvw.cloudfront.net/images/avatars/avatar_7.png',
        displayName: 'johnDoe@example.com User',
        login: 'johnDoe@example.com',
    },
    action: CONST_1.default.SEARCH.ACTION_TYPES.VIEW,
};
exports.transactionWithOptionalSearchFields = transactionWithOptionalSearchFields;
exports.default = transaction;
