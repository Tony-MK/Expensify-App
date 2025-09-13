"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
/**
 * Check to see if the build is staging (TestFlight) or production
 */
function isBetaBuild() {
    return new Promise((resolve) => {
        react_native_1.NativeModules.EnvironmentChecker.isBeta().then((isBeta) => {
            resolve(isBeta);
        });
    });
}
exports.default = {
    isBetaBuild,
};
