"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDerivedValue = exports.hasKeyTriggeredCompute = void 0;
var react_native_onyx_1 = require("react-native-onyx");
/**
 * Check if a specific key exists in sourceValue from OnyxDerived
 */
var hasKeyTriggeredCompute = function (key, sourceValues) {
    if (!sourceValues) {
        return false;
    }
    return Object.keys(sourceValues).some(function (sourceKey) { return sourceKey === key; });
};
exports.hasKeyTriggeredCompute = hasKeyTriggeredCompute;
/**
 * Set a derived value in Onyx
 * As a performance optimization, it skips the cache check and null removal
 * For derived values, we fully control their lifecycle and recompute them when any dependency changes - so we don’t need a deep comparison
 * Also, null may be a legitimate result of the computation, so pruning it is unnecessary
 */
var setDerivedValue = function (key, value) {
    return react_native_onyx_1.default.set(key, value, {
        skipCacheCheck: true,
    });
};
exports.setDerivedValue = setDerivedValue;
