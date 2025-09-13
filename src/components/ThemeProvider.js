"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useDebouncedState_1 = require("@hooks/useDebouncedState");
const useThemePreferenceWithStaticOverride_1 = require("@hooks/useThemePreferenceWithStaticOverride");
const DomUtils_1 = require("@libs/DomUtils");
// eslint-disable-next-line no-restricted-imports
const theme_1 = require("@styles/theme");
const ThemeContext_1 = require("@styles/theme/context/ThemeContext");
function ThemeProvider({ children, theme: staticThemePreference }) {
    const themePreference = (0, useThemePreferenceWithStaticOverride_1.default)(staticThemePreference);
    const [, debouncedTheme, setDebouncedTheme] = (0, useDebouncedState_1.default)(themePreference);
    (0, react_1.useEffect)(() => {
        setDebouncedTheme(themePreference);
    }, [setDebouncedTheme, themePreference]);
    const theme = (0, react_1.useMemo)(() => theme_1.default[debouncedTheme], [debouncedTheme]);
    (0, react_1.useEffect)(() => {
        /*
         * For static themes we don't want to apply the autofill input style globally
         * SignInPageLayout uses static theme and handles this differently.
         */
        if (staticThemePreference) {
            return;
        }
        DomUtils_1.default.addCSS(DomUtils_1.default.getAutofilledInputStyle(theme.text), 'autofill-input');
        // staticThemePreference as it is a property that does not change we don't need it in the dependency array
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, [theme.text]);
    return <ThemeContext_1.default.Provider value={theme}>{children}</ThemeContext_1.default.Provider>;
}
ThemeProvider.displayName = 'ThemeProvider';
exports.default = ThemeProvider;
