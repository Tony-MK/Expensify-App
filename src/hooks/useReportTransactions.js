"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const getEmptyArray_1 = require("@src/types/utils/getEmptyArray");
const useOnyx_1 = require("./useOnyx");
/**
 * Hook to get all transactions for a specific report
 */
function useReportTransactions(reportID) {
    const [reportTransactions = (0, getEmptyArray_1.default)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
        selector: (transactions) => {
            if (!transactions || !reportID) {
                return [];
            }
            return Object.values(transactions).filter((transaction) => !!transaction && transaction.reportID === reportID);
        },
        canBeMissing: true,
    });
    return reportTransactions;
}
exports.default = useReportTransactions;
