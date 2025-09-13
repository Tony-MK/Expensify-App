"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLocationPermission = requestLocationPermission;
exports.getLocationPermission = getLocationPermission;
const react_native_permissions_1 = require("react-native-permissions");
const CONST_1 = require("@src/CONST");
function requestLocationPermission() {
    return new Promise((resolve) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(() => resolve(react_native_permissions_1.RESULTS.GRANTED), (error) => resolve(error.TIMEOUT || error.POSITION_UNAVAILABLE ? react_native_permissions_1.RESULTS.BLOCKED : react_native_permissions_1.RESULTS.DENIED), {
                timeout: CONST_1.default.GPS.TIMEOUT,
                enableHighAccuracy: true,
            });
        }
        else {
            resolve(react_native_permissions_1.RESULTS.UNAVAILABLE);
        }
    });
}
// Using navigator.permissions.query does not provide accurate results on desktop.
// Therefore, we use getCurrentPosition instead and assume the user has not enabled location services if it reaches timeout.
function getLocationPermission() {
    return new Promise((resolve) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(() => resolve(react_native_permissions_1.RESULTS.GRANTED), (error) => {
                // If user denies permission, error.code will be 1 (PERMISSION_DENIED)
                if (error.code === 1) {
                    resolve(react_native_permissions_1.RESULTS.BLOCKED);
                }
                else if (error.code === 2) {
                    // POSITION_UNAVAILABLE
                    resolve(react_native_permissions_1.RESULTS.BLOCKED);
                }
                else if (error.code === 3) {
                    // TIMEOUT
                    resolve(react_native_permissions_1.RESULTS.BLOCKED);
                }
                else {
                    resolve(react_native_permissions_1.RESULTS.DENIED);
                }
            }, {
                timeout: CONST_1.default.GPS.TIMEOUT,
                enableHighAccuracy: true,
            });
        }
        else {
            resolve(react_native_permissions_1.RESULTS.UNAVAILABLE);
        }
    });
}
