"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplashScreenStateContextProvider = SplashScreenStateContextProvider;
exports.useSplashScreenStateContext = useSplashScreenStateContext;
const react_1 = require("react");
const CONST_1 = require("./CONST");
const SplashScreenStateContext = react_1.default.createContext({
    splashScreenState: CONST_1.default.BOOT_SPLASH_STATE.VISIBLE,
    setSplashScreenState: () => { },
});
function SplashScreenStateContextProvider({ children }) {
    const [splashScreenState, setSplashScreenState] = (0, react_1.useState)(CONST_1.default.BOOT_SPLASH_STATE.VISIBLE);
    const splashScreenStateContext = (0, react_1.useMemo)(() => ({
        splashScreenState,
        setSplashScreenState,
    }), [splashScreenState]);
    return <SplashScreenStateContext.Provider value={splashScreenStateContext}>{children}</SplashScreenStateContext.Provider>;
}
function useSplashScreenStateContext() {
    return (0, react_1.useContext)(SplashScreenStateContext);
}
exports.default = SplashScreenStateContext;
