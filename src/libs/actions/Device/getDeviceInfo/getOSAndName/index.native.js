"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expensify_common_1 = require("expensify-common");
const react_native_device_info_1 = require("react-native-device-info");
const getOSAndName = () => {
    const deviceName = react_native_device_info_1.default.getDeviceNameSync();
    const prettyName = `${expensify_common_1.Str.UCFirst(react_native_device_info_1.default.getManufacturerSync() || '')} ${deviceName}`;
    return {
        deviceName: react_native_device_info_1.default.isEmulatorSync() ? `Emulator - ${prettyName}` : prettyName,
        osVersion: react_native_device_info_1.default.getSystemVersion(),
    };
};
exports.default = getOSAndName;
