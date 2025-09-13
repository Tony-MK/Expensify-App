"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useScrollBlocker;
var react_1 = require("react");
/**
 * A hook that tracks scrolling state to block certain actions during scroll events.
 * Since scroll events don't provide an "end" callback, this implements uses a timeout
 * to detect when scrolling has likely stopped (300ms delay).
 */
function useScrollBlocker() {
    var _a = (0, react_1.useState)(false), isScrolling = _a[0], setIsScrolling = _a[1];
    var scrollTimeoutRef = (0, react_1.useRef)(null);
    var startScrollBlock = (0, react_1.useCallback)(function () {
        setIsScrolling(true);
    }, []);
    var endScrollBlock = (0, react_1.useCallback)(function () {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(function () {
            setIsScrolling(false);
        }, 300);
    }, []);
    (0, react_1.useEffect)(function () {
        return function () {
            if (!scrollTimeoutRef.current) {
                return;
            }
            clearTimeout(scrollTimeoutRef.current);
        };
    }, []);
    return { isScrolling: isScrolling, startScrollBlock: startScrollBlock, endScrollBlock: endScrollBlock };
}
