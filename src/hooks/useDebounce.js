"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useDebounce;
const debounce_1 = require("lodash/debounce");
const react_1 = require("react");
/**
 * Create and return a debounced function.
 *
 * Every time the identity of any of the arguments changes, the debounce operation will restart (canceling any ongoing debounce).
 * This is especially important in the case of func. To prevent that, pass stable references.
 *
 * @param func The function to debounce.
 * @param wait The number of milliseconds to delay.
 * @param options The options object.
 * @param options.leading Specify invoking on the leading edge of the timeout.
 * @param options.maxWait The maximum time func is allowed to be delayed before it’s invoked.
 * @param options.trailing Specify invoking on the trailing edge of the timeout.
 * @returns Returns a function to call the debounced function.
 */
function useDebounce(func, wait, options) {
    const debouncedFnRef = (0, react_1.useRef)(undefined);
    const { leading, maxWait, trailing = true } = options ?? {};
    (0, react_1.useEffect)(() => {
        const debouncedFn = (0, debounce_1.default)(func, wait, { leading, maxWait, trailing });
        debouncedFnRef.current = debouncedFn;
        return () => {
            debouncedFn.cancel();
        };
    }, [func, wait, leading, maxWait, trailing]);
    const debounceCallback = (0, react_1.useCallback)((...args) => {
        const debouncedFn = debouncedFnRef.current;
        if (debouncedFn) {
            debouncedFn(...args);
        }
    }, []);
    // eslint-disable-next-line react-compiler/react-compiler
    return debounceCallback;
}
