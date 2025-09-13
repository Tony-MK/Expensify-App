"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FP = exports.AndroidCapability = exports.FPAttributeFormat = exports.Capability = void 0;
const react_native_1 = require("react-native");
const LINKING_ERROR = `The package 'group-ib-fp' doesn't seem to be linked. Make sure: \n\n` +
    react_native_1.Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
    '- You rebuilt the app after installing the package\n' +
    '- You are not using Expo Go\n';
var Capability;
(function (Capability) {
    Capability[Capability["BatteryStatus"] = 0] = "BatteryStatus";
    Capability[Capability["Cellular"] = 1] = "Cellular";
    Capability[Capability["Call"] = 2] = "Call";
    Capability[Capability["Passcode"] = 3] = "Passcode";
    Capability[Capability["WebView"] = 4] = "WebView";
    Capability[Capability["Network"] = 5] = "Network";
    Capability[Capability["Motion"] = 6] = "Motion";
    Capability[Capability["Swizzle"] = 7] = "Swizzle";
    Capability[Capability["Location"] = 8] = "Location";
    Capability[Capability["Audio"] = 9] = "Audio";
    Capability[Capability["CloudIdentifier"] = 10] = "CloudIdentifier";
    Capability[Capability["DeviceStatus"] = 11] = "DeviceStatus";
    Capability[Capability["Capture"] = 12] = "Capture";
    Capability[Capability["Apps"] = 13] = "Apps";
    Capability[Capability["Proxy"] = 14] = "Proxy";
    Capability[Capability["Keyboard"] = 15] = "Keyboard";
    Capability[Capability["Behavior"] = 16] = "Behavior";
    Capability[Capability["PreventScreenshots"] = 17] = "PreventScreenshots";
    Capability[Capability["Security"] = 18] = "Security";
    Capability[Capability["Advertise"] = 19] = "Advertise";
    Capability[Capability["PortScan"] = 20] = "PortScan";
    Capability[Capability["GlobalId"] = 21] = "GlobalId";
})(Capability || (exports.Capability = Capability = {}));
var FPAttributeFormat;
(function (FPAttributeFormat) {
    FPAttributeFormat[FPAttributeFormat["ClearText"] = 1] = "ClearText";
    FPAttributeFormat[FPAttributeFormat["Hashed"] = 2] = "Hashed";
    FPAttributeFormat[FPAttributeFormat["Encrypted"] = 4] = "Encrypted";
})(FPAttributeFormat || (exports.FPAttributeFormat = FPAttributeFormat = {}));
var AndroidCapability;
(function (AndroidCapability) {
    AndroidCapability[AndroidCapability["CellsCollection"] = 0] = "CellsCollection";
    AndroidCapability[AndroidCapability["AccessPointsCollection"] = 1] = "AccessPointsCollection";
    AndroidCapability[AndroidCapability["Location"] = 2] = "Location";
    AndroidCapability[AndroidCapability["GlobalIdentification"] = 3] = "GlobalIdentification";
    AndroidCapability[AndroidCapability["CloudIdentification"] = 4] = "CloudIdentification";
    AndroidCapability[AndroidCapability["CallIdentification"] = 5] = "CallIdentification";
    AndroidCapability[AndroidCapability["ActivityCollection"] = 6] = "ActivityCollection";
    AndroidCapability[AndroidCapability["MotionCollection"] = 7] = "MotionCollection";
    AndroidCapability[AndroidCapability["PackageCollection"] = 8] = "PackageCollection";
})(AndroidCapability || (exports.AndroidCapability = AndroidCapability = {}));
const ModuleFhpIos = react_native_1.NativeModules.ModuleFhpIos
    ? react_native_1.NativeModules.ModuleFhpIos
    : new Proxy({}, {
        get() {
            throw new Error(LINKING_ERROR);
        },
    });
