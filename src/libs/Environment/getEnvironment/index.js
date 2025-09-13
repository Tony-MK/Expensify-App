"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_config_1 = require("react-native-config");
const CONST_1 = require("@src/CONST");
function getEnvironment() {
    return Promise.resolve(react_native_config_1.default?.ENVIRONMENT ?? CONST_1.default.ENVIRONMENT.DEV);
}
exports.default = getEnvironment;
