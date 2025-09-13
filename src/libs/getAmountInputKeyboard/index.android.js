"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
const getAmountInputKeyboard = () => {
    return {
        keyboardType: CONST_1.default.KEYBOARD_TYPE.DECIMAL_PAD,
        inputMode: CONST_1.default.INPUT_MODE.DECIMAL,
    };
};
exports.default = getAmountInputKeyboard;
