"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestContactPermission = requestContactPermission;
exports.getContactPermission = getContactPermission;
const react_native_permissions_1 = require("react-native-permissions");
function requestContactPermission() {
    return new Promise((resolve) => {
        resolve(react_native_permissions_1.RESULTS.GRANTED);
    });
}
function getContactPermission() {
    return new Promise((resolve) => {
        resolve(react_native_permissions_1.RESULTS.GRANTED);
    });
}
