"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shouldSetSelectionRange_1 = require("@libs/shouldSetSelectionRange");
const setSelectionRange = (0, shouldSetSelectionRange_1.default)();
const setTextInputSelection = (textInput, forcedSelectionRange) => {
    if (setSelectionRange) {
        textInput.setSelectionRange?.(forcedSelectionRange.start, forcedSelectionRange.end);
    }
    else {
        textInput.setSelection?.(forcedSelectionRange.start, forcedSelectionRange.end);
    }
};
exports.default = setTextInputSelection;
