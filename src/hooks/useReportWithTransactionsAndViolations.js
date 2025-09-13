"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var useNetwork_1 = require("./useNetwork");
var useOnyx_1 = require("./useOnyx");
var DEFAULT_TRANSACTIONS = {};
var DEFAULT_FILTERED_TRANSACTIONS = [];
var DEFAULT_VIOLATIONS = {};
function useReportWithTransactionsAndViolations(reportID) {
    var _a;
    var report = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(reportID), { canBeMissing: false })[0];
    // It connects to single Onyx instance held in OnyxListItemProvider, so it can be safely used in list items without affecting performance.
    var allReportTransactionsAndViolations = (0, OnyxListItemProvider_1.useAllReportsTransactionsAndViolations)();
    var _b = (_a = allReportTransactionsAndViolations === null || allReportTransactionsAndViolations === void 0 ? void 0 : allReportTransactionsAndViolations[reportID !== null && reportID !== void 0 ? reportID : CONST_1.default.DEFAULT_NUMBER_ID]) !== null && _a !== void 0 ? _a : { transactions: DEFAULT_TRANSACTIONS, violations: DEFAULT_VIOLATIONS }, transactions = _b.transactions, violations = _b.violations;
    var isOffline = (0, useNetwork_1.default)().isOffline;
    var filteredTransactions = (0, react_1.useMemo)(function () { return Object.values(transactions).filter(function (transaction) { return isOffline || (transaction === null || transaction === void 0 ? void 0 : transaction.pendingAction) !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE; }); }, [transactions, isOffline]);
    return [report, filteredTransactions !== null && filteredTransactions !== void 0 ? filteredTransactions : DEFAULT_FILTERED_TRANSACTIONS, violations];
}
exports.default = useReportWithTransactionsAndViolations;
