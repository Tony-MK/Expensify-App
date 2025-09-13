"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveElementRoleContext = void 0;
const react_1 = require("react");
const ActiveElementRoleContext = react_1.default.createContext({
    role: null,
});
exports.ActiveElementRoleContext = ActiveElementRoleContext;
function ActiveElementRoleProvider({ children }) {
    const [activeRoleRef, setRole] = (0, react_1.useState)(document?.activeElement?.role ?? null);
    const handleFocusIn = () => {
        setRole(document?.activeElement?.role ?? null);
    };
    const handleFocusOut = () => {
        setRole(null);
    };
    (0, react_1.useEffect)(() => {
        document.addEventListener('focusin', handleFocusIn);
        document.addEventListener('focusout', handleFocusOut);
        return () => {
            document.removeEventListener('focusin', handleFocusIn);
            document.removeEventListener('focusout', handleFocusOut);
        };
    }, []);
    const value = react_1.default.useMemo(() => ({
        role: activeRoleRef,
    }), [activeRoleRef]);
    return <ActiveElementRoleContext.Provider value={value}>{children}</ActiveElementRoleContext.Provider>;
}
exports.default = ActiveElementRoleProvider;
