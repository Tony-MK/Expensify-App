"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Browser_1 = require("@libs/Browser");
var CONST_1 = require("@src/CONST");
var getAmountInputKeyboard = function (shouldAllowNegative) {
    if (shouldAllowNegative === void 0) { shouldAllowNegative = false; }
    return {
        keyboardType: (0, Browser_1.isMobileIOS)() && shouldAllowNegative ? CONST_1.default.KEYBOARD_TYPE.NUMBERS_AND_PUNCTUATION : CONST_1.default.KEYBOARD_TYPE.DECIMAL_PAD,
        inputMode: (0, Browser_1.isMobileIOS)() && shouldAllowNegative ? undefined : CONST_1.default.INPUT_MODE.DECIMAL,
    };
};
exports.default = getAmountInputKeyboard;
