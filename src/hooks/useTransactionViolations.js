"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
var TransactionUtils_1 = require("@libs/TransactionUtils");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var getEmptyArray_1 = require("@src/types/utils/getEmptyArray");
var useOnyx_1 = require("./useOnyx");
function useTransactionViolations(transactionID, shouldShowRterForSettledReport) {
    if (shouldShowRterForSettledReport === void 0) { shouldShowRterForSettledReport = true; }
    var transaction = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION).concat((0, getNonEmptyStringOnyxID_1.default)(transactionID)), {
        canBeMissing: true,
    })[0];
    var _a = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS).concat(transactionID), {
        canBeMissing: true,
    })[0], transactionViolations = _a === void 0 ? (0, getEmptyArray_1.default)() : _a;
    var iouReport = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.REPORT).concat(transaction === null || transaction === void 0 ? void 0 : transaction.reportID), {
        canBeMissing: true,
    })[0];
    var policy = (0, useOnyx_1.default)("".concat(ONYXKEYS_1.default.COLLECTION.POLICY).concat(iouReport === null || iouReport === void 0 ? void 0 : iouReport.policyID), {
        canBeMissing: true,
    })[0];
    return (0, react_1.useMemo)(function () {
        return transactionViolations.filter(function (violation) { return !(0, TransactionUtils_1.isViolationDismissed)(transaction, violation) && (0, TransactionUtils_1.shouldShowViolation)(iouReport, policy, violation.name, shouldShowRterForSettledReport); });
    }, [transaction, transactionViolations, iouReport, policy, shouldShowRterForSettledReport]);
}
exports.default = useTransactionViolations;
