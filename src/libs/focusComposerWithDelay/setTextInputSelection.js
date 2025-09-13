"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shouldSetSelectionRange_1 = require("@libs/shouldSetSelectionRange");
var setSelectionRange = (0, shouldSetSelectionRange_1.default)();
var setTextInputSelection = function (textInput, forcedSelectionRange) {
    var _a, _b, _c, _d;
    if (setSelectionRange) {
        (_b = (_a = textInput).setSelectionRange) === null || _b === void 0 ? void 0 : _b.call(_a, forcedSelectionRange.start, forcedSelectionRange.end);
    }
    else {
        (_d = (_c = textInput).setSelection) === null || _d === void 0 ? void 0 : _d.call(_c, forcedSelectionRange.start, forcedSelectionRange.end);
    }
};
exports.default = setTextInputSelection;
