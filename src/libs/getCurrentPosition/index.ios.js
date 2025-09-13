"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const geolocation_1 = require("@react-native-community/geolocation");
geolocation_1.default.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'whenInUse',
    locationProvider: 'auto',
});
const getCurrentPosition = (success, error, config) => {
    geolocation_1.default.getCurrentPosition(success, error, config);
};
exports.default = getCurrentPosition;
