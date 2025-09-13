"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const CustomStatusBarAndBackgroundContext_1 = require("./CustomStatusBarAndBackgroundContext");
function CustomStatusBarAndBackgroundContextProvider({ children }) {
    const [isRootStatusBarEnabled, setRootStatusBarEnabled] = (0, react_1.useState)(true);
    const value = (0, react_1.useMemo)(() => ({
        isRootStatusBarEnabled,
        setRootStatusBarEnabled,
    }), [isRootStatusBarEnabled]);
    return <CustomStatusBarAndBackgroundContext_1.default.Provider value={value}>{children}</CustomStatusBarAndBackgroundContext_1.default.Provider>;
}
exports.default = CustomStatusBarAndBackgroundContextProvider;
