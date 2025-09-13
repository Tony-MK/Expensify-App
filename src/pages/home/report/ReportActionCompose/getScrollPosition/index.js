"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getScrollPosition({ textInputRef }) {
    let scrollValue = 0;
    if (textInputRef?.current) {
        if ('scrollTop' in textInputRef.current) {
            scrollValue = textInputRef.current.scrollTop;
        }
    }
    return { scrollValue };
}
exports.default = getScrollPosition;
