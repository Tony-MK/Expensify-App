"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// eslint-disable-next-line no-restricted-imports
const index_1 = require("@styles/index");
// eslint-disable-next-line no-restricted-imports
const utils_1 = require("@styles/utils");
const ThemeStylesContext = react_1.default.createContext({ styles: index_1.defaultStyles, StyleUtils: utils_1.DefaultStyleUtils });
exports.default = ThemeStylesContext;
