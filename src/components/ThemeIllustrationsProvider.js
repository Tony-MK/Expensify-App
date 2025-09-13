"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useThemePreference_1 = require("@hooks/useThemePreference");
const ThemeIllustrationsContext_1 = require("@styles/theme/context/ThemeIllustrationsContext");
// eslint-disable-next-line no-restricted-imports
const illustrations_1 = require("@styles/theme/illustrations");
function ThemeIllustrationsProvider({ children }) {
    const themePreference = (0, useThemePreference_1.default)();
    const themeIllustrations = (0, react_1.useMemo)(() => illustrations_1.default[themePreference], [themePreference]);
    return <ThemeIllustrationsContext_1.default.Provider value={themeIllustrations}>{children}</ThemeIllustrationsContext_1.default.Provider>;
}
ThemeIllustrationsProvider.displayName = 'ThemeIllustrationsProvider';
exports.default = ThemeIllustrationsProvider;
