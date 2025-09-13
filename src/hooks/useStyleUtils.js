"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ThemeStylesContext_1 = require("@styles/theme/context/ThemeStylesContext");
function useStyleUtils() {
    const themeStylesContext = (0, react_1.useContext)(ThemeStylesContext_1.default);
    if (!themeStylesContext) {
        throw new Error('ThemeStylesContext was null! Are you sure that you wrapped the component under a <ThemeStylesProvider>?');
    }
    return themeStylesContext.StyleUtils;
}
exports.default = useStyleUtils;
