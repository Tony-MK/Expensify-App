"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setCursorPosition = (position, ref, setSelection) => {
    const selection = {
        start: position,
        end: position,
    };
    setSelection(selection);
    ref.current?.focus();
    ref.current?.setNativeProps({ selection });
};
exports.default = setCursorPosition;
