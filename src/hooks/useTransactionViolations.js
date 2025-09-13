"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const getNonEmptyStringOnyxID_1 = require("@libs/getNonEmptyStringOnyxID");
const TransactionUtils_1 = require("@libs/TransactionUtils");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const getEmptyArray_1 = require("@src/types/utils/getEmptyArray");
const useOnyx_1 = require("./useOnyx");
function useTransactionViolations(transactionID, shouldShowRterForSettledReport = true) {
    const [transaction] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION}${(0, getNonEmptyStringOnyxID_1.default)(transactionID)}`, {
        canBeMissing: true,
    });
    const [transactionViolations = (0, getEmptyArray_1.default)()] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.TRANSACTION_VIOLATIONS}${transactionID}`, {
        canBeMissing: true,
    });
    const [iouReport] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.REPORT}${transaction?.reportID}`, {
        canBeMissing: true,
    });
    const [policy] = (0, useOnyx_1.default)(`${ONYXKEYS_1.default.COLLECTION.POLICY}${iouReport?.policyID}`, {
        canBeMissing: true,
    });
    return (0, react_1.useMemo)(() => transactionViolations.filter((violation) => !(0, TransactionUtils_1.isViolationDismissed)(transaction, violation) && (0, TransactionUtils_1.shouldShowViolation)(iouReport, policy, violation.name, shouldShowRterForSettledReport)), [transaction, transactionViolations, iouReport, policy, shouldShowRterForSettledReport]);
}
exports.default = useTransactionViolations;
