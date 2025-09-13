"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomStylesForChildrenContext = void 0;
const react_1 = require("react");
const CustomStylesForChildrenContext = react_1.default.createContext(null);
exports.CustomStylesForChildrenContext = CustomStylesForChildrenContext;
function CustomStylesForChildrenProvider({ children, style }) {
    const value = (0, react_1.useMemo)(() => style, [style]);
    return <CustomStylesForChildrenContext.Provider value={value}>{children}</CustomStylesForChildrenContext.Provider>;
}
CustomStylesForChildrenProvider.displayName = 'CustomStylesForChildrenProvider';
exports.default = CustomStylesForChildrenProvider;
