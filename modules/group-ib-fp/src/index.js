"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FP = exports.AndroidCapability = exports.FPAttributeFormat = exports.Capability = void 0;
var react_native_1 = require("react-native");
var LINKING_ERROR = "The package 'group-ib-fp' doesn't seem to be linked. Make sure: \n\n" +
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
var ModuleFhpIos = react_native_1.NativeModules.ModuleFhpIos
    ? react_native_1.NativeModules.ModuleFhpIos
    : new Proxy({}, {
        get: function () {
            throw new Error(LINKING_ERROR);
        },
    });
var FP = /** @class */ (function () {
    function FP() {
        if (!react_native_1.NativeModules.ModuleFhpIos) {
            console.warn(LINKING_ERROR);
        }
    }
    FP.getInstance = function () {
        if (!FP.instance) {
            FP.instance = new FP();
        }
        return FP.instance;
    };
    FP.prototype.enableCapability = function (capability, responseHandler) {
        if (react_native_1.Platform.OS === 'ios') {
            return ModuleFhpIos.enableCapability(capability, responseHandler);
        }
    };
    FP.prototype.enableAndroidCapability = function (capability, responseHandler) {
        if (react_native_1.Platform.OS === 'android') {
            return ModuleFhpIos.enableAndroidCapability(capability, responseHandler);
        }
    };
    FP.prototype.disableCapability = function (capability, responseHandler) {
        if (react_native_1.Platform.OS === 'ios') {
            return ModuleFhpIos.disableCapability(capability, responseHandler);
        }
    };
    FP.prototype.disableAndroidCapability = function (capability, responseHandler) {
        if (react_native_1.Platform.OS === 'android') {
            return ModuleFhpIos.disableAndroidCapability(capability, responseHandler);
        }
    };
    FP.prototype.setLogURL = function (url, errorCallback) {
        return ModuleFhpIos.setLogURL(url, errorCallback);
    };
    FP.prototype.setTargetURL = function (url, errorCallback) {
        return ModuleFhpIos.setTargetURL(url, errorCallback);
    };
    FP.prototype.setCustomerId = function (iOSCustomerId, androidCustomerId, errorCallback) {
        if (react_native_1.Platform.OS === 'ios') {
            return ModuleFhpIos.setCustomerId(iOSCustomerId, errorCallback);
        }
        else if (react_native_1.Platform.OS === 'android') {
            return ModuleFhpIos.setCustomerId(androidCustomerId, errorCallback);
        }
    };
    FP.prototype.run = function (errorCallback) {
        return ModuleFhpIos.run(errorCallback);
    };
    FP.prototype.stop = function (errorCallback) {
        return ModuleFhpIos.stop(errorCallback);
    };
    FP.prototype.enableDebugLogs = function () {
        if (react_native_1.Platform.OS === 'ios') {
            return ModuleFhpIos.enableDebugLogs();
        }
    };
    FP.prototype.setPublicKeyForPinning = function (publicKey, errorCallback) {
        return ModuleFhpIos.setPublicKeyForPinning(publicKey, errorCallback);
    };
    FP.prototype.setPublicKeysForPinning = function (publicKeys, errorCallback) {
        return ModuleFhpIos.setPublicKeysForPinning(publicKeys, errorCallback);
    };
    FP.prototype.setUserAgent = function (userAgent, errorCallback) {
        return ModuleFhpIos.setUserAgent(userAgent, errorCallback);
    };
    FP.prototype.setSharedKeychainIdentifier = function (identifier) {
        if (react_native_1.Platform.OS === 'ios') {
            return ModuleFhpIos.setSharedKeychainIdentifier(identifier);
        }
    };
    FP.prototype.setKeepAliveTimeout = function (sec, errorCallback) {
        return ModuleFhpIos.setKeepAliveTimeout(sec, errorCallback);
    };
    FP.prototype.setHeaderValue = function (value, key, errorCallback) {
        return ModuleFhpIos.setHeaderValue(value, key, errorCallback);
    };
    FP.prototype.setLogin = function (login, errorCallback) {
        return ModuleFhpIos.setLogin(login, errorCallback);
    };
    FP.prototype.setSessionId = function (sessionId, errorCallback) {
        return ModuleFhpIos.setSessionId(sessionId, errorCallback);
    };
    FP.prototype.setCustomEvent = function (event, errorCallback) {
        return ModuleFhpIos.setCustomEvent(event, errorCallback);
    };
    FP.prototype.setAttributeTitle = function (title, value, format, errorCallback) {
        return ModuleFhpIos.setAttributeTitle(title, value, format, errorCallback);
    };
    FP.prototype.setGlobalIdURL = function (url, errorCallback) {
        if (react_native_1.Platform.OS === 'android') {
            return ModuleFhpIos.setGlobalIdURL(url, errorCallback);
        }
    };
    FP.prototype.getCookies = function (cookiesCallback) {
        return ModuleFhpIos.getCookies(cookiesCallback);
    };
    FP.prototype.changeBehaviorExtendedData = function (isExtendedData) {
        if (react_native_1.Platform.OS === 'ios') {
            return ModuleFhpIos.changeBehaviorExtendedData(isExtendedData);
        }
    };
    FP.prototype.setPubKey = function (pubKey, errorCallback) {
        return ModuleFhpIos.setPubKey(pubKey, errorCallback);
    };
    FP.instance = null;
    return FP;
}());
exports.FP = FP;
