"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const useThemePreference_1 = require("./useThemePreference");
const useThemePreferenceWithStaticOverride = (staticThemePreference) => {
    const dynamicThemePreference = (0, useThemePreference_1.default)();
    // If the "theme" prop is provided, we'll want to use a hardcoded/static theme instead of the currently selected dynamic theme
    // This is used for example on the "SignInPage", because it should always display in dark mode.
    const themePreference = staticThemePreference ?? dynamicThemePreference;
    return themePreference;
};
exports.default = useThemePreferenceWithStaticOverride;
