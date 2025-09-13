"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateSessionAuthTokens;
const react_native_onyx_1 = require("react-native-onyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function updateSessionAuthTokens(authToken, encryptedAuthToken) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { authToken, encryptedAuthToken, creationDate: new Date().getTime() });
}
