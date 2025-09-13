"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveElementRoleContext = void 0;
const react_1 = require("react");
const ActiveElementRoleContext = react_1.default.createContext({
    role: null,
});
exports.ActiveElementRoleContext = ActiveElementRoleContext;
function ActiveElementRoleProvider({ children }) {
    const value = react_1.default.useMemo(() => ({
        role: null,
    }), []);
    return <ActiveElementRoleContext.Provider value={value}>{children}</ActiveElementRoleContext.Provider>;
}
exports.default = ActiveElementRoleProvider;
