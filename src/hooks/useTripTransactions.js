"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const getEmptyArray_1 = require("@src/types/utils/getEmptyArray");
const useOnyx_1 = require("./useOnyx");
/**
 * Hook to fetch transactions associated with a specific `tripRoom` report.
 *
 * Since trip rooms and their transactions lack a direct connection, this hook
 * fetches all child reports and transactions from Onyx and filters them to derive
 * relevant transactions for the given trip room.
 *
 * @param reportID - The trip room's reportID.
 * @returns Transactions linked to the specified trip room.
 */
function useTripTransactions(reportID) {
    const [tripTransactionReportIDs = (0, getEmptyArray_1.default)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.REPORT, {
        selector: (reports) => Object.values(reports ?? {})
            .filter((report) => report && report.chatReportID === reportID)
            .map((report) => report?.reportID),
    });
    const [tripTransactions = (0, getEmptyArray_1.default)()] = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
        selector: (transactions) => {
            if (!tripTransactionReportIDs.length) {
                return [];
            }
            return Object.values(transactions ?? {}).filter((transaction) => !!transaction && tripTransactionReportIDs.includes(transaction.reportID));
        },
    }, [tripTransactionReportIDs]);
    return tripTransactions;
}
exports.default = useTripTransactions;
