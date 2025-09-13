"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDeviceID = setDeviceID;
exports.getDeviceInfoWithID = getDeviceInfoWithID;
const react_native_onyx_1 = require("react-native-onyx");
const Log_1 = require("@libs/Log");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const generateDeviceID_1 = require("./generateDeviceID");
const getDeviceInfo_1 = require("./getDeviceInfo");
let deviceID = null;
/**
 * @returns - device ID string or null in case of failure
 */
function getDeviceID() {
    return new Promise((resolve) => {
        if (deviceID) {
            resolve(deviceID);
            return;
        }
        // Use connectWithoutView because this is a one-time data fetch that disconnects immediately without triggering UI updates
        // and this onyx key is created for non-UI task only.
        const connection = react_native_onyx_1.default.connectWithoutView({
            key: ONYXKEYS_1.default.DEVICE_ID,
            callback: (id) => {
                react_native_onyx_1.default.disconnect(connection);
                deviceID = id ?? null;
                return resolve(id ?? null);
            },
        });
    });
}
/**
 * Saves a unique deviceID into Onyx.
 */
function setDeviceID() {
    getDeviceID()
        .then((existingDeviceID) => {
        if (!existingDeviceID) {
            return Promise.resolve();
        }
        throw new Error(existingDeviceID);
    })
        .then(generateDeviceID_1.default)
        .then((uniqueID) => {
        Log_1.default.info('Got new deviceID', false, uniqueID);
        react_native_onyx_1.default.set(ONYXKEYS_1.default.DEVICE_ID, uniqueID);
    })
        .catch((error) => Log_1.default.info('Found existing deviceID', false, error.message));
}
/**
 * Returns a string object with device info and uniqueID
 * @returns - device info with ID
 */
function getDeviceInfoWithID() {
    return new Promise((resolve) => {
        getDeviceID().then((currentDeviceID) => resolve(JSON.stringify({
            ...(0, getDeviceInfo_1.default)(),
            deviceID: currentDeviceID,
        })));
    });
}
