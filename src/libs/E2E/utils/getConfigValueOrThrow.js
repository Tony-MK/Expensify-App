"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getConfigValueOrThrow;
const react_native_config_1 = require("react-native-config");
/**
 * Gets a config value or throws an error if the value is not defined.
 */
function getConfigValueOrThrow(key, config = react_native_config_1.default) {
    const value = config[key];
    if (value == null) {
        throw new Error(`Missing config value for ${key}`);
    }
    return value;
}
