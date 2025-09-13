"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateApp;
const react_native_1 = require("react-native");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
function updateApp(isProduction) {
    if (isProduction) {
        react_native_1.Linking.openURL(CONST_1.default.APP_DOWNLOAD_LINKS.OLD_DOT_ANDROID);
        return;
    }
    react_native_1.Linking.openURL(CONFIG_1.default.IS_HYBRID_APP ? CONST_1.default.APP_DOWNLOAD_LINKS.OLD_DOT_ANDROID : CONST_1.default.APP_DOWNLOAD_LINKS.ANDROID);
}
