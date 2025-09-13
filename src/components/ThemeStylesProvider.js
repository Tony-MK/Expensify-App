"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useTheme_1 = require("@hooks/useTheme");
// eslint-disable-next-line no-restricted-imports
const index_1 = require("@styles/index");
const ThemeStylesContext_1 = require("@styles/theme/context/ThemeStylesContext");
// eslint-disable-next-line no-restricted-imports
const utils_1 = require("@styles/utils");
function ThemeStylesProvider({ children }) {
    const theme = (0, useTheme_1.default)();
    const themeStyles = (0, react_1.useMemo)(() => (0, index_1.default)(theme), [theme]);
    const StyleUtils = (0, react_1.useMemo)(() => (0, utils_1.default)(theme, themeStyles), [theme, themeStyles]);
    const contextValue = (0, react_1.useMemo)(() => ({ styles: themeStyles, StyleUtils }), [themeStyles, StyleUtils]);
    return <ThemeStylesContext_1.default.Provider value={contextValue}>{children}</ThemeStylesContext_1.default.Provider>;
}
ThemeStylesProvider.displayName = 'ThemeStylesProvider';
exports.default = ThemeStylesProvider;
