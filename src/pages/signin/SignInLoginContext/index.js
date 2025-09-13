"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
exports.LoginProvider = LoginProvider;
exports.useLogin = useLogin;
const expensify_common_1 = require("expensify-common");
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const defaultLoginContext = {
    login: '',
    setLogin: () => { },
};
const Context = react_1.default.createContext(defaultLoginContext);
exports.Context = Context;
function LoginProvider({ children }) {
    const [credentials] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CREDENTIALS, { canBeMissing: true });
    const [login, setLoginState] = (0, react_1.useState)(() => expensify_common_1.Str.removeSMSDomain(credentials?.login ?? ''));
    const setLogin = (0, react_1.useCallback)((newLogin) => {
        setLoginState(newLogin);
    }, []);
    const loginContext = (0, react_1.useMemo)(() => ({
        login,
        setLogin,
    }), [login, setLogin]);
    return <Context.Provider value={loginContext}>{children}</Context.Provider>;
}
function useLogin() {
    return (0, react_1.useContext)(Context);
}
LoginProvider.displayName = 'LoginProvider';
