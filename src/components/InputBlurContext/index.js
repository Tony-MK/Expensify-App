"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInputBlurContext = useInputBlurContext;
exports.InputBlurContextProvider = InputBlurContextProvider;
const react_1 = require("react");
const InputBlurContext = react_1.default.createContext({
    isBlurred: true,
    setIsBlurred: () => { },
});
function InputBlurContextProvider({ children }) {
    const [isBlurred, setIsBlurred] = (0, react_1.useState)(false);
    const contextValue = (0, react_1.useMemo)(() => ({
        isBlurred,
        setIsBlurred,
    }), [isBlurred]);
    return <InputBlurContext.Provider value={contextValue}>{children}</InputBlurContext.Provider>;
}
function useInputBlurContext() {
    return (0, react_1.useContext)(InputBlurContext);
}
