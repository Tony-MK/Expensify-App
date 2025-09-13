"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CONST_1 = require("@src/CONST");
const usePrevious_1 = require("./usePrevious");
/**
 * This hook returns new transactions that have been added since the last transactions update.
 * This hook should be used only in the context of highlighting the new transactions on the Report table view.
 */
function useNewTransactions(hasOnceLoadedReportActions, transactions) {
    // If we haven't loaded report yet we set previous transactions to undefined.
    const prevTransactions = (0, usePrevious_1.default)(hasOnceLoadedReportActions ? transactions : undefined);
    // We need to skip the first transactions change, to avoid highlighting transactions on the first load.
    const skipFirstTransactionsChange = (0, react_1.useRef)(!hasOnceLoadedReportActions);
    const newTransactions = (0, react_1.useMemo)(() => {
        if (transactions === undefined || prevTransactions === undefined || transactions.length <= prevTransactions.length) {
            return CONST_1.default.EMPTY_ARRAY;
        }
        if (skipFirstTransactionsChange.current) {
            skipFirstTransactionsChange.current = false;
            return CONST_1.default.EMPTY_ARRAY;
        }
        return transactions.filter((transaction) => !prevTransactions?.some((prevTransaction) => prevTransaction.transactionID === transaction.transactionID));
        // Depending only on transactions is enough because prevTransactions is a helper object.
        // eslint-disable-next-line react-compiler/react-compiler
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactions]);
    // In case when we have loaded the report, but there were no transactions in it, then we need to explicitly set skipFirstTransactionsChange to false, as it will be not set in the useMemo above.
    (0, react_1.useEffect)(() => {
        if (!hasOnceLoadedReportActions) {
            return;
        }
        // This is needed to ensure that set we skipFirstTransactionsChange to false only after the Onyx merge is done.
        new Promise((resolve) => {
            resolve();
        }).then(() => {
            requestAnimationFrame(() => {
                skipFirstTransactionsChange.current = false;
            });
        });
    }, [hasOnceLoadedReportActions]);
    return newTransactions;
}
exports.default = useNewTransactions;
