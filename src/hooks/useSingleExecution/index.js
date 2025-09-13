"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useSingleExecution;
const react_1 = require("react");
/**
 * This hook was specifically written for native issue
 * more information: https://github.com/Expensify/App/pull/24614 https://github.com/Expensify/App/pull/24173
 * on web we don't need this mechanism so we just call the action directly.
 */
function useSingleExecution() {
    const singleExecution = (0, react_1.useCallback)((action) => (...params) => {
        action?.(...params);
    }, []);
    return { isExecuting: false, singleExecution };
}
