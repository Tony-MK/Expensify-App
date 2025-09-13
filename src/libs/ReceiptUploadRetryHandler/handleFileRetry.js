"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handleFileRetry;
const IOU = require("@userActions/IOU");
const CONST_1 = require("@src/CONST");
function handleFileRetry(message, file, dismissError, setShouldShowErrorModal) {
    const retryParams = typeof message.retryParams === 'string'
        ? JSON.parse(message.retryParams)
        : message.retryParams;
    switch (message.action) {
        case CONST_1.default.IOU.ACTION_PARAMS.REPLACE_RECEIPT: {
            dismissError();
            const replaceReceiptParams = { ...retryParams };
            replaceReceiptParams.file = file;
            IOU.replaceReceipt(replaceReceiptParams);
            break;
        }
        case CONST_1.default.IOU.ACTION_PARAMS.START_SPLIT_BILL: {
            dismissError();
            const startSplitBillParams = { ...retryParams };
            startSplitBillParams.receipt = file;
            startSplitBillParams.shouldPlaySound = false;
            IOU.startSplitBill(startSplitBillParams);
            break;
        }
        case CONST_1.default.IOU.ACTION_PARAMS.TRACK_EXPENSE: {
            dismissError();
            const trackExpenseParams = { ...retryParams };
            trackExpenseParams.transactionParams.receipt = file;
            trackExpenseParams.isRetry = true;
            trackExpenseParams.shouldPlaySound = false;
            IOU.trackExpense(trackExpenseParams);
            break;
        }
        case CONST_1.default.IOU.ACTION_PARAMS.MONEY_REQUEST: {
            dismissError();
            const requestMoneyParams = { ...retryParams };
            requestMoneyParams.transactionParams.receipt = file;
            requestMoneyParams.isRetry = true;
            requestMoneyParams.shouldPlaySound = false;
            IOU.requestMoney(requestMoneyParams);
            break;
        }
        default:
            setShouldShowErrorModal(true);
            break;
    }
}