class FP {
    constructor() {
        if (!react_native_1.NativeModules.ModuleFhpIos) {
            console.warn(LINKING_ERROR);
        }
    }
    static getInstance() {
        if (!FP.instance) {
            FP.instance = new FP();
        }
        return FP.instance;
    }
    enableCapability(capability, responseHandler) {
        if (react_native_1.Platform.OS === 'ios') {
            return ModuleFhpIos.enableCapability(capability, responseHandler);
        }
    }
    enableAndroidCapability(capability, responseHandler) {
        if (react_native_1.Platform.OS === 'android') {
            return ModuleFhpIos.enableAndroidCapability(capability, responseHandler);
        }
    }
    disableCapability(capability, responseHandler) {
        if (react_native_1.Platform.OS === 'ios') {
            return ModuleFhpIos.disableCapability(capability, responseHandler);
        }
    }
    disableAndroidCapability(capability, responseHandler) {
        if (react_native_1.Platform.OS === 'android') {
            return ModuleFhpIos.disableAndroidCapability(capability, responseHandler);
        }
    }
    setLogURL(url, errorCallback) {
        return ModuleFhpIos.setLogURL(url, errorCallback);
    }
    setTargetURL(url, errorCallback) {
        return ModuleFhpIos.setTargetURL(url, errorCallback);
    }
    setCustomerId(iOSCustomerId, androidCustomerId, errorCallback) {
        if (react_native_1.Platform.OS === 'ios') {
            return ModuleFhpIos.setCustomerId(iOSCustomerId, errorCallback);
        }
        else if (react_native_1.Platform.OS === 'android') {
            return ModuleFhpIos.setCustomerId(androidCustomerId, errorCallback);
        }
    }
    run(errorCallback) {
        return ModuleFhpIos.run(errorCallback);
    }
    stop(errorCallback) {
        return ModuleFhpIos.stop(errorCallback);
    }
    enableDebugLogs() {
        if (react_native_1.Platform.OS === 'ios') {
            return ModuleFhpIos.enableDebugLogs();
        }
    }
    setPublicKeyForPinning(publicKey, errorCallback) {
        return ModuleFhpIos.setPublicKeyForPinning(publicKey, errorCallback);
    }
    setPublicKeysForPinning(publicKeys, errorCallback) {
        return ModuleFhpIos.setPublicKeysForPinning(publicKeys, errorCallback);
    }
    setUserAgent(userAgent, errorCallback) {
        return ModuleFhpIos.setUserAgent(userAgent, errorCallback);
    }
    setSharedKeychainIdentifier(identifier) {
        if (react_native_1.Platform.OS === 'ios') {
            return ModuleFhpIos.setSharedKeychainIdentifier(identifier);
        }
    }
    setKeepAliveTimeout(sec, errorCallback) {
        return ModuleFhpIos.setKeepAliveTimeout(sec, errorCallback);
    }
    setHeaderValue(value, key, errorCallback) {
        return ModuleFhpIos.setHeaderValue(value, key, errorCallback);
    }
    setLogin(login, errorCallback) {
        return ModuleFhpIos.setLogin(login, errorCallback);
    }
    setSessionId(sessionId, errorCallback) {
        return ModuleFhpIos.setSessionId(sessionId, errorCallback);
    }
    setCustomEvent(event, errorCallback) {
        return ModuleFhpIos.setCustomEvent(event, errorCallback);
    }
    setAttributeTitle(title, value, format, errorCallback) {
        return ModuleFhpIos.setAttributeTitle(title, value, format, errorCallback);
    }
    setGlobalIdURL(url, errorCallback) {
        if (react_native_1.Platform.OS === 'android') {
            return ModuleFhpIos.setGlobalIdURL(url, errorCallback);
        }
    }
    getCookies(cookiesCallback) {
        return ModuleFhpIos.getCookies(cookiesCallback);
    }
    changeBehaviorExtendedData(isExtendedData) {
        if (react_native_1.Platform.OS === 'ios') {
            return ModuleFhpIos.changeBehaviorExtendedData(isExtendedData);
        }
    }
    setPubKey(pubKey, errorCallback) {
        return ModuleFhpIos.setPubKey(pubKey, errorCallback);
    }
}
exports.FP = FP;
FP.instance = null;
