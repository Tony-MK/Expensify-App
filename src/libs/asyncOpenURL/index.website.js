"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const getPlatform_1 = require("@libs/getPlatform");
const Log_1 = require("@libs/Log");
const CONST_1 = require("@src/CONST");
/**
 * Prevents Safari from blocking pop-up window when opened within async call.
 * @param shouldSkipCustomSafariLogic When true, we will use `Linking.openURL` even if the browser is Safari.
 */
const asyncOpenURL = (promise, url, shouldSkipCustomSafariLogic, shouldOpenInSameTab) => {
    if (!url) {
        return;
    }
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const canOpenURLInSameTab = (0, getPlatform_1.default)() === CONST_1.default.PLATFORM.WEB;
    if (!isSafari || !!shouldSkipCustomSafariLogic || !!shouldOpenInSameTab) {
        promise
            .then((params) => {
            react_native_1.Linking.openURL(typeof url === 'string' ? url : url(params), shouldOpenInSameTab && canOpenURLInSameTab ? '_self' : undefined);
        })
            .catch(() => {
            Log_1.default.warn('[asyncOpenURL] error occurred while opening URL', { url });
        });
    }
    else {
        const windowRef = window.open();
        promise
            .then((params) => {
            if (!windowRef) {
                return;
            }
            windowRef.location = typeof url === 'string' ? url : url(params);
        })
            .catch(() => {
            windowRef?.close();
            Log_1.default.warn('[asyncOpenURL] error occurred while opening URL', { url });
        });
    }
};
exports.default = asyncOpenURL;
