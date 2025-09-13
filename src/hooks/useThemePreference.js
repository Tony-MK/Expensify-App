"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
function useThemePreference() {
    const [preferredThemeFromStorage] = (0, useOnyx_1.default)(ONYXKEYS_1.default.PREFERRED_THEME, { canBeMissing: true });
    const systemTheme = (0, react_native_1.useColorScheme)();
    const themePreference = (0, react_1.useMemo)(() => {
        const theme = preferredThemeFromStorage ?? CONST_1.default.THEME.DEFAULT;
        // If the user chooses to use the device theme settings, set the theme preference to the system theme
        return theme === CONST_1.default.THEME.SYSTEM ? (systemTheme ?? CONST_1.default.THEME.FALLBACK) : theme;
    }, [preferredThemeFromStorage, systemTheme]);
    return themePreference;
}
exports.default = useThemePreference;
