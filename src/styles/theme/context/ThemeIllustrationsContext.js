"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// eslint-disable-next-line no-restricted-imports
const illustrations_1 = require("@styles/theme/illustrations");
const ThemeIllustrationsContext = react_1.default.createContext(illustrations_1.defaultIllustrations);
exports.default = ThemeIllustrationsContext;
