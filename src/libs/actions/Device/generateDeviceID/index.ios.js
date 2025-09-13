"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_device_info_1 = require("react-native-device-info");
const deviceID = react_native_device_info_1.default.getDeviceId();
/**
 * Get the unique ID of the current device. This should remain the same even if the user uninstalls and reinstalls the app.
 */
const generateDeviceID = () => react_native_device_info_1.default.getUniqueId().then((uniqueID) => `${deviceID}_${uniqueID}`);
exports.default = generateDeviceID;
