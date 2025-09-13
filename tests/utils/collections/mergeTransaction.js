"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createRandomMergeTransaction;
const falso_1 = require("@ngneat/falso");
const date_fns_1 = require("date-fns");
const CONST_1 = require("@src/CONST");
const transaction_1 = require("./transaction");
function createRandomMergeTransaction(index) {
    return {
        targetTransactionID: index.toString(),
        sourceTransactionID: (0, falso_1.randWord)(),
        eligibleTransactions: [(0, transaction_1.default)(0), (0, transaction_1.default)(1)],
        amount: (0, falso_1.randAmount)(),
        currency: CONST_1.default.CURRENCY.USD,
        merchant: (0, falso_1.randWord)(),
        category: (0, falso_1.randWord)(),
        tag: (0, falso_1.randWord)(),
        description: (0, falso_1.randWord)(),
        comment: {
            comment: (0, falso_1.randWord)(),
        },
        reimbursable: (0, falso_1.randBoolean)(),
        billable: (0, falso_1.randBoolean)(),
        receipt: {},
        created: (0, date_fns_1.format)((0, falso_1.randPastDate)(), CONST_1.default.DATE.FNS_DB_FORMAT_STRING),
        reportID: index.toString(),
    };
}
