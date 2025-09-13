"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialURLContext = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
/** Initial url that will be opened when NewDot is embedded into Hybrid App. */
const InitialURLContext = (0, react_1.createContext)({
    initialURL: null,
    setInitialURL: () => { },
    isAuthenticatedAtStartup: false,
    setIsAuthenticatedAtStartup: () => { },
});
exports.InitialURLContext = InitialURLContext;
function InitialURLContextProvider({ children }) {
    const [initialURL, setInitialURL] = (0, react_1.useState)(null);
    const [isAuthenticatedAtStartup, setIsAuthenticatedAtStartup] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        react_native_1.Linking.getInitialURL().then((initURL) => {
            if (!initURL) {
                return;
            }
            setInitialURL(initURL);
        });
    }, []);
    const initialUrlContext = (0, react_1.useMemo)(() => ({
        initialURL,
        setInitialURL,
        isAuthenticatedAtStartup,
        setIsAuthenticatedAtStartup,
    }), [initialURL, isAuthenticatedAtStartup]);
    return <InitialURLContext.Provider value={initialUrlContext}>{children}</InitialURLContext.Provider>;
}
InitialURLContextProvider.displayName = 'InitialURLContextProvider';
exports.default = InitialURLContextProvider;
