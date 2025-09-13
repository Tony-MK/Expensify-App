"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debounce_1 = require("lodash/debounce");
const react_1 = require("react");
/**
 * Custom hook to track if the window is being resized.
 * It sets a state variable `isResizing` to true when a resize event occurs,
 * and sets it back to false after 1 second of inactivity.
 */
function useIsResizing() {
    const [isResizing, setIsResizing] = (0, react_1.useState)(false);
    const debouncedSetIsResizing = (0, react_1.useMemo)(() => (0, debounce_1.default)(() => {
        if (!isResizing) {
            return;
        }
        // Set isResizing to false after 500 milliseconds of inactivity (no resize events emitted)
        setIsResizing(false);
    }, 500), [isResizing]);
    (0, react_1.useEffect)(() => {
        const handleResize = () => {
            if (!isResizing) {
                setIsResizing(true);
            }
            debouncedSetIsResizing();
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            debouncedSetIsResizing.cancel();
        };
    }, [isResizing, debouncedSetIsResizing]);
    return isResizing;
}
exports.default = useIsResizing;
