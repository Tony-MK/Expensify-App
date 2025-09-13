"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useSingleExecution;
const react_1 = require("react");
const react_native_1 = require("react-native");
/**
 * With any action passed in, it will only allow 1 such action to occur at a time.
 */
function useSingleExecution() {
    const [isExecuting, setIsExecuting] = (0, react_1.useState)(false);
    const isExecutingRef = (0, react_1.useRef)(undefined);
    // eslint-disable-next-line react-compiler/react-compiler
    isExecutingRef.current = isExecuting;
    const singleExecution = (0, react_1.useCallback)((action) => (...params) => {
        if (isExecutingRef.current) {
            return;
        }
        setIsExecuting(true);
        isExecutingRef.current = true;
        const execution = action(...params);
        react_native_1.InteractionManager.runAfterInteractions(() => {
            if (!(execution instanceof Promise)) {
                setIsExecuting(false);
                return;
            }
            execution.finally(() => {
                setIsExecuting(false);
            });
        });
    }, []);
    return { isExecuting, singleExecution };
}
