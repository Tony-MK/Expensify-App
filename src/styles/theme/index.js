"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTheme = void 0;
const CONST_1 = require("@src/CONST");
const dark_1 = require("./themes/dark");
const light_1 = require("./themes/light");
const themes = {
    [CONST_1.default.THEME.LIGHT]: light_1.default,
    [CONST_1.default.THEME.DARK]: dark_1.default,
};
const defaultTheme = themes[CONST_1.default.THEME.FALLBACK];
exports.defaultTheme = defaultTheme;
exports.default = themes;
