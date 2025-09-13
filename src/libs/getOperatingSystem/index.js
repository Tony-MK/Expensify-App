"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_1 = require("@src/CONST");
/**
 * Reads the current operating system when running on Web/Mobile-Web/Desktop
 */
const getOperatingSystem = () => {
    const { userAgent, platform } = window.navigator;
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    let os = null;
    if (macosPlatforms.includes(platform)) {
        os = CONST_1.default.OS.MAC_OS;
    }
    else if (iosPlatforms.includes(platform)) {
        os = CONST_1.default.OS.IOS;
    }
    else if (windowsPlatforms.includes(platform)) {
        os = CONST_1.default.OS.WINDOWS;
    }
    else if (/Android/.test(userAgent)) {
        os = CONST_1.default.OS.ANDROID;
    }
    else if (/Linux/.test(platform)) {
        os = CONST_1.default.OS.LINUX;
    }
    return os;
};
exports.default = getOperatingSystem;
