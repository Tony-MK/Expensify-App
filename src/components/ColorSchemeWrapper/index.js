"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
function ColorSchemeWrapper({ children }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    return <react_native_1.View style={[styles.flex1, styles.colorSchemeStyle(theme.colorScheme)]}>{children}</react_native_1.View>;
}
exports.default = ColorSchemeWrapper;
