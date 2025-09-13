"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useEnvironment;
const react_1 = require("react");
const withEnvironment_1 = require("@components/withEnvironment");
const CONST_1 = require("@src/CONST");
function useEnvironment() {
    const { environment, environmentURL } = (0, react_1.useContext)(withEnvironment_1.EnvironmentContext);
    return {
        environment,
        environmentURL,
        isProduction: environment === CONST_1.default.ENVIRONMENT.PRODUCTION,
        isDevelopment: environment === CONST_1.default.ENVIRONMENT.DEV,
    };
}
