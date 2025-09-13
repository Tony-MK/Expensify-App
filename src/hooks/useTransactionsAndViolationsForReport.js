"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const CONST_1 = require("@src/CONST");
const DEFAULT_RETURN_VALUE = { transactions: {}, violations: {} };
function useTransactionsAndViolationsForReport(reportID) {
    const allReportsTransactionsAndViolations = (0, OnyxListItemProvider_1.useAllReportsTransactionsAndViolations)();
    if (!reportID) {
        return DEFAULT_RETURN_VALUE;
    }
    return allReportsTransactionsAndViolations?.[reportID ?? CONST_1.default.DEFAULT_NUMBER_ID] ?? DEFAULT_RETURN_VALUE;
}
exports.default = useTransactionsAndViolationsForReport;
