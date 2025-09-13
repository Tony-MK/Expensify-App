"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_config_1 = require("react-native-config");
const betaChecker_1 = require("@libs/Environment/betaChecker");
const CONST_1 = require("@src/CONST");
let environment = null;
/**
 * Returns a promise that resolves with the current environment string value
 */
function getEnvironment() {
    return new Promise((resolve) => {
        // If we've already set the environment, use the current value
        if (environment) {
            resolve(environment);
            return;
        }
        if ((react_native_config_1.default?.ENVIRONMENT ?? CONST_1.default.ENVIRONMENT.DEV) === CONST_1.default.ENVIRONMENT.DEV) {
            environment = CONST_1.default.ENVIRONMENT.DEV;
            resolve(environment);
            return;
        }
        if ((react_native_config_1.default?.ENVIRONMENT ?? CONST_1.default.ENVIRONMENT.DEV) === CONST_1.default.ENVIRONMENT.ADHOC) {
            environment = CONST_1.default.ENVIRONMENT.ADHOC;
            resolve(environment);
            return;
        }
        // If we haven't set the environment yet and we aren't on dev/adhoc, check to see if this is a beta build
        betaChecker_1.default.isBetaBuild().then((isBeta) => {
            environment = isBeta ? CONST_1.default.ENVIRONMENT.STAGING : CONST_1.default.ENVIRONMENT.PRODUCTION;
            resolve(environment);
        });
    });
}
exports.default = getEnvironment;
