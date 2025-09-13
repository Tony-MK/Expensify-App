"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrollToRight = exports.moveSelectionToEnd = exports.scrollToBottom = void 0;
const scrollToBottom = (input) => {
    if (!('scrollTop' in input)) {
        return;
    }
    // eslint-disable-next-line no-param-reassign
    input.scrollTop = input.scrollHeight;
};
exports.scrollToBottom = scrollToBottom;
const scrollToRight = (input) => {
    if (!('scrollLeft' in input)) {
        return;
    }
    // Scroll to the far right
    // eslint-disable-next-line no-param-reassign
    input.scrollLeft = input.scrollWidth;
};
exports.scrollToRight = scrollToRight;
const moveSelectionToEnd = (input) => {
    if (!('setSelectionRange' in input)) {
        return;
    }
    const length = input.value.length;
    input.setSelectionRange(length, length);
};
exports.moveSelectionToEnd = moveSelectionToEnd;
