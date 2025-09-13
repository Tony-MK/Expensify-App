"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const CONST_1 = require("@src/CONST");
/**
 * This hook tracks scroll events and emits a "scrolling" event when scrolling starts and ends.
 */
const useScrollEventEmitter = () => {
    const isScrollingRef = (0, react_1.useRef)(false);
    const timeoutRef = (0, react_1.useRef)(null);
    const triggerScrollEvent = (0, react_1.useCallback)(() => {
        const emitScrolling = (isScrolling) => {
            react_native_1.DeviceEventEmitter.emit(CONST_1.default.EVENTS.SCROLLING, {
                isScrolling,
            });
        };
        // Start emitting the scrolling event when the scroll begins
        if (!isScrollingRef.current) {
            emitScrolling(true);
            isScrollingRef.current = true;
        }
        // End the scroll and emit after a brief timeout to detect the end of scrolling
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            emitScrolling(false);
            isScrollingRef.current = false;
        }, 250);
    }, []);
    // Cleanup timeout on unmount
    (0, react_1.useEffect)(() => {
        return () => {
            if (!timeoutRef.current) {
                return;
            }
            clearTimeout(timeoutRef.current);
        };
    }, []);
    return triggerScrollEvent;
};
exports.default = useScrollEventEmitter;
