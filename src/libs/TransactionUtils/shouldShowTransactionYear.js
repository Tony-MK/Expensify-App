"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DateUtils_1 = require("@libs/DateUtils");
const index_1 = require("./index");
function shouldShowTransactionYear(transaction) {
    const date = (0, index_1.getCreated)(transaction);
    return DateUtils_1.default.doesDateBelongToAPastYear(date);
}
exports.default = shouldShowTransactionYear;
