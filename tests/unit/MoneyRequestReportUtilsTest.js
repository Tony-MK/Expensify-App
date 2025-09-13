"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MoneyRequestReportUtils_1 = require("@libs/MoneyRequestReportUtils");
const CONST_1 = require("@src/CONST");
const transactionItemBaseMock = {
    reportID: 'report123',
    transactionThreadReportID: 'thread123',
};
describe('MoneyRequestReportUtils', () => {
    describe('getReportIDForTransaction', () => {
        it('returns transaction thread ID if its not from one transaction report', () => {
            const transactionItem = { ...transactionItemBaseMock };
            const resultID = (0, MoneyRequestReportUtils_1.getReportIDForTransaction)(transactionItem);
            expect(resultID).toBe('thread123');
        });
        it('returns transaction thread ID if its from self DM', () => {
            const transactionItem = { ...transactionItemBaseMock, reportID: CONST_1.default.REPORT.UNREPORTED_REPORT_ID };
            const resultID = (0, MoneyRequestReportUtils_1.getReportIDForTransaction)(transactionItem);
            expect(resultID).toBe('thread123');
        });
        it('returns expense reportID if its from one transaction report', () => {
            const transactionItem = { ...transactionItemBaseMock, isFromOneTransactionReport: true };
            const resultID = (0, MoneyRequestReportUtils_1.getReportIDForTransaction)(transactionItem);
            expect(resultID).toBe('report123');
        });
        it('returns reportID if transaction thread ID is 0 - unreported', () => {
            const transactionItem = { ...transactionItemBaseMock, transactionThreadReportID: CONST_1.default.REPORT.UNREPORTED_REPORT_ID };
            const resultID = (0, MoneyRequestReportUtils_1.getReportIDForTransaction)(transactionItem);
            expect(resultID).toBe('report123');
        });
    });
});
