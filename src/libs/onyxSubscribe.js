"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
/**
 * Connect to onyx data. Same params as Onyx.connect(), but returns a function to unsubscribe.
 *
 * @param mapping Same as for Onyx.connect()
 * @return Unsubscribe callback
 */
function onyxSubscribe(mapping) {
    const connection = react_native_onyx_1.default.connect(mapping);
    return () => react_native_onyx_1.default.disconnect(connection);
}
exports.default = onyxSubscribe;
