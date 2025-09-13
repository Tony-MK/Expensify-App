"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
// Signin page has its separate Statusbar and ThemeProvider, so when user is on the SignInPage we need to disable the root statusbar so there is no double status bar in component stack, first in Root and other in SignInPage
const CustomStatusBarAndBackgroundContext = (0, react_1.createContext)({ isRootStatusBarEnabled: true, setRootStatusBarEnabled: () => undefined });
exports.default = CustomStatusBarAndBackgroundContext;
