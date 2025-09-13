"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getScrollPosition({ mobileInputScrollPosition }) {
    if (!mobileInputScrollPosition.current) {
        return {
            scrollValue: 0,
        };
    }
    return {
        scrollValue: mobileInputScrollPosition.current,
    };
}
exports.default = getScrollPosition;
