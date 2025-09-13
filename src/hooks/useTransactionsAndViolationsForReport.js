"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var CONST_1 = require("@src/CONST");
var DEFAULT_RETURN_VALUE = { transactions: {}, violations: {} };
function useTransactionsAndViolationsForReport(reportID) {
    var _a;
    var allReportsTransactionsAndViolations = (0, OnyxListItemProvider_1.useAllReportsTransactionsAndViolations)();
    if (!reportID) {
        return DEFAULT_RETURN_VALUE;
    }
    return (_a = allReportsTransactionsAndViolations === null || allReportsTransactionsAndViolations === void 0 ? void 0 : allReportsTransactionsAndViolations[reportID !== null && reportID !== void 0 ? reportID : CONST_1.default.DEFAULT_NUMBER_ID]) !== null && _a !== void 0 ? _a : DEFAULT_RETURN_VALUE;
}
exports.default = useTransactionsAndViolationsForReport;
