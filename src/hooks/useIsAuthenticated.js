"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const useOnyx_1 = require("./useOnyx");
function useIsAuthenticated() {
    const [session] = (0, useOnyx_1.default)(ONYXKEYS_1.default.SESSION);
    const isAuthenticated = (0, react_1.useMemo)(() => !!(session?.authToken ?? null), [session]);
    return isAuthenticated;
}
exports.default = useIsAuthenticated;
