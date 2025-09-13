"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserLocation = setUserLocation;
exports.clearUserLocation = clearUserLocation;
const react_native_onyx_1 = require("react-native-onyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
/**
 * Sets the longitude and latitude of user's current location
 */
function setUserLocation({ longitude, latitude }) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.USER_LOCATION, { longitude, latitude });
}
function clearUserLocation() {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.USER_LOCATION, null);
}
