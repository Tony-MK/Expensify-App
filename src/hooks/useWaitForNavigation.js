"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useWaitForNavigation;
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
/**
 * Returns a promise that resolves when navigation finishes.
 * Only use when navigating by react-navigation
 */
function useWaitForNavigation() {
    const resolvePromises = (0, react_1.useRef)([]);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        return () => {
            resolvePromises.current.forEach((resolve) => {
                resolve();
            });
            resolvePromises.current = [];
        };
    }, []));
    return (navigate) => () => {
        navigate();
        return new Promise((resolve) => {
            resolvePromises.current.push(resolve);
        });
    };
}
