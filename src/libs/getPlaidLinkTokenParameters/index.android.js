"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_device_info_1 = require("react-native-device-info");
const getPlaidLinkTokenParameters = () => ({
    androidPackage: react_native_device_info_1.default.getBundleId(),
});
exports.default = getPlaidLinkTokenParameters;
