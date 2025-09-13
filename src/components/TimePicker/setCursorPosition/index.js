"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setCursorPosition = (position, ref, setSelection) => {
    setSelection({
        start: position,
        end: position,
    });
    ref.current?.focus();
};
exports.default = setCursorPosition;
