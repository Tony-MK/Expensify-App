"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestNotifications = exports.requestMultiple = exports.requestLocationAccuracy = exports.request = exports.openSettings = exports.openLimitedPhotoLibraryPicker = exports.checkNotifications = exports.checkMultiple = exports.checkLocationAccuracy = exports.check = exports.RESULTS = exports.PERMISSIONS = void 0;
const permissions_1 = require("react-native-permissions/dist/commonjs/permissions");
Object.defineProperty(exports, "PERMISSIONS", { enumerable: true, get: function () { return permissions_1.PERMISSIONS; } });
Object.defineProperty(exports, "RESULTS", { enumerable: true, get: function () { return permissions_1.RESULTS; } });
const openLimitedPhotoLibraryPicker = jest.fn(() => { });
exports.openLimitedPhotoLibraryPicker = openLimitedPhotoLibraryPicker;
const openSettings = jest.fn(() => { });
exports.openSettings = openSettings;
const check = jest.fn(() => permissions_1.RESULTS.GRANTED);
exports.check = check;
const request = jest.fn(() => permissions_1.RESULTS.GRANTED);
exports.request = request;
const checkLocationAccuracy = jest.fn(() => 'full');
exports.checkLocationAccuracy = checkLocationAccuracy;
const requestLocationAccuracy = jest.fn(() => 'full');
exports.requestLocationAccuracy = requestLocationAccuracy;
const notificationOptions = ['alert', 'badge', 'sound', 'carPlay', 'criticalAlert', 'provisional'];
const notificationSettings = {
    alert: true,
    badge: true,
    sound: true,
    carPlay: true,
    criticalAlert: true,
    provisional: true,
    lockScreen: true,
    notificationCenter: true,
};
const checkNotifications = jest.fn(() => ({
    status: permissions_1.RESULTS.GRANTED,
    settings: notificationSettings,
}));
exports.checkNotifications = checkNotifications;
const requestNotifications = jest.fn((options) => ({
    status: permissions_1.RESULTS.GRANTED,
    settings: Object.keys(options)
        .filter((option) => notificationOptions.includes(option))
        .reduce((acc, option) => {
        acc[option] = true;
        return acc;
    }, {
        lockScreen: true,
        notificationCenter: true,
    }),
}));
exports.requestNotifications = requestNotifications;
const checkMultiple = jest.fn((permissions) => permissions.reduce((acc, permission) => {
    acc[permission] = permissions_1.RESULTS.GRANTED;
    return acc;
}, {}));
exports.checkMultiple = checkMultiple;
const requestMultiple = jest.fn((permissions) => permissions.reduce((acc, permission) => {
    acc[permission] = permissions_1.RESULTS.GRANTED;
    return acc;
}, {}));
exports.requestMultiple = requestMultiple;
