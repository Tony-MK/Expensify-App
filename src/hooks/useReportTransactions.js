"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var getEmptyArray_1 = require("@src/types/utils/getEmptyArray");
var useOnyx_1 = require("./useOnyx");
/**
 * Hook to get all transactions for a specific report
 */
function useReportTransactions(reportID) {
    var _a = (0, useOnyx_1.default)(ONYXKEYS_1.default.COLLECTION.TRANSACTION, {
        selector: function (transactions) {
            if (!transactions || !reportID) {
                return [];
            }
            return Object.values(transactions).filter(function (transaction) { return !!transaction && transaction.reportID === reportID; });
        },
        canBeMissing: true,
    })[0], reportTransactions = _a === void 0 ? (0, getEmptyArray_1.default)() : _a;
    return reportTransactions;
}
exports.default = useReportTransactions;
