"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OnyxListItemProvider_1 = require("@components/OnyxListItemProvider");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useNetwork_1 = require("./useNetwork");
const useOnyx_1 = require("./useOnyx");
const DEFAULT_TRANSACTIONS = {};
const DEFAULT_FILTERED_TRANSACTIONS = [];
const DEFAULT_VIOLATIONS = {};
function useReportWithTransactionsAndViolations(reportID) {
    const [report] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`, { canBeMissing: false });
    // It connects to single Onyx instance held in OnyxListItemProvider, so it can be safely used in list items without affecting performance.
    const allReportTransactionsAndViolations = (0, OnyxListItemProvider_1.useAllReportsTransactionsAndViolations)();
    const { transactions, violations } = allReportTransactionsAndViolations?.[reportID ?? CONST_1.default.DEFAULT_NUMBER_ID] ?? { transactions: DEFAULT_TRANSACTIONS, violations: DEFAULT_VIOLATIONS };
    const { isOffline } = (0, useNetwork_1.default)();
    const filteredTransactions = (0, react_1.useMemo)(() => Object.values(transactions).filter((transaction) => isOffline || transaction?.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.DELETE), [transactions, isOffline]);
    return [report, filteredTransactions ?? DEFAULT_FILTERED_TRANSACTIONS, violations];
}
exports.default = useReportWithTransactionsAndViolations;
