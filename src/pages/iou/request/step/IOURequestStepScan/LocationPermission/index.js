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
function getLocationPermission() {
    return new Promise((resolve) => {
        if (navigator.geolocation) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                if (result.state === 'prompt') {
                    resolve(react_native_permissions_1.RESULTS.DENIED);
                    return;
                }
                resolve(result.state === 'granted' ? react_native_permissions_1.RESULTS.GRANTED : react_native_permissions_1.RESULTS.BLOCKED);
            });
        }
        else {
            resolve(react_native_permissions_1.RESULTS.UNAVAILABLE);
        }
    });
}
