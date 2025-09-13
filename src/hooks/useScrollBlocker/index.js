"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useScrollBlocker;
const react_1 = require("react");
/**
 * A hook that tracks scrolling state to block certain actions during scroll events.
 * Since scroll events don't provide an "end" callback, this implements uses a timeout
 * to detect when scrolling has likely stopped (300ms delay).
 */
function useScrollBlocker() {
    const [isScrolling, setIsScrolling] = (0, react_1.useState)(false);
    const scrollTimeoutRef = (0, react_1.useRef)(null);
    const startScrollBlock = (0, react_1.useCallback)(() => {
        setIsScrolling(true);
    }, []);
    const endScrollBlock = (0, react_1.useCallback)(() => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
        }, 300);
    }, []);
    (0, react_1.useEffect)(() => {
        return () => {
            if (!scrollTimeoutRef.current) {
                return;
            }
            clearTimeout(scrollTimeoutRef.current);
        };
    }, []);
    return { isScrolling, startScrollBlock, endScrollBlock };
}
