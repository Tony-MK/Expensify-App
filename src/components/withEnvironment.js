"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentContext = void 0;
exports.EnvironmentProvider = EnvironmentProvider;
const react_1 = require("react");
const Environment_1 = require("@libs/Environment/Environment");
const CONST_1 = require("@src/CONST");
const EnvironmentContext = (0, react_1.createContext)({
    environment: CONST_1.default.ENVIRONMENT.PRODUCTION,
    environmentURL: CONST_1.default.NEW_EXPENSIFY_URL,
});
exports.EnvironmentContext = EnvironmentContext;
function EnvironmentProvider({ children }) {
    const [environment, setEnvironment] = (0, react_1.useState)(CONST_1.default.ENVIRONMENT.PRODUCTION);
    const [environmentURL, setEnvironmentURL] = (0, react_1.useState)(CONST_1.default.NEW_EXPENSIFY_URL);
    (0, react_1.useEffect)(() => {
        (0, Environment_1.getEnvironment)().then(setEnvironment);
        (0, Environment_1.getEnvironmentURL)().then(setEnvironmentURL);
    }, []);
    const contextValue = (0, react_1.useMemo)(() => ({
        environment,
        environmentURL,
    }), [environment, environmentURL]);
    return <EnvironmentContext.Provider value={contextValue}>{children}</EnvironmentContext.Provider>;
}
EnvironmentProvider.displayName = 'EnvironmentProvider';
