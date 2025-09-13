"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isInputAutoFilled;
const isSelectorSupported_1 = require("./isSelectorSupported");
/**
 * Check the input is auto filled or not
 */
function isInputAutoFilled(input) {
    if ((!!input && !('matches' in input)) || !input?.matches) {
        return false;
    }
    if ((0, isSelectorSupported_1.default)(':autofill')) {
        return input.matches(':-webkit-autofill') || input.matches(':autofill');
    }
    return input.matches(':-webkit-autofill');
}
