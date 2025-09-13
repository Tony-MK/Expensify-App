"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function callOrReturn(value, ...args) {
    if (typeof value === 'function') {
        return value(...args);
    }
    return value;
}
exports.default = callOrReturn;
