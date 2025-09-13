"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useDebounceNonReactive;
const debounce_1 = require("lodash/debounce");
const react_1 = require("react");
/**
 * Create and return a debounced function.
 *
 * Every time the identity of any of the arguments changes, the debounce operation will restart (canceling any ongoing debounce).
 * This hook doesn't react on function identity changes and will not cancel the debounce in case of function identity change.
 * This is important because we want to debounce the function call and not the function reference.
 *
 * @param func The function to debounce.
 * @param wait The number of milliseconds to delay.
 * @param options The options object.
 * @param options.leading Specify invoking on the leading edge of the timeout.
 * @param options.maxWait The maximum time func is allowed to be delayed before it’s invoked.
 * @param options.trailing Specify invoking on the trailing edge of the timeout.
 * @returns Returns a function to call the debounced function.
 */
function useDebounceNonReactive(func, wait, options) {
    const funcRef = (0, react_1.useRef)(func); // Store the latest func reference
    const debouncedFnRef = (0, react_1.useRef)(undefined);
    const { leading, maxWait, trailing = true } = options ?? {};
    (0, react_1.useEffect)(() => {
        // Update the funcRef dynamically to avoid recreating debounce
        funcRef.current = func;
    }, [func]);
    // Recreate the debounce instance only if debounce settings change
    (0, react_1.useEffect)(() => {
        const debouncedFn = (0, debounce_1.default)((...args) => {
            funcRef.current(...args); // Use the latest func reference
        }, wait, { leading, maxWait, trailing });
        debouncedFnRef.current = debouncedFn;
        return () => {
            debouncedFn.cancel();
        };
    }, [wait, leading, maxWait, trailing]);
    const debounceCallback = (0, react_1.useCallback)((...args) => {
        debouncedFnRef.current?.(...args);
    }, []);
    // eslint-disable-next-line react-compiler/react-compiler
    return debounceCallback;
}
