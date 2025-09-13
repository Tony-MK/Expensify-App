"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullScreenLoaderContext = void 0;
exports.useFullScreenLoader = useFullScreenLoader;
const react_1 = require("react");
const FullscreenLoadingIndicator_1 = require("./FullscreenLoadingIndicator");
const FullScreenLoaderContext = (0, react_1.createContext)({
    isLoaderVisible: false,
    setIsLoaderVisible: () => { },
});
exports.FullScreenLoaderContext = FullScreenLoaderContext;
function FullScreenLoaderContextProvider({ children }) {
    const [isLoaderVisible, setIsLoaderVisible] = (0, react_1.useState)(false);
    const loaderContext = (0, react_1.useMemo)(() => ({
        isLoaderVisible,
        setIsLoaderVisible,
    }), [isLoaderVisible]);
    return (<FullScreenLoaderContext.Provider value={loaderContext}>
            {children}
            {isLoaderVisible && <FullscreenLoadingIndicator_1.default />}
        </FullScreenLoaderContext.Provider>);
}
function useFullScreenLoader() {
    const context = (0, react_1.useContext)(FullScreenLoaderContext);
    if (!context) {
        throw new Error('useFullScreenLoader must be used within a FullScreenLoaderContextProvider');
    }
    return context;
}
FullScreenLoaderContextProvider.displayName = 'FullScreenLoaderContextProvider';
exports.default = FullScreenLoaderContextProvider;
