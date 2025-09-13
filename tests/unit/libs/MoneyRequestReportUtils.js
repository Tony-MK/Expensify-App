"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MoneyRequestReportUtils_1 = require("@libs/MoneyRequestReportUtils");
const actions_1 = require("../../../__mocks__/reportData/actions");
const transactions_1 = require("../../../__mocks__/reportData/transactions");
describe('getThreadReportIDsForTransactions', () => {
    test('returns empty list for no transactions', () => {
        const result = (0, MoneyRequestReportUtils_1.getThreadReportIDsForTransactions)([actions_1.actionR14932], []);
        expect(result).toEqual([]);
    });
    test('returns empty list for transactions but no reportActions', () => {
        const result = (0, MoneyRequestReportUtils_1.getThreadReportIDsForTransactions)([], [transactions_1.transactionR14932]);
        expect(result).toEqual([]);
    });
    test('returns list of reportIDs for transactions which have matching reportActions', () => {
        const reportActions = [actions_1.actionR14932, actions_1.actionR98765];
        const transactions = [{ ...transactions_1.transactionR14932 }, { ...transactions_1.transactionR98765 }];
        const result = (0, MoneyRequestReportUtils_1.getThreadReportIDsForTransactions)(reportActions, transactions);
        expect(result).toEqual(['CHILD_REPORT_ID_R14932', 'CHILD_REPORT_ID_R98765']);
    });
    test('returns empty list for transactions which have no matching reportActions', () => {
        // fakeAction456 has originalMessage with undefined id, so cannot be mapped
        const reportActions = [{ ...actions_1.actionR98765, originalMessage: {} }];
        const transactions = [{ ...transactions_1.transactionR14932 }, { ...transactions_1.transactionR98765 }];
        const result = (0, MoneyRequestReportUtils_1.getThreadReportIDsForTransactions)(reportActions, transactions);
        expect(result).toEqual([]);
    });
});
