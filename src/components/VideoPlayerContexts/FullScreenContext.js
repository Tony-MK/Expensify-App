"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullScreenContext = void 0;
exports.FullScreenContextProvider = FullScreenContextProvider;
exports.useFullScreenContext = useFullScreenContext;
const react_1 = require("react");
const Context = react_1.default.createContext(null);
exports.FullScreenContext = Context;
function FullScreenContextProvider({ children }) {
    const isFullScreenRef = (0, react_1.useRef)(false);
    const lockedWindowDimensionsRef = (0, react_1.useRef)(null);
    const lockWindowDimensions = (0, react_1.useCallback)((newResponsiveLayoutProperties) => {
        lockedWindowDimensionsRef.current = newResponsiveLayoutProperties;
    }, []);
    const unlockWindowDimensions = (0, react_1.useCallback)(() => {
        lockedWindowDimensionsRef.current = null;
    }, []);
    const contextValue = (0, react_1.useMemo)(() => ({ isFullScreenRef, lockedWindowDimensionsRef, lockWindowDimensions, unlockWindowDimensions }), [lockWindowDimensions, unlockWindowDimensions]);
    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
function useFullScreenContext() {
    const fullscreenContext = (0, react_1.useContext)(Context);
    if (!fullscreenContext) {
        throw new Error('useFullScreenContext must be used within a FullScreenContextProvider');
    }
    return fullscreenContext;
}
FullScreenContextProvider.displayName = 'FullScreenContextProvider';
