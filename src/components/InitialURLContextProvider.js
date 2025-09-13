"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialURLContext = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
/** Initial url that will be opened when NewDot is embedded into Hybrid App. */
var InitialURLContext = (0, react_1.createContext)({
    initialURL: null,
    setInitialURL: function () { },
    isAuthenticatedAtStartup: false,
    setIsAuthenticatedAtStartup: function () { },
});
exports.InitialURLContext = InitialURLContext;
function InitialURLContextProvider(_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(null), initialURL = _b[0], setInitialURL = _b[1];
    var _c = (0, react_1.useState)(false), isAuthenticatedAtStartup = _c[0], setIsAuthenticatedAtStartup = _c[1];
    (0, react_1.useEffect)(function () {
        react_native_1.Linking.getInitialURL().then(function (initURL) {
            if (!initURL) {
                return;
            }
            setInitialURL(initURL);
        });
    }, []);
    var initialUrlContext = (0, react_1.useMemo)(function () { return ({
        initialURL: initialURL,
        setInitialURL: setInitialURL,
        isAuthenticatedAtStartup: isAuthenticatedAtStartup,
        setIsAuthenticatedAtStartup: setIsAuthenticatedAtStartup,
    }); }, [initialURL, isAuthenticatedAtStartup]);
    return <InitialURLContext.Provider value={initialUrlContext}>{children}</InitialURLContext.Provider>;
}
InitialURLContextProvider.displayName = 'InitialURLContextProvider';
exports.default = InitialURLContextProvider;
