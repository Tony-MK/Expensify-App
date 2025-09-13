"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItemGroupContext = void 0;
const react_1 = require("react");
const useSingleExecution_1 = require("@hooks/useSingleExecution");
const useWaitForNavigation_1 = require("@hooks/useWaitForNavigation");
const MenuItemGroupContext = (0, react_1.createContext)(undefined);
exports.MenuItemGroupContext = MenuItemGroupContext;
function MenuItemGroup({ children, shouldUseSingleExecution = true }) {
    const { isExecuting, singleExecution } = (0, useSingleExecution_1.default)();
    const waitForNavigate = (0, useWaitForNavigation_1.default)();
    const value = (0, react_1.useMemo)(() => (shouldUseSingleExecution ? { isExecuting, singleExecution, waitForNavigate } : undefined), [shouldUseSingleExecution, isExecuting, singleExecution, waitForNavigate]);
    return <MenuItemGroupContext.Provider value={value}>{children}</MenuItemGroupContext.Provider>;
}
exports.default = MenuItemGroup;
